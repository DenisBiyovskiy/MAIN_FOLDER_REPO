define("UsrAccountDocumentPageV2", [], function() {
	return {
		entitySchemaName: "UsrAccountDocument",
		messages: {},
		attributes: {
			"enabledForPortal": {
				"dataValueType": Terrasoft.DataValueType.BOOLEAN,
				"value":  true
			}
		},
		details: /**SCHEMA_DETAILS*/{
			"Files": {
				schemaName: "FileDetailV2",
				entitySchemaName: "UsrAccDocFile",
				filter: {
					masterColumn: "Id",
					detailColumn: "UsrAccDoc"
				}
			}
		}/**SCHEMA_DETAILS*/,
		
		mixins: {},
		methods: {
			/*onSaved: function() {
				if (Terrasoft.configuration.Storage.hasOwnProperty("newChildDoc")) {
					var accountID, parentID;
					var defValues = this.get("DefaultValues");
					for (var i = 0; i < defValues.length; i++) {
						switch (defValues[i].name) {
							case "UsrAccount":
								accountID = defValues[i].value;
								break;
							case "UsrParent": 
								parentID = defValues[i].value;
								break;
						}
					}
					var update = Ext.create("Terrasoft.UpdateQuery", {
						rootSchemaName: "UsrAccountDocument"
					});
					update.setParameterValue("UsrAccount", accountID, Terrasoft.DataValueType.GUID);
					update.setParameterValue("UsrParent", parentID, Terrasoft.DataValueType.GUID);
					var filter = update.createColumnFilterWithParameter(Terrasoft.ComparisonType.EQUAL, "Id" , this.get("Id"));
					update.filters.add("FilterId", filter);

					update.execute(function(result) {

					});
					delete Terrasoft.configuration.Storage.newChildDoc;
				} else {

				}
				this.callParent(arguments);
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
					var isPortalUser = result.success && (result.collection.getCount() === 1);
					this.set("enabledForPortal", !isPortalUser);
				}, this);
				this.callParent(arguments);
			},*/
		},
		diff: /**SCHEMA_DIFF*/[
			{
				"operation": "insert",
				"name": "UsrName",
				"values": {
					"layout": {
						"colSpan": 12,
						"rowSpan": 1,
						"column": 0,
						"row": 0,
						"layoutName": "Header"
					},
					"bindTo": "UsrName",
					"visible": true,
					"enabled": {"bindTo": "enabledForPortal"}
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "DocumentTabContainer",
				"values": {
					"caption": {
						"bindTo": "Resources.Strings.DocumentTabCaption"
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
				"parentName": "DocumentTabContainer",
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