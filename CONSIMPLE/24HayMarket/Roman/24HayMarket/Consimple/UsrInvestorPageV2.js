define("UsrInvestorPageV2", [],
	function() {
		return {
			entitySchemaName: "UsrInvestor",
			messages: {},
			attributes: {
				"UsrName": {
					dependencies: [
						{
							columns: ["UsrName"],
							methodName: "setEmail"
						}
					],
					lookupListConfig: {
						columns: ["Email"]
			        }
				}
			},
			details: /**SCHEMA_DETAILS*/{}/**SCHEMA_DETAILS*/,
			
			mixins: {},
			methods: {
				setEmail: function () {
					this.set("UsrType", this.get("UsrName").Email);
				}
			},
			diff: /**SCHEMA_DIFF*/[
	{
		"operation": "remove",
		"name": "ESNTab"
	},
	{
		"operation": "insert",
		"name": "UsrName",
		"values": {
			"layout": {
				"colSpan": 12,
				"rowSpan": 1,
				"column": 0,
				"row": 0,
				"layoutName": "Header"
			},
			"bindTo": "UsrName"
		},
		"parentName": "Header",
		"propertyName": "items",
		"index": 0
	},
	{
		"operation": "insert",
		"name": "UsrType",
		"values": {
			"layout": {
				"colSpan": 12,
				"rowSpan": 1,
				"column": 12,
				"row": 0,
				"layoutName": "Header"
			},
			"bindTo": "UsrType"
		},
		"parentName": "Header",
		"propertyName": "items",
		"index": 1
	},
	{
		"operation": "remove",
		"name": "ESNTab"
	}
]/**SCHEMA_DIFF*/
	};
});