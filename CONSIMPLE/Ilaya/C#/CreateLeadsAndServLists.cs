//[IL-576] Den

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

var ilayRecomendESQFilter3 = ilayRecomendESQ.CreateFilterWithParameters(FilterComparisonType.NotEqual, 
	"ilayService.ilayServCategory", new Guid("63E31699-426A-4ECC-93F0-DD89EC22A8E0"));
ilayRecomendESQ.Filters.Add(ilayRecomendESQFilter3);

var date = DateTime.Now.Date.AddDays(1);
var ilayRecomendESQFilter4 = ilayRecomendESQ.CreateFilterWithParameters(FilterComparisonType.GreaterOrEqual, 
	"ilayDateOfRecording", date);
ilayRecomendESQ.Filters.Add(ilayRecomendESQFilter4);
//Групируем рекомендации по всем галочкам, дате, врачу и мед. направлению.
//String - ключ [ilaySelfAssigning + ilayAssignToAnDoctor + ilayAssignToMe + ilayDoctorId + ilayDateOfRecording + ilayService.ilayMedDirection]
var servDict = new Dictionary<String, List<Guid>>();
var servDictDate = new Dictionary<String, DateTime>();
var servDictPrice = new Dictionary<String, double>();
var servDictDoctor = new Dictionary<String, Guid>();
var ilayRecomendInMedDocEntities = ilayRecomendESQ.GetEntityCollection(userConnection);
foreach(Entity ilayRecomendInMedDoc in ilayRecomendInMedDocEntities) {
	var doctorId = ilayRecomendInMedDoc.GetTypedColumnValue<Guid>("ilayDoctorId");
	var ilayDateOfRecording = ilayRecomendInMedDoc.GetTypedColumnValue<DateTime>("ilayDateOfRecording");
	var isa = ilayRecomendInMedDoc.GetTypedColumnValue<bool>("ilaySelfAssigning");
	var iatad = ilayRecomendInMedDoc.GetTypedColumnValue<bool>("ilayAssignToAnDoctor");
	var iatm = ilayRecomendInMedDoc.GetTypedColumnValue<bool>("ilayAssignToMe");
	var medDirection = (new Select(userConnection)
		.Column("ilayMedDirectionId")
		.From("Product")
		.Where("Id").IsEqual(Column.Parameter(ilayRecomendInMedDoc.GetTypedColumnValue<Guid>("ilayServiceId"))) as Select).ExecuteScalar<Guid>();
	var price = (new Select(userConnection)
		.Column("Price")
		.From("Product")
		.Where("Id").IsEqual(Column.Parameter(ilayRecomendInMedDoc.GetTypedColumnValue<Guid>("ilayServiceId"))) as Select).ExecuteScalar<double>();
	ilayDateOfRecording = ilayDateOfRecording.Date;
	var customKey = "";
	
	customKey = "" + isa + iatad + iatm + doctorId + medDirection + ilayDateOfRecording;
	servDictDate[customKey] = ilayDateOfRecording;
	servDictPrice[customKey] = servDictPrice.ContainsKey(customKey) ? servDictPrice[customKey] + price : price;
	servDictDoctor[customKey] = doctorId;
	if(servDict.ContainsKey(customKey))
	{
		var currList = new List<Guid>(servDict[customKey]);
		currList.Add(ilayRecomendInMedDoc.GetTypedColumnValue<Guid>("ilayServiceId"));
		servDict[customKey] = currList;
	} else {
		var currList = new List<Guid>();
		currList.Add(ilayRecomendInMedDoc.GetTypedColumnValue<Guid>("ilayServiceId"));
		servDict[customKey] = currList;
	}
}
/*
название - Тип потребности\ ФИО пациента
тип потребности - Потребность в услугах клиники 
дата создания - текущая дата
контакт - Пациент
создал - врач из визита
медичний напрямок - медецинское направление группы рекомендаций
ориентировочная дата визита - дата группы рекомендаций
дату актуализации-  ориентировочная дата визита- 3 дня или текущая дата, если ориентировочная дата меньше чем через  3 дня
загальна вартість сервісів
тип джерела -контакт с существующем клиентом
джерело - рекомендации
метод реєстрації - создан автоматически
*/
//Создаем лиды для каждой группы рекомендаций.
var leadIds = new List<Guid>();
var ilayPatientId = Get<Guid>("ProcessIlayPatientId");
var ilayPatientName = (new Select(userConnection)
				.Column("Name")
				.From("Contact")
				.Where("Id").IsEqual(Column.Parameter(ilayPatientId)) as Select).ExecuteScalar<string>();
