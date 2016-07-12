//Объявляем переменные и "константы".
//ID сервіса пацієнта.
Guid SERVISE_ID = Get<Guid>("ProcessServiceChosen");
//ID пациента
//Guid const PATIENT_ID = Guid.NewGuid();
//Имя системной настройки автонумерации и ее маски для документа.
string sysSettingName = "DocumentLastNumber";
string sysSettingMaskName = "DocumentCodeMask";
//Дата создания документа.
DateTime date = DateTime.Now;
//"Медичний документ"
Guid DOCUMENT_TYPE = new Guid("2F3F339E-7A37-4772-8C87-C4DFF260B341");
//"Підготовка"
Guid DOCUMENT_STATE = new Guid("1FCD639A-E581-4E2E-815B-7A7EE341BAC1");
//Список айдишников шаблонов документов, по которым будем создавать Мед.доки
ArrayList docModelsIdsList = new ArrayList();
//Список параметров сервиса пациентов
	Guid ilayVisittoDoctorId = new Guid();
	Guid ilayDoctorId = new Guid();
	Guid ilayCourseId = new Guid();
	Guid ilayPatientId = new Guid();
	Guid ilayServiceId = new Guid();
//Карта связи Guid-а созданных Мед.доков и шаблонов мед.доков. для переноса характеристик
/*
	Key: DocModelGuid;//Id Шаблонов документов из севисов.
	Value: MedDocGuid;//Id Созданных Мед.доков.
*/
Dictionary<Guid, Guid> docsIdMap = new Dictionary<Guid, Guid>();
var userConnection = Get<UserConnection>("UserConnection");

