define("ContactPageV2", ["BaseFiltersGenerateModule", "BusinessRuleModule", "ContactPageV2Resources",
			"ConfigurationConstants", "ContactCareer", "DuplicatesSearchUtilitiesV2"],
	function(BaseFiltersGenerateModule, BusinessRuleModule, resources, ConfigurationConstants, ContactCareer) {
		return {
			entitySchemaName: "Contact",
			messages: {},
			attributes: {
				"NameChanged": {
					dependencies: [
						{
							columns: ["GivenName", "Surname"],
							methodName: "setFullName"
						}
					]
				},
				"visiblePortalUserType": {
					dataValueType: Terrasoft.DataValueType.BOOLEAN,
					value: false
				}
			},
			rules: {},
			details: /**SCHEMA_DETAILS*/{
	"UsrDirectorship": {
		"schemaName": "UsrDirectorshipDetailV2",
		"entitySchemaName": "UsrDirectorship",
		"filter": {
			"detailColumn": "UsrAccount",
			"masterColumn": "Id"
		}
	}
}/**SCHEMA_DETAILS*/,
			methods: {
				setFullName: function () {
					this.set("Name", this.get("GivenName") + " " + this.get("Surname"));
				},
				onEntityInitialized: function () {
					var esq = Ext.create("Terrasoft.EntitySchemaQuery", {
						"rootSchemaName": "SysAdminUnit"
					});
					esq.addColumn("Id");
					esq.addColumn("Contact");
					esq.filters.addItem(Terrasoft.createColumnFilterWithParameter(
						Terrasoft.ComparisonType.EQUAL, "Contact", this.get("Id")));
					esq.filters.addItem(Terrasoft.createColumnFilterWithParameter(
						Terrasoft.ComparisonType.EQUAL, "[SysAdminUnitInRole:SysAdminUnit:Id].SysAdminUnitRoleId",
						"720B771C-E7A7-4F31-9CFB-52CD21C3739F"));
					esq.getEntityCollection(function(result) {
						var isPortalUser = result.success && (result.collection.getCount() === 1);
						this.set("visiblePortalUserType", isPortalUser);
						if (isPortalUser) {
							var esqContact = Ext.create("Terrasoft.EntitySchemaQuery", {
								"rootSchemaName": "Contact"
							});
							esqContact.addColumn("Id");
							esqContact.addColumn("Account");
							esqContact.filters.addItem(Terrasoft.createColumnFilterWithParameter(
								Terrasoft.ComparisonType.EQUAL, "Id", this.get("Id")));
							esqContact.getEntityCollection(function(resultContact) { 
								if (resultContact.success) {
									if (resultContact.collection.getByIndex(0).get("Account").value != "e308b781-3c5b-4ecb-89ef-5c1ed4da488e") {
										var update = Ext.create("Terrasoft.UpdateQuery", {
											rootSchemaName: "Contact"
										});
										update.setParameterValue("Account", "e308b781-3c5b-4ecb-89ef-5c1ed4da488e", Terrasoft.DataValueType.GUID);
										var filter = update.createColumnFilterWithParameter(Terrasoft.ComparisonType.EQUAL, "Id" , this.get("Id"));
										update.filters.add("FilterId", filter);
										update.execute(function(result) {
										});
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
		"name": "Name",
		"values": {
			"layout": {
				"column": 4,
				"row": 0,
				"colSpan": 20,
				"rowSpan": 1
			}
		}
	},
	{
		"operation": "merge",
		"name": "Type",
		"values": {
			"layout": {
				"column": 4,
				"row": 1,
				"colSpan": 8,
				"rowSpan": 1
			}
		}
	},
	{
		"operation": "merge",
		"name": "Owner",
		"values": {
			"layout": {
				"column": 12,
				"row": 1,
				"colSpan": 12,
				"rowSpan": 1
			}
		}
	},
	{
		"operation": "insert",
		"name": "UsrPortalUserType",
		"values": {
			"layout": {
				"column": 12,
				"row": 2,
				"colSpan": 12,
				"rowSpan": 1
			},
			"bindTo": "UsrPortalUserType",
			"contentType": 3,
			"caption": {
				"bindTo": "Resources.Strings.UsrPortalUserTypeCaption"
			},
			"visible": {
				//"bindTo": "visiblePortalUserType"
				"bindTo": false
			}
		},
		"parentName": "Header",
		"propertyName": "items",
		"index": 5
	},
	{
		"operation": "merge",
		"name": "SalutationType",
		"values": {
			"layout": {
				"column": 0,
				"row": 0,
				"rowSpan": 1,
				"colSpan": 12
			}
		}
	},
	{
		"operation": "merge",
		"name": "Gender",
		"values": {
			"layout": {
				"column": 12,
				"row": 0,
				"rowSpan": 1,
				"colSpan": 12
			}
		}
	},
	{
		"operation": "merge",
		"name": "Dear",
		"values": {
			"layout": {
				"column": 0,
				"row": 2,
				"colSpan": 12,
				"rowSpan": 1
			}
		}
	},
	{
		"operation": "insert",
		"name": "GivenName",
		"values": {
			"layout": {
				"column": 0,
				"row": 1,
				"colSpan": 12,
				"rowSpan": 1
			},
			"bindTo": "GivenName",
			"caption": {
				"bindTo": "Resources.Strings.GivenNameCaption"
			},
			"enabled": true
		},
		"parentName": "ContactGeneralInfoBlock",
		"propertyName": "items",
		"index": 3
	},
	{
		"operation": "insert",
		"name": "Surname",
		"values": {
			"layout": {
				"column": 12,
				"row": 1,
				"colSpan": 12,
				"rowSpan": 1
			},
			"bindTo": "Surname",
			"caption": {
				"bindTo": "Resources.Strings.SurnameCaption"
			},
			"enabled": true
		},
		"parentName": "ContactGeneralInfoBlock",
		"propertyName": "items",
		"index": 4
	},
	{
		"operation": "insert",
		"name": "DirectorshipTab",
		"values": {
			"items": [],
			"caption": {
				"bindTo": "Resources.Strings.DirectorshipTabCaption"
			}
		},
		"parentName": "Tabs",
		"propertyName": "tabs",
		"index": 2
	},
	{
		"operation": "insert",
		"name": "UsrDirectorship",
		"values": {
			"itemType": 2
		},
		"parentName": "DirectorshipTab",
		"propertyName": "items",
		"index": 0
	},
	{
		"operation": "remove",
		"name": "Account"
	},
	{
		"operation": "remove",
		"name": "ContactAnniversary"
	},
	{
		"operation": "remove",
		"name": "Relationships"
	},
	{
		"operation": "remove",
		"name": "JobTabContainer"
	},
	{
		"operation": "remove",
		"name": "JobInformationControlGroup"
	},
	{
		"operation": "remove",
		"name": "JobInformationBlock"
	},
	{
		"operation": "remove",
		"name": "Job"
	},
	{
		"operation": "remove",
		"name": "JobTitle"
	},
	{
		"operation": "remove",
		"name": "Department"
	},
	{
		"operation": "remove",
		"name": "DecisionRole"
	},
	{
		"operation": "remove",
		"name": "ContactCareer"
	},
	{
		"operation": "remove",
		"name": "InternalRate"
	},
	{
		"operation": "remove",
		"name": "ExternalRate"
	},
	{
		"operation": "remove",
		"name": "HistoryTab"
	},
	{
		"operation": "remove",
		"name": "SiteEventDetail"
	},
	{
		"operation": "remove",
		"name": "Activities"
	},
	{
		"operation": "remove",
		"name": "Contract"
	},
	{
		"operation": "remove",
		"name": "Cases"
	},
	{
		"operation": "remove",
		"name": "Calls"
	},
	{
		"operation": "remove",
		"name": "EmailDetailV2"
	},
	{
		"operation": "remove",
		"name": "Leads"
	},
	{
		"operation": "remove",
		"name": "Invoice"
	},
	{
		"operation": "remove",
		"name": "Documents"
	},
	{
		"operation": "remove",
		"name": "Order"
	},
	{
		"operation": "remove",
		"name": "Project"
	},
	{
		"operation": "remove",
		"name": "Opportunities"
	},
	{
		"operation": "remove",
		"name": "EventDetail"
	},
	{
		"operation": "remove",
		"name": "BulkEmailDetail"
	},
	{
		"operation": "remove",
		"name": "NotesAndFilesTab"
	},
	{
		"operation": "remove",
		"name": "Files"
	},
	{
		"operation": "remove",
		"name": "NotesControlGroup"
	},
	{
		"operation": "remove",
		"name": "Notes"
	}
]/**SCHEMA_DIFF*/
		};
	});