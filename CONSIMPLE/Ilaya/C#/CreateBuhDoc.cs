//i have at least this
Guid ilayDoctorId = Get<Guid>("ProcessIlayDoctorId");
Guid ilayCourseId = Get<Guid>("ProcessIlayCourseId");
Guid ilayPatientId = Get<Guid>("ProcessIlayPatientId");
Guid ilayVisitId = Get<Guid>("ProcessCurrentVisit1");
float ilayDebt = 0;


Guid CONTRACT_STATE_ID = new Guid("1F703F42-F7E8-4E3F-9B54-2B85F62EA507");
//Бух.док.
Guid DOCUMENT_TYPE = new Guid("6CA82292-133E-4788-9E65-55A3C2C1E7BA");
//Додаткова угода/акт
Guid DOCUMENT_CATEGORY = new Guid("13401E41-E9A5-4156-A5E6-99044156128D");
//"Підготовка"
Guid DOCUMENT_STATE = new Guid("1FCD639A-E581-4E2E-815B-7A7EE341BAC1");
//На виконанні
Guid PERFORM_STATUS = new Guid("2E0AFD6B-B528-482A-9F00-52CCCB14B3BA");
//Підписано
Guid DOCUMENT_SIGNED = new Guid("92878C33-5938-459B-B6A9-AAD8C6BAB711");
//Не поребує
Guid DOCUMENT_NO_NEED = new Guid("77300FF4-1776-4B30-846F-C529D9DF5B13");
string sysSettingName = "DocumentLastNumber";
string sysSettingMaskName = "DocumentCodeMask";

Guid ContractId = Guid.Empty;
Guid OurCompanyId = Guid.Empty;
Guid SupplierBillingInfoId = Guid.Empty;
var userConnection = Get<UserConnection>("UserConnection");
//---------------------------------------------------------------------------------------------------
//Читаю задолженность пацыента.
var currentSelect = new Select(userConnection)
	.Column("Id")
	.Column("ilayDebt")
		.From("Contact")
	.Where("Id").IsEqual(Column.Parameter(ilayPatientId)) as Select;
using (var dbExecutor = userConnection.EnsureDBConnection())
{
	using (var dataReader = currentSelect.ExecuteReader(dbExecutor))
	{
		if(dataReader.Read())
		{
			if(userConnection.DBTypeConverter.DBValueToGuid(dataReader["Id"]) != Guid.Empty)
			{
				ilayDebt = dataReader.GetColumnValue<float>("ilayDebt");
			}
		}
	}
}	
//---------------------------------------------------------------------------------------------------


//---------------------------------------------------------------------------------------------------
//Читаю договор пациента.
currentSelect = new Select(userConnection)
	.Column("Id")
	.Column("OurCompanyId")
	.Column("SupplierBillingInfoId")
		.From("Contract")
	.Where("ilayPatientId").IsEqual(Column.Parameter(ilayPatientId))
	.And("StateId").IsEqual(Column.Parameter(CONTRACT_STATE_ID)) as Select;
using (var dbExecutor = userConnection.EnsureDBConnection())
{
	using (var dataReader = currentSelect.ExecuteReader(dbExecutor))
	{
		if(dataReader.Read())
		{
			if(userConnection.DBTypeConverter.DBValueToGuid(dataReader["Id"]) != Guid.Empty)
			{
				ContractId = dataReader.GetColumnValue<Guid>("Id");
				OurCompanyId = dataReader.GetColumnValue<Guid>("OurCompanyId");
				SupplierBillingInfoId = dataReader.GetColumnValue<Guid>("SupplierBillingInfoId");
			}
		}
	}
}	
//---------------------------------------------------------------------------------------------------


//---------------------------------------------------------------------------------------------------
//Создаем Бух.док.
	string number = GetIncrementCode(sysSettingName, sysSettingMaskName);
	Guid documentId = Guid.NewGuid();
	DateTime date = DateTime.Now;

	using (var dbExecutor = userConnection.EnsureDBConnection())
	{
		var insert = new Insert(userConnection).Into("Document")
					.Set("Id", Column.Parameter(documentId))
					.Set("TypeId", Column.Parameter(DOCUMENT_TYPE))
					.Set("ilayPatientId", Column.Parameter(ilayPatientId))
					.Set("StateId", Column.Parameter(DOCUMENT_STATE))
					.Set("OwnerId", Column.Parameter(ilayDoctorId))
					.Set("ilayCourseId", Column.Parameter(ilayCourseId))
					.Set("ContractId", Column.Parameter(ContractId))
					.Set("Number", Column.Parameter(number))
					.Set("ilayOurCompanyId", Column.Parameter(OurCompanyId))
					.Set("ilayRequisitsId", Column.Parameter(SupplierBillingInfoId))
					.Set("ilayDebt", Column.Parameter(ilayDebt))
					.Set("ilayCategoryId", Column.Parameter(DOCUMENT_CATEGORY))
					.Set("ilayVisitId", Column.Parameter(ilayVisitId))
					.Set("Date", Column.Parameter(date)) as Insert;
		insert.Execute(dbExecutor);
	}
	Set<Guid>("ProcessDocCreated", documentId);
