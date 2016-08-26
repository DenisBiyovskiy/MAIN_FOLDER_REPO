define("UsrInvestorDocumentsPageV2", [],
	function() {
		var investors = [];
		return {
			entitySchemaName: "UsrInvestorDocuments",
			messages: {},
			attributes: {
				"UsrInvestor": {
					dataValueType: Terrasoft.DataValueType.LOOKUP,
					lookupListConfig: {
						filters: [
							function() {
								var filterGroup = Ext.create("Terrasoft.FilterGroup");
								filterGroup.logicalOperation = this.Terrasoft.LogicalOperatorType.OR;
								for (var i = 0; i < investors.length; i++) {
									filterGroup.add("acount" + i, this.Terrasoft.createColumnFilterWithParameter(
										this.Terrasoft.ComparisonType.EQUAL, "Id", investors[i]));
								}
								return filterGroup;
							}
						]
					}
				}
			},
			details: /**SCHEMA_DETAILS*/{
				Files: {
					schemaName: "FileDetailV2",
					entitySchemaName: "UsrInvestorDocFile",
					filter: {
						masterColumn: "Id",
						detailColumn: "UsrInvestorDoc"
					}
				}
			}/**SCHEMA_DETAILS*/,
			
			mixins: {},
			methods: {
				init: function () {
					this.callParent(arguments);
					investors = [];
					var entity = Ext.create("Terrasoft.EntitySchemaQuery", {
						rootSchemaName: "UsrInvestment"
					});
					entity.addColumn("Id");
					entity.addColumn("UsrInvestorName");
					entity.filters.addItem(entity.createColumnFilterWithParameter(
						this.Terrasoft.ComparisonType.EQUAL, "UsrAccount", this.getDefaultValues()[0].value));
					entity.filters.addItem(entity.createColumnFilterWithParameter(
						this.Terrasoft.ComparisonType.EQUAL, "UsrConfirmed", true));
					entity.getEntityCollection(function(result) {
						if (result.success) { 
							for (var i = 0; i < result.collection.getCount(); i++) {
								investors.push(result.collection.getByIndex(i).get("UsrInvestorName").value);
							}
						}
					}, this);
				}
			},
			diff: /**SCHEMA_DIFF*/[
	{
		"operation": "insert",
		"name": "UsrInvestor",
		"values": {
			"layout": {
				"colSpan": 12,
				"rowSpan": 1,
				"column": 0,
				"row": 0,
				"layoutName": "Header"
			},
			"bindTo": "UsrInvestor"
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
				"column": 0,
				"row": 1,
				"layoutName": "Header"
			},
			"bindTo": "UsrFileName",
			"visible": true
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