var today = DateTime.Now;
var ilayDoctor = Get<Guid>("ProcessIlayDoctorId");
var LEAD_TYPE = new Guid("E12C4C83-97D3-42C7-B785-17B14179E879");
var LEAD_MEDIUM = new Guid("1CD669F4-4E2F-41E4-A439-C56B18F1F9B5");
var LEAD_SOURCE = new Guid("DE68C011-3952-47D8-AAC6-7B5AFF43A77F");
var LEAD_REGISTER_METHOD = new Guid("2F65913C-FF62-40FB-9D01-1A3E2E893E0E");
var ILAY_LEAD_TYPE = new Guid("4E8BC959-9842-40BB-9C95-3E3503676FD9");
var LeadServDict = new Dictionary<Guid, List<Guid>>();
var LeadServDoctorDict = new Dictionary<Guid, Guid>();
foreach(var el in servDict.Keys) {
	
	var leadId = Guid.NewGuid();
	leadIds.Add(leadId);
	LeadServDict[leadId] = servDict[el];
	if(servDictDoctor.ContainsKey(el)) LeadServDoctorDict[leadId] = servDictDoctor[el];
	var ilayMedDirection = (new Select(userConnection)
				.Column("ilayMedDirectionId")
				.From("Product")
				.Where("Id").IsEqual(Column.Parameter(servDict[el][0])) as Select).ExecuteScalar<Guid>();
	var ilayDateOfRecording = servDictDate[el];
	var IlayInterestActualizationDate = ilayDateOfRecording.AddDays(-3);
	if(IlayInterestActualizationDate < today) IlayInterestActualizationDate = today.AddHours(2);
	var leadDictionary = new Dictionary<string, object>()
	{
		{"Id", leadId},
		{"LeadName", "Потребность в услугах клиники/" + ilayPatientName},
		{"LeadTypeId", LEAD_TYPE},
		{"CreatedOn", today},
		{"QualifiedContactId", ilayPatientId},
		{"CreatedById", ilayDoctor},
		{"ilayMedDirectionId", ilayMedDirection},
		{"ilayDateOfRecording", ilayDateOfRecording},
		{"IlayInterestActualizationDate", IlayInterestActualizationDate},
		{"ilayTotalServCost", servDictPrice[el]},
		{"LeadMediumId", LEAD_MEDIUM},
		{"LeadSourceId", LEAD_SOURCE},
		{"RegisterMethodId", LEAD_REGISTER_METHOD},
		{"ilayLeadTypeId", ILAY_LEAD_TYPE}
	};
	var errorMsg = AddEntity(userConnection, "Lead", leadDictionary);
}
//Привязываем сервисы к Лидам.
var PERFORM_STATUS = new Guid("766AFF6D-ECA4-4059-9553-A53E93F06015");
var PAYMENT_STATUS = new Guid("FDBD93D7-752E-494C-A258-F3C159DE2148");
foreach(var id in leadIds)
{
	foreach(var prId in LeadServDict[id])
	{
		var productESQ = new EntitySchemaQuery(userConnection.EntitySchemaManager, "Product");
		productESQ.AddAllSchemaColumns();
		var product = productESQ.GetEntity(userConnection, prId);
		var ilayName = product.GetTypedColumnValue<string>("Name");
		var ilayServiceCode = product.GetTypedColumnValue<string>("Code");
		var ilayBaseCost = product.GetTypedColumnValue<double>("Price");
		var ilayServListDictionary = new Dictionary<string, object>()
		{
			{"ilayName", ilayName},
			{"CreatedById", ilayDoctor},
			{"ilayServiceId", prId},
			{"ilayServiceCode", ilayServiceCode},
			{"ilayBaseCost", ilayBaseCost},
			{"ilayPatientId", ilayPatientId},
			{"ilayPerfomStatusId", PERFORM_STATUS},
			{"ilayPaymentStatusId", PAYMENT_STATUS},
			{"ilayLeadId", id},
			{"ilayDoctorId", LeadServDoctorDict[id]}
		};
		var errorMsg = AddEntity(userConnection, "ilayServList", ilayServListDictionary);
	}
}