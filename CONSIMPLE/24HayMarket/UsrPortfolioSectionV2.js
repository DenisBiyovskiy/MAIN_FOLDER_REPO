define("UsrPortfolioSectionV2", [], function() {
	var portfolioGuids = [];
	return {
		entitySchemaName: "UsrPortfolio",
		attributes: {},
		contextHelpId: "1001",
		messages: {},
		methods: {
			getFilters: function() {
				var filters = this.callParent(arguments);
				filters.logicalOperation = this.Terrasoft.LogicalOperatorType.OR;
				for (var i = 0; i < portfolioGuids.length; i++) {
					filters.add("InvestmentPrincipalFilter" + i, this.Terrasoft.createColumnFilterWithParameter(
						this.Terrasoft.ComparisonType.EQUAL, "Id", portfolioGuids[i]));
				}
				return filters; 
			},
			init: function () {
				this.getItemsByUser();
				this.callParent(arguments);
			},
			getItemsByUser: function () {
				var esq = Ext.create("Terrasoft.EntitySchemaQuery", {
					"rootSchemaName": "UsrAccountVsContact"
				});
				esq.addColumn("Id");
				esq.addColumn("UsrAccount");
				esq.addColumn("UsrContact");
				esq.filters.addItem(Terrasoft.createColumnFilterWithParameter(
					Terrasoft.ComparisonType.EQUAL, "UsrContact", Terrasoft.SysValue.CURRENT_USER_CONTACT.value));
				esq.getEntityCollection(function(result) { 
					if (result.success) {
						if (result.collection.getCount() > 0) {
							for (var i = 0; i < result.collection.getCount(); i++) {
								portfolioGuids[i] = result.collection.getByIndex(i).get("UsrAccount").value;
							}
						} else {
							portfolioGuids[0] = '00000000-0000-0000-0000-000000000000';
						}
						this.checkOnInvestments(portfolioGuids);
					}
				}, this);
			},
			checkOnInvestments: function (items) {
				var esqInvestment = Ext.create("Terrasoft.EntitySchemaQuery", {
					"rootSchemaName": "UsrInvestment"
				});
				esqInvestment.addColumn("Id");
				esqInvestment.addColumn("UsrAccount");
				esqInvestment.addColumn("UsrInvestorName");
				esqInvestment.filters.addItem(Terrasoft.createColumnFilterWithParameter(
					Terrasoft.ComparisonType.EQUAL, "[Account:Id:UsrAccount].Type", "f2c0ce97-53e6-df11-971b-001d60e938c6"));
				esqInvestment.filters.addItem(Terrasoft.createColumnFilterWithParameter(
					Terrasoft.ComparisonType.EQUAL, "UsrInvestorName", Terrasoft.SysValue.CURRENT_USER_CONTACT.value));
				var filterGroup = new this.Terrasoft.createFilterGroup();
				filterGroup.logicalOperation = this.Terrasoft.LogicalOperatorType.OR;
				for (var i = 0; i < items.length; i++) {
					filterGroup.add("AccountId_" + i, this.Terrasoft.createColumnFilterWithParameter(
						this.Terrasoft.ComparisonType.NOT_EQUAL, "Id", items[i]));
				}
				esqInvestment.filters.addItem(filterGroup);
				esqInvestment.getEntityCollection(function(resultInvestment) { 
					if (resultInvestment.success) {
						if (resultInvestment.collection.getCount() > 0) {
							var j = items.length;
							for (var i = 0; i < resultInvestment.collection.getCount(); i++) {
								portfolioGuids[j] = resultInvestment.collection.getByIndex(i).get("UsrAccount").value;
								j++;
							}
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
		]/**SCHEMA_DIFF*/
	};
});