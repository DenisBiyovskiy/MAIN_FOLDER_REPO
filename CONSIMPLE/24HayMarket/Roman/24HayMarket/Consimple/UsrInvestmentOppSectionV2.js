define("UsrInvestmentOppSectionV2", [],
	function() {
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
				var filters = this.callParent(arguments);
				if (this.get("IsPortalUser")) {
					filters.add("InvestmentPrincipalFilter_1", this.Terrasoft.createColumnFilterWithParameter(
						this.Terrasoft.ComparisonType.NOT_EQUAL, "UsrStage", this.get("AccountStageNewID")));
					filters.add("InvestmentPrincipalFilter_2", this.Terrasoft.createColumnFilterWithParameter(
						this.Terrasoft.ComparisonType.NOT_EQUAL, "UsrStage", this.get("AccountStageForAdminID")));
					for (var i = 0; i < this.get("AccountStagePortfolioID").getCount(); i++) {
						filters.add("InvestmentPrincipalFilter" + i, this.Terrasoft.createColumnFilterWithParameter(
							this.Terrasoft.ComparisonType.EQUAL, "Id", this.get("AccountStagePortfolioID")[i]));
					}

				}
				return filters; 
			},
			init: function () {
				var esq = Ext.create("Terrasoft.EntitySchemaQuery", {
					"rootSchemaName": "SysAdminUnit"
				});
				esq.addColumn("Id");
				esq.filters.addItem(Terrasoft.createColumnFilterWithParameter(
					Terrasoft.ComparisonType.EQUAL, "Id", Terrasoft.SysValue.CURRENT_USER.value));
				esq.filters.addItem(Terrasoft.createColumnFilterWithParameter(
					Terrasoft.ComparisonType.EQUAL, "[SysAdminUnitInRole:SysAdminUnit:Id].SysAdminUnitRoleId",
					"720B771C-E7A7-4F31-9CFB-52CD21C3739F"));
				esq.getEntityCollection(function(result) {
					var isAdmin = result.success && (result.collection.getCount() === 1);
					this.set("IsPortalUser", isAdmin);
					if (this.get("IsPortalUser")) {
						var esqContact = Ext.create("Terrasoft.EntitySchemaQuery", {
							"rootSchemaName": "Contact"
						});
						esqContact.addColumn("Id");
						esqContact.addColumn("UsrPortalUserType");
						esqContact.filters.addItem(Terrasoft.createColumnFilterWithParameter(
							Terrasoft.ComparisonType.EQUAL, "Id", Terrasoft.SysValue.CURRENT_USER_CONTACT.value));
						esqContact.getEntityCollection(function(resultContact) { 
							if (resultContact.success) {
								if (resultContact.collection.getByIndex(0).get("UsrPortalUserType").value == "0deb3907-08fd-4008-8189-f9c891af3aa1") {
									this.set("IsIPUserRoles", false);
									this.set("AccountStageNewID", "5484f782-c0c2-409e-9273-f28c1b8a6a43");
									this.set("AccountStageForAdminID", "df5960ba-f7e7-4532-b02e-f2c45212aae1");

									var esqInvestment = Ext.create("Terrasoft.EntitySchemaQuery", {
										"rootSchemaName": "UsrInvestment"
									});
									esqInvestment.addColumn("Id");
									esqInvestment.filters.addItem(Terrasoft.createColumnFilterWithParameter(
										Terrasoft.ComparisonType.EQUAL, "[Account:UsrStage].Id", "119f25c2-dc93-47ff-977f-ce1c907a3b23"));
									esqInvestment.filters.addItem(Terrasoft.createColumnFilterWithParameter(
										Terrasoft.ComparisonType.EQUAL, "UsrConfirmed", true));
									esqInvestment.getEntityCollection(function(resultInvestment) { 
										if (resultInvestment.success) {
											for (var i = 0; i < resultInvestment.collection.getCount(); i++) {
												this.get("AccountStagePortfolioID").add(resultInvestment.collection.getByIndex(i).get("Id"))
											}
										}
									}, this);
								} 
							}
						}, this);
					}
				}, this);
				this.callParent(arguments);
			}
		},
		diff: /**SCHEMA_DIFF*/[
			{
				"operation": "merge",
				"name": "SeparateModeAddRecordButton",
				"values": {"visible": false}
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
				"operation": "remove",
				"name": "SaveButton",
				"values": {
					"visible": false
				}
			}
		]/**SCHEMA_DIFF*/
	};
});