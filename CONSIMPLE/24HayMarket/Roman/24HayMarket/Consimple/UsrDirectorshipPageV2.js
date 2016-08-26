define("UsrDirectorshipPageV2", [],
	function() {
		return {
			entitySchemaName: "UsrDirectorship",
			messages: {},
			attributes: {},
			details: /**SCHEMA_DETAILS*/{}/**SCHEMA_DETAILS*/,
			
			mixins: {},
			methods: {},
			diff: /**SCHEMA_DIFF*/[
	{
		"operation": "insert",
		"name": "UsrCompanyName",
		"values": {
			"layout": {
				"colSpan": 24,
				"rowSpan": 1,
				"column": 0,
				"row": 0,
				"layoutName": "Header"
			},
			"bindTo": "UsrCompanyName"
		},
		"parentName": "Header",
		"propertyName": "items",
		"index": 0
	},
	{
		"operation": "insert",
		"name": "UsrStatus",
		"values": {
			"layout": {
				"colSpan": 12,
				"rowSpan": 1,
				"column": 0,
				"row": 1,
				"layoutName": "Header"
			},
			"bindTo": "UsrStatus"
		},
		"parentName": "Header",
		"propertyName": "items",
		"index": 1
	},
	{
		"operation": "insert",
		"name": "UsrIndustrySector",
		"values": {
			"layout": {
				"colSpan": 12,
				"rowSpan": 1,
				"column": 0,
				"row": 2,
				"layoutName": "Header"
			},
			"bindTo": "UsrIndustrySector"
		},
		"parentName": "Header",
		"propertyName": "items",
		"index": 2
	},
	{
		"operation": "remove",
		"name": "ESNTab"
	}
]/**SCHEMA_DIFF*/
	};
});