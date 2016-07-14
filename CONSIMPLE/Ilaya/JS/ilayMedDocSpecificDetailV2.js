define("ilayMedDocSpecificDetailV2", ["BusinessRulesApplierV2", "ConfigurationGrid", "ConfigurationGridGenerator",
			"ConfigurationGridUtilities"], function(BusinessRulesApplier) {
			return {
				entitySchemaName: "ilayMedDocSpecific",
				attributes: {
					"IsEditable": {
						dataValueType: Terrasoft.DataValueType.BOOLEAN,
						type: Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN,
						value: true
					}
				},
				methods: {
					/**
					 * @inheritdoc Terrasoft.GridUtilitiesV2#getFilterDefaultColumnName
					 * @overridden
					 */
					init: function() {
						this.callParent(arguments);
						//debugger;
					},

					getFilterDefaultColumnName: function() {
						return "Specification";
					},

					/**
					 * Сохраняет изменения на редактируемом гриде детали, меняет фокус,
					 * публикует сообщение для работы сабскрайбера.
					 */
					changeRow: function(config) { 
						var oldId = config.oldId; 
						if (!oldId) { 
							return; 
						} 
						var gridData = this.getGridData(); 
						if (!gridData.contains(oldId)) { 
							return; 
						} 
						var activeRow = gridData.get(oldId); 
						var activeRowChanged = this.getIsRowChanged(activeRow); 
						if (activeRowChanged) { 
							this.Terrasoft.chain( 
								function(next) { 
									this.saveRowChanges(activeRow, next);
								}, 
								function() { 
									this.set("ActiveRow", config.newId || null); 
								}, 
							this 
							); 
							config.success = false;
						} 
						this.updateDetail({
							detail: "ilayMedDocSpecificDetailV2",
							reloadAll: true
						});
					},

					generateActiveRowControlsConfig: function(id, columnsConfig, rowConfig) {
						// + vlad
						var changeConfig,
							columnNumber;
						// - vlad
						this.columnsConfig = columnsConfig;
						var gridLayoutItems = [];
						var currentColumnIndex = 0;
						this.Terrasoft.each(columnsConfig, function(columnConfig) {
							var columnName = columnConfig.key[0].name.bindTo;
							var column = this.getColumnByColumnName(columnName);
							var cellConfig = this.getCellControlsConfig(column);
							cellConfig = this.Ext.apply({
								layout: {
									colSpan: columnConfig.cols,
									column: currentColumnIndex,
									row: 0,
									rowSpan: 1
								}
							}, cellConfig);
							// + vlad
							if (columnName === "ilayFactValueForEditableGrid") {
								changeConfig = true;
								columnNumber = gridLayoutItems.length;
							}
							// - vlad
							gridLayoutItems.push(cellConfig);
							currentColumnIndex += columnConfig.cols;
						}, this);
						var gridData = this.getGridData();
						var activeRow = gridData.get(id);
						var rowClass = {prototype: activeRow};
						BusinessRulesApplier.applyRules(rowClass, gridLayoutItems);
						var viewGenerator = this.Ext.create("Terrasoft.ViewGenerator");
						viewGenerator.viewModelClass = {prototype: this};
						var gridLayoutConfig = viewGenerator.generateGridLayout({
							name: this.name,
							items: gridLayoutItems
						});
						// + vlad
						// TODO забиндить конфиги для типов int, float
						if (changeConfig) {
							var editedConfig = gridLayoutConfig.items[columnNumber].item.items[0].items[0];
							switch (activeRow.values.ilaySpecificType.value.toUpperCase()) {
								case "ECF578A0-4B4D-40E6-909C-39AF2A798D32":
									// lookup type
									activeRow.values.ilayFactValueForEditableGrid = activeRow.values.ilayListItemValue;
									editedConfig.className = "Terrasoft.ComboBoxEdit";
									editedConfig.enabled = true;
									editedConfig.focused = {bindTo : "IsilayFactValueForEditableGridFocused"};
									editedConfig.isRequired = undefined;
									editedConfig.id = "ilayFactValueForEditableGridComboBoxEdit";
									editedConfig.list = {bindTo : "ilayListItemValueList"};
									editedConfig.value = {bindTo : "ilayListItemValue"};
									break;
								/*
								case "BEB46531-4F29-452C-BE18-1ED5F1AA8B80":
									// float type
									activeRow.values.ilayFactValueForEditableGrid = activeRow.values.ilayFloatValue;
									editedConfig.value = {bindTo : "ilayFloatValue"};
									break;
								*/
								case "359E0E35-BB39-4F07-9B9F-AEC6AD076828":
									//boolean type
									activeRow.values.ilayFactValueForEditableGrid = activeRow.values.ilayBooleanValue;
									editedConfig.checked = {bindTo : "ilayBooleanValue"};
									editedConfig.className = "Terrasoft.CheckBoxEdit";
									editedConfig.enabled = true;
									editedConfig.id = "ilayFactValueForEditableGridCheckBoxEdit";
									delete editedConfig.isRequired;
									delete editedConfig.placeholder;
									delete editedConfig.focused;
									delete editedConfig.tips;
									delete editedConfig.value;
									break;
								/*
								case "2212241A-71EB-468B-A3D5-C0F39DFE51C9":
									//int type
									activeRow.values.ilayFactValueForEditableGrid = activeRow.values.ilayIntValue;
									editedConfig.value = {bindTo : "ilayIntValue"};
									break;
								*/
								case "7AAD419A-9E7A-4785-8D13-C7FF1402E13D":
									//string type
									activeRow.values.ilayFactValueForEditableGrid = activeRow.values.ilayStringValue;
									editedConfig.focused = {bindTo : "IsilayStringValueFocused"};
									editedConfig.id = "ilayFactValueForEditableGridTextEdit";
									editedConfig.value = {bindTo : "ilayStringValue"};
									break;
								default:
									// string type for default
									activeRow.values.ilayFactValueForEditableGrid = activeRow.values.ilayStringValue;
									editedConfig.focused = {bindTo : "IsilayStringValueFocused"};
									editedConfig.id = "ilayFactValueForEditableGridTextEdit";
									editedConfig.value = {bindTo : "ilayStringValue"};
							}
						}
						// - vlad
						rowConfig.push(gridLayoutConfig);
					},
					getRowCount: function() {
						var profile = this.get("Profile");
						var propertyName = this.getDataGridName();
						profile = propertyName ? profile[propertyName] : profile;
						if (profile && profile.isTiled !== undefined) {
							if(profile.key.includes("ilayMedDocSpecificDetailV2")) {
								return 50;
							} else {
								return profile.isTiled ? this.get("RowCount") : 2 * this.get("RowCount");
							}
						}
						return this.get("RowCount");
					}
				},
				mixins: {
					ConfigurationGridUtilites: "Terrasoft.ConfigurationGridUtilities"
				},
				diff: /**SCHEMA_DIFF*/[
					{
						"operation": "merge",
						"name": "DataGrid",
						"values": {
							"rowDataItemMarkerColumnName": "Specification",
							"className": "Terrasoft.ConfigurationGrid",
							"generator": "ConfigurationGridGenerator.generatePartial",
							"generateControlsConfig": {"bindTo": "generateActiveRowControlsConfig"},
							"changeRow": {"bindTo": "changeRow"},
							"unSelectRow": {"bindTo": "unSelectRow"},
							"onGridClick": {"bindTo": "onGridClick"},
							"activeRowActions": [
								{
									"className": "Terrasoft.Button",
									"style": this.Terrasoft.controls.ButtonEnums.style.TRANSPARENT,
									"tag": "save",
									"markerValue": "save",
									"imageConfig": {"bindTo": "Resources.Images.SaveIcon"}
								},
								{
									"className": "Terrasoft.Button",
									"style": this.Terrasoft.controls.ButtonEnums.style.TRANSPARENT,
									"tag": "cancel",
									"markerValue": "cancel",
									"imageConfig": {"bindTo": "Resources.Images.CancelIcon"}
								},
								{
									"className": "Terrasoft.Button",
									"style": this.Terrasoft.controls.ButtonEnums.style.TRANSPARENT,
									"tag": "remove",
									"markerValue": "remove",
									"imageConfig": {"bindTo": "Resources.Images.RemoveIcon"}
								}
							],
							"initActiveRowKeyMap": {"bindTo": "initActiveRowKeyMap"},
							"activeRowAction": {"bindTo": "onActiveRowAction"},
							"multiSelect": false,
							"sortColumnIndex": 3,
							"sortColumnDirection": 1
						}
					},
					{
						"operation": "remove",
						"name": "AddRecordButton",
						"parentName": "Detail",
						"propertyName": "tools",
						"values": {
							"itemType": Terrasoft.ViewItemType.BUTTON,
							"click": {"bindTo": "addRecord"},
							"visible": false,
							"enabled": {"bindTo": "getAddRecordButtonEnabled"},
							"style": Terrasoft.controls.ButtonEnums.style.TRANSPARENT,
							"imageConfig": {"bindTo": "Resources.Images.AddButtonImage"}
						}
					}
				]/**SCHEMA_DIFF*/
			};
		});
