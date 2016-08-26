DateTime d = DateTime.Today;
string day = "0" + d.Day;
if(day.Length > 2){
	day = day.Substring(1, day.Length - 1);
}
string month = "0" + d.Month;
if(month.Length > 2){
	month = month.Substring(1, day.Length - 1);
}
string year = "" + d.Year;
string date1 = year + "-" + month + "-" + day + "%";

d = DateTime.Today.AddDays(1);
day = "0" + d.Day;
if(day.Length > 2){
	day = day.Substring(1, day.Length - 1);
}
month = "0" + d.Month;
if(month.Length > 2){
	month = month.Substring(1, day.Length - 1);
}
year = "" + d.Year;
string date2 = year + "-" + month + "-" + day;

var currentSelect = new Select(UserConnection)
	.Column("t1", "ImpactValue")
	.Column("t1", "ImpactValueType")
	.Column("t1", "ListingId")
	.Column("t2", "Price")
	.Column("t2", "UsrBasePrice")
.From("PriceChangeStorage").As("t1")
	.Join(JoinType.Inner, "Listing").As("t2").On("t1", "ListingId").IsEqual("t2", "Id")
	.Where("t1", "ImpactType").IsEqual(Column.Parameter("Акция"))
	.And("t1", "StartDate").IsLike(Column.Parameter(date1))as Select;


//LinkedList<Guid> guidList = new LinkedList<Guid>();  
using (var dbExecutor = UserConnection.EnsureDBConnection())
{
    using (var dataReader = currentSelect.ExecuteReader(dbExecutor))
    {
        while (dataReader.Read())
        {
			//guidList.AddLast(UserConnection.DBTypeConverter.DBValueToGuid(dataReader["ListingId"]));
			var price = Convert.ToInt32(dataReader["Price"]);
			var basePrice = Convert.ToInt32(dataReader["UsrBasePrice"]);
			if (basePrice == 0)
			{
				basePrice = price;
			}
			var updateParameter = Convert.ToInt32(dataReader["ImpactValue"]);
			var impactValueType = Convert.ToString(dataReader["ImpactValueType"]);
			price += ((impactValueType != "Сумма") ? (price * updateParameter)/100 : updateParameter);
			var update = new Update(UserConnection, "Listing")
				.Set("Price", Column.Parameter(price))
				.Set("UsrBasePrice", Column.Parameter(basePrice))
			.Where("Id").IsEqual(Column.Parameter(UserConnection.DBTypeConverter.DBValueToGuid(dataReader["ListingId"]))) as Update;
			update.Execute(dbExecutor);
        }
    }
}
var oldActionsSelect = new Select(UserConnection).Distinct()
	.Column("t2", "Id")
	.Column("t2", "Price")
	.Column("t2", "UsrBasePrice")
.From("PriceChangeStorage").As("t1")
	.Join(JoinType.Inner, "Listing").As("t2").On("t1", "ListingId").IsEqual("t2", "Id")
	.Where("t1", "ImpactType").IsEqual(Column.Parameter("Акция"))
	.And("t1", "EndDate").IsLike(Column.Parameter(date1))as Select;
using (var dbExecutor = UserConnection.EnsureDBConnection())
{
    using (var dataReader = oldActionsSelect.ExecuteReader(dbExecutor))
    {
        while (dataReader.Read())
        {
			var localSelect = new Select(UserConnection)
				.Column("t1", "ImpactValue")
				.Column("t1", "ImpactValueType")
			.From("PriceChangeStorage").As("t1")
				.Where("t1", "ListingId").IsEqual(Column.Parameter(UserConnection.DBTypeConverter.DBValueToGuid(dataReader["Id"])))
				.And().OpenBlock()
					.OpenBlock("t1", "ImpactType").IsEqual(Column.Parameter("Акция"))
						.And(Column.Parameter(date2)).IsLessOrEqual("t1", "EndDate")
						.And("t1", "StartDate").IsLess(Column.Parameter(date2))
					.CloseBlock()
					.Or("t1", "ImpactType").IsNotEqual(Column.Parameter("Акция"))
				.CloseBlock()
				as Select;
			
			var price = Convert.ToInt32(dataReader["UsrBasePrice"]);
			
			using (var innerDataReader = localSelect.ExecuteReader(dbExecutor))
			{
				
				while (innerDataReader.Read())
				{
					var updateParameter = Convert.ToInt32(innerDataReader["ImpactValue"]);
					var impactValueType = Convert.ToString(innerDataReader["ImpactValueType"]);
					price += ((impactValueType != "Сумма") ? (price * updateParameter)/100 : updateParameter);
					
				}
				var update = new Update(UserConnection, "Listing")
					.Set("Price", Column.Parameter(price))
				.Where("Id").IsEqual(Column.Parameter(UserConnection.DBTypeConverter.DBValueToGuid(dataReader["Id"]))) as Update;
				update.Execute(dbExecutor);
			}
		}
	}
}
return true;