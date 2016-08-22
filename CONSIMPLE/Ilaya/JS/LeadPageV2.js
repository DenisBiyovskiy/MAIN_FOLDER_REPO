define('LeadPageV2', ['LeadPageV2Resources', 'GeneralDetails', 'ilayConfigurationConstants', 'BusinessRuleModule', 'MaskHelper', 'ConfigurationEnums', 'LookupUtilities','ProcessModuleUtilities', 'css!ilayCustomStyles'],
	function(resources, GeneralDetails, ilayConfigurationConstants, BusinessRuleModule, MaskHelper, Enums, LookupUtilities, ProcessModuleUtilities) {
		return {
			entitySchemaName: 'Lead',
			details: /**SCHEMA_DETAILS*/{
	"SiteEvent": {
		"schemaName": "SiteEventDetailV2",
		"entitySchemaName": "VwSiteEvent",
		"filter": {
			"masterColumn": "BpmSessionId",
			"detailColumn": "BpmSessionId"
		}
	},
	"ilayCourseba3ec690103e": {
		"schemaName": "ilayCourseDetail",
		"entitySchemaName": "ilayCourse",
		"filter": {
			"detailColumn": "ilayLead",
			"masterColumn": "Id"
		}
	},
	"ilayServListInLead": {
		"schemaName": "ilayServListInLeadDetail",
		"entitySchemaName": "ilayServList",
		"filter": {
			"detailColumn": "ilayLead",
			"masterColumn": "Id"
		},
		"defaultValues": {
			"ilayPatient": {
				"masterColumn": "Contact"
			},
			"ilayPaymentStatus": {
				"value": "fdbd93d7-752e-494c-a258-f3c159de2148"
			},
			"ilayPerfomStatus": {
				"value": "766aff6d-eca4-4059-9553-a53e93f06015"
			}
		}
	},
	"Activity02dbcb08146a": {
		"schemaName": "ActivityDetailV2",
		"entitySchemaName": "Activity",
		"filter": {
			"detailColumn": "Lead",
			"masterColumn": "Id"
		}
	}
}/**SCHEMA_DETAILS*/,
			messages: {
				"DistributeButtonChange": {
					mode: Terrasoft.MessageMode.PTP,
					direction: Terrasoft.MessageDirectionType.PUBLISH
				}
			},
			diff: /**SCHEMA_DIFF*/[
	{
		"operation": "insert",
		"name": "DistributePageButton",
		"values": {
			"itemType": 5,
			"caption": {
				"bindTo": "Resources.Strings.DistributeButtonCaption"
			},
			"classes": {
				"textClass": [
					"actions-button-margin-right"
				],
				"wrapperClass": [
					"actions-button-margin-right"
				]
			},
			"menu": {
				"items": {
					"bindTo": "DistributeButtonMenuItems"
				}
			},
			"visible": {
				"bindTo": "DistributeButtonVisible"
			}
		},
		"parentName": "LeftContainer",
		"propertyName": "items",
		"index": 10
	},
	{
		"operation": "merge",
		"name": "QualifyStatus",
		"values": {
			"enabled": true
		}
	},
	{
		"operation": "merge",
		"name": "NeedInfoTabContainer",
		"values": {
			"caption": {
				"bindTo": "Resources.Strings.NeedInfoTabContainerCaption"
			}
		}
	},
	{
		"operation": "insert",
		"name": "ilayLeadState469850e2f1b0",
		"values": {
			"layout": {
				"column": 12,
				"row": 0,
				"colSpan": 12,
				"rowSpan": 1
			},
			"bindTo": "ilayLeadState",
			"caption": {
				"bindTo": "Resources.Strings.ilayLeadStateCaption"
			},
			"textSize": 0,
			"contentType": 3,
			"labelConfig": {
				"visible": true
			},
			"enabled": true
		},
		"parentName": "LeadTypeBlock",
		"propertyName": "items",
		"index": 0
	},
	{
		"operation": "insert",
		"name": "ilayProblem1c040cbca972",
		"values": {
			"layout": {
				"column": 12,
				"row": 1,
				"colSpan": 12,
				"rowSpan": 1
			},
			"bindTo": "ilayProblem",
			"caption": {
				"bindTo": "Resources.Strings.ilayProblemCaption"
			},
			"textSize": 0,
			"contentType": 3,
			"labelConfig": {
				"visible": true
			},
			"enabled": true
		},
		"parentName": "LeadTypeBlock",
		"propertyName": "items",
		"index": 1
	},
	{
		"operation": "insert",
		"name": "ilayMedDirectionb1d46a3f81e0",
		"values": {
			"layout": {
				"column": 0,
				"row": 0,
				"colSpan": 12,
				"rowSpan": 1
			},
			"bindTo": "ilayMedDirection",
			"caption": {
				"bindTo": "Resources.Strings.ilayMedDirectionCaption"
			},
			"textSize": 0,
			"contentType": 3,
			"labelConfig": {
				"visible": true
			},
			"enabled": true
		},
		"parentName": "LeadTypeBlock",
		"propertyName": "items",
		"index": 2
	},
	{
		"operation": "insert",
		"name": "ilayCategory9ace1de09dcf",
		"values": {
			"layout": {
				"column": 0,
				"row": 1,
				"colSpan": 12,
				"rowSpan": 1
			},
			"bindTo": "ilayCategory",
			"caption": {
				"bindTo": "Resources.Strings.ilayCategoryCaption"
			},
			"textSize": 0,
			"contentType": 3,
			"labelConfig": {
				"visible": true
			},
			"enabled": true
		},
		"parentName": "LeadTypeBlock",
		"propertyName": "items",
		"index": 3
	},
	{
		"operation": "merge",
		"name": "LeadTypeStatus",
		"values": {
			"layout": {
				"column": 0,
				"row": 2,
				"colSpan": 12,
				"rowSpan": 1
			},
			"caption": {
				"bindTo": "Resources.Strings.LeadTypeStatusCaption"
			},
			"textSize": "Default",
			"contentType": 3,
			"labelConfig": {
				"visible": true
			},
			"enabled": true
		}
	},
	{
		"operation": "insert",
		"name": "ilayServListInLead",
		"values": {
			"itemType": 2,
			"visible": true
		},
		"parentName": "NeedInfoTabContainer",
		"propertyName": "items",
		"index": 2
	},
	{
		"operation": "merge",
		"name": "LeadMedium",
		"values": {
			"layout": {
				"column": 0,
				"row": 0,
				"colSpan": 12,
				"rowSpan": 1
			}
		}
	},
	{
		"operation": "merge",
		"name": "LeadSource",
		"values": {
			"layout": {
				"column": 0,
				"row": 1,
				"colSpan": 12,
				"rowSpan": 1
			}
		}
	},
	{
		"operation": "merge",
		"name": "WebForm",
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
		"operation": "merge",
		"name": "RegisterMethod",
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
		"operation": "merge",
		"name": "BpmRef",
		"values": {
			"layout": {
				"column": 12,
				"row": 0,
				"colSpan": 12,
				"rowSpan": 1
			}
		}
	},
	{
		"operation": "merge",
		"name": "Campaign",
		"values": {
			"layout": {
				"column": 12,
				"row": 2,
				"colSpan": 12,
				"rowSpan": 1
			}
		}
	},
	{
		"operation": "merge",
		"name": "BulkEmail",
		"values": {
			"layout": {
				"column": 12,
				"row": 3,
				"colSpan": 12,
				"rowSpan": 1
			}
		}
	},
	{
		"operation": "insert",
		"name": "ilayPartner024b2dfe96cc",
		"values": {
			"layout": {
				"column": 0,
				"row": 3,
				"colSpan": 12,
				"rowSpan": 1
			},
			"bindTo": "ilayPartner",
			"caption": {
				"bindTo": "Resources.Strings.ilayPartnerCaption"
			},
			"textSize": 0,
			"contentType": 5,
			"labelConfig": {
				"visible": true
			},
			"enabled": true
		},
		"parentName": "LeadPageSourceInfoBlock",
		"propertyName": "items",
		"index": 7
	},
	{
		"operation": "insert",
		"name": "ilayInsurenceba159c5a06e0",
		"values": {
			"layout": {
				"column": 0,
				"row": 4,
				"colSpan": 12,
				"rowSpan": 1
			},
			"bindTo": "ilayInsurence",
			"caption": {
				"bindTo": "Resources.Strings.ilayInsurenceCaption"
			},
			"textSize": 0,
			"contentType": 5,
			"labelConfig": {
				"visible": true
			},
			"enabled": true
		},
		"parentName": "LeadPageSourceInfoBlock",
		"propertyName": "items",
		"index": 8
	},
	{
		"operation": "insert",
		"name": "ilayCourseba3ec690103e",
		"values": {
			"itemType": 2
		},
		"parentName": "HistoryTab",
		"propertyName": "items",
		"index": 1
	},
	{
		"operation": "insert",
		"name": "group383589a5f0bd",
		"values": {
			"itemType": 15,
			"caption": {
				"bindTo": "Resources.Strings.group383589a5f0bdCaption"
			},
			"items": [],
			"controlConfig": {
				"collapsed": false
			}
		},
		"parentName": "HistoryTab",
		"propertyName": "items",
		"index": 2
	},
	{
		"operation": "insert",
		"name": "group383589a5f0bd_gridLayout",
		"values": {
			"itemType": 0,
			"items": []
		},
		"parentName": "group383589a5f0bd",
		"propertyName": "items",
		"index": 0
	},
	{
		"operation": "insert",
		"name": "ilayVisita28f32b12583",
		"values": {
			"layout": {
				"column": 0,
				"row": 0,
				"colSpan": 12,
				"rowSpan": 1
			},
			"bindTo": "ilayVisit",
			"caption": {
				"bindTo": "Resources.Strings.VisitCaption"
			},
			"textSize": 0,
			"contentType": 5,
			"labelConfig": {
				"visible": true
			},
			"enabled": true
		},
		"parentName": "group383589a5f0bd_gridLayout",
		"propertyName": "items",
		"index": 0
	},
	{
		"operation": "insert",
		"name": "ilayDoctorf00b88b485a7",
		"values": {
			"layout": {
				"column": 12,
				"row": 0,
				"colSpan": 12,
				"rowSpan": 1
			},
			"bindTo": "ilayDoctor",
			"caption": {
				"bindTo": "Resources.Strings.DoctorCaption"
			},
			"textSize": 0,
			"contentType": 5,
			"labelConfig": {
				"visible": true
			},
			"enabled": true
		},
		"parentName": "group383589a5f0bd_gridLayout",
		"propertyName": "items",
		"index": 1
	},
	{
		"operation": "insert",
		"name": "LeadPageV26Tab",
		"values": {
			"items": [],
			"caption": {
				"bindTo": "Resources.Strings.LeadPageV26TabCaption"
			}
		},
		"parentName": "Tabs",
		"propertyName": "tabs",
		"index": 4
	},
	{
		"operation": "insert",
		"name": "group4e365091ed5d",
		"values": {
			"itemType": 15,
			"caption": {
				"bindTo": "Resources.Strings.group4e365091ed5dCaption"
			},
			"items": [],
			"controlConfig": {
				"collapsed": false
			}
		},
		"parentName": "LeadPageV26Tab",
		"propertyName": "items",
		"index": 0
	},
	{
		"operation": "insert",
		"name": "group4e365091ed5d_gridLayout",
		"values": {
			"itemType": 0,
			"items": []
		},
		"parentName": "group4e365091ed5d",
		"propertyName": "items",
		"index": 0
	},
	{
		"operation": "insert",
		"name": "ilayScript1a1a62343940",
		"values": {
			"layout": {
				"column": 0,
				"row": 0,
				"colSpan": 24,
				"rowSpan": 1
			},
			"bindTo": "ilayScript",
			"caption": {
				"bindTo": "Resources.Strings.ilayScriptCaption"
			},
			"textSize": 0,
			"contentType": 5,
			"labelConfig": {
				"visible": true
			},
			"enabled": true
		},
		"parentName": "group4e365091ed5d_gridLayout",
		"propertyName": "items",
		"index": 0
	},
	{
		"operation": "insert",
		"name": "Activity02dbcb08146a",
		"values": {
			"itemType": 2
		},
		"parentName": "LeadPageV26Tab",
		"propertyName": "items",
		"index": 1
	},
	{
		"operation": "remove",
		"name": "LeadProduct"
	}
]/**SCHEMA_DIFF*/,
			attributes: {
				"DistributeButtonMenuItems": {
					dataValueType: Terrasoft.DataValueType.COLLECTION
				},
				//Den>
				"IsAppointVisitButtonVisible": {
					dataValueType: Terrasoft.DataValueType.BOOLEAN,
					dependencies:[
						{
							columns:["QualifiedContact"],
							methodName:"isAppointVisitButtonVisible"
						}
					]
				},
				"IsCreateEMKButtonVisible": {
					dataValueType: Terrasoft.DataValueType.BOOLEAN,
					dependencies:[
						{
							columns:["QualifiedContact"],
							methodName:"isCreateEMKButtonVisible"
						}
					]
				}
				//Den<
			},
			methods: {
				getServListSandboxId: function() {
					return this.sandbox.id + "_detail_ilayServListInLeadilayServList";
				},
				openCardInChain: function(config) {
					if (config && !config.hasOwnProperty("OpenProductSelectionModule")) {
						return this.callParent(arguments);
					}else{
						MaskHelper.ShowBodyMask();
						var params = this.sandbox.publish("GetHistoryState");
						this.sandbox.publish("PushHistoryState", {
							hash: params.hash.historyState,
							silent: true
						});
						this.sandbox.loadModule("ilayServListSelectionModule", {
							renderTo: "centerPanel",
							id: config.moduleId + "_ilayServListSelectionModule",
							keepAlive: true
						});
						return true;
					}
				},
				DistributeButtonVisible: function() {
					if (this.get("LeadType") && this.get("QualifyStatus")){
						if (this.get("LeadType").value == 'e12c4c83-97d3-42c7-b785-17b14179e879' && this.get("QualifyStatus").value == '48088d99-9af1-4122-bdde-4218ca1d7b60'){
							this.sandbox.publish("DistributeButtonChange", true, [this.sandbox.id]);
							return true;
						}
					}
					//Den>
					this.isAppointVisitButtonVisible();
					this.isCreateEMKButtonVisible();
					//Den<
					this.sandbox.publish("DistributeButtonChange", false, [this.sandbox.id]);
					return false;
				},
				getDistributeButtonMenuItems: function() {
					var distributeButtonMenuItems = this.Ext.create("Terrasoft.BaseViewModelCollection");
					distributeButtonMenuItems.addItem(this.getButtonMenuItem({
						Caption: {"bindTo": "DistributeButtonCaption"},
						Type: "Terrasoft.MenuSeparator",
						Visible: true
					}));
					distributeButtonMenuItems.addItem(this.getButtonMenuItem({
						"Caption": {"bindTo": "Resources.Strings.AppointVisitCaption"},
						"Click": {"bindTo": "appointVisitClick"},
						"Visible": {"bindTo": "IsAppointVisitButtonVisible"}//Den
					}));
					//Den>
					distributeButtonMenuItems.addItem(this.getButtonMenuItem({
						"Caption": {"bindTo": "Resources.Strings.CreateEMKCaption"},
						"Click": {"bindTo": "createEMKButtonClick"},
						"Visible": {"bindTo": "IsCreateEMKButtonVisible"}
					}));
					//Den<
					distributeButtonMenuItems.addItem(this.getButtonMenuItem({
						"Caption": {"bindTo": "Resources.Strings.NoNeedCaption"},
						"Click": {"bindTo": "noNeedClick"},
						"Visible": true
					}));
					distributeButtonMenuItems.addItem(this.getButtonMenuItem({
						"Caption": {"bindTo": "Resources.Strings.callbackLaterButtonCaption"},
						"Click": {"bindTo": "callbackLaterButtonClick"},
						"Visible": true
					}));
					this.set("DistributeButtonMenuItems", distributeButtonMenuItems);
					return distributeButtonMenuItems;
				},
				//Den>
				/**
				 * После нажатия кнопки отмена - атрибуты не срабатывают, и не обновляется видимость кнопки.
				 * Обновляем видимости кнопок вручную.
				 */
				discardDetailChange: function() {
					this.callParent(arguments);
					this.isAppointVisitButtonVisible();
					this.isCreateEMKButtonVisible();
				},
				
				isAppointVisitButtonVisible: function() {
					this.set("IsAppointVisitButtonVisible", this.get("QualifiedContact") ? true : false );
				},
				
				isCreateEMKButtonVisible: function() {
					this.set("IsCreateEMKButtonVisible", this.get("QualifiedContact") ? false : true);
				},
				createEMKButtonClick: function() {
					
				},
				//Den<
				appointVisitClick: function() {
					this.loadLookupDisplayValue("QualifyStatus", "2f82e402-1dba-48a0-b4cb-fbe828a1c554");
					var cfg = {
						isSilent: true
					}
					this.save(cfg);
					// + vlad 
					this.swithOwnerToSchedule();
					// - vlad
				},
				// + vlad Переход на расписание, с кэшированием параметров
				swithOwnerToSchedule: function() {
					this.saveCurrentDataIntoStorage();
					this.pushStateIntoActivitySection();
				},
				saveCurrentDataIntoStorage: function(){
					var pkId = this.get("Id");
					var patientId = this.get("QualifiedContact").value || "";
					var cashedDataFromLead = {
						"patientId" : patientId,
						"leadId": pkId
					};
					sessionStorage.setItem("cashedDataFromLead", JSON.stringify(cashedDataFromLead));
				},
				pushStateIntoActivitySection: function(){
					var schedulerHash = "SectionModuleV2/ActivitySectionV2";
					var paramHash = "&isFromLead=true";
					this.sandbox.publish("PushHistoryState", {
						hash: this.Terrasoft.combinePath(schedulerHash, paramHash)
					});
				},
				// - vlad
				
				noNeedClick: function() {
					this.loadLookupDisplayValue("QualifyStatus", "51adc3ec-3503-4b10-a00b-8be3b0e11f08");
					var cfg = {
						isSilent: true
					}
					this.save(cfg);
				},
				callbackLaterButtonClick: function() {
					this.loadLookupDisplayValue("QualifyStatus", "8501579b-0f64-4b31-8ce8-adb8fafc3849");
					var cfg = {
						isSilent: true
					}
					this.save(cfg);
				},
				onEntityInitialized: function() {
					this.callParent(arguments);
					this.getDistributeButtonMenuItems();
					this.DistributeButtonVisible();
				},
				onSaved: function(response, config) {
					this.callParent(arguments);
					this.DistributeButtonVisible();
				}
			},
			rules: {},
			userCode: {}
		};
	}
);
