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
				},
				"isInvestor": {
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
					"filterMethod": "portalUserFilterInvest",
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
					"filterMethod": "portalUserFilterInvestDocs"
				},
				"UsrReporting": {
					"schemaName": "UsrReportingDetailV2",
					"entitySchemaName": "UsrReporting",
					"filter": {
						"detailColumn": "UsrAccount",
						"masterColumn": "Id"
					},
					"filterMethod": "portalUserFilterReport"
				}
			}/**SCHEMA_DETAILS*/,
			
			mixins: {},
			methods: {
				portalUserFilterReport: function () {
					var filterGroup = new this.Terrasoft.createFilterGroup();
					filterGroup.add("accountFilter", this.Terrasoft.createColumnFilterWithParameter(
						this.Terrasoft.ComparisonType.EQUAL, "UsrAccount", this.get("Id")));
					filterGroup.add("displayPortalFilter", this.Terrasoft.createColumnFilterWithParameter(
						this.Terrasoft.ComparisonType.EQUAL, "UsrDisplayPortal", true));
					return filterGroup;
				},
				portalUserFilterInvest: function () {
					var filterGroup = new this.Terrasoft.createFilterGroup();

					filterGroup.add("accountFilter", this.Terrasoft.createColumnFilterWithParameter(
						this.Terrasoft.ComparisonType.EQUAL, "UsrAccount", this.get("Id")));

					var filterGroup_1 = new this.Terrasoft.createFilterGroup();
					filterGroup_1.logicalOperation = this.Terrasoft.LogicalOperatorType.OR;
					filterGroup_1.add("keepPrivateFilter", this.Terrasoft.createColumnFilterWithParameter(
						this.Terrasoft.ComparisonType.EQUAL, "UsrKeepInvestmentPrivate", false));
					filterGroup_1.add("userFilter", this.Terrasoft.createColumnFilterWithParameter(
						this.Terrasoft.ComparisonType.EQUAL, "UsrInvestorName", Terrasoft.SysValue.CURRENT_USER_CONTACT.value));
					filterGroup.add(filterGroup_1);

					return filterGroup;
				},
				portalUserFilterInvestDocs: function () {
					var filterGroup = new this.Terrasoft.createFilterGroup();
					filterGroup.add("accountFilter", this.Terrasoft.createColumnFilterWithParameter(
						this.Terrasoft.ComparisonType.EQUAL, "UsrAccount", this.get("Id")));
					if (!this.get("isAdminUserRoles")) {
						filterGroup.add("userFilter", this.Terrasoft.createColumnFilterWithParameter(
							this.Terrasoft.ComparisonType.EQUAL, "UsrInvestor", Terrasoft.SysValue.CURRENT_USER_CONTACT.value));
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
					Terrasoft.configuration.EntityStructure.UsrInvestorDocuments = {entitySchemaName: "UsrInvestorDocuments", entitySchemaUId: "1b03f644-0002-4c92-ae03-155bc9c274f6", pages: [{Uid: "8B2CFDC7-25CC-45AF-B083-6A357D40A09B", caption: "", captionLcz: "", cardSchema: "UsrInvestorDocumentsPageV2",typeColumnName: ""}]};
					Terrasoft.configuration.EntityStructure.UsrReporting = {entitySchemaName: "UsrReporting", entitySchemaUId: "26faa4b1-59cd-4e20-9c02-39eb10321e5b", pages: [{Uid: "edd71432-886d-476b-adb9-a3c2916dbceb", caption: "", captionLcz: "", cardSchema: "UsrReportingPageV2",typeColumnName: ""}]};
					Terrasoft.configuration.EntityStructure.UsrAccountDocument = {entitySchemaName: "UsrAccountDocument", entitySchemaUId: "50896158-8505-440D-8546-61FF825C7BD1", pages: [{Uid: "A4AD2B31-F88D-48C2-92DC-41771E902107", caption: "", captionLcz: "", cardSchema: "UsrAccountDocumentPageV2",typeColumnName: ""}]};
					var esqContact = Ext.create("Terrasoft.EntitySchemaQuery", {
						"rootSchemaName": "Contact"
					});
					esqContact.addColumn("Id");
					esqContact.addColumn("UsrPortalUserType");
					esqContact.addColumn("Type");
					esqContact.filters.addItem(Terrasoft.createColumnFilterWithParameter(
						Terrasoft.ComparisonType.EQUAL, "Id", Terrasoft.SysValue.CURRENT_USER_CONTACT.value));
					esqContact.getEntityCollection(function(resultContact) { 
						if (resultContact.success) {
							if (resultContact.collection.getByIndex(0).get("Type").value == "00783EF6-F36B-1410-A883-16D83CAB0980".toLowerCase()) {
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
											this.set("isVisibleEISForm", true);
											this.set("isInvestor", true);
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
							} 
						}
					}, this);
					this.set('ShowSaveButton', false);
				},
				getOpenCardConfig: function(operation, typeColumnValue, recordId) {
					var editPages = this.getEditPages();
					var editPage = editPages.find(typeColumnValue) || editPages.getByIndex(0);
					var schemaName = "";
					if (editPage === undefiend) {
						schemaName = "UsrInvestorDocumentsPageV2";
					} else {
						schemaName = editPage.get("SchemaName");
					}
					var cardModuleId = this.getEditPageSandboxId(editPage);
					var defaultValues = this.get("DefaultValues");
					var typeColumnName = this.get("TypeColumnName");
					if (typeColumnName && typeColumnValue) {
						defaultValues.push({
							name: typeColumnName,
							value: typeColumnValue
						});
					}
					return {
						moduleId: cardModuleId,
						schemaName: schemaName,
						operation: operation,
						id: recordId,
						defaultValues: defaultValues
					};
				},
				onRender: function () {
					this.callParent(arguments);
					document.getElementById("t-comp0-wrap").style.height = "163px";
					document.getElementById("t-comp0-wrap").style.width = "460px";
					document.getElementById("t-comp0-caption").style.height = "90px";
				}
			},
			diff: /**SCHEMA_DIFF*/[
				{
					"operation": "remove",
					"name": "ActionsDashboardModule",
				},
				{
					"operation": "merge",
					"name": "CombinedModeAddRecordButton",
					"values": {"visible": false}
				},
				{
					"operation": "remove",
					"name": "AccountType"
				},
				{
					"operation": "remove",
					"name": "NewAccountCategory"
				},
				{
					"operation": "remove",
					"name": "Phone"
				},
				{
					"operation": "remove",
					"name": "Web"
				},
				{
					"operation": "remove",
					"name": "ContactProfile"
				},
				{
					"operation": "remove",
					"name": "AccountVsContactTab",
				},
				{
					"operation": "remove",
					"name": "AccountPageGeneralTabContainer"
				},
				{
					"operation": "remove",
					"name": "CompletenessContainer"
				},
				{
					"operation": "remove",
					"name": "UsrStage"
				},
				{
					"operation": "remove",
					"name": "UsrAmountIndicated"
				},
				/*{
					"operation": "remove",
					"name": "UsrAmountCommitted"
				},*/
				{
					"operation": "remove",
					"name": "Type"
				},
				{
					"operation": "remove",
					"name": "Owner"
				},
				{
					"operation": "remove",
					"name": "AccountCompletenessContainer"
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
						/*"layout": {
							"column": 4,
							"row": 4,
							"colSpan": 9,
							"rowSpan": 1
						},*/
						//"enabled": {"bindTo": "isIPUserRoles"}//Den
						"enabled": false
					}
				},
				{
					"operation": "merge",
					"name": "UsrAmountCommitted",
					"values": {
						"enabled": false
					}
				}
			]/**SCHEMA_DIFF*/
		};
	});