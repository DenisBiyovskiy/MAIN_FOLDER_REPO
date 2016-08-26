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
			details: /**SCHEMA_DETAILS*/{}/**SCHEMA_DETAILS*/,
			
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
							}
							if (this.get("UsrAmountCommitted") != amountCommitted)
								this.set("UsrAmountCommitted", amountCommitted);
							if (this.get("UsrAmountIndicated") != amountIndicated)
								this.set("UsrAmountIndicated", amountIndicated);
							this.set("ShowSaveButton", false);
						}
					}, this);
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
							"column": 4,
							"row": 2,
							"colSpan": 19,
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
						"layout": {
							"column": 4,
							"row": 4,
							"colSpan": 9,
							"rowSpan": 1
						},
						"enabled": {"bindTo": "isIPUserRoles"}
					}
				},
				{
					"operation": "merge",
					"name": "UsrAmountIndicated",
					"values": {
						"layout": {
							"column": 4,
							"row": 5,
							"colSpan": 9,
							"rowSpan": 1
						},
						"enabled": {"bindTo": "isIPUserRoles"}
					}
				},
				{
					"operation": "merge",
					"name": "UsrAmountCommitted",
					"values": {
						"layout": {
							"column": 4,
							"row": 6,
							"colSpan": 9,
							"rowSpan": 1
						},
						"enabled": {"bindTo": "isIPUserRoles"}
					}
				}
			]/**SCHEMA_DIFF*/
		};
	});
