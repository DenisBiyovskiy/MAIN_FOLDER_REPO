SQL in C# samples

UserConnection - доступен при добавлении обработки по удалению\сохранению объекта.
Просто в БП нжно получать:
var userConnection = Get<UserConnection>("UserConnection");

____________________________________________________________________________________________________________________________________________________
Insert sample
var insertPhone = new Insert(UserConnection).Into("RequestsCommunication")
     .Set("RequestsId", Column.Parameter(requestId))
     .Set("CommunicationTypeId", Column.Parameter(communicationTypePhoneId))
     .Set("Number", Column.Parameter(Phone));
insertPhone.Execute();
.IsLessOrEqual(Column.Parameter(userConnection.CurrentUser.GetCurrentDateTime()))

.OrderByDesc("Date")

simple SELECT sample

var currentSelect = new Select(UserConnection)
  .Column("Contact", "Id")
  .Column("Contact", "Name")
    .From("Contact")
  .Where("Contact", "Name").IsNotEqual(Column.Parameter("Supervisor")) as Select;

using (var dbExecutor = UserConnection.EnsureDBConnection())
{
    using (var dataReader = currentSelect.ExecuteReader(dbExecutor))
    {
        while (dataReader.Read())
        {
           if(UserConnection.DBTypeConverter.DBValueToGuid(dataReader["Id"]) != Guid.Empty)
           {
                string[] stringSeparators = new string[] {" "};
                string[] splitResult;
                string resultString;
                resultString = Convert.ToString(dataReader["Name"]);
                Guid curId = UserConnection.DBTypeConverter.DBValueToGuid(dataReader["Id"]);
                splitResult = resultString.Split(stringSeparators, StringSplitOptions.None);

                if (splitResult.Length == 2)
                {
                    resultString = splitResult[1] + " " + splitResult[0] + " ";
                }
                if(splitResult.Length == 3)
                {
                    resultString = splitResult[2] + " " + splitResult[0] + " " + splitResult[1];
                }
                if(splitResult.Length != 3 && splitResult.Length != 2)
                {
                    continue;
                }

                splitResult = resultString.Split(stringSeparators, StringSplitOptions.None);
                var update = new Update(UserConnection, "Contact")
                    .Set("Name", Column.Parameter(resultString))
                    .Set("GivenName", Column.Parameter(splitResult[1]))
                    .Set("Surname", Column.Parameter(splitResult[0]))
                    .Set("MiddleName", Column.Parameter(splitResult[2]))
                 .Where("Id").IsEqual(Column.Parameter(curId)) as Update;
                update.Execute(dbExecutor);
           }
        }
    }
}
return true;
Join and "AND"/"OR" clauses

