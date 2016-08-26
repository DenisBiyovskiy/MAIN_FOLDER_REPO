define("UsrInvestmentOppSectionV2", [],
	function() {
		var portfolioGuids = [];
	return {
		entitySchemaName: "UsrInvestmentOpp",
		attributes: {
			"IsPortalUser": {
				"dataValueType": Terrasoft.DataValueType.BOOLEAN,
				"value":  false
			},
			"AccountStageNewID": {
				"dataValueType": Terrasoft.DataValueType.TEXT,
				"value":  ""
			},
			"AccountStageForAdminID": {
				"dataValueType": Terrasoft.DataValueType.TEXT,
				"value":  ""
			},
			"AccountStagePortfolioID": {
				"dataValueType": Terrasoft.DataValueType.COLLECTION,
				"type": Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN,
				"value": Ext.create("Terrasoft.Collection")
			},
			"IsIPUserRoles": {
				"dataValueType": Terrasoft.DataValueType.BOOLEAN,
				"value":  true
			}
		},
		contextHelpId: "1001",
		messages: {},
		methods: {
			getFilters: function() {
				// var filters = this.callParent(arguments);
				var filters = new this.Terrasoft.createFilterGroup();
				filters.logicalOperation = this.Terrasoft.LogicalOperatorType.OR;
				filters.add("AccountStageNewIDFilter", this.Terrasoft.createColumnFilterWithParameter(
					this.Terrasoft.ComparisonType.NOT_EQUAL, "UsrStage", this.get("AccountStageNewID")));
				filters.add("AccountStageForAdminIDFilter", this.Terrasoft.createColumnFilterWithParameter(
					this.Terrasoft.ComparisonType.NOT_EQUAL, "UsrStage", this.get("AccountStageForAdminID")));
				var filterGroup = new this.Terrasoft.createFilterGroup();
				filterGroup.logicalOperation = this.Terrasoft.LogicalOperatorType.OR;
				for (var i = 0; i < portfolioGuids.length; i++) {
					filterGroup.add("InvestmentPrincipalFilter" + i, this.Terrasoft.createColumnFilterWithParameter(
						this.Terrasoft.ComparisonType.EQUAL, "Id", portfolioGuids[i]));
				}
				filters.add(filterGroup);
				return filters; 
			},
			init: function () {				
				this.getItemsByUser();
				this.callParent(arguments);
			},
			getItemsByUser: function () {
				this.set("AccountStageNewID", "5484f782-c0c2-409e-9273-f28c1b8a6a43");
				this.set("AccountStageForAdminID", "df5960ba-f7e7-4532-b02e-f2c45212aae1");
				var esq = Ext.create("Terrasoft.EntitySchemaQuery", {
					"rootSchemaName": "UsrAccountVsContact"
				});
				esq.addColumn("Id");
				esq.addColumn("UsrAccount");
				esq.filters.addItem(Terrasoft.createColumnFilterWithParameter(
					Terrasoft.ComparisonType.EQUAL, "UsrContact", Terrasoft.SysValue.CURRENT_USER_CONTACT.value));
				esq.filters.addItem(Terrasoft.createColumnFilterWithParameter(
					Terrasoft.ComparisonType.EQUAL, "[Account:Id:UsrAccount].Type", "57412fad-53e6-df11-971b-001d60e938c6"));
				esq.getEntityCollection(function(result) { 
					if (result.success) {
						if (result.collection.getCount() > 0) {
							for (var i = 0; i < result.collection.getCount(); i++) {
								portfolioGuids[i] = result.collection.getByIndex(i).get("UsrAccount").value;
							}
						} else {
							portfolioGuids[0] = '00000000-0000-0000-0000-000000000000';
						}
					}
				}, this);
			}
		},
		diff: /**SCHEMA_DIFF*/[
			{
				"operation": "remove",
				"name": "CombinedModeAddRecordButton",
				//"values": {"visible": false}
			},
			{
				"operation": "remove",
				"name": "SeparateModeAddRecordButton",
				//"values": {"visible": false}
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
			{
				"operation": "merge",
				"name": "SaveButton",
				"values": {
					"visible": false
				}
			}
		]/**SCHEMA_DIFF*/
	};
});