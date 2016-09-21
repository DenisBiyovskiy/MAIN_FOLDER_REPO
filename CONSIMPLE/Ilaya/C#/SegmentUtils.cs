namespace Terrasoft.Configuration {
	using System;
	using System.Collections.Generic;
	using System.Collections.Specialized;
	using System.Data;
	using System.IO;
	using System.Linq;
	using System.Runtime.Serialization;
	using System.Security.Cryptography;
	using System.ServiceModel;
	using System.ServiceModel.Web;
	using System.ServiceModel.Activation;
	using System.Text;
	using System.Text.RegularExpressions;
	using System.Threading;
	using System.Threading.Tasks;
	using System.Web;
	using Terrasoft.Core;
	using Terrasoft.Core.DB;
	using Terrasoft.Core.Entities;
	using Terrasoft.Common;
	using Terrasoft.Configuration.Marketing.Utilities;
	using Terrasoft.Configuration;
	using Terrasoft.Configuration.MandrillService;
	using Terrasoft.Core.Configuration;
	using Terrasoft.Core.Process;
	using Terrasoft.Core.Process.Configuration;

	using ServiceStack.Text;

	#region Class: SegmentUtils

	public class SegmentUtils {
		#region Properties: Public
		public UserConnection UserConnection { get;	private set;}
		public virtual string RootSchemaName { get; set; }
		public virtual Guid RootSchemaRecordId { get; set; }
		public virtual Guid TargetSchemaUId { get; set; }
		public virtual Guid TargetFolderSchemaUId { get; set; }
		public virtual string TargetName { get; set; }
		public virtual string TargetNameId { get; set; }
		public virtual string TargetNameFolder { get; set; }
		public virtual string TargetNameInFolder { get; set; }
		public virtual string TargetSchemaBindingColumnValueName { get; set; }
		public virtual string TargetSchemaName { get; set; }
		public virtual string SegmentSchemaName { get; set; }
		private LocalizableString _remindingCaption = "В {0}";
		public LocalizableString RemindingCaption {
			get {
				return _remindingCaption;
			}
		}
		private LocalizableString _successMessage = ". Добавлено : {0} записей.";
		public LocalizableString SuccessMessage {
			get {
				return _successMessage;
			}
		}
		private Func<int> _descriptionTypeStringLength;
		public virtual int DescriptionTypeStringLength {
			get {
				return (_descriptionTypeStringLength ?? (_descriptionTypeStringLength = () => 0)).Invoke();
			}
			set {
				_descriptionTypeStringLength = () => { return value; };
			}
		}

		private Func<int> _subjectCaptionTypeStringLength;
		public virtual int SubjectCaptionTypeStringLength {
			get {
				return (_subjectCaptionTypeStringLength ?? (_subjectCaptionTypeStringLength = () => 0)).Invoke();
			}
			set {
				_subjectCaptionTypeStringLength = () => { return value; };
			}
		}
		private LocalizableString _failMessage = ". К сожалению, по неизвестной нам причине не удалось добавить записи. Обратитесь к администратору системы.";
		public LocalizableString FailMessage {
			get {
				return _failMessage;
			}
		}		
		#endregion

		public SegmentUtils(UserConnection userConnection) {
			UserConnection = userConnection;
			_descriptionTypeStringLength = () => { return (int)(250); };
			_subjectCaptionTypeStringLength = () => { return (int)(500); };
		}

		public virtual void Main() {
			if (string.IsNullOrEmpty(RootSchemaName) || RootSchemaRecordId.IsEmpty()) {
				return;
			}

			TargetNameFolder = string.Format("{0}Folder", TargetName);
			TargetNameInFolder = string.Format("{0}InFolder", TargetName);
			TargetSchemaBindingColumnValueName = string.Format("{0}Id", RootSchemaName); //CampaingId;
			TargetNameId = string.Format("{0}Id", TargetName);//ContactId
			TargetSchemaUId = UserConnection.EntitySchemaManager.GetItemByName(TargetName).UId;//new Guid("16BE3651-8FE2-4159-8DD0-A803D4683DD3");//SysSchema - Contact
			TargetFolderSchemaUId = UserConnection.EntitySchemaManager.GetItemByName(TargetNameFolder).UId; //new Guid("8B5C01A2-59E9-40DC-855B-6E3BEBDDC6EE");//SysSchema - ContactFolder
			SegmentSchemaName = "SegmentEntity";
			int targetAudienceCounter = 0;
			var folders = GetSegmentFolders(TargetNameFolder);
			while (true) {
				try {
					var selectList = new List<Select>();
					SetRootStatus(MarketingConsts.SegmentStatusUpdatingId, -1, DateTime.MinValue);
					if (!folders.Any()) {
						return;
					}
					List<Guid> staticFolders = new List<Guid>();
					foreach (var folder in folders) {
						Guid folderId = folder.Item1;
						Guid folderTypeId = folder.Item2;
						if (folderTypeId == MarketingConsts.FolderTypeDynamicId) {
							selectList.Add(ProcessDynamicFolder(folderId));
						} else {
							staticFolders.Add(folderId);
						}
					}
					if (staticFolders.Any()) {
						selectList.Add(ProcessStaticFolders(staticFolders));
					}
					targetAudienceCounter = ExecuteSelectInsert(selectList);
				} catch (Exception e) {
					//LogError("Error updating a sms target audience.", e);
					FailOperation();
					return;
				}
				if (targetAudienceCounter == -1) {
					folders = GetSegmentFolders(TargetNameFolder);
				} else {
					break;
				}
			}
			SuccessOperation(targetAudienceCounter);
		}

		public virtual void FailOperation() {
			int totalTargetAudienceCounter = GetRestTargetAudienceCount();
			SetRootStatus(MarketingConsts.SegmentStatusUpdatedId, totalTargetAudienceCounter, DateTime.MinValue);
			
			var refColumn = string.Format("{0}Id", RootSchemaName);
			new Delete(UserConnection)
					.From(SegmentSchemaName)
					.Where("EntityId").IsEqual(Column.Parameter(RootSchemaRecordId))
					.And("SegmentName").IsEqual(Column.Parameter(TargetName))
					.Execute();
			string remindingCaption = GetRemindingCaption();
			CreateReminding(FailMessage.ToString(), GetRootEntity(), remindingCaption);
		}

		public virtual int ExecuteSelectInsert(IList<Select> selects) {
			const int packageSize = 10000;
			Select unionSelect = selects[0];
			for (var i = 1; i < selects.Count; i++) {
				unionSelect = unionSelect.Union(selects[i]) as Select;
			}
			unionSelect.SpecifyNoLockHints(true);
			var execSelect = new Select(UserConnection)
				.Top(packageSize)
				.Column(Column.Asterisk("ResultSelect"))
				.From(unionSelect).As("ResultSelect");
			var iterateInsertedCount = 0;
			var insertedCount = 0;
			do {
				var insertSelect = GetInsertSelect(execSelect);
				using (var dbExecutor = UserConnection.EnsureDBConnection()) {
					dbExecutor.StartTransaction(System.Data.IsolationLevel.ReadUncommitted);
					try {
						iterateInsertedCount = insertSelect.Execute(dbExecutor);
					} catch (Exception e) {
						dbExecutor.RollbackTransaction();
						throw e;
					}
					dbExecutor.CommitTransaction();
				}
				insertedCount += iterateInsertedCount;
				if (CheckIsProcessRestartRequired()) {
					insertedCount = -1;
					break;
				}
			} while (iterateInsertedCount == packageSize);
			return insertedCount;
		}

		public virtual void SuccessOperation(int targetAudienceCounter) {
			int totalTargetAudienceCounter = GetRestTargetAudienceCount();
			var processingDate = DateTime.UtcNow;
			SetRootStatus(MarketingConsts.SegmentStatusUpdatedId, totalTargetAudienceCounter, processingDate);
			new Delete(UserConnection)
					.From(SegmentSchemaName)
					.Where("EntityId").IsEqual(Column.Parameter(RootSchemaRecordId))
					.And("SegmentName").IsEqual(Column.Parameter(TargetName))
					.Execute();
			
			string remindingCaption = GetRemindingCaption();
			CreateReminding(string.Format(SuccessMessage.ToString(), targetAudienceCounter), GetRootEntity(), remindingCaption);
		}

		public virtual void SetRootStatus(Guid StatusId, int RecipientCount, DateTime ProcessingDate) {
			var update = new Update(UserConnection, "SegmentEntity")
							.Set("StateId", Column.Parameter(StatusId))
							.Set("ModifiedOn", Column.Parameter(DateTime.UtcNow))
							.Set("ModifiedById", Column.Parameter(TsConsts.SysAdminUnit.Supervisor));
			update.Where("EntityId").IsEqual(Column.Parameter(RootSchemaRecordId));
			update.Execute();
		}

		public virtual Select ProcessDynamicFolder(Guid folderId) {
			var dataValueTypeManager = (DataValueTypeManager)UserConnection.AppManagerProvider.GetManager("DataValueTypeManager");
			DataValueType dateTimeDataValueType = dataValueTypeManager.GetInstanceByName("DateTime");
			DataValueType guidDataValueType = dataValueTypeManager.GetInstanceByName("Guid");
			DataValueType integerDataValueType = dataValueTypeManager.GetInstanceByName("Integer");
			EntitySchema targetSchema = UserConnection.EntitySchemaManager.GetInstanceByUId(TargetSchemaUId);
			IEntitySchemaQueryFilterItem filters = MandrillUtilities.GetFolderFilters(UserConnection, folderId, TargetFolderSchemaUId, TargetSchemaUId);
			var esq = new EntitySchemaQuery(targetSchema);
			esq.AddColumn(RootSchemaRecordId, guidDataValueType).SetForcedQueryColumnValueAlias("RootSchemaRecordId");
			esq.AddColumn("Id").SetForcedQueryColumnValueAlias("RecordId");
			esq.Filters.Add(filters);
			Select folderQuery = esq.GetSelectQuery(UserConnection);
			//Den>
			//Select resultSelect = GetDynamicFolderProcessingQuery(folderQuery);
			Select resultSelect;
			if (TargetSchemaName.Equals("ilayPriceForAccount")) {
				resultSelect = GetDynamicFolderProcessingQueryForPatientAcc(folderQuery);
			} else {
				resultSelect = GetDynamicFolderProcessingQuery(folderQuery);
			}
			//Den<
			return resultSelect;
		}

		public virtual Select GetDynamicFolderProcessingQuery(Select dynamicFilterSelect) {
			Select notExistsSelect = new Select(UserConnection)
										.Column("Id")
										.From(TargetSchemaName)
										.Where(TargetSchemaBindingColumnValueName).IsEqual(Column.Parameter(RootSchemaRecordId)) as Select;
			dynamicFilterSelect.And().Not().Exists(notExistsSelect);
			return dynamicFilterSelect;
		}
		//Den>
		public virtual Select GetDynamicFolderProcessingQueryForPatientAcc(Select dynamicFilterSelect) {
			Select notInSelect = new Select(UserConnection)
										.Column("ilayPatientAccId")
										.From(TargetSchemaName)
										.Where(TargetSchemaBindingColumnValueName).IsEqual(Column.Parameter(RootSchemaRecordId)) as Select;
			dynamicFilterSelect.And("Id").Not().In(notInSelect);
			return dynamicFilterSelect;
		}
		//Den<
		
		public virtual Select ProcessStaticFolders(List<Guid> folders) {
			Select resultSelect = GetStaticFolderProcessingQuery(folders);
			return resultSelect;
		}

		public virtual Select GetStaticFolderProcessingQuery(List<Guid> folders) {
			Select notExistsSelect = new Select(UserConnection)
										.Column("Id")
										.From(TargetSchemaName)
										.Where(TargetSchemaBindingColumnValueName).IsEqual(Column.Parameter(RootSchemaRecordId)) as Select;
			var resultSelect = new Select(UserConnection)
				.Column(Column.Const(RootSchemaRecordId)).As("RootSchemaRecordId")
				.Column(TargetName, "Id").As("RecordId")
				.From(TargetName)
				.Where().Exists(new Select(UserConnection)
					.Column(Column.Parameter("Id"))
					.From(TargetNameInFolder)
					.Where(TargetNameId/*"ContactId"*/).IsEqual(TargetName, "Id")
					.And("FolderId").In(Column.Parameters(folders)))
				.And().Not().Exists(notExistsSelect) as Select;
			return resultSelect;
		}
		
		public virtual InsertSelect GetInsertSelect(Select selectQuery) {
			InsertSelect insertSelect = new InsertSelect(UserConnection)
			.Into(TargetSchemaName)
			.Set(TargetSchemaBindingColumnValueName, TargetNameId)
			.FromSelect(selectQuery);
			return insertSelect;
		}
		
		public virtual bool CheckIsProcessRestartRequired() {
			Select checkStatusQuery = (Select)new Select(UserConnection)
										.Column("Id")
										.From(SegmentSchemaName)
										.Where("EntityId").IsEqual(Column.Parameter(RootSchemaRecordId))
										.And("StateId").IsEqual(Column.Parameter(MarketingConsts.SegmentStatusRequiresUpdatingId))
										.And("SegmentName").IsEqual(Column.Parameter(TargetName)); 
			using (DBExecutor dbExecutor = UserConnection.EnsureDBConnection()) {
				using (IDataReader reader = checkStatusQuery.ExecuteReader(dbExecutor)) {
					return reader.Read();
				}
			}
		}
		
		public virtual int GetRestTargetAudienceCount() {
			Select countQuery = new Select(UserConnection)
								.Column(Func.Count("Id"))
								.From(TargetSchemaName)
								.Where(TargetSchemaBindingColumnValueName).IsEqual(Column.Parameter(RootSchemaRecordId)) as Select;
			HintsHelper.SpecifyNoLockHints(countQuery, true);
			int countResult = countQuery.ExecuteScalar<int>();
			return countResult;
		}
		
		public virtual string GetRemindingCaption() {
			Entity rootEntity = GetRootEntity();
			return string.Format(RemindingCaption.ToString(), rootEntity.Schema.Caption);
		}
		
		public virtual Entity GetRootEntity() {
			EntitySchema schema = UserConnection.EntitySchemaManager.GetInstanceByName(RootSchemaName);
			Entity entity = schema.CreateEntity(UserConnection);
			var columnsToFetch = new[] {
				schema.PrimaryColumn,
				schema.PrimaryDisplayColumn
			};
			if (!entity.FetchFromDB(schema.PrimaryColumn, RootSchemaRecordId, columnsToFetch)) {
				return null;
			}
			return entity;
		}
		
		public virtual void CreateReminding(string description, Entity entity, string schemaCaption) {
			schemaCaption = schemaCaption != null ? schemaCaption : string.Empty;
			Reminding remindingEntity = new Reminding(UserConnection);
			string subject = entity.PrimaryDisplayColumnValue;
			DateTime userDateTime = UserConnection.CurrentUser.GetCurrentDateTime();
			Guid userContactId = UserConnection.CurrentUser.ContactId;
			var condition = new Dictionary<string, object> {
				{
					"Author", userContactId
				}, {
					"Contact", userContactId
				}, {
					"Source", RemindingConsts.RemindingSourceAuthorId
				}, {
					"SubjectCaption", subject
				}, {
					"SysEntitySchema", entity.Schema.UId
				},
			};
			string hash = GetRemindingHash(condition);
			if (!string.IsNullOrEmpty(description)) {
				subject = string.Format("{0} \"{1}\" {2}",
						string.IsNullOrEmpty(schemaCaption) ? entity.Schema.Caption.Value : schemaCaption,
						entity.PrimaryDisplayColumnValue,
						description);
			}
			if (!remindingEntity.FetchFromDB(new Dictionary<string, object> { { "Hash", hash } }, false)) {
				remindingEntity.SetDefColumnValues();
			}
			description = TruncateString(subject, DescriptionTypeStringLength);
			subject = TruncateString(subject, SubjectCaptionTypeStringLength);
			remindingEntity.SetColumnValue("ModifiedOn", userDateTime);
			remindingEntity.SetColumnValue("AuthorId", userContactId);
			remindingEntity.SetColumnValue("ContactId", userContactId);
			remindingEntity.SetColumnValue("SourceId", RemindingConsts.RemindingSourceAuthorId);
			remindingEntity.SetColumnValue("RemindTime", userDateTime);
			remindingEntity.SetColumnValue("Description", description);
			remindingEntity.SetColumnValue("SubjectCaption", subject);
			remindingEntity.SetColumnValue("Hash", hash);
			remindingEntity.SetColumnValue("SysEntitySchemaId", entity.Schema.UId);
			remindingEntity.SetColumnValue("SubjectId", entity.PrimaryColumnValue);
			remindingEntity.Save();
		}
		
		public virtual string GetRemindingHash(Dictionary<string, object> dictionary) {
			var str = new StringBuilder();
			foreach (object value in dictionary.Values) {
				str.Append(value);
			}
			return FileUtilities.GetMD5Hash(Encoding.Unicode.GetBytes(str.ToString()));
		}
		
		public virtual string TruncateString(string source, int length) {
			return (source.Length > length)	? source = source.Substring(0, length)	: source;
		}

		private List<Tuple<Guid, Guid>> GetSegmentFolders(string targetNameFolder) {
			var list = new List<Tuple<Guid, Guid>>();
			Select checkStatusQuery = (Select)new Select(UserConnection)
					.Column("SegmentId")
					.Column("FolderTypeId")
					.From("SegmentEntity").InnerJoin(targetNameFolder).On(targetNameFolder, "Id").IsEqual("SegmentEntity", "SegmentId")
					.Where("EntityId").IsEqual(Column.Parameter(RootSchemaRecordId))
					.And("SegmentName").IsEqual(Column.Parameter(TargetName));
			using (DBExecutor dbExecutor = UserConnection.EnsureDBConnection()) {
				using (IDataReader reader = checkStatusQuery.ExecuteReader(dbExecutor)) {
					while (reader.Read()) {
						list.Add(new Tuple<Guid, Guid>(reader.GetColumnValue<Guid>("SegmentId"), reader.GetColumnValue<Guid>("FolderTypeId")));
					}
				}
			}
			return list;
		}
	}
	#endregion
}