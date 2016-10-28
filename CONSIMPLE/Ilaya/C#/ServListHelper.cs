namespace Terrasoft.Configuration
{
	using System;
	using System.Collections.Generic;
	using System.Linq;
	using System.Text;
	using System.Web;
	using Terrasoft.Common;
	using Terrasoft.Core;
	using Terrasoft.Core.DB;
	using Terrasoft.Core.Entities;
	using Terrasoft.Core.Store;
	using Newtonsoft.Json.Linq;
	using System.ServiceModel;
	using System.ServiceModel.Web;
	using System.ServiceModel.Activation;
	
	[ServiceContract]
	[AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Required)]
	class ServListHelper
	{
		private static UserConnection userConnection = (UserConnection)HttpContext.Current.Session["UserConnection"];
		private int ilayPriority = 0;
		
		[OperationContract]
		[WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.Wrapped,
			RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
		public string updateAddedServListFromModule (List<Guid> servLists) {
			if(servLists.Count > 0) {
				// Так как пациент у всех добавляемых записей один и тот же, то и значение колонок "ilayPatientAccount",
				// "ilayPrice" у всех добавляемых записей одно и тоже
				//Den а вот и нет, Тариф (ilayPrice) может быть разный.
				var patientId = getPatientIdFromServList(servLists[0]);
				if (patientId != Guid.Empty) {
					updatePatientAccountAndPrice(getPatientAccs(patientId), servLists);
				} else {
					updateAccountAndPrice(servLists);
				}
				//setCoast(servLists);
				//setSpecialTariff(servLists);
			}
			return "";
		}
		//Den>
		//Если у созданного сервиса нет пациента(он создан не с визита) - добавляет базовый тариф с типом
		//"накопичувальний" и "нижня межа" = 0.
		private void updateAccountAndPrice(List<Guid> servLists) {
			foreach(Guid servListId in servLists) {
				var ilayServListESQ = new EntitySchemaQuery(userConnection.EntitySchemaManager, "ilayServList");
				ilayServListESQ.AddAllSchemaColumns();
				
				var ilayServList = ilayServListESQ.GetEntity(userConnection, servListId);
				Guid ilayServiceId = ilayServList.GetTypedColumnValue<Guid>("ilayServiceId");
				Guid ilayPackageId = ilayServList.GetTypedColumnValue<Guid>("ilayPackageId");
				
				double ilayCoast = 0;
				Guid ilayPriceId = Guid.Empty;
				Select select;
				
				if(ilayPackageId == Guid.Empty) {
					select = new Select(userConnection)
						.Top(1)
						.Column("ips", "ilayPriceValue")
						.Column("ips", "ilayPriceId")
						.From("ilayPriceForService").As("ips")
						.Join(JoinType.Inner, "ilayPricePlan").As("pp")
						.On("ips", "ilayPriceId").IsEqual("pp", "Id")
						.Where("ips", "ilayPriceStatusId").IsEqual(Column.Parameter(new Guid("0b57640a-9443-4c78-a739-0d9ab437b39e")))//Активний
						.And("pp", "ilayPriceTypeId").IsEqual(Column.Parameter("C16627E4-D885-4896-843A-6A294668D4C7"))//Накопичувальний
						.And("ips", "ilayServiceId").IsEqual(Column.Parameter(ilayServiceId))
						.And("ips", "ilayPackageId").IsNull()
						.And("pp", "ilayRequiredSumm").IsEqual(Column.Parameter(0))as Select;
				} else {
					select = new Select(userConnection)
						.Top(1)
						.Column("ips", "ilayPriceValue")
						.From("ilayPriceForService").As("ips")
						.Join(JoinType.Inner, "ilayPricePlan").As("pp")
						.On("ips", "ilayPriceId").IsEqual("pp", "Id")
						.Where("ips", "ilayPriceStatusId").IsEqual(Column.Parameter(new Guid("0b57640a-9443-4c78-a739-0d9ab437b39e")))//Активний
						.And("pp", "ilayPriceTypeId").IsEqual(Column.Parameter("C16627E4-D885-4896-843A-6A294668D4C7"))//Накопичувальний
						.And("ips", "ilayServiceId").IsEqual(Column.Parameter(ilayServiceId))
						.And("ips", "ilayPackageId").IsEqual(Column.Parameter(ilayPackageId))
						.And("pp", "ilayRequiredSumm").IsEqual(Column.Parameter(0))as Select;
				}
				using (var dbExecutor = userConnection.EnsureDBConnection())
				{
					using (var dataReader = select.ExecuteReader(dbExecutor))
					{
						if(dataReader.Read()) {
							ilayCoast = Convert.ToDouble(dataReader["ilayPriceValue"]);
							ilayPriceId = userConnection.DBTypeConverter.DBValueToGuid(dataReader["ilayPriceId"]);
						}
					}
				}
				if(ilayPriceId != Guid.Empty) ilayServList.SetColumnValue("ilayPriceId", ilayPriceId);
				ilayServList.SetColumnValue("ilayCoast", ilayCoast);
				ilayServList.Save();
			}
		}
		//Den<
		private void setCoast(List<Guid> servLists) {
			
			foreach(Guid servList in servLists) {
				var ilayServListESQ = new EntitySchemaQuery(userConnection.EntitySchemaManager, "ilayServList");
				ilayServListESQ.AddAllSchemaColumns();
				var ilayServList = ilayServListESQ.GetEntity(userConnection, servList);
				if(ilayServList != null) {
					Guid ilayServiceId = ilayServList.GetTypedColumnValue<Guid>("ilayServiceId");
					Guid ilayPriceId = ilayServList.GetTypedColumnValue<Guid>("ilayPriceId");
					double ilayCoast = (new Select(userConnection)
						.Column("ilayPriceValue")
						.From("ilayPriceForService")
						.Where("ilayPriceStatusId").IsEqual(Column.Parameter(new Guid("0b57640a-9443-4c78-a739-0d9ab437b39e")))
						.And("ilayServiceId").IsEqual(Column.Parameter(ilayServiceId))
						.And("ilayPriceId").IsEqual(Column.Parameter(ilayPriceId))	as Select).ExecuteScalar<double>();
					if(ilayCoast > 0) {
						ilayServList.SetColumnValue("ilayCoast", ilayCoast);
						ilayServList.Save();
					}
				}
			}
		}
		
		private void setSpecialTariff(List<Guid> servLists) {
			foreach(Guid servList in servLists) {
				var ilayServListESQ = new EntitySchemaQuery(userConnection.EntitySchemaManager, "ilayServList");
				ilayServListESQ.AddAllSchemaColumns();
				var ilayPriceType = ilayServListESQ.AddColumn("ilayPrice.ilayPriceType.Id");
				var ilayServList = ilayServListESQ.GetEntity(userConnection, servList);
				if(ilayServList != null) {
					if(ilayServList.GetTypedColumnValue<Guid>(ilayPriceType.Name) == new Guid("d7c71086-bb98-48ef-88d3-b025487ed787")) {
						Guid ilayServiceId = ilayServList.GetTypedColumnValue<Guid>("ilayServiceId");
						if(ilayServiceId != Guid.Empty) {
							var ilayPriceForServiceESQ = new EntitySchemaQuery(userConnection.EntitySchemaManager, "ilayPriceForService");
							ilayPriceForServiceESQ.AddAllSchemaColumns();
							var ilayPriceValue = ilayPriceForServiceESQ.AddColumn("ilayPriceValue");
							ilayPriceValue.OrderDirection = OrderDirection.Ascending;
							
							var groupFilter = new EntitySchemaQueryFilterCollection(ilayPriceForServiceESQ, LogicalOperationStrict.Or);
							var ilayPriceTypeFilter1 = ilayPriceForServiceESQ.CreateFilterWithParameters(FilterComparisonType.Equal, "ilayPrice.ilayPriceType", 
								new Guid("2e00b180-4c35-4363-9615-367da557732d"));
							var ilayPriceTypeFilter2 = ilayPriceForServiceESQ.CreateFilterWithParameters(FilterComparisonType.Equal, "ilayPrice.ilayPriceType", 
								new Guid("1cc992cb-2f17-49fa-b974-7d4679bf4828"));
							groupFilter.Add(ilayPriceTypeFilter1);
							groupFilter.Add(ilayPriceTypeFilter2);
							ilayPriceForServiceESQ.Filters.Add(groupFilter);
							
							var ilayPriceForServiceFilter1 = ilayPriceForServiceESQ.CreateFilterWithParameters(FilterComparisonType.Equal, 
								"ilayPriceStatus", new Guid("0b57640a-9443-4c78-a739-0d9ab437b39e"));
							ilayPriceForServiceESQ.Filters.Add(ilayPriceForServiceFilter1);
							var ilayPriceForServiceFilter2 = ilayPriceForServiceESQ.CreateFilterWithParameters(FilterComparisonType.Equal, 
								"ilayService", ilayServiceId);
							ilayPriceForServiceESQ.Filters.Add(ilayPriceForServiceFilter2);
							var ilayPriceForServiceEntities = ilayPriceForServiceESQ.GetEntityCollection(userConnection);
							if(ilayPriceForServiceEntities.Count > 0) {
								Guid ilaySpecialPriceId = ilayPriceForServiceEntities[0].GetTypedColumnValue<Guid>("ilayPriceId");
								double ilaySpecialCost = ilayPriceForServiceEntities[0].GetTypedColumnValue<double>("ilayPriceValue");
								ilayServList.SetColumnValue("ilaySpecialPriceId", ilaySpecialPriceId);
								ilayServList.SetColumnValue("ilaySpecialCost", ilaySpecialCost);
								ilayServList.Save();
							}
						}
					}
				}
			}
		}
		
		private Guid getPatientIdFromServList(Guid servListId) {
			Guid ilayPatientId = (new Select(userConnection)
				.Column("ilayPatientId")
				.From("ilayServList")
				.Where("Id").IsEqual(Column.Parameter(servListId)) as Select).ExecuteScalar<Guid>();
			return ilayPatientId;
		}
		
		private List<Guid> getPatientAccs(Guid ilayPatientId) {
			List<Guid> ilayPatientAccList = new List<Guid>();
			if(ilayPatientId != Guid.Empty) {
				var ilayPatientAccESQ = new EntitySchemaQuery(userConnection.EntitySchemaManager, "ilayPatientAcc");
				ilayPatientAccESQ.AddAllSchemaColumns();
				
				var ilayPatientAccFilter1 = ilayPatientAccESQ.CreateFilterWithParameters(FilterComparisonType.Equal, 
					"ilayPatAccStatus", new Guid("c0ad5502-f232-4075-b9ea-3815ae4dc299")); //Активний
				ilayPatientAccESQ.Filters.Add(ilayPatientAccFilter1);
				var ilayPatientAccFilter2 = ilayPatientAccESQ.CreateFilterWithParameters(FilterComparisonType.Equal, 
					"ilayPatient", ilayPatientId);
				ilayPatientAccESQ.Filters.Add(ilayPatientAccFilter2);
				
				var ilayPatientAccEntities = ilayPatientAccESQ.GetEntityCollection(userConnection);
				foreach(Entity ilayPatientAcc in ilayPatientAccEntities) {
					ilayPatientAccList.Add(ilayPatientAcc.GetTypedColumnValue<Guid>("Id"));
				}
			//Den>
				//Так как EntitySchemaQuery при попытке join :
				//var priority = ilayPatientAccESQ.AddColumn("ilayAccountType.ilayPriority");
				//priority.OrderDirection = OrderDirection.Descending;
				//ilayPriority = ilayPatientAccEntities[0].GetTypedColumnValue<int>("ilayAccountType.ilayPriority");
				//Выдавало ошибку, пришлось делать еще один запрос.
				ilayPriority = (new Select(userConnection)
					.Top(1)
					.Column("at", "ilayPriority")
					.From("ilayPatientAcc").As("pa")
					.Join(JoinType.Inner, "ilayAccountType").As("at")
					.On("pa", "ilayAccountTypeId").IsEqual("at", "Id")
					.Where("pa", "ilayPatientId").IsEqual(Column.Parameter(ilayPatientId))
					.And("pa", "ilayPatAccStatusId").IsEqual(Column.Parameter(new Guid("c0ad5502-f232-4075-b9ea-3815ae4dc299")))
					.OrderByDesc("at", "ilayPriority")
					as Select
				).ExecuteScalar<int>();
			//Den<
			}
			return ilayPatientAccList;
		}

		private void updatePatientAccountAndPrice(List<Guid> patientAccs, List<Guid> servLists) {
			
			var ilayPriceForAccountESQ = new EntitySchemaQuery(userConnection.EntitySchemaManager, "ilayPriceForAccount");
			ilayPriceForAccountESQ.AddAllSchemaColumns();
			ilayPriceForAccountESQ.AddColumn("ilayPatientAcc.ilayAccountType.ilayPriority");
			var ilayPriceForAccountFilter1 = ilayPriceForAccountESQ.CreateFilterWithParameters(FilterComparisonType.Equal, 
				"ilayPriceStatus", new Guid("0b57640a-9443-4c78-a739-0d9ab437b39e"));
			ilayPriceForAccountESQ.Filters.Add(ilayPriceForAccountFilter1);
			//Den>
			//Фильтр по самому приоритетному счету пациента.
			var ilayPriceForAccountFilter = ilayPriceForAccountESQ.CreateFilterWithParameters(FilterComparisonType.Equal, 
				"ilayPatientAcc.ilayAccountType.ilayPriority", ilayPriority);
			ilayPriceForAccountESQ.Filters.Add(ilayPriceForAccountFilter);
			//patientAccs Guid добавлялись в AND фильтр...исправлено.
						
			var patAccsFilter = new EntitySchemaQueryFilterCollection(ilayPriceForAccountESQ, Terrasoft.Common.LogicalOperationStrict.Or);
			foreach(Guid patientAcc in patientAccs) {
				var ilayPriceForAccountFilter2 = ilayPriceForAccountESQ.CreateFilterWithParameters(FilterComparisonType.Equal, 
					"ilayPatientAcc", patientAcc);
				patAccsFilter.Add(ilayPriceForAccountFilter2);
			}
			ilayPriceForAccountESQ.Filters.Add(patAccsFilter);
			//Den<
			var ilayPriceForAccountEntities = ilayPriceForAccountESQ.GetEntityCollection(userConnection);
			//Den>
			List<Guid> priceList = new List<Guid>();
			Guid ilayPatientAccId = Guid.Empty;
			foreach(Entity ent in ilayPriceForAccountEntities) {
				if(ilayPatientAccId == Guid.Empty) ilayPatientAccId = ent.GetTypedColumnValue<Guid>("ilayPatientAccId");
				priceList.Add(ent.GetTypedColumnValue<Guid>("ilayPricePlanId"));
			}
			foreach(Guid servListId in servLists) {
				var ilayServListESQ = new EntitySchemaQuery(userConnection.EntitySchemaManager, "ilayServList");
				ilayServListESQ.AddAllSchemaColumns();
				var ilayServList = ilayServListESQ.GetEntity(userConnection, servListId);
				Guid ilayServiceId = ilayServList.GetTypedColumnValue<Guid>("ilayServiceId");
				Guid ilayPackageId = ilayServList.GetTypedColumnValue<Guid>("ilayPackageId");
				double minPriceValue, currPriceValue = 0;
				Guid minPriceId = Guid.Empty;
				Select select;
				if(ilayPackageId == Guid.Empty) {
					select = new Select(userConnection)
						.Column("Id")
						.Column("ilayPriceValue")
						.Column("ilayPriceId")
						.From("ilayPriceForService")
						.Where("ilayPriceStatusId").IsEqual(Column.Parameter(new Guid("0b57640a-9443-4c78-a739-0d9ab437b39e")))
						.And("ilayServiceId").IsEqual(Column.Parameter(ilayServiceId))
						.And("ilayPackageId").IsNull()
						.And("ilayPriceId").In(Column.Parameters(priceList))	as Select;
				} else {
					select = new Select(userConnection)
						.Column("Id")
						.Column("ilayPriceValue")
						.Column("ilayPriceId")
						.From("ilayPriceForService")
						.Where("ilayPriceStatusId").IsEqual(Column.Parameter(new Guid("0b57640a-9443-4c78-a739-0d9ab437b39e")))
						.And("ilayServiceId").IsEqual(Column.Parameter(ilayServiceId))
						.And("ilayPackageId").IsEqual(Column.Parameter(ilayPackageId))
						.And("ilayPriceId").In(Column.Parameters(priceList))	as Select;
				}
				
				using (var dbExecutor = userConnection.EnsureDBConnection())
				{
					using (var dataReader = select.ExecuteReader(dbExecutor))
					{
						if(dataReader.Read()) {
							minPriceValue = Convert.ToDouble(dataReader["ilayPriceValue"]);
							minPriceId = userConnection.DBTypeConverter.DBValueToGuid(dataReader["ilayPriceId"]);
							while (dataReader.Read())
							{
								currPriceValue = Convert.ToDouble(dataReader["ilayPriceValue"]);
								if(currPriceValue < minPriceValue) {
									minPriceValue = currPriceValue;
									minPriceId = userConnection.DBTypeConverter.DBValueToGuid(dataReader["ilayPriceId"]);
								}
							}
							ilayServList.SetColumnValue("ilayCoast", minPriceValue);
							ilayServList.SetColumnValue("ilayPriceId", minPriceId);
							if(ilayPatientAccId != Guid.Empty) ilayServList.SetColumnValue("ilayPatientAccountId", ilayPatientAccId);
							ilayServList.Save();
						}
					}
				}
			}
			//Den<
		}
	}
}