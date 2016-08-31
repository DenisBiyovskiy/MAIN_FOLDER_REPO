/**
 * Установка настроек колонок детали по умолчанию, если отсутствует пользовательская настройка
 */
initProfile: function() {
	var profile = this.getProfile();
	var dataGridName = this.getDataGridName();
	if (!profile[dataGridName]) {
		profile[dataGridName] = {};
		this.set("Profile", this.Terrasoft.deepClone(profile));
	}
	var currentProfile = this.get("Profile");
	if (currentProfile && currentProfile.DataGrid
		&& ((currentProfile.DataGrid.listedConfig == '{"items":[]}' && currentProfile.DataGrid.type == 'listed')
		|| (currentProfile.DataGrid.tiledConfig == '{"grid":{"rows":0,"columns":24},"items":[]}' && currentProfile.DataGrid.type == 'tiled')
		|| (!currentProfile.DataGrid.listedConfig && !currentProfile.DataGrid.tiledConfig))
	) {
		var newProfile = JSON.parse(Resources.localizableStrings.DefaultColumnsProfileConfig);
		this.set("Profile", newProfile);
	}
},
//UsrAccountDocument default fields config json string
/*
{"DataGrid":{"tiledConfig":"{\"grid\":{\"rows\":1,\"columns\":24},\"items\":[{\"bindTo\":\"UsrName\",\"caption\":\"Name\",\"position\":{\"column\":0,\"colSpan\":4,\"row\":1},\"dataValueType\":1,\"metaPath\":\"UsrName\",\"path\":\"UsrName\",\"captionConfig\":{\"visible\":false}}]}","listedConfig":"{\"items\":[{\"bindTo\":\"UsrName\",\"caption\":\"Name\",\"position\":{\"column\":0,\"colSpan\":24,\"row\":1},\"dataValueType\":1,\"metaPath\":\"UsrName\",\"path\":\"UsrName\"}]}","key":"UsrInvestmentOppPageV2UsrAccountDocumentDetailV2","isTiled":false,"type":"listed"},"isCollapsed":false,"tiledColumnsConfig":"{}","listedColumnsConfig":"{}","key":"UsrInvestmentOppPageV2UsrAccountDocumentDetailV2"}
*/

