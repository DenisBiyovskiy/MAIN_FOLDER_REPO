define("UsrInvestmentDetailV2", ["UsrInvestmentDetailV2Resources", "ConfigurationEnums"], 
	function(Resources, enums) {
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
			onRender: function () {
				this.callParent(arguments);
				//this.reloadGridData();
			},
			addColumnLink: function(item, column) {
				var columnPath = column.columnPath;
				if (columnPath === "UsrActionEdit") {
					var name = item.values.ilayName;
					var id = item.values.Id;
					var target = "_self";
					var link = Terrasoft.workspaceBaseUrl + "/Nui/ViewModule.aspx#" + "CardModuleV2/UsrInvestmentPageV2/edit/" + id;
					item["on" + column.columnPath + "LinkClick"] = function() {
						return {
							caption: name,
							target: target,
							title: name,
							url: link
						};
					};
				} else {
					this.callParent(arguments);
				}
			},
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
			addGridDataColumns: function(esq) {
				this.callParent(arguments);
				esq.addColumn("UsrInvestorName");
			},
			/**
			 * Установка настроек колонок детали по умолчанию, если отсутствует пользовательская настройка
			 */
			initProfile: function() {
				var profile = this.getProfile();
				var dataGridName = this.getDataGridName();
				if (!profile[dataGridName]) {
					profile[dataGridName] = {};
					this.set("Profile", this.Terrasoft.deepClone(profile));
				}
				var currentProfile = this.get("Profile");
				if (currentProfile && currentProfile.DataGrid
					&& ((currentProfile.DataGrid.listedConfig == '{"items":[]}' && currentProfile.DataGrid.type == 'listed')
					|| (currentProfile.DataGrid.tiledConfig == '{"grid":{"rows":0,"columns":24},"items":[]}' && currentProfile.DataGrid.type == 'tiled')
					|| (!currentProfile.DataGrid.listedConfig && !currentProfile.DataGrid.tiledConfig))
				) {
					var newProfile = JSON.parse(Resources.localizableStrings.DefaultColumnsProfileConfig);
					this.set("Profile", newProfile);
				}
			},
			addRecord: function () {
				if (!this.get("isEnabledAdd")) {
					this.showInformationDialog("You are not allowed to make multiple investments for one opportunity. Please use the Question tab if you have any issues.");
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