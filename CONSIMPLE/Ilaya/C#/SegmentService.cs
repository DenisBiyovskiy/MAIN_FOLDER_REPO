namespace Terrasoft.Configuration {
	using System;
	using System.Collections.Generic;
	using System.Runtime.Serialization;
	using System.ServiceModel;
	using System.ServiceModel.Web;
	using System.ServiceModel.Activation;
	using Terrasoft.Common;
	using Terrasoft.Core;
	using Terrasoft.Core.DB;
	using System.Diagnostics;
	using System.Web;
	using System.Data;
	//using Terrasoft.Configuration.SegmentUtils;

	#region Class: SegmentService
	[ServiceContract]
	[AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Required)]
	public class SegmentService {

		#region Properties: Public

		public UserConnection UserConnection {
			get {
				if (_userConnection != null) {
					return _userConnection;
				}
				_userConnection = HttpContext.Current.Session["UserConnection"] as UserConnection;
				if (_userConnection != null) {
					return _userConnection;
				}
				var appConnection = (AppConnection)HttpContext.Current.Application["AppConnection"];
				_userConnection = appConnection.SystemUserConnection;
				return _userConnection;
			}
			set {
				_userConnection = value;
			}
		}

		#endregion

		private Guid operationId;
		private UserConnection _userConnection;

		
		private void Authenticate() {
			if (UserConnection == null) {
				throw new System.Security.Authentication.AuthenticationException();
			}
		}

		[OperationContract]
		[WebInvoke(Method = "POST", UriTemplate = "FillDetailTarget", BodyStyle = WebMessageBodyStyle.Wrapped,
			RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
		public void FillDetailTarget(string entityName, Guid entityId, string segmentName, string targetSchemaName) {
			Authenticate();
			System.Threading.Tasks.Task.Factory.StartNew(
				() => ExecuteUpdateTargetAudience(UserConnection, entityName, entityId, segmentName, targetSchemaName)
			);
		}

		private void ExecuteUpdateTargetAudience(UserConnection UserConnection, string entityName, Guid entityId, string segmentName, string targetSchemaName) {
			/*bool needStartProcess;
			Select checkStatusQuery = (Select)new Select(UserConnection)
				.Column("Id")
				.From("SegmentEntity")
				.Where("EntityId").IsEqual(Column.Parameter(entityId))
				.And("StateId").IsEqual(Column.Parameter(MarketingConsts.SegmentStatusUpdatingId))
				.And("SegmentName").IsEqual(Column.Parameter(segmentName));
			using (DBExecutor dbExecutor = UserConnection.EnsureDBConnection()) {
				using (IDataReader reader = checkStatusQuery.ExecuteReader(dbExecutor)) {
					needStartProcess = !reader.Read();
				}
			}
			if (needStartProcess) {*/
				SegmentUtils segment = new SegmentUtils(UserConnection);
				segment.RootSchemaName = entityName;
				segment.RootSchemaRecordId = entityId;
				segment.TargetName = segmentName;
				segment.TargetSchemaName = targetSchemaName;
				segment.Main();
			/*} else {
				new Update(UserConnection, "SegmentEntity")
					.Set("StateId",	Column.Parameter(MarketingConsts.SegmentStatusRequiresUpdatingId))
					.Set("ModifiedOn", Column.Parameter(DateTime.UtcNow))
					.Set("ModifiedById", Column.Parameter(MarketingConsts.MandrillUserId))
					.Where("EntityId").IsEqual(Column.Parameter(entityId))
					.And("SegmentName").IsEqual(Column.Parameter(segmentName))
					.Execute();
			}*/
		}

	}
}
#endregion