//UsrInvestment default fields config json string
/*
{"DataGrid":{"tiledConfig":"{\"grid\":{\"rows\":2,\"columns\":24},\"items\":[{\"bindTo\":\"UsrOptIn\",\"caption\":\"Opt-in\",\"position\":{\"column\":0,\"colSpan\":4,\"row\":1},\"dataValueType\":12,\"metaPath\":\"UsrOptIn\",\"path\":\"UsrOptIn\",\"captionConfig\":{\"visible\":true}},{\"bindTo\":\"UsrOptOut\",\"caption\":\"Opt-out\",\"position\":{\"column\":4,\"colSpan\":4,\"row\":1},\"dataValueType\":12,\"metaPath\":\"UsrOptOut\",\"path\":\"UsrOptOut\",\"captionConfig\":{\"visible\":true}},{\"bindTo\":\"UsrMin\",\"caption\":\"Indication min\",\"type\":\"text\",\"position\":{\"column\":8,\"colSpan\":4,\"row\":1},\"dataValueType\":4,\"aggregationType\":\"\",\"metaCaptionPath\":\"Min\",\"metaPath\":\"UsrMin\",\"path\":\"UsrMin\",\"serializedFilter\":\"{\\\"className\\\":\\\"Terrasoft.FilterGroup\\\",\\\"items\\\":{},\\\"logicalOperation\\\":0,\\\"isEnabled\\\":true,\\\"filterType\\\":6,\\\"key\\\":\\\"\\\"}\",\"captionConfig\":{\"visible\":true}},{\"bindTo\":\"UsrMax\",\"caption\":\"Indication Max\",\"type\":\"text\",\"position\":{\"column\":12,\"colSpan\":4,\"row\":1},\"dataValueType\":4,\"aggregationType\":\"\",\"metaCaptionPath\":\"Max\",\"metaPath\":\"UsrMax\",\"path\":\"UsrMax\",\"serializedFilter\":\"{\\\"className\\\":\\\"Terrasoft.FilterGroup\\\",\\\"items\\\":{},\\\"logicalOperation\\\":0,\\\"isEnabled\\\":true,\\\"filterType\\\":6,\\\"key\\\":\\\"\\\"}\",\"captionConfig\":{\"visible\":true}},{\"bindTo\":\"UsrComittedAmount\",\"caption\":\"Committed Amount\",\"position\":{\"column\":16,\"colSpan\":8,\"row\":1},\"dataValueType\":4,\"metaPath\":\"UsrComittedAmount\",\"path\":\"UsrComittedAmount\",\"captionConfig\":{\"visible\":true}},{\"bindTo\":\"UsrComments\",\"caption\":\"Comments\",\"position\":{\"column\":0,\"colSpan\":22,\"row\":2},\"dataValueType\":1,\"metaPath\":\"UsrComments\",\"path\":\"UsrComments\",\"captionConfig\":{\"visible\":true}},{\"bindTo\":\"UsrActionEdit\",\"caption\":\"Action Edit\",\"type\":\"text\",\"position\":{\"column\":22,\"colSpan\":2,\"row\":2},\"dataValueType\":1,\"aggregationType\":\"\",\"metaCaptionPath\":\"Action Edit\",\"metaPath\":\"UsrActionEdit\",\"path\":\"UsrActionEdit\",\"serializedFilter\":\"{\\\"className\\\":\\\"Terrasoft.FilterGroup\\\",\\\"items\\\":{},\\\"logicalOperation\\\":0,\\\"isEnabled\\\":true,\\\"filterType\\\":6,\\\"key\\\":\\\"\\\"}\",\"captionConfig\":{\"visible\":false}}]}","listedConfig":"{\"items\":[]}","key":"UsrInvestmentOppPageV2UsrInvestmentDetailV2","isTiled":true,"type":"tiled"},"isCollapsed":false,"tiledColumnsConfig":"{}","listedColumnsConfig":"{}","key":"UsrInvestmentOppPageV2UsrInvestmentDetailV2"}
{"DataGrid":{"tiledConfig":"{\"grid\":{\"rows\":0,\"columns\":24},\"items\":[]}","listedConfig":"{\"items\":[{\"bindTo\":\"UsrInvestorName\",\"caption\":\"Investor\",\"position\":{\"column\":0,\"colSpan\":4,\"row\":1},\"dataValueType\":10,\"metaPath\":\"UsrInvestorName\",\"path\":\"UsrInvestorName\",\"referenceSchemaName\":\"Contact\"}]}","key":"UsrInvestmentOppPageV2UsrInvestmentDetailV2","isTiled":false,"type":"listed"},"isCollapsed":false,"tiledColumnsConfig":"{}","listedColumnsConfig":"{}","key":"UsrInvestmentOppPageV2UsrInvestmentDetailV2"}
*/

//UsrReporting default fields config json string
/*
{"DataGrid":{"tiledConfig":"{\"grid\":{\"rows\":0,\"columns\":24},\"items\":[]}","listedConfig":"{\"items\":[{\"bindTo\":\"UsrFileName\",\"caption\":\"File Name\",\"position\":{\"column\":0,\"colSpan\":4,\"row\":1},\"dataValueType\":1,\"metaPath\":\"UsrFileName\",\"path\":\"UsrFileName\"}]}","key":"UsrInvestmentOppPageV2UsrReportingDetailV2","isTiled":false,"type":"listed"},"isCollapsed":false,"tiledColumnsConfig":"{}","listedColumnsConfig":"{}","key":"UsrInvestmentOppPageV2UsrReportingDetailV2"}
*/

methods: {
/**
* Возвращает колонки, которые всегда выбираются запросом
* @return {Object} Возвращает массив объектов-конфигураций колонок
*/
getGridDataColumns: function() {
return {
"Id": {path: "Id"},
"Product": {path: "Product"},
"Product.Name": {path: "Product.Name"}
};
},
-----------------------------------------------------------------------------------------------------------------------------------------------

--update SysProfileData set ContactId = null where [Key] = 'UsrPortfolioPageV2UsrInvestmentDetailV2' and id = '95b92777-638e-46f2-9ed8-9aa571c425a2'

select * from SysProfileData where [Key] = 'UsrPortfolioPageV2UsrInvestmentDetailV2'

--delete from SysProfileData where [Key] = 'UsrPortfolioPageV2UsrInvestmentDetailV2' and ContactId is not null


--select top 10 * from SysProfileData order by ModifiedOn desc