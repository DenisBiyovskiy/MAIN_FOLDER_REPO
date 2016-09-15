define("UsrInvestmentOppPageV2", [],
	function() {
		return {
			entitySchemaName: "UsrInvestmentOpp",
			messages: {},
			attributes: {
				"isIPUserRoles": {
					"dataValueType": Terrasoft.DataValueType.BOOLEAN,
					"value":  true
				},
				"isAdminUserRoles": {
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
					"defaultValues": {
						"UsrAccount": {
							masterColumn: "UsrAccount"
						}
					},
					"filterMethod": "portalUserFilterInvest",
					subscriber: function() {
						this.updateAmount();
					}
				}/*,
				"UsrReporting": {
					"schemaName": "UsrReportingDetailV2",
					"entitySchemaName": "UsrReporting",
					"filter": {
						"detailColumn": "UsrAccount",
						"masterColumn": "Id"
					},
					"filterMethod": "portalUserFilterReport"
				}*/
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
				onRender: function () {
					this.callParent(arguments);
					var entity = Ext.create("Terrasoft.EntitySchemaQuery", {
						rootSchemaName: "UsrInvestment"
					});
					entity.addColumn("Id");
					entity.addColumn("UsrConfirmed");
					entity.addColumn("UsrMin");
					entity.addColumn("UsrMax");
					entity.addColumn("UsrComittedAmount");
					entity.addColumn("UsrInvestorName");
					entity.filters.addItem(entity.createColumnFilterWithParameter(
						this.Terrasoft.ComparisonType.EQUAL, "UsrAccount", this.get("Id")));
					entity.getEntityCollection(function(result) {
						if (result.success) {
							var amountIndicated = 0;
							var amountCommitted = 0;
							for (var i = 0; i < result.collection.getCount(); i++) {
								if (result.collection.getByIndex(i).get("UsrConfirmed")) {
									var usrComitted = result.collection.getByIndex(i).get("UsrComittedAmount");
									amountCommitted = amountCommitted + usrComitted;
								} else {
									var usrMin = result.collection.getByIndex(i).get("UsrMin");
									amountIndicated = amountIndicated + usrMin;
								} 
								if (!this.get("isInvestor")) {
									if (result.collection.getByIndex(i).get("UsrInvestorName").value == Terrasoft.SysValue.CURRENT_USER_CONTACT.value) {
										this.set("isInvestor", true);
									}
								}
							}
							if (this.get("UsrAmountCommitted") != amountCommitted)
								this.set("UsrAmountCommitted", amountCommitted);
							if (this.get("UsrAmountIndicated") != amountIndicated)
								this.set("UsrAmountIndicated", amountIndicated);
							this.set("ShowSaveButton", false);
						}
					}, this);
					document.getElementById("t-comp0-wrap").style.height = "163px";
					document.getElementById("t-comp0-wrap").style.width = "460px";
					document.getElementById("t-comp0-caption").style.height = "90px";
				},
				init: function(){
					this.callParent(arguments);
					Terrasoft.configuration.EntityStructure.UsrInvestment = {entitySchemaName: "UsrInvestment", entitySchemaUId: "EBE54B74-62F9-47EA-AA09-4617FB874728", pages: [{Uid: "A00FCE2C-5A69-4520-8CD7-CCD5C33B5677", caption: "", captionLcz: "", cardSchema: "UsrInvestmentPageV2",typeColumnName: ""}]};
					Terrasoft.configuration.EntityStructure.UsrQuestions = {entitySchemaName: "UsrQuestions", entitySchemaUId: "64D359E0-D76D-4C6B-8D10-E4055F938412", pages: [{Uid: "6B7DC5B1-C7F7-4D64-B99B-A37A59BB21CD", caption: "", captionLcz: "", cardSchema: "UsrQuestionsPageV2",typeColumnName: ""}]};
					Terrasoft.configuration.EntityStructure.UsrReporting = {entitySchemaName: "UsrReporting", entitySchemaUId: "26faa4b1-59cd-4e20-9c02-39eb10321e5b", pages: [{Uid: "edd71432-886d-476b-adb9-a3c2916dbceb", caption: "", captionLcz: "", cardSchema: "UsrReportingPageV2",typeColumnName: ""}]};
					//Terrasoft.configuration.EntityStructure.UsrAccountDocument = {entitySchemaName: "UsrAccountDocument", entitySchemaUId: "50896158-8505-440D-8546-61FF825C7BD1", pages: [{Uid: "A4AD2B31-F88D-48C2-92DC-41771E902107", caption: "", captionLcz: "", cardSchema: "UsrAccountDocumentPageV2",typeColumnName: ""}]};
					Terrasoft.configuration.EntityStructure.UsrAccountDocument = {entitySchemaName: "UsrAccountDocument", entitySchemaUId: "C0EED27E-59E2-42C3-B5B9-428BAC13965B", pages: [{Uid: "C2CDDBA2-A12F-4A48-BE97-29C803B8163F", caption: "", captionLcz: "", cardSchema: "UsrAccountDocumentPageV2",typeColumnName: ""}]};
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
							} else {
								this.set("isIPUserRoles", true);
							} 
						}
					}, this);
					this.set('ShowSaveButton', false);
				}
			},
			diff: /**SCHEMA_DIFF*/[
				{
					"operation": "remove",
					"name": "ActionsDashboardModule"
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
					"name": "AccountVsContactTab"
				},
				{
					"operation": "merge",
					"name": "SeparateModeAddRecordButton",
					"values": {"visible": false}
				},
				{
					"operation": "remove",
					"name": "AccountCompletenessContainer"
				},
				{
					"operation": "merge",
					"name": "SaveButton",
					"values": {"visible": false}
				},
				{
					"operation": "remove",
					"name": "UsrInvestorDocuments"
				},
				{
					"operation": "remove",
					"name": "InvestorDocumentsTab"
				},
				{
					"operation": "remove",
					"name": "UsrReporting"
				},
				{
					"operation": "remove",
					"name": "ReportingTab"
				},
				{
					"operation": "remove",
					"name": "AccountPageGeneralTabContainer"
				},
				{
					"operation": "remove",
					"name": "Type"
				},
				{
					"operation": "remove",
					"name": "UsrApplicationStatus"
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
							"colSpan": 19,
							"rowSpan": 1
						},
						"enabled": {"bindTo": "isIPUserRoles"}
					}
				},
				{
					"operation": "merge",
					"name": "UsrStage",
					"values": {
						"layout": {
							"column": 0,
							"row": 2,
							"colSpan": 24,
							"rowSpan": 1
						},
						"enabled": {"bindTo": "isIPUserRoles"}
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
						"contentType": 3,
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
						//"enabled": {"bindTo": "isIPUserRoles"}
						"enabled": false//Den
					}
				},
				{
					"operation": "merge",
					"name": "UsrAmountIndicated",
					"values": {
						/*"layout": {
							"column": 4,
							"row": 5,
							"colSpan": 9,
							"rowSpan": 1
						},*/
						//"enabled": {"bindTo": "isIPUserRoles"}
						"enabled": false//Den
					}
				},
				{
					"operation": "merge",
					"name": "UsrAmountCommitted",
					"values": {
						/*"layout": {
							"column": 4,
							"row": 6,
							"colSpan": 9,
							"rowSpan": 1
						},*/
						//"enabled": {"bindTo": "isIPUserRoles"}
						"enabled": false//Den
					}
				}
			]/**SCHEMA_DIFF*/
		};
	});
