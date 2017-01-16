double ilayPriceValue = Entity.GetTypedColumnValue<double>("ilayPriceValue");
double oldIlayPriceValue = Entity.GetTypedOldColumnValue<double>("ilayPriceValue");
if(ilayPriceValue == oldIlayPriceValue) return true;

var UserConnection = context.UserConnection;
Guid ilayServiceId = Entity.GetTypedColumnValue<Guid>("ilayServiceId");
Guid ilayPackageId = Entity.GetTypedColumnValue<Guid>("ilayPackageId");
Guid ilayPriceId = Entity.GetTypedColumnValue<Guid>("ilayPriceId");
Guid ilayPricePlanStatusId = Guid.Empty;
Guid ilayPricePlanTypeId = Guid.Empty;

var ilayPricePlanSchemaQuery = new EntitySchemaQuery(UserConnection.EntitySchemaManager, "ilayPricePlan");
ilayPricePlanSchemaQuery.AddAllSchemaColumns();
var ilayPricePlanEntity = ilayPricePlanSchemaQuery.GetEntity(UserConnection, ilayPriceId);
if(ilayPricePlanEntity != null) 
{
	ilayPricePlanStatusId = ilayPricePlanEntity.GetTypedColumnValue<Guid>("ilayPriceStatusId");
	ilayPricePlanTypeId = ilayPricePlanEntity.GetTypedColumnValue<Guid>("ilayPriceTypeId");
}

if(ilayServiceId != Guid.Empty && ilayPricePlanStatusId == new Guid("0b57640a-9443-4c78-a739-0d9ab437b39e")
	&& ilayPricePlanTypeId == new Guid("d7c71086-bb98-48ef-88d3-b025487ed787")) 
{
	if(ilayPackageId != Guid.Empty)
	{
		var ilayPriceForServESQ = new EntitySchemaQuery(UserConnection.EntitySchemaManager, "ilayPriceForService");
		ilayPriceForServESQ.AddAllSchemaColumns();
		ilayPriceForServESQ.Filters.Add(ilayPriceForServESQ.CreateFilterWithParameters(FilterComparisonType.Equal, 
								"ilayPackage", ilayPackageId));
		ilayPriceForServESQ.Filters.Add(ilayPriceForServESQ.CreateFilterWithParameters(FilterComparisonType.Equal, 
								"ilayPrice", ilayPriceId));
		ilayPriceForServESQ.Filters.Add(ilayPriceForServESQ.CreateFilterWithParameters(FilterComparisonType.NotEqual, 
								"ilayService", ilayServiceId));
		var ilayPriceForServ = ilayPriceForServESQ.GetEntityCollection(UserConnection);
		double totalPackagePrice = ilayPriceValue;
		foreach(var pfs in ilayPriceForServ)
		{
			totalPackagePrice += pfs.GetTypedColumnValue<double>("ilayPriceValue");
		}
		var update = new Update(UserConnection, "Product")
			.Set("Price" ,Column.Parameter(totalPackagePrice))
			.Where("Id").IsEqual(Column.Parameter(ilayPackageId)) as Update;
		update.Execute();
	} 
	else
	{
		var update = new Update(UserConnection, "Product")
			.Set("Price" ,Column.Parameter(ilayPriceValue))
			.Where("Id").IsEqual(Column.Parameter(ilayServiceId)) as Update;
		update.Execute();
	}
}
return true;