//---------------------------------------------------------------------------------------------------


//---------------------------------------------------------------------------------------------------
//Добавляем сервисы пациентов.
currentSelect = new Select(userConnection)
	.Column("Id")
		.From("ilayServList")
	.Where("ilayVisittoDoctorId").IsEqual(Column.Parameter(ilayVisitId))
	.And().OpenBlock("ilayMedDocSignId").IsEqual(Column.Parameter(DOCUMENT_SIGNED))
	.Or("ilayMedDocSignId").IsEqual(Column.Parameter(DOCUMENT_NO_NEED)).CloseBlock()
	.And("ilayPerfomStatusId").IsEqual(Column.Parameter(PERFORM_STATUS)) as Select;
using (var dbExecutor = userConnection.EnsureDBConnection())
{
	using (var dataReader = currentSelect.ExecuteReader(dbExecutor))
	{
		while(dataReader.Read())
		{
			Guid curGuid = Guid.NewGuid();
			if(userConnection.DBTypeConverter.DBValueToGuid(dataReader["Id"]) != Guid.Empty)
			{
				var insert = new Insert(userConnection).Into("ilayDocService")
					.Set("Id", Column.Parameter(curGuid))
					.Set("CreatedOn", Column.Parameter(date))
					.Set("ModifiedOn", Column.Parameter(date))
					.Set("ilayServiceId", Column.Parameter(dataReader.GetColumnValue<Guid>("Id")))
					.Set("ilayDocumentId", Column.Parameter(documentId)) as Insert;
				insert.Execute(dbExecutor);
			}
		}
	}
}
//---------------------------------------------------------------------------------------------------


//---------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------
//ilayPatientPays: Загальна вартість
float ilayPatientPays = 0;
//ilayDiscount: Сумма знижки
float ilayDiscount = 0;
//ilayPDV: ПДВ. грн.
float ilayPDV = 0;
List<QueryColumnExpression> servIds = new List<QueryColumnExpression>();
//---------------------------------------------------------------------------------------------------
//1. Выбираем все сервисы по данному бух.документу
currentSelect = new Select(userConnection)
	.Column("Id")
	.Column("ilayDocumentId")
	.Column("ilayServiceId")
		.From("ilayDocService")
	.Where("ilayDocumentId").IsEqual(Column.Parameter(documentId)) as Select;
using (var dbExecutor = userConnection.EnsureDBConnection())
{
	using (var dataReader = currentSelect.ExecuteReader(dbExecutor))
	{
		if(dataReader.Read())
		{
			if(userConnection.DBTypeConverter.DBValueToGuid(dataReader["Id"]) != Guid.Empty)
			{
				servIds.Add(Column.Parameter(dataReader.GetColumnValue<Guid>("ilayServiceId")));
			}
		}
	}
}		
//---------------------------------------------------------------------------------------------------

//---------------------------------------------------------------------------------------------------
//2. Читаем данные из сервисов.
if(servIds.Count == 0) return true;

currentSelect = new Select(userConnection)
	.Column("Id")
	.Column("ilayPatientPays")
	.Column("ilayDiscount")
	.Column("ilayPDV")
		.From("ilayServList")
	.Where("Id").In(servIds) as Select;
using (var dbExecutor = userConnection.EnsureDBConnection())
{
	using (var dataReader = currentSelect.ExecuteReader(dbExecutor))
	{
		while(dataReader.Read())
		{
			if(userConnection.DBTypeConverter.DBValueToGuid(dataReader["Id"]) != Guid.Empty)
			{
				ilayPatientPays += dataReader.GetColumnValue<float>("ilayPatientPays");
				ilayDiscount += dataReader.GetColumnValue<float>("ilayDiscount");
				ilayPDV += dataReader.GetColumnValue<float>("ilayPDV");
			}
		}
	}
}
//---------------------------------------------------------------------------------------------------

//---------------------------------------------------------------------------------------------------
//3.Апдейтим в бух.доках просумированные поля.
var update = new Update(userConnection, "Document")
		.Set("ilayPDV", Column.Parameter(ilayPDV))
		.Set("ilayDiscount", Column.Parameter(ilayDiscount))
		.Set("ilayTotalCost", Column.Parameter(ilayPatientPays))
	.Where("Id").IsEqual(Column.Parameter(documentId)) as Update;
	using (var dbExecutor = userConnection.EnsureDBConnection())
{
	update.Execute(dbExecutor);
}
//---------------------------------------------------------------------------------------------------
return true;