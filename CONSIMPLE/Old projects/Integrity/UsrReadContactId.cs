DateTime d = DateTime.Today;
string day = "0" + d.Day;
if(day.Length > 2){
	day = day.Substring(1, day.Length - 1);
}
var currentSelect = new Select(UserConnection)
	.Column("ContactId") 
	.From("ContactAnniversary")
	.Where("AnniversaryTypeId").IsEqual(Column.Parameter(new Guid("173D56D2-FDCA-DF11-9B2A-001D60E938C6")))
	.And("Date").IsLike(Column.Parameter("%-" + d.Month.ToString() + "-" + day))	as Select;


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
UsrTimerOffset = 0;
if(d.DayOfWeek == DayOfWeek.Sunday){
	UsrTimerOffset = 86400;//time offset in sec.
}
if(d.DayOfWeek == DayOfWeek.Saturday){
	UsrTimerOffset = 86400*2;//time offset in sec.
}
return true;