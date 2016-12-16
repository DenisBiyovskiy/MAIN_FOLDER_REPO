//Den [IL-487]
Guid companyId = Entity.GetTypedColumnValue<Guid>("ilayCompanyId");
Guid accountId   = Entity.Id;
Guid statusId  = new Guid("0B57640A-9443-4C78-A739-0D9AB437B39E");//Активний
Guid pricePlanId = Guid.Empty;
if (Entity.GetTypedColumnValue<Guid>("ilayAccountTypeId") == new Guid("436982DA-322D-42D1-A43D-6DA6DB82D2BC")) 
{//Страховий
	if (companyId != Guid.Empty) {
		pricePlanId = (new Select(UserConnection)
			.Top(1)
			.Column("Id")
			.From("ilayPricePlan")
			//Злая ведьма Вася заставила меня поменять ilayAccountTypeId на ilayPriceTypeId -->
			//.Where("ilayAccountTypeId").IsEqual(Column.Parameter(new Guid("436982DA-322D-42D1-A43D-6DA6DB82D2BC")))//Страховий
			.Where("ilayPriceTypeId").IsEqual(Column.Parameter(new Guid("FF82E151-3308-477C-A3EB-2F8C620122AD")))//Страховий
			.And("ilayAccountId").IsEqual(Column.Parameter(companyId))
			.And("ilayPriceStatusId").IsEqual(Column.Parameter(new Guid("0B57640A-9443-4C78-A739-0D9AB437B39E")))//Активний
		as Select).ExecuteScalar<Guid>();
	}	
	if(pricePlanId == Guid.Empty)
	{
		pricePlanId = (new Select(UserConnection)
				.Top(1)
				.Column("Id")
				.From("ilayPricePlan")
				.Where("ilayPriceTypeId").IsEqual(Column.Parameter(new Guid("C16627E4-D885-4896-843A-6A294668D4C7")))//Накопичувальний
				.And("ilayRequiredSumm").IsEqual(Column.Parameter(0))
				.And("ilayPriceStatusId").IsEqual(Column.Parameter(new Guid("0B57640A-9443-4C78-A739-0D9AB437B39E")))//Активний
			as Select).ExecuteScalar<Guid>();
	}
	if(pricePlanId != Guid.Empty) 
	{
		using (var dbExecutor = UserConnection.EnsureDBConnection())
		{
			var newInsert = new Insert(UserConnection).Into("ilayPriceForAccount")
				.Set("ilayPatientAccId", Column.Parameter(accountId))
				.Set("ilayPricePlanId", Column.Parameter(pricePlanId))
				.Set("ilayPriceStatusId", Column.Parameter(statusId))
				.Set("CreatedById", Column.Parameter(UserConnection.CurrentUser.ContactId));
			newInsert.Execute(dbExecutor);
		}
	}
}
if (Entity.GetTypedColumnValue<Guid>("ilayAccountTypeId") == new Guid("FDD138B6-C22A-44D8-9557-189C1E5C54E1")) 
{//Комерційний
	pricePlanId = (new Select(UserConnection)
				.Top(1)
				.Column("Id")
				.From("ilayPricePlan")
				.Where("ilayPriceTypeId").IsEqual(Column.Parameter(new Guid("C16627E4-D885-4896-843A-6A294668D4C7")))//Накопичувальний
				.And("ilayRequiredSumm").IsEqual(Column.Parameter(0))
				.And("ilayPriceStatusId").IsEqual(Column.Parameter(new Guid("0B57640A-9443-4C78-A739-0D9AB437B39E")))//Активний
			as Select).ExecuteScalar<Guid>();
	if(pricePlanId != Guid.Empty) 
	{
		using (var dbExecutor = UserConnection.EnsureDBConnection())
		{
			var newInsert = new Insert(UserConnection).Into("ilayPriceForAccount")
				.Set("ilayPatientAccId", Column.Parameter(accountId))
				.Set("ilayPricePlanId", Column.Parameter(pricePlanId))
				.Set("ilayPriceStatusId", Column.Parameter(statusId))
				.Set("CreatedById", Column.Parameter(UserConnection.CurrentUser.ContactId));
			newInsert.Execute(dbExecutor);
		}
	}
}
return true;