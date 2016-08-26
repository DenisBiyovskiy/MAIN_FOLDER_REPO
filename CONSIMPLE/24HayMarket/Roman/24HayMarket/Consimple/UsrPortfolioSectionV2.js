define("UsrPortfolioSectionV2", [],
	function() {
	return {
		entitySchemaName: "UsrPortfolio",
		attributes: {},
		contextHelpId: "1001",
		messages: {},
		methods: {},
		diff: /**SCHEMA_DIFF*/[
			{
				"operation": "merge",
				"name": "SeparateModeAddRecordButton",
				"values": {
					"visible": false
				}
			},
			{
				"operation": "remove",
				"name": "DataGridActiveRowDeleteAction",
				"values": {
					"className": "Terrasoft.Button"
				}
			},
			{
				"operation": "remove",
				"name": "DataGridActiveRowCopyAction",
				"values": {
					"className": "Terrasoft.Button"
				}
			},
		]/**SCHEMA_DIFF*/
	};
});