Guid curId = Entity.GetTypedColumnValue<Guid>("Id");
var currentSelect = new Select(UserConnection)
  .Column("t1", "Id")
  .Column("t1", "UsrIsNew")
    .From("Order").As("t1")
  .Join(JoinType.Inner, "OrderProduct").As("t2").On("t1", "Id").IsEqual("t2", "OrderId")
  .Where("t1", "ContactId").IsEqual(Column.Parameter(Entity.GetTypedColumnValue<Guid>("ContactId"))
      .And().OpenBlock("t1", "StatusId" ).IsEqual(Column.Parameter("40de86ee-274d-4098-9b92-9ebdcf83d4fc"))
        .Or("t1", "StatusId").IsEqual(Column.Parameter("c8742634-ea8b-46d9-ba71-1989b951772d"))
    .CloseBlock()
  as Select;

using (var dbExecutor = UserConnection.EnsureDBConnection())
{
    using (var dataReader = currentSelect.ExecuteReader(dbExecutor))
    {
        if(dataReader.Read())
        {
           if(UserConnection.DBTypeConverter.DBValueToGuid(dataReader["Id"]) != Guid.Empty)
           {
            var update = new Update(UserConnection, "Order")
                .Set("UsrIsNew", Column.Parameter(true))
            .Where("Id").IsEqual(Column.Parameter(curId)) as Update;
            update.Execute(dbExecutor);
           }
        }
    }
}
return true;
One more clause sample

Здравствуйте, Лариса!
Для комбинирования условий используются операторы OpenBlock и CloseBlock. Например:
Select select =
        new Select(UserConnection)
                .Column("Id")
                .Column("SysSchemaId")
                .Column("Name")
                .Column("SysSchemaManagerName")
                .Column("SysSchemaFolderId")
                .Column("MetaDataModifiedOn")
        .From("VwSysSchemaInSolution")
        .Where("SysSolutionId").IsEqual(new QueryParameter("solutionId", userConnection.Solution.Id))
                .And("SysSchemaId").In(schemas)
               .And("SysSchemaStateInSolution").IsNotEqual(Column.Const((int)StoringObjectState.Deleted))
                .And().OpenBlock("LockedById").IsNull()
                        .Or("LockedById").IsEqual(newQueryParameter("currentUserId", userConnection.CurrentUser.Id))
                .CloseBlock()
                as Select;
DateTime and IsLike sample

DateTime d = DateTime.Today;
var currentSelect = new Select(UserConnection)
    .Column("ContactId")
    .From("ContactAnniversary")
    .Where("Date").IsLike(Column.Parameter("%-" + d.Month + "-" + d.Day))
    .And("AnniversaryTypeId").IsEqual(Column.Parameter(new Guid("173D56D2-FDCA-DF11-9B2A-001D60E938C6")))    as Select;


string resultString = ""; 
using (var dbExecutor = UserConnection.EnsureDBConnection())
{
    using (var dataReader = currentSelect.ExecuteReader(dbExecutor))
    {
        while (dataReader.Read())
        {
            resultString = resultString + Convert.ToString(dataReader["ContactId"]) + ";";
        }
    }
}
if(resultString.Length > 0){
    StringOfContactGuids = resultString.Substring(0, resultString.Length - 1);
}
else
{
    StringOfContactGuids = "";
}
return true;
BAD SAMPLE
EntitySchemaQuery esq = new EntitySchemaQuery(UserConnection.EntitySchemaManager, "UsrEquipPerfomance");
esq.AddColumn("Id");
esq.AddColumn("UsrLead");
var UsrTrasnportObtainFilter = esq.CreateFilterWithParameters(FilterComparisonType.Equal, "UsrLead", UsrLeadID);
esq.Filters.Add(UsrTrasnportObtainFilter);
var esqEntityCollection = esq.GetEntityCollection(UserConnection);
Guid id = System.Guid.NewGuid();
UsrOpportunityId = id;
DateTime dt = DateTime.Now;
string datetime = dt.ToString();
Guid opportunityContactId = System.Guid.NewGuid();

var insert = new Insert(UserConnection).Into("Opportunity")
    .Set("Id", Column.Parameter(UsrOpportunityId))
    .Set("Title", Column.Parameter(datetime))
    .Set("StageId", Column.Parameter(UsrOpportunityStageId))
    .Set("OwnerId", Column.Parameter(UsrOwnerId))
    .Set("LeadTypeId", Column.Parameter(UsrLeadType));
insert.Execute(); //создание продажи

var insert1 = new Insert(UserConnection).Into("OpportunityContact")
    .Set("Id", Column.Parameter(opportunityContactId))
    .Set("ContactId", Column.Parameter(UsrFirstCallContact))
    .Set("OpportunityId", Column.Parameter(UsrOpportunityId));
insert1.Execute(); //деталь продажи контакт в продаже

if(esqEntityCollection != null){
    foreach ( var result in esqEntityCollection)
    {
        if (result.GetTypedColumnValue<Guid>("UsrLeadId") != Guid.Empty)
        {
            var update = new Update(UserConnection, "UsrEquipPerfomance")
                .Set("UsrOpportunityId", Column.Parameter(UsrOpportunityId))
                .Where("UsrLeadId").IsEqual(Column.Parameter(UsrLeadID)) as Update;
            update.Execute(); //
        }
    }
}//Перенос оборудование из лида в продажу
return true;
return true;
var insert = new Insert(userConnection).Into("Contact")
        .Set("Name", Func.IsNull(Column.Parameter(string.Empty), Column.Parameter("ParameterValue")));
//не проверено на работоспособность, инфа с сайта академии.

 https://www.terrasoft.ru/bpmonlinesdk/
____________________________________________________________________________________________________________________
   .Top(1)
   .Column("t1", "ContactId") 
   .Column("t1", "CreatedOn")
   .Column("t2", "CreatedOn")
   .From("Activity").As("t1")
   .Join(JoinType.Inner, "UsrPayments").As("t2")
   .On("t1", "ContactId").IsEqual("t2", "UsrDebtorId")
   .Where("t1", "CreatedOn").IsLess("t2", "CreatedOn").OrderByAsc("t1", "id") as Select;