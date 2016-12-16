//[IL-577] Den

Guid ilayVisit = Get<Guid>("ProcessCurrentVisit1");
var userConnection = Get<UserConnection>("UserConnection");

var ilayRecomendESQ = new EntitySchemaQuery(userConnection.EntitySchemaManager, "ilayRecomendInMedDoc");
ilayRecomendESQ.AddAllSchemaColumns();

var ilayRecomendESQFilter1 = ilayRecomendESQ.CreateFilterWithParameters(FilterComparisonType.Equal, 
	"ilayVisit", ilayVisit);
ilayRecomendESQ.Filters.Add(ilayRecomendESQFilter1);

var ilayRecomendESQFilter2 = ilayRecomendESQ.CreateFilterWithParameters(FilterComparisonType.IsNotNull, 
	"ilayService");
ilayRecomendESQ.Filters.Add(ilayRecomendESQFilter2);

var ilayRecomendESQFilter3 = ilayRecomendESQ.CreateFilterWithParameters(FilterComparisonType.Equal, 
	"ilayService.ilayServCategory", new Guid("63E31699-426A-4ECC-93F0-DD89EC22A8E0"));
ilayRecomendESQ.Filters.Add(ilayRecomendESQFilter3);

var date = DateTime.Now.Date.AddDays(1);
var ilayRecomendESQFilter4 = ilayRecomendESQ.CreateFilterWithParameters(FilterComparisonType.GreaterOrEqual, 
	"ilayDateOfRecording", date);
ilayRecomendESQ.Filters.Add(ilayRecomendESQFilter4);

var ilayRecomendInMedDocEntities = ilayRecomendESQ.GetEntityCollection(userConnection);

var ilayPatientId = Get<Guid>("ProcessIlayPatientId");
var today = DateTime.Now;
var ilayDoctor = Get<Guid>("ProcessIlayDoctorId");
var ILAY_SURGERY_STATE = new Guid("F8F8F6FC-6787-4F86-BE62-3D1BBEBEFFFA");
var SurgeriesPackageDic = new Dictionary<Guid, Guid>();//<SurgeryId, ProductPackageId>

//Создаем операции.
foreach(Entity ilayRecomendInMedDoc in ilayRecomendInMedDocEntities) {
	/*
		Если тип услуги рекомендации Операційний пакет, создать Операцию. 
		Название операции = Название пакета + Имя пациента 
		Дата операції = Орієнтована дата
		Відповідальний = Лікар
		Стадія = Планування
		Создать сервисы из пакета с привязкой к этой операции. 
	*/
	var ilayPackageId = ilayRecomendInMedDoc.GetTypedColumnValue<Guid>("ilayServiceId");
	var doctorId = ilayRecomendInMedDoc.GetTypedColumnValue<Guid>("ilayDoctorId");
	var ilayDateOfRecording = ilayRecomendInMedDoc.GetTypedColumnValue<DateTime>("ilayDateOfRecording");
	var ilayPatientName = (new Select(userConnection)
					.Column("Name")
					.From("Contact")
					.Where("Id").IsEqual(Column.Parameter(ilayPatientId)) as Select).ExecuteScalar<string>();
	var ilayPackageName = (new Select(userConnection)
					.Column("Name")
					.From("Product")
					.Where("Id").IsEqual(Column.Parameter(ilayPackageId)) as Select).ExecuteScalar<string>();
	var surgeryId = Guid.NewGuid();
	SurgeriesPackageDic[surgeryId] = ilayPackageId;
	var surgeryDictionary = new Dictionary<string, object>()
	{
		{"Id", surgeryId},
		{"Name", ilayPackageName + "/" + ilayPatientName},
		{"ilaySurgeryDate", ilayDateOfRecording},
		{"CreatedOn", today},
		{"CreatedById", ilayDoctor},
		{"ilayDoctorId", doctorId},
		{"ilaySurgeryStateId", ILAY_SURGERY_STATE}
	};
	var errorMsg = AddEntity(userConnection, "ilaySurgery", surgeryDictionary);
}

//Выбираем пакеты и создаем cервисы.
var PERFORM_STATUS = new Guid("766AFF6D-ECA4-4059-9553-A53E93F06015");
var PAYMENT_STATUS = new Guid("FDBD93D7-752E-494C-A258-F3C159DE2148");
foreach(var el in SurgeriesPackageDic.Keys) {
	var prodInPackESQ = new EntitySchemaQuery(userConnection.EntitySchemaManager, "ilayProductsInPackage");
	prodInPackESQ.AddAllSchemaColumns();
	var prodInPackESQFilter1 = prodInPackESQ.CreateFilterWithParameters(FilterComparisonType.Equal, 
		"ilayPackage", SurgeriesPackageDic[el]);
	prodInPackESQ.Filters.Add(prodInPackESQFilter1);
	var productsAndPacks = prodInPackESQ.GetEntityCollection(userConnection);
	foreach(var p in productsAndPacks)
	{
		var pId = p.GetTypedColumnValue<Guid>("ilayProductId");
		var productESQ = new EntitySchemaQuery(userConnection.EntitySchemaManager, "Product");
		productESQ.AddAllSchemaColumns();
		var product = productESQ.GetEntity(userConnection, pId);
		var ilayName = product.GetTypedColumnValue<string>("Name");
		var ilayServiceCode = product.GetTypedColumnValue<string>("Code");
		var ilayBaseCost = product.GetTypedColumnValue<double>("Price");
		var count = p.GetTypedColumnValue<int>("ilayProdNumber");
		var ilayServListDictionary = new Dictionary<string, object>()
		{
			{"ilayName", ilayName},
			{"CreatedById", ilayDoctor},
			{"ilayServiceId", pId},
			{"ilayServiceCode", ilayServiceCode},
			{"ilayBaseCost", ilayBaseCost},
			{"ilayPatientId", ilayPatientId},
			{"ilayPerfomStatusId", PERFORM_STATUS},
			{"ilayPaymentStatusId", PAYMENT_STATUS},
			{"ilayPackageId", SurgeriesPackageDic[el]},
			{"ilaySurgeryId", el}
		};
		for(var i = 0; i < count; i++) 
		{
			var errorMsg = AddEntity(userConnection, "ilayServList", ilayServListDictionary);
		}
	}
}