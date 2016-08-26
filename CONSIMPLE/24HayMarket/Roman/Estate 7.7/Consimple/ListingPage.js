define('ListingPage', ['ListingPageResources', 'GeneralDetails', 'ProcessModuleUtilities'],
function(resources, GeneralDetails, ProcessModuleUtilities) {
	return {
		entitySchemaName: 'Listing',
		messages: {
			/**
			 * @message AmenityChangedForAvito
			 * Получает сообщение изменения параметров для выгрузки на Avito.
			 */
			"AmenityChangedAvito": {
				mode: this.Terrasoft.MessageMode.PTP,
				direction: this.Terrasoft.MessageDirectionType.SUBSCRIBE
			}
		},
		details: /**SCHEMA_DETAILS*/{}/**SCHEMA_DETAILS*/,
		diff: /**SCHEMA_DIFF*/[
			{
				"operation": "insert",
				"name": "exportGroup",
				"values": {
					"itemType": 15,
					"caption": {
						"bindTo": "Resources.Strings.group0812b468ebccCaption"
					},
					"items": [],
					"controlConfig": {
						"collapsed": false
					}
				},
				"parentName": "GeneralInfoTab",
				"propertyName": "items",
				"index": 4
			},
			{
				"operation": "insert",
				"name": "exportGroup_gridLayout",
				"values": {
					"itemType": 0,
					"items": []
				},
				"parentName": "exportGroup",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "UsrLastExportAvito",
				"values": {
					"layout": {
						"column": 0,
						"row": 0,
						"colSpan": 12,
						"rowSpan": 1
					},
					"bindTo": "UsrLastExportAvito",
					"caption": {
						"bindTo": "Resources.Strings.UsrLastExportAvitoCaption"
					},
					"textSize": "Default",
					"labelConfig": {
						"visible": true
					},
					"enabled": true
				},
				"parentName": "exportGroup_gridLayout",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "UsrExportedOnAvito",
				"values": {
					"layout": {
						"column": 12,
						"row": 0,
						"colSpan": 12,
						"rowSpan": 1
					},
					"bindTo": "UsrExportedOnAvito",
					"caption": {
						"bindTo": "Resources.Strings.UsrExportedOnAvitoCaption"
					},
					"textSize": "Default",
					"labelConfig": {
						"visible": true
					},
					"enabled": true
				},
				"parentName": "exportGroup_gridLayout",
				"propertyName": "items",
				"index": 1
			},
			{
				"operation": "insert",
				"name": "UsrLastExportRgr51",
				"values": {
					"layout": {
						"column": 0,
						"row": 1,
						"colSpan": 12,
						"rowSpan": 1
					},
					"bindTo": "UsrLastExportRgr51",
					"caption": {
						"bindTo": "Resources.Strings.UsrLastExportRgr51Caption"
					},
					"enabled": true
				},
				"parentName": "exportGroup_gridLayout",
				"propertyName": "items",
				"index": 2
			},
			{
				"operation": "insert",
				"name": "UsrExportedOnRgr51",
				"values": {
					"layout": {
						"column": 12,
						"row": 1,
						"colSpan": 12,
						"rowSpan": 1
					},
					"bindTo": "UsrExportedOnRgr51",
					"caption": {
						"bindTo": "Resources.Strings.UsrExportedOnRgr51Caption"
					},
					"enabled": false
				},
				"parentName": "exportGroup_gridLayout",
				"propertyName": "items",
				"index": 3
			},
			{
				"operation": "insert",
				"name": "UsrLastExportZipal",
				"values": {
					"layout": {
						"column": 0,
						"row": 2,
						"colSpan": 12,
						"rowSpan": 1
					},
					"bindTo": "UsrLastExportZipal",
					"caption": {
						"bindTo": "Resources.Strings.UsrLastExportZipalCaption"
					},
					"enabled": false
				},
				"parentName": "exportGroup_gridLayout",
				"propertyName": "items",
				"index": 4
			},
			{
				"operation": "insert",
				"name": "UsrExportedOnZipal",
				"values": {
					"layout": {
						"column": 12,
						"row": 2,
						"colSpan": 12,
						"rowSpan": 1
					},
					"bindTo": "UsrExportedOnZipal",
					"caption": {
						"bindTo": "Resources.Strings.UsrExportedOnZipalCaption"
					},
					"enabled": false
				},
				"parentName": "exportGroup_gridLayout",
				"propertyName": "items",
				"index": 5
			}
		]/**SCHEMA_DIFF*/,
		attributes: {
			"IsNotUpdateOnAvitoZipal": {
				dataValueType: Terrasoft.DataValueType.BOOLEAN,
				type: Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN,
				value: false
			}
		},
		methods: {
			subscribeSandboxEvents: function() {
				this.callParent(arguments);
				var tag = this.sandbox.id + "_detail_Amenities";
				this.sandbox.subscribe("AmenityChanged", function() { this.setIsNotEditOnAvito(); }, this, [tag]);
			},
			setIsNotEditOnAvito: function () {
				this.set("IsNotUpdateOnAvitoZipal", true);
			}, 
			onSaved: function () {
				this.callParent(arguments);
				if (!this.isNewMode() || !this.isAddMode()) {
					if (this.get("UsrExportedOnAvito")) {
						var selected = this.get("Id") + ",";
						if (this.get("IsNotUpdateOnAvitoZipal")) {
							var processArgs = {
								sysProcessName: 'UsrProcessExportAtAvito',
								parameters: {						
									"SelectedListings": selected,
									"AddOrDelete": true
								}
							};
							ProcessModuleUtilities.runProcess(processArgs.sysProcessName, processArgs.parameters, function() {  }, this);
							this.hideBodyMask();
						} else {
							var processArgs = {
								sysProcessName: 'UsrProcessExportAtAvito',
								parameters: {						
									"SelectedListings": selected,
									"AddOrDelete": true
								}
							};
							ProcessModuleUtilities.runProcess(processArgs.sysProcessName, processArgs.parameters, function() {  }, this);
							this.hideBodyMask();
						}
					}
					if (this.get("UsrExportedOnZipal")) {
						this.unloadListings();
					}
				}
				this.set("IsNotUpdateOnAvitoZipal", false);
			}
		},
		rules: {},
		userCode: {}
	};
});