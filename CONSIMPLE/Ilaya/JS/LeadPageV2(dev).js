define('LeadPageV2', ['LeadPageV2Resources', 'GeneralDetails', 'ilayConfigurationConstants', 'BusinessRuleModule', 'MaskHelper', 'ConfigurationEnums', 'LookupUtilities','ProcessModuleUtilities', 'css!ilayCustomStyles', 'css!UIHelperCSS'],
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
				},
				"CallCustomer": {
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
				"bindTo": "IsDistributeButtonVisible"
			}
		},
		"parentName": "LeftContainer",
		"propertyName": "items",
		"index": 10
	},
				{
		"operation": "merge",
		"name": "LeadType",
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
		"name": "QualifiedContact",
		"values": {
			"layout": {
				"column": 12,
				"row": 0,
				"colSpan": 10,
				"rowSpan": 1
			}
		}
	},
				{
		"operation": "merge",
		"name": "SimilarContactsButton",
		"values": {
			"layout": {
				"column": 22,
				"row": 0,
				"colSpan": 2,
				"rowSpan": 1
			}
		}
	},
				{
		"operation": "merge",
		"name": "QualifiedAccount",
		"values": {
			"layout": {
				"column": 12,
				"row": 1,
				"colSpan": 10,
				"rowSpan": 1
			}
		}
	},
				{
		"operation": "merge",
		"name": "SimilarAccountsButton",
		"values": {
			"layout": {
				"column": 22,
				"row": 1,
				"colSpan": 2,
				"rowSpan": 1
			}
		}
	},
				{
		"operation": "merge",
		"name": "LeadDisqualifyReason",
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
		"operation": "move",
		"name": "LeadDisqualifyReason",
		"parentName": "Header",
		"propertyName": "items",
		"index": 5
	},
				{
		"operation": "merge",
		"name": "CreatedOn",
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
		"operation": "move",
		"name": "CreatedOn",
		"parentName": "Header",
		"propertyName": "items",
		"index": 6
	},
				{
		"operation": "merge",
		"name": "QualifyStatus",
		"values": {
			"layout": {
				"column": 0,
				"row": 2,
				"colSpan": 12,
				"rowSpan": 1
			},
			"enabled": true
		}
	},
				{
		"operation": "insert",
		"name": "ilayLeadType8280cd624df2",
		"values": {
			"layout": {
				"column": 0,
				"row": 3,
				"colSpan": 12,
				"rowSpan": 1
			},
			"bindTo": "ilayLeadType",
			"caption": {
				"bindTo": "Resources.Strings.ilayLeadTypeCaption"
			},
			"enabled": true
		},
		"parentName": "Header",
		"propertyName": "items",
		"index": 8
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
		"index": 3
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
	},
				// + vlad call btn
				
				{
					"operation": "insert",
					"parentName": "Header",
					"propertyName": "items",
					"name": "CallButton",
					"values": {
						"layout": {"column": 12, "row": 2, "colSpan": 1, "rowSpan": 1},
						"itemType": 5,
						"click": {
							"bindTo": "makeCall"
						},
						"hint": {
							"bindTo": "Resources.Strings.CallButtonCaption"
						},
						"imageConfig": {
							"bindTo": "Resources.Images.CallButtonImage"
						},
						"classes": {
							"wrapperClass": "call-btn",
							"imageClass": "call-img"
						},
						"visible": {"bindTo": "CallButtonVisible"}
					}
				},
				{
					"operation": "merge",
					"parentName": "LeadPageRegisterInfoBlock",
					"propertyName": "items",
					"name": "Country",
					"values": {
						"layout": {"column": 13, "row": 2, "colSpan": 11}
					}
				},
				
			]/**SCHEMA_DIFF*/,
			attributes: {
				"DistributeButtonMenuItems": {
					dataValueType: Terrasoft.DataValueType.COLLECTION
				},
				"CallButtonVisible": {
					dataValueType: this.Terrasoft.DataValueType.BOOLEAN,
					type: this.Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN,
					value: false,
					dependencies: [
						{
							columns: ["MobilePhone"],
							methodName: "ilayMainPhoneChanged"
						}
					]
				},
				//Den>
				"IsDistributeButtonVisible": {
					dataValueType: Terrasoft.DataValueType.BOOLEAN,
					dependencies:[
						{
							columns:["LeadType", "QualifyStatus", "QualifiedContact"],
							methodName:"distributeButtonsVisible"
						}
					]
				},
				"IsAppointVisitButtonVisible": {
					dataValueType: Terrasoft.DataValueType.BOOLEAN
				},
				"IsCreateEMKButtonVisible": {
					dataValueType: Terrasoft.DataValueType.BOOLEAN
				},
				"IsCreateEMKButtonClicked": {
					dataValueType: Terrasoft.DataValueType.BOOLEAN,
					value: false
				},
				"IsCallLeadLaterButtonClicked": {
					dataValueType: Terrasoft.DataValueType.BOOLEAN,
					value: false
				},
				"IsNoNeedButtonClicked": {
					dataValueType: Terrasoft.DataValueType.BOOLEAN,
					value: false
				}
				//Den<
			},
			methods: {
				makeCall: function() {
					var number = this.get("MobilePhone");
					var contact = this.get("QualifiedContact").value;
					var entitySchemaName = "Contact";
					var ilayCallLeadId = this.get("Id");
					this.sandbox.publish("CallCustomer", {
						number: number,
						customerId: contact,
						entitySchemaName: entitySchemaName,
						ilayCallLeadId: ilayCallLeadId
					});
				},
				getServListSandboxId: function() {
					return this.sandbox.id + "_detail_ilayServListInLeadilayServList";
				},
				ilayMainPhoneChanged: function() {
					this.set("CallButtonVisible", !!this.get("MobilePhone"));
				},
				tryGetPhone: function() {
					var contact = this.get("QualifiedContact");
					if(!Ext.isEmpty(contact)){
						var select = Ext.create("Terrasoft.EntitySchemaQuery",{
							rootSchemaName: "Contact"
						});
						select.addColumn("ilayMainPhine");
						var filterId = select.createColumnFilterWithParameter(Terrasoft.ComparisonType.EQUAL,
							"Id", contact.value);
						select.filters.add("filterId", filterId);
						select.getEntityCollection(function(result) {
							if (result.success) {
								if (result.collection.getCount()) {
									this.set("MobilePhone", result.collection.getByIndex(0).get("ilayMainPhine"));
								}else{
									this.set("MobilePhone", "");
								}
							}
						}, this);
					}else{
						this.set("MobilePhone", "");
					}
				},
				onQualifiedContactChanged: function() {
					this.callParent(arguments);
					//auto fill phone
					//Den> Чтобы телефон подтягивалсся каждый раз по изменению контакта.
					// if(this.get("MobilePhone") && (this.get("QualifiedContact"))){
					// 	this.set("CallButtonVisible", true);
					// }else{
					this.changeContactName();
						this.tryGetPhone();
					// }
				},
				
				changeContactName: function() {
					var qualifiedContact = this.get("QualifiedContact"),
						contact = this.get("Contact");
					if( contact && qualifiedContact && qualifiedContact.displayValue == contact) return;
					this.set("Contact", qualifiedContact.displayValue);
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
				
				distributeButtonsVisible: function() {
					this.checkDistributeButtonVisible();
					this.checkAppointVisitButtonVisible();
					this.checkCreateEMKButtonVisible();
					var config = {
						IsDistributeButtonVisible: this.get("IsDistributeButtonVisible"),
						IsAppointVisitButtonVisible: this.get("IsAppointVisitButtonVisible"),
						IsCreateEMKButtonVisible: this.get("IsCreateEMKButtonVisible")
					}
					this.sandbox.publish("DistributeButtonChange", config, [this.sandbox.id]);
				},
				
				checkDistributeButtonVisible: function() {
					//Den>
					if (this.get("LeadType") && this.get("QualifyStatus")){
						if (this.get("LeadType").value === "e12c4c83-97d3-42c7-b785-17b14179e879" //Потребность в наших услугах
						&& (this.get("ilayLeadType").value === "4e8bc959-9842-40bb-9c95-3e3503676fd9")//B2C
						&& (this.get("QualifyStatus").value !== "d024f2a3-c95e-442a-a00b-12ffe8436347" //Візит призначено
						&& this.get("QualifyStatus").value !== "51adc3ec-3503-4b10-a00b-8be3b0e11f08")){//Потребность отсутствует
							this.set("IsDistributeButtonVisible", true);
						} else {
							this.set("IsDistributeButtonVisible", false);
						}
					} else {
						this.set("IsDistributeButtonVisible", false);
					}
					//Den<
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
						"Click": {"bindTo": "onCreateEMKButtonClick"},
						"Visible": {"bindTo": "IsCreateEMKButtonVisible"}
					}));
					//Den<
					distributeButtonMenuItems.addItem(this.getButtonMenuItem({
						"Caption": {"bindTo": "Resources.Strings.callbackLaterButtonCaption"},
						"Click": {"bindTo": "callbackLaterButtonClick"},
						"Visible": true
					}));
					distributeButtonMenuItems.addItem(this.getButtonMenuItem({
						"Caption": {"bindTo": "Resources.Strings.NoNeedCaption"},
						"Click": {"bindTo": "noNeedClick"},
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
					this.distributeButtonsVisible();
				},
				
				checkAppointVisitButtonVisible: function() {
					this.set("IsAppointVisitButtonVisible", this.get("QualifiedContact") ? true : false );
				},
				
				checkCreateEMKButtonVisible: function() {
					this.set("IsCreateEMKButtonVisible", this.get("QualifiedContact") ? false : true);
				},
				onCreateEMKButtonClick: function() {
					this.set("IsCreateEMKButtonClicked", true);
					this.save();
				},
				runCreateEMKProcess: function() {
					var leadID = this.getPrimaryColumnValue();
					var processArgs = {
						sysProcessName: 'ilayEMKCreationFromLead',
						parameters: {
							LeadID: leadID
						}
					};
					ProcessModuleUtilities.runProcess(processArgs.sysProcessName, processArgs.parameters, this);
				},
					//Den>[IL-480]
				runCallLeadLaterProcess: function() {
					var leadID = this.get("Id");
					var processArgs = {
						sysProcessName: 'CallLeadLater',
						parameters: {
							LeadID: leadID
						}
					};
					ProcessModuleUtilities.runProcess(processArgs.sysProcessName, processArgs.parameters, this);
				},
				runNoInterestFromLeadProcess: function() {
					var leadID = this.get("Id");
					var processArgs = {
						sysProcessName: 'NoInterestFromLead',
						parameters: {
							LeadId: leadID
						}
					};
					ProcessModuleUtilities.runProcess(processArgs.sysProcessName, processArgs.parameters, this);
				},
					//Den<[IL-480]
				//Den<
				appointVisitClick: function() {
					this.loadLookupDisplayValue("QualifyStatus", "2f82e402-1dba-48a0-b4cb-fbe828a1c554");
					var cfg = {
						isSilent: true,
						goToSchedule: true
					}
					this.save(cfg);
				},
				// + vlad Переход на расписание, с кэшированием параметров
				swithOwnerToSchedule: function() {
					this.saveCurrentDataIntoStorage(function(){
						this.pushStateIntoActivitySection();
					}, this);
				},
				saveCurrentDataIntoStorage: function(callback){
					var pkId = this.get("Id");
					var patientId;
					var medDirectionId = "";
					if(this.model.has("QualifiedContact")){
						patient = this.get("QualifiedContact");
					}
					if(this.model.has("ilayMedDirection")){
						medDirectionId = this.get("ilayMedDirection").value;
					}
					var cashedDataFromLead = {
						"patient" : patient,
						"leadId": pkId,
						"medDirectionId" : medDirectionId
					};
					
					// + vlad [IL-286]
					if(medDirectionId){
						var select = Ext.create("Terrasoft.EntitySchemaQuery", {
							rootSchemaName: 'ilayVisitDuration'
						});
						select.addColumn("ilayDuration");
						var FilterMedDir = select.createColumnFilterWithParameter(Terrasoft.ComparisonType.EQUAL,
							"ilayMedDirection", medDirectionId);
						var FilterCategory = select.createColumnFilterWithParameter(Terrasoft.ComparisonType.EQUAL, 
							"ilayVisitCategory", "D3797437-0648-4C42-BF53-3F0A0155509C");
						select.filters.add("FilterMedDir", FilterMedDir);
						select.filters.add("FilterCategory", FilterCategory);
						select.getEntityCollection(function(result) {
							if (result.success){
								var collection = result.collection;
								if (collection.getCount()){
									cashedDataFromLead.duration = collection.getByIndex(0).get("ilayDuration");
								}
								sessionStorage.setItem("cashedDataFromLead", JSON.stringify(cashedDataFromLead));
								callback.call(this);
							}
						}, this);
					}else{
						sessionStorage.setItem("cashedDataFromLead", JSON.stringify(cashedDataFromLead));
						callback.call(this);
					}
					// - vlad [IL-286]
				},
				pushStateIntoActivitySection: function(){
					var schedulerHash = "SectionModuleV2/ActivitySectionV2";
					var paramHash = "&isFromLead=true";
					MaskHelper.ShowBodyMask();
					this.sandbox.publish("PushHistoryState", {
						hash: this.Terrasoft.combinePath(schedulerHash, paramHash)
					});
				},
				// - vlad
				
				noNeedClick: function() {
					this.set("IsNoNeedButtonClicked", true);
					this.save();
				},
				callbackLaterButtonClick: function() {
					this.set("IsCallLeadLaterButtonClicked", true);
					this.save();
				},
				onEntityInitialized: function() {
					this.callParent(arguments);
					this.getDistributeButtonMenuItems();
					this.distributeButtonsVisible();
					//auto fill phone
					if (this.get("MobilePhone")/* && (this.get("QualifiedContact"))*/) {
						this.set("CallButtonVisible", true);
					} else {
						this.tryGetPhone();
					}
					this.changeContactName();
				},
				onSaved: function(response, config) {
					// + vlad
					if(config && config.goToSchedule){
						this.swithOwnerToSchedule();
					}
					// - vlad
					if(this.get("IsCreateEMKButtonClicked")) {
						this.runCreateEMKProcess();
						this.set("IsCreateEMKButtonClicked", false);
					}
					//Den>[IL-480]
					if(this.get("IsCallLeadLaterButtonClicked")) {
						this.runCallLeadLaterProcess();
						this.set("IsCallLeadLaterButtonClicked", false);
					}
					if(this.get("IsNoNeedButtonClicked")) {
						this.runNoInterestFromLeadProcess();
						this.set("IsNoNeedButtonClicked", false);
					}
					//Den<[IL-480]
					this.callParent(arguments);
					this.distributeButtonsVisible();
				}
			},
			rules: {},
			userCode: {}
		};
	}
);
