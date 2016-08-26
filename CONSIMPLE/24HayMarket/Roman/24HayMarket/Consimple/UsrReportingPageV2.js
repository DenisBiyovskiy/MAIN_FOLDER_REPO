define("UsrReportingPageV2", [],
	function() {
		return {
			entitySchemaName: "UsrReporting",
			messages: {},
			attributes: {},
			details: /**SCHEMA_DETAILS*/{
				Files: {
					schemaName: "FileDetailV2",
					entitySchemaName: "UsrReportingFile",
					filter: {
						masterColumn: "Id",
						detailColumn: "UsrReporting"
					}
				}
			}/**SCHEMA_DETAILS*/,
			
			mixins: {},
			methods: {},
			diff: /**SCHEMA_DIFF*/[
	{
		"operation": "insert",
		"name": "UsrDisplayPortal",
		"values": {
			"layout": {
				"colSpan": 12,
				"rowSpan": 1,
				"column": 0,
				"row": 0,
				"layoutName": "Header"
			},
			"bindTo": "UsrDisplayPortal"
		},
		"parentName": "Header",
		"propertyName": "items",
		"index": 0
	},
	{
		"operation": "insert",
		"name": "UsrFileName",
		"values": {
			"layout": {
				"colSpan": 12,
				"rowSpan": 1,
				"column": 12,
				"row": 0,
				"layoutName": "Header"
			},
			"bindTo": "UsrFileName",
			"visible": false
		},
		"parentName": "Header",
		"propertyName": "items",
		"index": 1
	},
	{
		"operation": "insert",
		"name": "HistoryTabContainer",
		"values": {
			"caption": {
				"bindTo": "Resources.Strings.HistoryTabCaption"
			},
			"items": []
		},
		"parentName": "Tabs",
		"propertyName": "tabs",
		"index": 0
	},
	{
		"operation": "insert",
		"name": "Files",
		"values": {
			"itemType": 2
		},
		"parentName": "HistoryTabContainer",
		"propertyName": "items",
		"index": 0
	},
	{
		"operation": "remove",
		"name": "ESNTab"
	},
	{
		"operation": "remove",
		"name": "ESNFeedContainer"
	},
	{
		"operation": "remove",
		"name": "ESNFeed"
	}
]/**SCHEMA_DIFF*/
	};
});