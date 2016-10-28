define('ilayLeadTypeB2C', ['ilayLeadTypeB2CResources', 'GeneralDetails', 'LeadConfigurationConst', 'ConfigurationEnums'],
function(resources, GeneralDetails, LeadConfigurationConst, enums) {
	return {
		entitySchemaName: 'Lead',
		details: /**SCHEMA_DETAILS*/{}/**SCHEMA_DETAILS*/,
		diff: /**SCHEMA_DIFF*/[
	{
		"operation": "insert",
		"name": "ilayEventf5617ef97585",
		"values": {
			"layout": {
				"column": 12,
				"row": 0,
				"colSpan": 12,
				"rowSpan": 1
			},
			"bindTo": "ilayEvent",
			"caption": {
				"bindTo": "Resources.Strings.EventCaption"
			},
			"textSize": 0,
			"contentType": 5,
			"labelConfig": {
				"visible": true
			},
			"enabled": true
		},
		"parentName": "LeadTypeBlock",
		"propertyName": "items",
		"index": 3
	},
	{
		"operation": "remove",
		"name": "ilayLeadState469850e2f1b0"
	},
	{
		"operation": "remove",
		"name": "ilayProblem1c040cbca972"
	}
]/**SCHEMA_DIFF*/,
		attributes: {},
		methods: {
			/**
			 * Инициализирует значение по умолчанию для поля QualifyStatus.
			 * @protected
			 */
			initDefQualifyStatus: function() {
				var operation = this.get("Operation");
				if (operation === enums.CardStateV2.EDIT) {
					return;
				}
				this.setQualifyStatus(LeadConfigurationConst.LeadConst.QualifyStatus.New);
			}
		},
		rules: {}
	};
});
