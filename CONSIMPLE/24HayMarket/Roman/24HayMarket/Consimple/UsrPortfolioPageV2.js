define("UsrPortfolioPageV2", [],
	function() {
		return {
			entitySchemaName: "UsrPortfolio",
			messages: {},
			attributes: {
				"isIPUserRoles": {
					"dataValueType": Terrasoft.DataValueType.BOOLEAN,
					"value":  true
				},
				"isAdminUserRoles": {
					"dataValueType": Terrasoft.DataValueType.BOOLEAN,
					"value":  false
				},
				"isVisibleEISForm": {
					"dataValueType": Terrasoft.DataValueType.BOOLEAN,
					"value":  false
				}
			},
			details: /**SCHEMA_DETAILS*/{
				"UsrInvestment": {
					"schemaName": "UsrInvestmentDetailV2",
					"entitySchemaName": "UsrInvestment",
					"filter": {
						"detailColumn": "UsrAccount",
						"masterColumn": "Id"
					},
					"filterMethod": "portalUserFilter",
					subscriber: function() {
						this.updateAmount();
					}
				},
				"UsrInvestorDocuments": {
					"schemaName": "UsrInvestorDocumentsDetailV2",
					"entitySchemaName": "UsrInvestorDocuments",
					"filter": {
						"detailColumn": "UsrAccount",
						"masterColumn": "Id"
					},
					"filterMethod": "portalUserFilter"
				},
				"AccountFile": {
					"schemaName": "FileDetailV2",
					"entitySchemaName": "AccountFile",
					"filter": {
						"detailColumn": "Account",
						"masterColumn": "Id"
					},
					"filterMethod": "CreatedByFilter"
				}
			}/**SCHEMA_DETAILS*/,
			
			mixins: {},
			methods: {
				CreatedByFilter: function () {
					var filterGroup = new this.Terrasoft.createFilterGroup();
					filterGroup.logicalOperation = this.Terrasoft.LogicalOperatorType.AND;
					filterGroup.add("AccountIdFilter", this.Terrasoft.createColumnFilterWithParameter(
						this.Terrasoft.ComparisonType.EQUAL, "Account", this.get("Id")));
					filterGroup.add("CreatedByFilter", this.Terrasoft.createColumnFilterWithParameter(
						this.Terrasoft.ComparisonType.EQUAL, "CreatedBy", Terrasoft.SysValue.CURRENT_USER_CONTACT.value));
					return filterGroup;
				},
				portalUserFilter: function () {
					var filterGroup = new this.Terrasoft.createFilterGroup();
					filterGroup.add("accountFilter", this.Terrasoft.createColumnFilterWithParameter(
						this.Terrasoft.ComparisonType.EQUAL, "UsrAccount", this.get("Id")));
					if (!this.get("isAdminUserRoles")) {
						filterGroup.add("userFilter", this.Terrasoft.createColumnFilterWithParameter(
							this.Terrasoft.ComparisonType.EQUAL, "CreatedBy", Terrasoft.SysValue.CURRENT_USER_CONTACT.value));
					} 
					return filterGroup;
				},
				onSaved: function () {
					this.callParent(arguments);
					if (this.isAddMode() || this.isNewMode()) {
						this.loadLookupDisplayValue("Type", "F2C0CE97-53E6-DF11-971B-001D60E938C6");
					}
				},
				init: function(){
					this.callParent(arguments);
					Terrasoft.configuration.EntityStructure.UsrInvestment = {entitySchemaName: "UsrInvestment", entitySchemaUId: "EBE54B74-62F9-47EA-AA09-4617FB874728", pages: [{Uid: "A00FCE2C-5A69-4520-8CD7-CCD5C33B5677", caption: "", captionLcz: "", cardSchema: "UsrInvestmentPageV2",typeColumnName: ""}]};
					Terrasoft.configuration.EntityStructure.UsrQuestions = {entitySchemaName: "UsrQuestions", entitySchemaUId: "64D359E0-D76D-4C6B-8D10-E4055F938412", pages: [{Uid: "6B7DC5B1-C7F7-4D64-B99B-A37A59BB21CD", caption: "", captionLcz: "", cardSchema: "UsrQuestionsPageV2",typeColumnName: ""}]};
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
								this.set("isIPUserRoles", false);
								var esqInvestment = Ext.create("Terrasoft.EntitySchemaQuery", {
									"rootSchemaName": "UsrInvestment"
								});
								esqInvestment.addColumn("Id");
								esqInvestment.filters.addItem(Terrasoft.createColumnFilterWithParameter(
									Terrasoft.ComparisonType.EQUAL, "UsrAccount", this.get("Id")));
								esqInvestment.filters.addItem(Terrasoft.createColumnFilterWithParameter(
									Terrasoft.ComparisonType.EQUAL, "UsrInvestorName", Terrasoft.SysValue.CURRENT_USER_CONTACT.value));
								esqInvestment.getEntityCollection(function(resultInvestment) { 
									if (resultInvestment.success) {
										if (resultInvestment.collection.getCount() > 0) {
											this.set("isVisibleEISForm", true)
										}
									}
									var tabsCollection = this.get("TabsCollection");
					                var ReportingTab = tabsCollection.contains("ReportingTab")?tabsCollection.get("ReportingTab"):false;
					                var InvestorDocumentsTab = tabsCollection.contains("InvestorDocumentsTab")?tabsCollection.get("InvestorDocumentsTab"):false;
					                if(!this.get("isVisibleEISForm") && ReportingTab && InvestorDocumentsTab) {
					                	Terrasoft.Account.ReportingTab = ReportingTab;
					                    tabsCollection.removeByKey("ReportingTab");
					                    Terrasoft.Account.InvestorDocumentsTab = InvestorDocumentsTab;
					                    tabsCollection.removeByKey("InvestorDocumentsTab");
					                } else if (!ReportingTab && !InvestorDocumentsTab) {
					                    tabsCollection.insert(4, "InvestorDocumentsTab", Terrasoft.Contact.InvestorDocumentsTab);
					                    tabsCollection.insert(3, "ReportingTab", Terrasoft.Contact.ReportingTab);
					                }
								}, this);
							} else if (resultContact.collection.getByIndex(0).get("UsrPortalUserType").value == "7a64b120-3ee7-4081-9a5a-c1cb18ac9d42") {
								this.set("isAdminUserRoles", true);
							}
						}
					}, this);
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
					"name": "AccountPageGeneralTabContainer"
				},
				{
					"operation": "remove",
					"name": "UsrStage"
				},
				{
					"operation": "remove",
					"name": "UsrAmountIndicated"
				},
				{
					"operation": "remove",
					"name": "UsrAmountCommitted"
				},
				{
					"operation": "remove",
					"name": "Type"
				},
				{
					"operation": "remove",
					"name": "Owner"
				},
				{
					"operation": "merge",
					"name": "Name",
					"values": {
						"layout": {
							"column": 5,
							"row": 0,
							"colSpan": 18,
							"rowSpan": 1
						},
						"enabled": {"bindTo": "isIPUserRoles"}
					}
				},
				{
					"operation": "merge",
					"name": "UsrKeySummary",
					"values": {
						"layout": {
							"column": 4,
							"row": 1,
							"colSpan": 18,
							"rowSpan": 1
						},
						"enabled": {"bindTo": "isIPUserRoles"}
					}
				},
				{
					"operation": "merge",
					"name": "UsrApplicationStatus",
					"values": {
						"layout": {
							"column": 4,
							"row": 2,
							"colSpan": 18,
							"rowSpan": 1
						},
						"enabled": {"bindTo": "isIPUserRoles"},
						"visible": {"bindTo": "isVisibleEISForm"}
					}
				},
				{
					"operation": "merge",
					"name": "Industry",
					"values": {
						"layout": {
							"column": 4,
							"row": 3,
							"colSpan": 9,
							"rowSpan": 1
						},
						"enabled": {"bindTo": "isIPUserRoles"}
					}
				},
				{
					"operation": "merge",
					"name": "AnnualRevenue",
					"values": {
						"layout": {
							"column": 14,
							"row": 3,
							"colSpan": 9,
							"rowSpan": 1
						},
						"enabled": {"bindTo": "isIPUserRoles"}
					}
				},
				{
					"operation": "merge",
					"name": "UsrInvestmentBudget",
					"values": {
						"layout": {
							"column": 4,
							"row": 4,
							"colSpan": 9,
							"rowSpan": 1
						},
						"enabled": {"bindTo": "isIPUserRoles"}
					}
				}
			]/**SCHEMA_DIFF*/
		};
	});