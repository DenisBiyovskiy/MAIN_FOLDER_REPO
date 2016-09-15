//Список параметров сервиса пациентов
	Guid ilayDoctorId = new Guid();
	Guid ilayCourseId = new Guid();
	Guid ilayPatientId = new Guid();
	Guid ilayServiceId = new Guid();
//ID сервіса пацієнта.
	Guid SERVISE_ID = Get<Guid>("ProcessServiceChosen");
	
	UserConnection userConnection = context.UserConnection;
//---------------------------------------------------------------------------------------------------
//1.Читаем инфу самого Сервиса пациентов.
/*
	1:	ilayDoctorId
	2:	ilayCourseId
	3:	ilayPatientId
	4: 	ilayServiceId //какой-то хороший человек назвал так "Послуги" в этом объекте.
	...
*/
var currentSelect = new Select(userConnection)
	.Column("Id")
	.Column("ilayDoctorId")
	.Column("ilayCourseId")
	.Column("ilayPatientId")
	.Column("ilayServiceId")
		.From("ilayServList")
	.Where("Id").IsEqual(Column.Parameter(SERVISE_ID)) as Select;

using (var dbExecutor = userConnection.EnsureDBConnection())
{
	using (var dataReader = currentSelect.ExecuteReader(dbExecutor))
	{
		if(dataReader.Read())
		{
			if(dataReader.GetGuid(dataReader.GetOrdinal("Id")) != Guid.Empty)
			{
				ilayDoctorId = userConnection.DBTypeConverter.DBValueToGuid(dataReader["ilayDoctorId"]);
				ilayCourseId = userConnection.DBTypeConverter.DBValueToGuid(dataReader["ilayCourseId"]);
				ilayPatientId = userConnection.DBTypeConverter.DBValueToGuid(dataReader["ilayPatientId"]);
				ilayServiceId = userConnection.DBTypeConverter.DBValueToGuid(dataReader["ilayServiceId"]);
			}
		}
	}
}		
Set<Guid>("ProcessIlayPatientId", ilayPatientId);
Set<Guid>("ProcessIlayCourseId", ilayCourseId);
Set<Guid>("ProcessIlayDoctorId", ilayDoctorId);
Set<Guid>("ProcessCurrentProduct", ilayServiceId);

var esqResult = new EntitySchemaQuery(userConnection.EntitySchemaManager, "ilayDocOrderInServ");
esqResult.AddColumn("ilayDocType");
esqResult.AddColumn("ilayDocCategory");
var sortOrder = esqResult.AddColumn("ilaySignOrder");
sortOrder.OrderByAsc(0);
// Создание экземпляра второго фильтра.
esqResult.Filters.Add(esqResult.CreateFilterWithParameters(FilterComparisonType.Equal, 
"ilayService", ilayServiceId));
esqResult.Filters.LogicalOperation = LogicalOperationStrict.And;

var entities = esqResult.GetEntityCollection(userConnection);

SerializeEntCollection(entities);

return true;