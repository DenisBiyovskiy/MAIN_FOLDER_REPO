Meridian

UsrReservation on save handling

var currentSelect = new Select(UserConnection)
  .Column("UsrReservation", "Id")
  .Column("UsrReservation", "UsrReservationStateId")
    .From("UsrReservation")
  .Where("UsrReservation", "UsrListingId").IsEqual(Column.Parameter(Entity.GetTypedColumnValue<Guid>("UsrListingId")))
    .And("Id").IsNotEqual(Column.Parameter(Entity.GetTypedColumnValue<Guid>("Id")))as Select;
var UsrHasActiveReserv = false;
Guid curId = new Guid("386BDD79-8A1A-4853-8550-A6AE4CA0A5AE"); // active state guid
using (var dbExecutor = UserConnection.EnsureDBConnection())
{
    if(curId.Equals(Entity.GetTypedColumnValue<Guid>("UsrReservationStateId")))
    {
        UsrHasActiveReserv = true;
    } else {
        using (var dataReader = currentSelect.ExecuteReader(dbExecutor))
        {
            while (dataReader.Read())
            {
                if(UserConnection.DBTypeConverter.DBValueToGuid(dataReader["Id"]) != Guid.Empty)
                {
                    if (curId.Equals(UserConnection.DBTypeConverter.DBValueToGuid(dataReader["UsrReservationStateId"])))
                    {
                        UsrHasActiveReserv = true;
                    }
                }
            }
        }
    }
    var update = new Update(UserConnection, "Listing")
        .Set("UsrHasActiveReserv", Column.Parameter(UsrHasActiveReserv))
        .Where("Id").IsEqual(Column.Parameter(Entity.GetTypedColumnValue<Guid>("UsrListingId"))) as Update;
    update.Execute(dbExecutor);
}
return true;