//---------------------------------------------------------------------------------------------------
//1.Читаем инфу самого Сервиса пациентов.
/*	Записи массива "servParamsList"
	0:	ilayVisittoDoctorId
	1:	ilayDoctorId
	2:	ilayCourseId
	3:	ilayPatientId
	4: 	ilayServiceId //какой-то хороший человек назвал так "Послуги" в этом объекте.
	...
*/
var currentSelect = new Select(userConnection)
	.Column("Id")
	.Column("ilayVisittoDoctorId")
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
			if(userConnection.DBTypeConverter.DBValueToGuid(dataReader["Id"]) != Guid.Empty)
			{
				ilayVisittoDoctorId = userConnection.DBTypeConverter.DBValueToGuid(dataReader["ilayVisittoDoctorId"]);
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
//---------------------------------------------------------------------------------------------------

//---------------------------------------------------------------------------------------------------
//2.Выбираем шаблоны мед документов в состоянии "активный" из сервисов пациента.
var statusActiveGuid = new Guid("C0AD5502-F232-4075-B9EA-3815AE4DC299");// статус активний
currentSelect = new Select(userConnection)
	.Column("Id")
	.Column("ilayStatusId")
	.Column("ilayProductId")
		.From("ilayDocModel")
	.Where("ilayProductId").IsEqual(Column.Parameter(ilayServiceId))
		.And("ilayStatusId").IsEqual(Column.Parameter(statusActiveGuid)) as Select;


using (var dbExecutor = userConnection.EnsureDBConnection())
{
	using (var dataReader = currentSelect.ExecuteReader(dbExecutor))
	{
		while (dataReader.Read())
		{
			if(userConnection.DBTypeConverter.DBValueToGuid(dataReader["Id"]) != Guid.Empty)
			{
				docModelsIdsList.Add(userConnection.DBTypeConverter.DBValueToGuid(dataReader["Id"]));
			}
		}
	}
}

/*//3.Читаем инфу из пациента
var statusActiveGuid = new Guid("C0AD5502-F232-4075-B9EA-3815AE4DC299")// статус активний
currentSelect = new Select(userConnection)
	.Column("Id")
		.From("ilayPatient")
	.Where("Id").IsEqual(Column.Parameter(PATIENT_ID)) as Select;

//Поля пациента для переноса в мед. док.
var patientPropertiesList = new ArrayList();

using (var dbExecutor = userConnection.EnsureDBConnection())
{
	using (var dataReader = currentSelect.ExecuteReader(dbExecutor))
	{
		
		while (dataReader.Read())
		{
			if(userConnection.DBTypeConverter.DBValueToGuid(dataReader["Id"]) != Guid.Empty)
			{
				
			}
		}
	}
}*/

//---------------------------------------------------------------------------------------------------
//4.Инсертим новые мед.доки.
foreach(Guid docModelId in docModelsIdsList) {
	string number = GetIncrementCode(sysSettingName, sysSettingMaskName);
	Guid newGuid = Guid.NewGuid();

	//Сохраняем новый Guid по ключу Guid шаблона по которому создали мед.док.
	docsIdMap.Add(docModelId, newGuid);
	using (var dbExecutor = userConnection.EnsureDBConnection())
	{
		var insert = new Insert(userConnection).Into("Document")
					.Set("Id", Column.Parameter(newGuid))
					.Set("TypeId", Column.Parameter(DOCUMENT_TYPE))
					.Set("ilayPatientId", Column.Parameter(ilayPatientId))
					.Set("StateId", Column.Parameter(DOCUMENT_STATE))
					.Set("OwnerId", Column.Parameter(ilayDoctorId))
					.Set("ilayCourseId", Column.Parameter(ilayCourseId))
					.Set("ilayPatientServiceId", Column.Parameter(SERVISE_ID))
					.Set("ilayModelNameId", Column.Parameter(docModelId))
					.Set("Number", Column.Parameter(number))
					.Set("ilayVisitId", Column.Parameter(ilayVisittoDoctorId))
					.Set("Date", Column.Parameter(date)) as Insert;
		insert.Execute(dbExecutor);
	}
}

//---------------------------------------------------------------------------------------------------
//5.Получаем характеристики из шаблонов доков. и заполняем их в мед. доках.
foreach(Guid docModelId in docModelsIdsList) {
	currentSelect = new Select(userConnection)
		.Column("t1", "Id")
		.Column("t1", "StringValue")
		.Column("t1", "IntValue")
		.Column("t1", "FloatValue")
		.Column("t1", "BooleanValue")
		.Column("t1", "SpecificationId")
		.Column("t1", "ListItemValueId")
		.Column("t1", "ilaySerialNumber")
		.Column("t2", "TypeId")
			.From("ilayDocSpecification").As("t1").Join(JoinType.Inner, "Specification").As("t2")
			.On("t1", "SpecificationId").IsEqual("t2", "Id")
		.And("t1", "ilayDocModelId").IsEqual(Column.Parameter(docModelId)) as Select;

	using (var dbExecutor = userConnection.EnsureDBConnection())
	{
		using (var dataReader = currentSelect.ExecuteReader(dbExecutor))
		{
			
			while (dataReader.Read())
			{
				Guid specId = Guid.NewGuid();
				if((dataReader.GetColumnValue<Guid>("Id") != Guid.Empty))
				{
					var insert = new Insert(userConnection).Into("ilayMedDocSpecific")
							.Set("StringValue", Column.Parameter(dataReader.GetColumnValue<string>("StringValue")))
							.Set("IntValue", Column.Parameter(dataReader.GetColumnValue<int>("IntValue")))
							.Set("FloatValue", Column.Parameter(dataReader.GetColumnValue<float>("FloatValue")))
							.Set("BooleanValue", Column.Parameter(dataReader.GetColumnValue<bool>("BooleanValue")))
							.Set("ilaySerialNumber", Column.Parameter(dataReader.GetColumnValue<string>("ilaySerialNumber")))
							.Set("ilayMedDocId", Column.Parameter(docsIdMap[docModelId]))
							.Set("ilayDocModelId", Column.Parameter(docModelId))
							.Set("SpecificationId", Column.Parameter(dataReader.GetColumnValue<Guid>("SpecificationId")))
							.Set("ilaySpecificTypeId", Column.Parameter(dataReader.GetColumnValue<Guid>("TypeId")))
							.Set("Id", Column.Parameter(specId)) as Insert;
					if(dataReader.GetColumnValue<Guid>("ListItemValueId") != Guid.Empty)
					{
							insert.Set("ListItemValueId", Column.Parameter(dataReader.GetColumnValue<Guid>("ListItemValueId")));
					}
					insert.Execute(dbExecutor);
				}
			}
		}
	}
}
return true;
