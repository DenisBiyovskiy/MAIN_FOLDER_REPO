define("UsrInvestmentDetailV2", [], function() {
	return {
		entitySchemaName: "UsrInvestment",
		attributes: {
			"isEnabledButtons": {
				"dataValueType": Terrasoft.DataValueType.BOOLEAN,
				"value":  true
			},
			"isEnabledAdd": {
				"dataValueType": Terrasoft.DataValueType.BOOLEAN,
				"value":  true
			}
		},
		methods: {
			init: function() {
				this.callParent(arguments);
				if (this.getDetailInfo().cardPageName === "UsrPortfolioPageV2") {
					this.set("isEnabledButtons", false);
				} else if (this.getDetailInfo().cardPageName === "UsrInvestmentOppPageV2") {
					var entity = Ext.create("Terrasoft.EntitySchemaQuery", {
						rootSchemaName: "UsrInvestment"
					});
					entity.addColumn("Id");
					entity.addColumn("UsrAccount");
					entity.addColumn("UsrComittedAmount");
					entity.filters.addItem(entity.createColumnFilterWithParameter(
						this.Terrasoft.ComparisonType.EQUAL, "UsrAccount", this.get("MasterRecordId")));
					entity.filters.addItem(entity.createColumnFilterWithParameter(
						this.Terrasoft.ComparisonType.EQUAL, "CreatedBy", Terrasoft.SysValue.CURRENT_USER_CONTACT.value));
					entity.getEntityCollection(function(result) {
						if (result.collection.getCount() > 0) {
							this.set("isEnabledAdd", false);
						}
					}, this);
				}

			},
			addRecord: function () {
				if (!this.get("isEnabledAdd")) {
					this.showInformationDialog("It`s forbidden to make another one investment.");
					return;
				}
				this.callParent(arguments);
			}
		},
		diff: /**SCHEMA_DIFF*/[
			{
				"operation": "merge",
				"name": "AddRecordButton",
				"parentName": "Detail",
				"propertyName": "tools",
				"values": {
					"visible": {
						"bindTo": "isEnabledButtons"
					}
				},
				"index": 0
			}
		]/**SCHEMA_DIFF*/
	};
});