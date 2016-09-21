define('ilayActivityType1Page', ['ilayActivityType1PageResources', 'GeneralDetails', 'ilayConfigurationConstants',
	'BusinessRuleModule', 'MaskHelper', 'ConfigurationEnums', 'LookupUtilities', "ProcessModule", "ProcessModuleUtilities",
	'css!ilayScheduleCSS', 'css!ilaySignsCustomCSS', 'css!RecommendationModule', 'css!ilayCustomStyles'],
function(resources, GeneralDetails, ilayConfigurationConstants, BusinessRuleModule, MaskHelper, Enums,
	LookupUtilities, ProcessModule, ProcessModuleUtilities) {
	return {
		entitySchemaName: 'Activity',
		details: /**SCHEMA_DETAILS*/{
			"ilayAccountingDocument": {
				"schemaName": "ilayAccountingDocumentDetailV2",
				"entitySchemaName": "Document",
				"filter": {
					"detailColumn": "ilayVisit",
					"masterColumn": "Id"
				},
				"filterMethod": "accountingDocDetailFilter"
			},
			"ilayDiagnosisInCourse792bdc58653f": {
				"schemaName": "ilaySchema5Detail",
				"entitySchemaName": "ilayDiagnosisInCourse",
				"filter": {
					"detailColumn": "ilayVisitToDoctor",
					"masterColumn": "Id"
				}
			},
			"ActivityParticipanta0629755d0d5": {
				"schemaName": "ActivityParticipantDetailV2",
				"entitySchemaName": "ActivityParticipant",
				"filter": {
					"detailColumn": "Activity",
					"masterColumn": "Id"
				}
			},
			"Activityb48a823d380c": {
				"schemaName": "ActivityDetailV2",
				"entitySchemaName": "Activity",
				"filter": {
					"detailColumn": "ilayMainVisit",
					"masterColumn": "Id"
				}//,"filterMethod": "visitToDoctorType"
			},
			"ilayRecomendDetail": {
				"schemaName": /*"ilaySchema7Detail"*/ "ilayRecomendInVisitDetail",
				"entitySchemaName": "ilayRecomendInMedDoc",
				"filter": {
					"detailColumn": "ilayVisit",
					"masterColumn": "Id"
				},
				"filterMethod" : "ilayRecomendDetailFilter"
			},
			"ilayServListd368df1ad041": {
				"schemaName": "ilayServListDetail",
				"entitySchemaName": "ilayServList",
				"filter": {
					"detailColumn": "ilayVisittoDoctor",
					"masterColumn": "Id"
				},
				"defaultValues": {
					"ilayPatient": {
						"masterColumn": "ilayPatient"
					},
					"ilayCourse": {
						"masterColumn": "ilayCourse"
					},
					"ilayDoctor": {
						"masterColumn": "Owner"
					},
					"ilayPlanDate": {
						"masterColumn": "DueDate"
					},
					"ilayPaymentStatus": {
						"value": "fdbd93d7-752e-494c-a258-f3c159de2148"
					},
					"ilayPerfomStatus": {
						"value": "766aff6d-eca4-4059-9553-a53e93f06015"
					}
				},
				"filterMethod": "serviceListDetailFilter"
			},
			// медичні документи
			"Document5f73f9b3f2c3": {
				"schemaName": "ilayDocumentInServListDetailV2",
				"entitySchemaName": "Document",
				"filter": {
					"detailColumn": "ilayVisit",
					"masterColumn": "Id"
				},
				"filterMethod": "medDocDetailFilter"
			},
			"ilayDiagnosisInCoursec0fa663f691e": {
				"schemaName": "ilaySchema5Detail",
				"entitySchemaName": "ilayDiagnosisInCourse",
				"filter": {
					"detailColumn": "ilayVisitToDoctor",
					"masterColumn": "Id"
				}
			}
		}/**SCHEMA_DETAILS*/,
		diff: /**SCHEMA_DIFF*/[
			{
				"operation": "merge",
				"name": "Lead",
				"values": {
					"layout": { "column": 12, "row": 2, "colSpan": 12 }
				}
			},
			{
				"operation": "merge",
				"parentName": "LeftContainer",
				"propertyName": "items",
				"name": "ChangeQueueItemDateButton",
				"values": {
					"itemType": Terrasoft.ViewItemType.BUTTON,
					"style": Terrasoft.controls.ButtonEnums.style.BLUE,
					"visible": false
				}
			},
			{
				"operation": "insert",
				"name": "ilayRecomendDetail",
				"values": {
					"itemType": 2,
					"visible": {
						"bindTo" : "getRecomendVisibility"
					}
				},
				"parentName": "ilayActivityType1Page3Tab",
				"propertyName": "items",
				"index": 3
			},
			{
				"operation": "insert",
				"name": "ilayAccountingDocument",
				"values": {
					"itemType": 2,
					"visible": {
						"bindTo" : "getFullVisibility"
					}
				},
				"parentName": "ilayActivityType1Page3Tab",
				"propertyName": "items",
				"index": 5
			},
			{
				"operation": "insert",
				"name": "Title",
				"values": {
					"layout": {
						"column": 4,
						"row": 0,
						"colSpan": 20,
						"rowSpan": 1
					},
					"caption": {
						"bindTo": "Resources.Strings.TitleCaption"
					},
					"textSize": "Default",
					"contentType": 1,
					"labelConfig": {
						"visible": true
					},
					"enabled": true
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "ilayPatientb0828f37650a",
				"values": {
					"layout": {
						"column": 4,
						"row": 2,
						"colSpan": 10,
						"rowSpan": 1
					},
					"bindTo": "ilayPatient",
					"caption": {
						"bindTo": "Resources.Strings.ilayPatientCaption"
					},
					"enabled": true
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 1
			},
			{
				"operation": "insert",
				"name": "Status6f075e1af308",
				"values": {
					"layout": {
						"column": 0,
						"row": 0,
						"colSpan": 12,
						"rowSpan": 1
					},
					"bindTo": "Status",
					"caption": {
						"bindTo": "Resources.Strings.StatusCaption"
					},
					"enabled": true,
					"textSize": "Default",
					"contentType": 3,
					"labelConfig": {
						"visible": true
					}
				},
				"parentName": "groupe0379499335c_gridLayout",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "ilayVisitStatus",
				"values": {
					"layout": {
						"column": 12,
						"row": 3,
						"colSpan": 12,
						"rowSpan": 1
					},
					"bindTo": "ilayVisitStatus",
					"caption": {
						"bindTo": "Resources.Strings.ilayVisitStatusCaption"
					},
					"enabled": true
				},
				"parentName": "groupe0379499335c_gridLayout",
				"propertyName": "items",
				"index": 9
			},
			// new diff
			{
				"operation": "insert",
				"name": "ilayMedDirection",
				"values": {
					"layout": {
						"column": 12,
						"row": 0,
						"colSpan": 12,
						"rowSpan": 1
					},
					"bindTo": "ilayMedDirection",
					"caption": {
						"bindTo": "Resources.Strings.ilayMedDirectionCaption"
					},
					"enabled": true,
					"textSize": "Default",
					"contentType": 3,
					"labelConfig": {
						"visible": true
					}
				},
				"parentName": "groupe0379499335c_gridLayout",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "StartDated1fb34a79110",
				"values": {
					"layout": {
						"column": 14,
						"row": 1,
						"colSpan": 10,
						"rowSpan": 1
					},
					"bindTo": "StartDate",
					"caption": {
						"bindTo": "Resources.Strings.StartDateCaption"
					},
					"enabled": true,
					"textSize": "Default",
					"labelConfig": {
						"visible": true
					}
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 4
			},
			{
				"operation": "insert",
				"name": "DueDate5e6487171853",
				"values": {
					"layout": {
						"column": 14,
						"row": 2,
						"colSpan": 10,
						"rowSpan": 1
					},
					"bindTo": "DueDate",
					"caption": {
						"bindTo": "Resources.Strings.DueDateCaption"
					},
					"enabled": true,
					"textSize": "Default",
					"labelConfig": {
						"visible": true
					}
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 5
			},
			{
				"operation": "insert",
				"name": "ActivityCategoryefc24d1c6c46",
				"values": {
					"layout": {
						"column": 4,
						"row": 1,
						"colSpan": 10,
						"rowSpan": 1
					},
					"bindTo": "ActivityCategory",
					"caption": {
						"bindTo": "Resources.Strings.ActivityCategoryCaption"
					},
					"enabled": true
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 6
			},
			{
				"operation": "insert",
				"name": "ilayActivityType1Page3Tab",
				"values": {
					"items": [],
					"caption": {
						"bindTo": "Resources.Strings.ilayActivityType1Page3TabCaption"
					}
				},
				"parentName": "Tabs",
				"propertyName": "tabs",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "CourseGroup",
				"values": {
					"itemType": 15,
					"items": [],
					"controlConfig": {
						"collapsed": false
					},
					"afterrender": { "bindTo": "addEventListenerForCourse" },
					"afterrerender": { "bindTo": "addEventListenerForCourse" }
				},
				"parentName": "ilayActivityType1Page3Tab",
				"propertyName": "items",
				"index": 0
			},
			
			
			{
				"operation": "insert",
				"name": "ilayCoursefbd3e6033381",
				"values": {
					"layout": {
						"column": 0,
						"row": 0,
						"colSpan": 6,
						"rowSpan": 1
					},
					"bindTo": "ilayCourse",
					"caption": {
						"bindTo": "Resources.Strings.ilayCourseCaption"
					},
					"enabled": true,
					"visible": {
						"bindTo": "getCourseVisibility"
					}
				},
				"parentName": "CourseGroup",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "ilayServListd368df1ad041",
				"values": {
					"itemType": 2,
					"visible": {
						"bindTo": "getServiceVisibility"
					}
				},
				"parentName": "ilayActivityType1Page3Tab",
				"propertyName": "items",
				"index": 1
			},
			{
				"operation": "insert",
				"name": "Document5f73f9b3f2c3",
				"values": {
					"itemType": 2,
					"visible": {
						"bindTo": "getMedDocVisibility"
					},
					"enabled": {
						"bindTo": "getMedDocVisibility"
					}
				},
				"parentName": "ilayActivityType1Page3Tab",
				"propertyName": "items",
				"index": 2
			},
			{
				"operation": "insert",
				"name": "ilayDiagnosisInCoursec0fa663f691e",
				"values": {
					"itemType": 2,
					"visible": {
						"bindTo": "getFullVisibility"
					}
				},
				"parentName": "ilayActivityType1Page3Tab",
				"propertyName": "items",
				"index": 4
			},
			{
				"operation": "insert",
				"name": "GeneralInfoTab",
				"values": {
					"caption": {
						"bindTo": "Resources.Strings.GeneralInfoTabCaption"
					},
					"items": []
				},
				"parentName": "Tabs",
				"propertyName": "tabs",
				"index": 2
			},
			{
				"operation": "insert",
				"name": "groupe0379499335c",
				"values": {
					"itemType": 15,
					"caption": {
						"bindTo": "Resources.Strings.groupe0379499335cCaption"
					},
					"items": [],
					"controlConfig": {
						"collapsed": false
					}
				},
				"parentName": "GeneralInfoTab",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "groupe0379499335c_gridLayout",
				"values": {
					"itemType": 0,
					"items": []
				},
				"parentName": "groupe0379499335c",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "Owner42e26cc64814",
				"values": {
					"layout": {
						"column": 0,
						"row": 1,
						"colSpan": 12,
						"rowSpan": 1
					},
					"bindTo": "Owner",
					"caption": {
						"bindTo": "Resources.Strings.OwnerCaption"
					},
					"enabled": true
				},
				"parentName": "groupe0379499335c_gridLayout",
				"propertyName": "items",
				"index": 1
			},
			{
				"operation": "insert",
				"name": "ilayAssistant18ac875ab66d",
				"values": {
					"layout": {
						"column": 12,
						"row": 1,
						"colSpan": 12,
						"rowSpan": 1
					},
					"bindTo": "ilayAssistant",
					"caption": {
						"bindTo": "Resources.Strings.ilayAssistantCaption"
					},
					"enabled": true
				},
				"parentName": "groupe0379499335c_gridLayout",
				"propertyName": "items",
				"index": 2
			},
			{
				"operation": "insert",
				"name": "ilaySession04e210ea4faf",
				"values": {
					"layout": {
						"column": 0,
						"row": 2,
						"colSpan": 12,
						"rowSpan": 1
					},
					"bindTo": "ilaySession",
					"caption": {
						"bindTo": "Resources.Strings.ilaySessionCaption"
					},
					"enabled": true
				},
				"parentName": "groupe0379499335c_gridLayout",
				"propertyName": "items",
				"index": 3
			},
			{
				"operation": "insert",
				"name": "ilayCabinet2d081f922c01",
				"values": {
					"layout": {
						"column": 12,
						"row": 2,
						"colSpan": 12,
						"rowSpan": 1
					},
					"bindTo": "ilayCabinet",
					"caption": {
						"bindTo": "Resources.Strings.ilayCabinetCaption"
					},
					"enabled": true
				},
				"parentName": "groupe0379499335c_gridLayout",
				"propertyName": "items",
				"index": 4
			},
			{
				"operation": "insert",
				"name": "ilayMainVisit87ca4daa7e5a",
				"values": {
					"layout": {
						"column": 0,
						"row": 3,
						"colSpan": 12,
						"rowSpan": 1
					},
					"bindTo": "ilayMainVisit",
					"caption": {
						"bindTo": "Resources.Strings.ilayMainVisitCaption"
					},
					"enabled": true
				},
				"parentName": "groupe0379499335c_gridLayout",
				"propertyName": "items",
				"index": 5
			},
			{
				"operation": "insert",
				"name": "Author4fa51c34fdc2",
				"values": {
					"layout": {
						"column": 0,
						"row": 4,
						"colSpan": 12,
						"rowSpan": 1
					},
					"bindTo": "Author",
					"caption": {
						"bindTo": "Resources.Strings.AuthorCaption"
					},
					"enabled": true
				},
				"parentName": "groupe0379499335c_gridLayout",
				"propertyName": "items",
				"index": 7
			},
			{
				"operation": "insert",
				"name": "CreatedOn",
				"values": {
					"layout": {
						"column": 12,
						"row": 4,
						"colSpan": 12,
						"rowSpan": 1
					},
					"bindTo": "CreatedOn",
					"caption": {
						"bindTo": "Resources.Strings.CreatedOnCaption"
					},
					"enabled": true
				},
				"parentName": "groupe0379499335c_gridLayout",
				"propertyName": "items",
				"index": 8
			},
			{
				"operation": "insert",
				"name": "ActivityParticipanta0629755d0d5",
				"values": {
					"itemType": 2
				},
				"parentName": "GeneralInfoTab",
				"propertyName": "items",
				"index": 1
			},
			{
				"operation": "insert",
				"name": "Activityb48a823d380c",
				"values": {
					"itemType": 2
				},
				"parentName": "GeneralInfoTab",
				"propertyName": "items",
				"index": 2
			},
			{
				"operation": "insert",
				"name": "groupCancel",
				"values": {
					"itemType": 15,
					"caption": {
						"bindTo": "Resources.Strings.groupCancelCaption"
					},
					"items": [],
					"controlConfig": {
						"collapsed": false
					}
				},
				"parentName": "GeneralInfoTab",
				"propertyName": "items",
				"index": 3
			},
			{
				"operation": "insert",
				"name": "groupCancel_gridLayout",
				"values": {
					"itemType": 0,
					"items": []
				},
				"parentName": "groupCancel",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"parentName": "LeftContainer",
				"propertyName": "items",
				"name": "CancelVisitButton",
				"values": {
					"itemType": Terrasoft.ViewItemType.BUTTON,
					"caption": {"bindTo": "Resources.Strings.CancelVisitButtonCaption"},
					"style": Terrasoft.controls.ButtonEnums.style.RED,
					"visible": {"bindTo": "ShowCancelVisitButton"},
					"click": {"bindTo": "onCancelVisitButtonClick"},
					"enabled": true
				},
				"index": 14
			},
			{
				"operation": "insert",
				"parentName": "LeftContainer",
				"propertyName": "items",
				"name": "FinishVisitButton",
				"values": {
					"itemType": Terrasoft.ViewItemType.BUTTON,
					"caption": {"bindTo": "Resources.Strings.FinishVisitButtonCaption"},
					"style": Terrasoft.controls.ButtonEnums.style.GREEN,
					"visible": /*{"bindTo": "ShowFinishVisitButton"}*/ false,
					"click": {"bindTo": "onFinishVisitButtonClick"},
					"enabled": true
				},
				"index": 12
			},
			{
				"operation": "insert",
				"parentName": "LeftContainer",
				"propertyName": "items",
				"name": "MoveVisitButton",
				"values": {
					"itemType": Terrasoft.ViewItemType.BUTTON,
					"caption": {"bindTo": "Resources.Strings.MoveVisitButtonCaption"},
					"style": Terrasoft.controls.ButtonEnums.style.BLUE,
					"classes": {
						"wrapperClass": "ilayActivityType1PageMoveVisitButtonButton-textEl"
					},
					"visible": {"bindTo": "ShowMoveVisitButton"},
					"click": {"bindTo": "onMoveVisitButtonClick"},
					"enabled": true
				},
				"index": 13
			},
			{
				"operation": "insert",
				"parentName": "LeftContainer",
				"propertyName": "items",
				"name": "ConfirmButton",
				"values": {
					"itemType": Terrasoft.ViewItemType.BUTTON,
					"caption": {"bindTo": "Resources.Strings.ConfirmButtonCaption"},
					"style": Terrasoft.controls.ButtonEnums.style.BLUE,
					"classes": {
						"wrapperClass": "ilayActivityType1PageConfirmButtonButton-textEl"
					},
					"visible": {"bindTo": "ShowConfirmButton"}/*true*/,
					"click": {"bindTo": "onConfirmButtonClick"},
					"enabled": true
				},
				"index": 9
			},
			{
				"operation": "insert",
				"parentName": "LeftContainer",
				"propertyName": "items",
				"name": "PacientInHospitalButton",
				"values": {
					"itemType": Terrasoft.ViewItemType.BUTTON,
					"caption": {"bindTo": "Resources.Strings.PacientInHospitalButtonCaption"},
					"style": Terrasoft.controls.ButtonEnums.style.BLUE,
					"classes": {
						"wrapperClass": "ilayActivityType1PagePacientInHospitalButtonButton-textEl"
					},
					"visible": {"bindTo": "ShowPacientInHospitalButton"}/*true*/,
					"click": {"bindTo": "onPacientInHospitalButtonClick"},
					"enabled": true
				},
				"index": 10
			},
			{
				"operation": "insert",
				"parentName": "LeftContainer",
				"propertyName": "items",
				"name": "ReceptionButton",
				"values": {
					"itemType": Terrasoft.ViewItemType.BUTTON,
					"caption": {"bindTo": "Resources.Strings.ReceptionButtonCaption"},
					"style": Terrasoft.controls.ButtonEnums.style.BLUE,
					"classes": {
						"wrapperClass": "ilayActivityType1PageReceptionButtonButton-textEl"
					},
					"visible": {"bindTo": "ShowReceptionButton"}/*true*/,
					"click": {"bindTo": "onReceptionButtonClick"},
					"enabled": true
				},
				"index": 11
			},
			{
				"operation": "insert",
				"name": "ilayReasonCancelVisit",
				"values": {
					"layout": {
						"column": 0,
						"row": 0,
						"colSpan": 12,
						"rowSpan": 1
					},
					"bindTo": "ilayReasonCancelVisit",
					"enabled": true
				},
				"parentName": "groupCancel_gridLayout",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "ilayContactCancelVisit",
				"values": {
					"layout": {
						"column": 12,
						"row": 0,
						"colSpan": 12,
						"rowSpan": 1
					},
					"bindTo": "ilayContactCancelVisit",
					"enabled": true
				},
				"parentName": "groupCancel_gridLayout",
				"propertyName": "items",
				"index": 1
			},
			{
				"operation": "insert",
				"name": "ilayDateCancelVisit",
				"values": {
					"layout": {
						"column": 0,
						"row": 1,
						"colSpan": 12,
						"rowSpan": 1
					},
					"bindTo": "ilayDateCancelVisit",
					"enabled": true
				},
				"parentName": "groupCancel_gridLayout",
				"propertyName": "items",
				"index": 2
			},
			{
				"operation": "insert",
				"name": "SignButtonsContainer",
				"values": {
					"itemType": 7,
					"visible": true,
					"wrapClass": [
						"sign-container"
					],
					"items": []
				},
				"parentName": "HeaderContainer",
				"propertyName": "items",
				"index": 2
			},
			{
				"operation": "insert",
				"name": "SignBtnInsurance",
				"values": {
					"itemType": 5,
					"caption": {
						"bindTo": "sign_insurance"
					},
					"hint": {
						"bindTo": "Resources.Strings.sign_insurance"
					},
					"imageConfig": {
						"bindTo": "Resources.Images.sign_insurance_image"
					},
					"pressed": {
						"bindTo": "ilaySignInsurance"
					},
					"classes": {
						"wrapperClass": "sign-btn",
						"imageClass": "sign-img",
						"pressedClass": "sign-img-pressed"
					},
					"visible": {"bindTo": "ilaySignInsurance"}
				},
				"parentName": "SignButtonsContainer",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "SignBtnVip",
				"values": {
					"itemType": 5,
					"caption": {
						"bindTo": "sign_vip"
					},
					"hint": {
						"bindTo": "Resources.Strings.sign_vip"
					},
					"imageConfig": {
						"bindTo": "Resources.Images.sign_vip_image"
					},
					"click": {
						"bindTo": "onVipButtonClick"
					},
					"pressed": {
						"bindTo": "ilaySignVip"
					},
					"classes": {
						"wrapperClass": "sign-btn",
						"imageClass": "sign-img",
						"pressedClass": "sign-img-pressed"
					},
					"visible": {"bindTo": "ilaySignVip"}
				},
				"parentName": "SignButtonsContainer",
				"propertyName": "items",
				"index": 1
			},
			{
				"operation": "insert",
				"name": "SignBtnPassport",
				"values": {
					"itemType": 5,
					"caption": {
						"bindTo": "sign_passport"
					},
					"hint": {
						"bindTo": "Resources.Strings.sign_passport"
					},
					"imageConfig": {
						"bindTo": "Resources.Images.sign_passport_image"
					},
					"pressed": {
						"bindTo": "ilaySignPassport"
					},
					"classes": {
						"wrapperClass": "sign-btn",
						"imageClass": "sign-img",
						"pressedClass": "sign-img-pressed"
					},
					"visible": {"bindTo": "ilaySignPassport"}
				},
				"parentName": "SignButtonsContainer",
				"propertyName": "items",
				"index": 2
			},
			{
				"operation": "insert",
				"name": "SignBtnAttension",
				"values": {
					"itemType": 5,
					"caption": {
						"bindTo": "sign_attention"
					},
					"hint": {
						"bindTo": "Resources.Strings.sign_attention"
					},
					"imageConfig": {
						"bindTo": "Resources.Images.sign_attention_image"
					},
					"pressed": {
						"bindTo": "ilaySignAttention"
					},
					"classes": {
						"wrapperClass": "sign-btn",
						"imageClass": "sign-img",
						"pressedClass": "sign-img-pressed"
					},
					"visible": {"bindTo": "ilaySignAttention"}
				},
				"parentName": "SignButtonsContainer",
				"propertyName": "items",
				"index": 3
			},
			{
				"operation": "insert",
				"name": "SignBtnToughCase",
				"values": {
					"itemType": 5,
					"caption": {
						"bindTo": "sign_tough_case"
					},
					"hint": {
						"bindTo": "Resources.Strings.sign_tough_case"
					},
					"imageConfig": {
						"bindTo": "Resources.Images.sign_tough_case_image"
					},
					"click": {
						"bindTo": "onToughCaseButtonClick"
					},
					"pressed": {
						"bindTo": "ilaySignToughCase"
					},
					"classes": {
						"wrapperClass": "sign-btn",
						"imageClass": "sign-img",
						"pressedClass": "sign-img-pressed"
					},
					"visible": {"bindTo": "ilaySignToughCase"}
				},
				"parentName": "SignButtonsContainer",
				"propertyName": "items",
				"index": 4
			},
			{
				"operation": "insert",
				"name": "SignBtnDebt",
				"values": {
					"itemType": 5,
					"caption": {
						"bindTo": "sign_debt"
					},
					"hint": {
						"bindTo": "Resources.Strings.sign_debt"
					},
					"imageConfig": {
						"bindTo": "Resources.Images.sign_debt_image"
					},
					"pressed": {
						"bindTo": "ilaySignDebt"
					},
					"classes": {
						"wrapperClass": "sign-btn",
						"imageClass": "sign-img",
						"pressedClass": "sign-img-pressed"
					},
					"visible": {"bindTo": "ilaySignDebt"}
				},
				"parentName": "SignButtonsContainer",
				"propertyName": "items",
				"index": 5
			},
			{
				"operation": "insert",
				"name": "PhotoContainer",
				"values": {
					"itemType": 7,
					"wrapClass": [
						"image-edit-container"
					],
					"layout": {
						"column": 0,
						"row": 0,
						"rowSpan": 3,
						"colSpan": 4
					},
					"items": []
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 6
			},
			{
				"operation": "insert",
				"name": "ilayPhoto",
				"values": {
					"getSrcMethod": "getPhotoImage",
					"readonly": true,
					"defaultImage": Terrasoft.ImageUrlBuilder.getUrl(resources.localizableImages.DefaultPhoto),
					"generator": "ImageCustomGeneratorV2.generateCustomImageControl"
				},
				"parentName": "PhotoContainer",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"parentName": "Section",
				"propertyName": "items",
				"name": "ContinueProcess",
				"values": {
					"itemType": 5,
					"caption": {"bindTo": "Resources.Strings.ContinueProcessButtonCaption"},
					"style": Terrasoft.controls.ButtonEnums.style.GREEN,
					"classes": {
						"wrapperClass": "custom-btn"
					},
					"visible": {"bindTo": "getContinueProcessButtonVisibility"},
					"click": {"bindTo": "beforeContinueProcess"},
					"enabled": true
				}
			}
			/*,
			{
				"operation": "insert",
				"parentName": "CourseGroup",
				"propertyName": "items",
				"name": "testIcon",
				"values": {
					"tag": "testIcon",
					"generator": "ilayRenderHelper.generateMenuItem"
				}
			}
			*/
		]/**SCHEMA_DIFF*/,
		attributes: {
			"CurrentServiceCode": {
				dataValueType: this.Terrasoft.DataValueType.INTEGER,
				value: 2
			},
			
			"ShowReceptionButton": {
				dataValueType: this.Terrasoft.DataValueType.BOOLEAN,
				type: this.Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN
			},

			"ShowPacientInHospitalButton": {
				dataValueType: this.Terrasoft.DataValueType.BOOLEAN,
				type: this.Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN
			},
			
			"ShowConfirmButton": {
				dataValueType: this.Terrasoft.DataValueType.BOOLEAN,
				type: this.Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN
			},
			
			"ShowCancelVisitButton": {
				dataValueType: this.Terrasoft.DataValueType.BOOLEAN,
				type: this.Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN
			},
			"ShowMoveVisitButton": {
				dataValueType: this.Terrasoft.DataValueType.BOOLEAN,
				type: this.Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN
			},
			"ShowFinishVisitButton": {
				dataValueType: this.Terrasoft.DataValueType.BOOLEAN,
				type: this.Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN
			},
			"ilayPatient": {
				dataValueType: Terrasoft.DataValueType.LOOKUP,
				dependencies: [
					{
						columns: ["ilayPatient"],
						methodName: "ilayPatientChanged"
					}
				],
				lookupListConfig: {
					columns: ["ilaySignVip",
						"ilaySignInsurance",
						"ilaySignPassport",
						"ilaySignToughCase",
						"ilaySignAttention",
						"ilaySignDebt"
					],
					filter: function() {
						return Terrasoft.createColumnInFilterWithParameters("Type",
							["e16c5781-245b-43ea-b429-9f554ee392ec"]);
					}
				}
			},
			"ilaySignVip": {
				dataValueType: this.Terrasoft.DataValueType.BOOLEAN,
				type: this.Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN,
				value: false
			},
			"ilaySignInsurance": {
				dataValueType: this.Terrasoft.DataValueType.BOOLEAN,
				type: this.Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN,
				value: false
			},
			"ilaySignPassport": {
				dataValueType: this.Terrasoft.DataValueType.BOOLEAN,
				type: this.Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN,
				value: false
			},
			"ilaySignToughCase": {
				dataValueType: this.Terrasoft.DataValueType.BOOLEAN,
				type: this.Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN,
				value: false
			},
			"ilaySignAttention": {
				dataValueType: this.Terrasoft.DataValueType.BOOLEAN,
				type: this.Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN,
				value: false
			},
			"ilaySignDebt": {
				dataValueType: this.Terrasoft.DataValueType.BOOLEAN,
				type: this.Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN,
				value: false
			},
			"ActivityCategory": {
				dataValueType: Terrasoft.DataValueType.LOOKUP,
				lookupListConfig: {
					columns: ["ActivityType"],
					filter: function() {
						return Terrasoft.createColumnInFilterWithParameters("ActivityType",
							[ilayConfigurationConstants.Activity.Type.VisitToDoctor]);
					}
				}
			},
			
			"ilayCourse": {
				dataValueType: Terrasoft.DataValueType.LOOKUP,
				lookupListConfig: {
					columns: ["ilayCourseStatus.ilayStatusSign"],
					filter: function() {
						var ilayPatient = this.get("ilayPatient");
						var ilayDoctor = this.get("ilayDoctor");
						var filterGroup = new this.Terrasoft.createFilterGroup();
						filterGroup.logicalOperation = this.Terrasoft.LogicalOperatorType.AND;
						filterGroup.add("filter1", this.Terrasoft.createColumnFilterWithParameter(
							this.Terrasoft.ComparisonType.EQUAL, "ilayCourseStatus.ilayStatusSign", false));
						if (ilayPatient != null) {
							filterGroup.add("filter2", this.Terrasoft.createColumnFilterWithParameter(
								this.Terrasoft.ComparisonType.EQUAL, "ilayPatientInCourse", ilayPatient.value));
						}
						if (ilayDoctor != null) {
							filterGroup.add("filter3", this.Terrasoft.createColumnFilterWithParameter(
								this.Terrasoft.ComparisonType.EQUAL, "ilayDoctor", ilayDoctor.value));
						}
						return filterGroup;
					}
				},
				dependencies: [
					{
						columns: ["ilayCourse"],
						methodName: "ilayCourseChanged"
					}
				]
			},
			// + vlad [IL-287]
			"ilaySession": {
				dataValueType: Terrasoft.DataValueType.LOOKUP,
				lookupListConfig: {
					filter: function() {
						var filterGroup = new this.Terrasoft.createFilterGroup();
						var doctor = this.get("Owner");
						if (doctor === "" || doctor === null || doctor === undefined){
							filterGroup.add("impossibruFilter", this.Terrasoft.createColumnFilterWithParameter(
								this.Terrasoft.ComparisonType.EQUAL, "Id", this.Terrasoft.GUID_EMPTY));
							return filterGroup;
						}
						filterGroup.add("typeFilter", this.Terrasoft.createColumnFilterWithParameter(
							this.Terrasoft.ComparisonType.EQUAL, "Type", "AF486E80-BA72-4206-822B-726F972ABF13"));
						filterGroup.add("sessionFilter", this.Terrasoft.createColumnFilterWithParameter(
							this.Terrasoft.ComparisonType.EQUAL, "Owner", doctor.value));
						return filterGroup;
					}
				}
			},
			// - vlad [IL-287]
			
			"ilayVisitStatus": {
				dataValueType: Terrasoft.DataValueType.LOOKUP,
				 dependencies: [
					{
						columns: ["ilayVisitStatus"],
						methodName: "statusChanged"
					}
				],
				lookupListConfig: {
					filter: function() {
						var filterGroup = Ext.create("Terrasoft.FilterGroup");
						filterGroup.add("Type", Terrasoft.createColumnFilterWithParameter(
							Terrasoft.ComparisonType.EQUAL, "[ilayActivityStateEntry:ilayActivityState:Id].ilayActivityType",
							this.get("Type").value));
						return filterGroup;
					}
				}
			},
			"DueDate": {
				dependencies: [
					{
						columns: ["DueDate"],
						methodName: "dueDateChanged"
					}
				]
			},
			// + vlad [IL-286]
			"DurationHandler": {
				dependencies: [
					{
						columns: ["StartDate", "ActivityCategory", "ilayMedDirection"],
						methodName: "calcDurationHandler"
					}
				]
			},
			// - vlad [IL-286]
			
			// + vlad [IL-287]
			// лікар
			"Owner": {
				dataValueType: Terrasoft.DataValueType.LOOKUP,
				lookupListConfig: {
					filters: [
						function() {
							var filterGroup = new this.Terrasoft.createFilterGroup();
							var ilayMedDirection = this.get("ilayMedDirection");
							if(ilayMedDirection === "" || ilayMedDirection === null || ilayMedDirection === undefined) {
								filterGroup.add("impossibruFilter", this.Terrasoft.createColumnFilterWithParameter(
									this.Terrasoft.ComparisonType.EQUAL, "Id", this.Terrasoft.GUID_EMPTY));
								return filterGroup;
							}
							filterGroup.add("doctorInMedDirectionFilter", this.Terrasoft.createColumnFilterWithParameter(
								this.Terrasoft.ComparisonType.EQUAL, "[ilayDoctorsInMedDirect:ilayDoctor].ilayMedicalDirection", ilayMedDirection.value));
							return filterGroup;
						}
					]
				}
			},
			"ilayCabinet": {
				dataValueType: Terrasoft.DataValueType.LOOKUP,
				lookupListConfig: {
					filters: [
						function() {
							var filterGroup = new this.Terrasoft.createFilterGroup();
							var doctor = this.get("Owner");
							if (doctor === "" || doctor === null || doctor === undefined) {
								filterGroup.add("impossibruFilter", this.Terrasoft.createColumnFilterWithParameter(
									this.Terrasoft.ComparisonType.EQUAL, "Id", this.Terrasoft.GUID_EMPTY));
								return filterGroup;
							}
							filterGroup.add("doctorInCabinerFilter", this.Terrasoft.createColumnFilterWithParameter(
								this.Terrasoft.ComparisonType.EQUAL, "[ilayCabinetForDoctor:ilayXCabinet].ilayDoctor", doctor.value));
							return filterGroup;
						}
					]
				}
			},
			"ilayAssistant": {
				dataValueType: Terrasoft.DataValueType.LOOKUP,
				lookupListConfig: {
					filters: [
						function() {
							var filterGroup = new this.Terrasoft.createFilterGroup();
							var session = this.get("ilaySession");
							if(session === "" || session === null || session === undefined){
								var ilayMedDirection = this.get("ilayMedDirection");
								if (ilayMedDirection === "" || ilayMedDirection === null || ilayMedDirection === undefined) {
									filterGroup.add("typeFilter", this.Terrasoft.createColumnFilterWithParameter(
										this.Terrasoft.ComparisonType.EQUAL, "Type", "60733EFC-F36B-1410-A883-16D83CAB0980"));
									return filterGroup;
								}
								filterGroup.add("doctorInMedDirectionFilter", this.Terrasoft.createColumnFilterWithParameter(
									this.Terrasoft.ComparisonType.EQUAL, "[ilayDoctorsInMedDirect:ilayDoctor].ilayMedicalDirection", ilayMedDirection.value));
								return filterGroup;
							}
							filterGroup.add("assistentFilter", this.Terrasoft.createColumnFilterWithParameter(
								this.Terrasoft.ComparisonType.EQUAL, "[Activity:ilayAssistant].Id", session.value));
							return filterGroup;
						}
					]
				}
			}
			// - vlad [IL-287]
		},
		methods: {
			// detail filters + 
			ilayRecomendDetailFilter: function() {
				var filterGroup = new this.Terrasoft.createFilterGroup();
				//check for detail visibility
				if (!(this.getRecomendVisibility())) {
					return filterGroup;
				}
				filterGroup.add("serviceNotNull", this.Terrasoft.createColumnIsNotNullFilter("ilayService"));
				filterGroup.add("statusFilter", this.Terrasoft.createColumnFilterWithParameter(
					this.Terrasoft.ComparisonType.NOT_EQUAL, "ilayStatus", "0CA0F578-B211-4700-9C92-9499BD4FF6B8".toLowerCase()));
				filterGroup.add("visitToDoctorFilter", this.Terrasoft.createColumnFilterWithParameter(
						this.Terrasoft.ComparisonType.EQUAL, "ilayVisit", this.getPrimaryColumnValue()));
				return filterGroup;
			},
			serviceListDetailFilter: function() {
				var filterGroup = new this.Terrasoft.createFilterGroup();
				//check for detail visibility
				if (!(this.getServiceVisibility())) {
					return filterGroup;
				}
				var ilayCourse = this.get("ilayCourse");
				var defaultFilter;
				// if couse doesnt set - show nothing
				if (ilayCourse === null || ilayCourse === undefined || ilayCourse === "") {
					filterGroup.add("visitToDoctorFilter", this.Terrasoft.createColumnFilterWithParameter(
						this.Terrasoft.ComparisonType.EQUAL, "ilayVisittoDoctor", "00000000-0000-0000-0000-000000000000"));
					return filterGroup;
				}
				
				// get current filter values by DOM elements
				var statusFilterElement = document.querySelector('[data-item-marker="StatusFilter"]');
				var isStatusDefault = true;
				if (statusFilterElement !== null) {
					isStatusDefault = (statusFilterElement.textContent === "Всі") ? true : false;
				} else {
					defaultFilter = true;
				}
				var courseFilterElement = document.querySelector('[data-item-marker="CourseFilter"]');
				var isCourseDefault = true;
				if (courseFilterElement !== null) {
					isCourseDefault = (courseFilterElement.textContent === "По візиту") ? true : false;
				} else {
					defaultFilter = true;
				}
				
				var scheduledFilterGroup;
				// updating filters
				if(defaultFilter){
					//default : isStatusDefault = true, isCourseDefault = true
					scheduledFilterGroup = new this.Terrasoft.createFilterGroup();
					scheduledFilterGroup.logicalOperation = this.Terrasoft.LogicalOperatorType.OR;
					scheduledFilterGroup.add("recomendedFilter", this.Terrasoft.createColumnFilterWithParameter(
						this.Terrasoft.ComparisonType.EQUAL, "ilayPerfomStatus", "766AFF6D-ECA4-4059-9553-A53E93F06015"));
					scheduledFilterGroup.add("confirmedFilter", this.Terrasoft.createColumnFilterWithParameter(
						this.Terrasoft.ComparisonType.EQUAL, "ilayPerfomStatus", "D95D8D99-E240-4C02-A894-A31DBBE99A08"));
					filterGroup.add("courseFilter", this.Terrasoft.createColumnFilterWithParameter(
							this.Terrasoft.ComparisonType.EQUAL, "ilayCourse", ilayCourse.value));
					filterGroup.add(scheduledFilterGroup);
					return filterGroup;
				}
				if(isStatusDefault && (!isCourseDefault)){
					// Заплановані, По візиту : isStatusDefault = true, isCourseDefault = false
					scheduledFilterGroup = new this.Terrasoft.createFilterGroup();
					scheduledFilterGroup.logicalOperation = this.Terrasoft.LogicalOperatorType.OR;
					scheduledFilterGroup.add("recomendedFilter", this.Terrasoft.createColumnFilterWithParameter(
						this.Terrasoft.ComparisonType.EQUAL, "ilayPerfomStatus", "766AFF6D-ECA4-4059-9553-A53E93F06015"));
					scheduledFilterGroup.add("confirmedFilter", this.Terrasoft.createColumnFilterWithParameter(
						this.Terrasoft.ComparisonType.EQUAL, "ilayPerfomStatus", "D95D8D99-E240-4C02-A894-A31DBBE99A08"));
					filterGroup.add("visitToDoctorFilter", this.Terrasoft.createColumnFilterWithParameter(
						this.Terrasoft.ComparisonType.EQUAL, "ilayVisittoDoctor", this.getPrimaryColumnValue()));
					filterGroup.add(scheduledFilterGroup);
					this.publishFilterChange("Заплановані по візиту");
				}else if(isStatusDefault && isCourseDefault){
					// same as default
					// Заплановані, По курсу : isStatusDefault = true, isCourseDefault = false
					scheduledFilterGroup = new this.Terrasoft.createFilterGroup();
					scheduledFilterGroup.logicalOperation = this.Terrasoft.LogicalOperatorType.OR;
					scheduledFilterGroup.add("recomendedFilter", this.Terrasoft.createColumnFilterWithParameter(
						this.Terrasoft.ComparisonType.EQUAL, "ilayPerfomStatus", "766AFF6D-ECA4-4059-9553-A53E93F06015"));
					scheduledFilterGroup.add("confirmedFilter", this.Terrasoft.createColumnFilterWithParameter(
						this.Terrasoft.ComparisonType.EQUAL, "ilayPerfomStatus", "D95D8D99-E240-4C02-A894-A31DBBE99A08"));
					filterGroup.add("courseFilter", this.Terrasoft.createColumnFilterWithParameter(
							this.Terrasoft.ComparisonType.EQUAL, "ilayCourse", ilayCourse.value));
					filterGroup.add(scheduledFilterGroup);
					this.publishFilterChange("Заплановані по курсу");
				}else if((!isStatusDefault) && (!isCourseDefault)){
					// Всі, По візиту
					filterGroup.add("visitToDoctorFilter", this.Terrasoft.createColumnFilterWithParameter(
						this.Terrasoft.ComparisonType.EQUAL, "ilayVisittoDoctor", this.getPrimaryColumnValue()));
					this.publishFilterChange("Всі по візиту");
				}else{
					// Всі, По курсу
					filterGroup.add("courseFilter", this.Terrasoft.createColumnFilterWithParameter(
							this.Terrasoft.ComparisonType.EQUAL, "ilayCourse", ilayCourse.value));
					this.publishFilterChange("Всі по курсу");
				}
				return filterGroup;
			},
			medDocDetailFilter: function(){
				var filterGroup = new this.Terrasoft.createFilterGroup();
				filterGroup.add("visitFilter", this.Terrasoft.createColumnFilterWithParameter(
					this.Terrasoft.ComparisonType.EQUAL, "ilayVisit", this.getPrimaryColumnValue()));
				filterGroup.add("typeFilter", this.Terrasoft.createColumnFilterWithParameter(
					this.Terrasoft.ComparisonType.EQUAL, "Type", "2F3F339E-7A37-4772-8C87-C4DFF260B341"));
				return filterGroup;
			},
			accountingDocDetailFilter: function(){
				var filterGroup = new this.Terrasoft.createFilterGroup();
				filterGroup.add("visitFilter", this.Terrasoft.createColumnFilterWithParameter(
					this.Terrasoft.ComparisonType.EQUAL, "ilayVisit", this.getPrimaryColumnValue()));
				filterGroup.add("typeFilter", this.Terrasoft.createColumnFilterWithParameter(
					this.Terrasoft.ComparisonType.EQUAL, "Type", "6CA82292-133E-4788-9E65-55A3C2C1E7BA"));
				return filterGroup;
			},
			// detail filters -
			
			// + [IL-215]
			// При выборе курса пользователь может добавить новый курс на lookupPage.
			// Необходимо чтобы эти добавленные курсы заполнялись полями по умолчанию в зависимости от тек. визита
			addEventListenerForCourse: function() {
				var courseDiv = document.getElementById("ilayActivityType1PageilayCoursefbd3e6033381LookupEdit-right-icon");
				if (courseDiv === null){
					return;
				}
				courseDiv.addEventListener("click", this.setDefaultsIntoStorage.bind(this));
			},
			setDefaultsIntoStorage: function() {
				var patient = (Ext.isEmpty(this.get("ilayPatient")))? undefined : this.get("ilayPatient");
				var doctor = (Ext.isEmpty(this.get("Owner")))? undefined : this.get("Owner");
				var startDate = (Ext.isEmpty(this.get("StartDate")))? undefined : this.get("StartDate");
				var medDirection = (Ext.isEmpty(this.get("ilayMedDirection")))? undefined : this.get("ilayMedDirection");
				var defaultDataFromVisit = {
					"patient" : patient,
					"doctor" : doctor,
					"startDate" : startDate,
					"medDirection" : medDirection
				};
				sessionStorage.setItem("defaultDataFromVisit", JSON.stringify(defaultDataFromVisit));
			},
			ilayCourseChanged: function() {
				this.updateDetails();
				if(Ext.isEmpty(this.get("ilayCourse"))){
					this.continueProcessButtonHandleRender(1); // установим цвет в серый
				}else{
					this.continueProcessButtonHandleRender(2);
				}
			},
			// - [IL-215]
			
			publishFilterChange: function(currFilter){
				this.sandbox.publish("SetCurrentServiceListFilter", currFilter, [this.getServListSandboxId()]);
			},
			getServListSandboxId: function() {
				return this.sandbox.id + "_detail_ilayServListd368df1ad041ilayServList";
			},
			
			//TODO нужна оптимизация
			onDataChange: function() {
				this.callParent(arguments);
				if (this.get("IsEntityInitialized")) {
					this.renderAdvice();
				}
			},
			removeClass: function(elem,value){
				var rspaces = /\s+/;
				var rclass = /[\n\t]/g
				var classNames = (value || "").split( rspaces );
				var className = (" " + elem.className + " ").replace(rclass, " ");
				for ( var c = 0, cl = classNames.length; c < cl; c++ ) {
					className = className.replace(" " + classNames[c] + " ", " ");
				}
				elem.className = className.replace(/^\s+|\s+$/g,'');
			},
			renderAdvice: function(){
				var step = this.get("ilayProcessStep");
				
				//already rendered, quit
				if(document.querySelector("#adviceContainer") !== null){
					return;
				};
				
				if (Ext.isEmpty(step)){
					return;
				}
				if (step.value.toUpperCase() === "EC7E8E2F-5EB1-43C9-BDE3-6C15969345E1"){
					return;
				}
				
				var parentTab = document.getElementById("ilayActivityType1Page3Tab");
				if(parentTab === null){
					return;
				}
				
				var adviceDiv = document.createElement("div");
				var adviceDivId = document.createAttribute("id");
				adviceDivId.value = "adviceContainer";
				adviceDiv.setAttributeNode(adviceDivId);
				adviceDiv.classList.add("recommendation-container");
				var displayingInformationDiv = document.createElement("div");
				
				//advice string
				var adviceLabel = document.createElement("label");
				adviceLabel.classList.add("t-label");
				adviceLabel.classList.add("information");
				adviceLabel.classList.add("recommendation");
				var advice = this.get("ilayAdvice");
				adviceLabel.textContent = advice.displayValue;
				
				//advice img
				var imgSrc = this.Terrasoft.ImageUrlBuilder.getUrl(this.get("Resources.Images.AdviceImg"));
				var DOM_img = document.createElement("img");
				DOM_img.classList.add("advice-img");
				DOM_img.src = imgSrc;
				
				var that = this;
				//start animation
				setInterval(function () {
					that.removeClass(DOM_img, "jump");
					setTimeout(function () {
						DOM_img.classList.add("jump");
					}, 1000);
				}, 10000);
				
				displayingInformationDiv.appendChild(DOM_img);
				displayingInformationDiv.appendChild(adviceLabel);
				adviceDiv.appendChild(displayingInformationDiv);
				parentTab.insertBefore(adviceDiv, parentTab.childNodes[0]);
				
			},
			// + vlad [IL-364]
			beforeContinueProcess: function() {
				var runningProcess = this.get("ilayProcessElementId");
				if(Ext.isEmpty(runningProcess)){
					this.onContinueProcess();
					//this.printLog();
					
				}else{
					this.checkForPendingDocument(runningProcess.value);
				}
			},
			checkForPendingDocument: function(processId) {
				console.log("checkForPendingDocument");
				var pk = this.getPrimaryColumnValue();
				var select = Ext.create("Terrasoft.EntitySchemaQuery",{
					rootSchemaName: "Document"
				});
				var attachedFilter = select.createColumnFilterWithParameter(Terrasoft.ComparisonType.EQUAL,
					"ilayVisit", pk);
				var stateFilter = select.createColumnFilterWithParameter(Terrasoft.ComparisonType.EQUAL,
					"State", "1FCD639A-E581-4E2E-815B-7A7EE341BAC1"); // Підготовка
				select.filters.add("attachedFilter", attachedFilter);
				select.filters.add("stateFilter", stateFilter);
				select.getEntityCollection(function(result){
					if(result.success) {
						if(result.collection.getCount()){
							console.log("finded document");
							this.checkForPendingElement(processId);
						}else{
							this.onContinueProcess();
							//this.printLog();
						}
					}
				}, this);
			},
			checkForPendingElement: function(processId) {
				console.log("checkForPendingElement");
				var select = Ext.create("Terrasoft.EntitySchemaQuery",{
					rootSchemaName: "SysProcessElementLog"
				});
				var processFilter = select.createColumnFilterWithParameter(Terrasoft.ComparisonType.EQUAL,
					"SysProcess", processId);
				var statusFilter = select.createColumnFilterWithParameter(Terrasoft.ComparisonType.EQUAL,
					"Status", "ED2AE277-B6E2-DF11-971B-001D60E938C6"); // Выполняется
				select.filters.add("processFilter", processFilter);
				select.filters.add("statusFilter", statusFilter);
				select.getEntityCollection(function(result){
					if(result.success) {
						if(result.collection.getCount()){
							var elId = result.collection.getByIndex(0).get("Id");
							console.log("selected pending element: " + elId);
							this.onCloseCardButtonClick();
							this.openPendingElement(elId);
						}else{
							this.onContinueProcess();
							//this.printLog();
						}
					}
				}, this);
			},
			openPendingElement: function(elId) {
				console.log("opening pending element: " + elId);
				
				MaskHelper.ShowBodyMask();
				var responseCallback = function() {
					MaskHelper.HideBodyMask();
				};
				ProcessModule.services.callConfigurationServiceMethod("ProcessEngineService/ExecuteProcessElement",
					{procElUId: elId}, responseCallback);
			},
			
			//FOR DEBUG ONLY
			printLog: function() {
				console.log("continue process");
			},
			// - vlad [IL-364]
			onContinueProcess: function() {
				var message = "";
				var buttonsConfig;
				// + vlad [IL-383] // проверка на заполнение курса
				if(Ext.isEmpty(this.get("ilayCourse"))){
					buttonsConfig = {
						buttons: [this.Terrasoft.MessageBoxButtons.OK.returnCode],
						defaultButton: 0
					};
					message = "Жодного курсу не обрано. Оберіть курс для переходу до сервісів";
					this.Terrasoft.utils.showInformation(message, this.Terrasoft.emptyFn, this, buttonsConfig);
					return;
				}
				// - vlad [IL-383] // проверка на заполнение курса
				
				// + vlad [IL-384] обработка поведения кнопки если сейчас шаг выбора сервисов.
				if(this.get("ilayProcessStep").value.toUpperCase() === "221D1E9C-E0BD-4A38-BABF-0ED169F422FD"){
					var code = this.get("CurrentServiceCode");
					if(code === 1){
						buttonsConfig = {
							buttons: [this.Terrasoft.MessageBoxButtons.OK.returnCode],
							defaultButton: 0
						};
						message = "Жодного сервіса не обрано. Оберіть сервіс для виконання";
						this.Terrasoft.utils.showInformation(message, this.Terrasoft.emptyFn, this, buttonsConfig);
					}else if(code === 3){
						buttonsConfig = {
							buttons: [this.Terrasoft.MessageBoxButtons.OK.returnCode],
							defaultButton: 0
						};
						message = "Для виконання обрано більше одного сервіса. Будь-ласка, залиште тільки один сервіс.";
						this.Terrasoft.utils.showInformation(message, this.Terrasoft.emptyFn, this, buttonsConfig);
					}else if(code === 4){
						message = "Перейти до формування актів?";
						this.Terrasoft.utils.showConfirmation(message,
							function(returnCode) {
								if (returnCode === this.Terrasoft.MessageBoxButtons.YES.returnCode) {
									this.invokeProcess();
								}
							},
							[
								this.Terrasoft.MessageBoxButtons.YES.returnCode,
								this.Terrasoft.MessageBoxButtons.NO.returnCode
							],
							this
						);
					}else{
						this.invokeProcess();
					}
				// - vlad [IL-384]
				
				// + vlad [IL-382] обработка поведения кнопки если сейчас шаг рекомендаций.
				}else if(this.get("ilayProcessStep").value.toUpperCase() === "7C77AB3D-03C6-4F42-8CBD-059B50B8C090"){
					var select = Ext.create("Terrasoft.EntitySchemaQuery", {
						rootSchemaName: "ilayRecomendInMedDoc"
					});
					select.addColumn("ilaySelfAssigning");
					select.addColumn("ilayContactCentreAssign");
					select.addColumn("ilayAssignToAnDoctor");
					select.addColumn("ilayAssignToMe");
					var serviceNotNullFilter = select.createColumnIsNotNullFilter("ilayService");
					var statusFilter = select.createColumnFilterWithParameter(this.Terrasoft.ComparisonType.NOT_EQUAL,
						"ilayStatus", "0CA0F578-B211-4700-9C92-9499BD4FF6B8"); // Выполняется
					var visitToDoctorFilter = select.createColumnFilterWithParameter(this.Terrasoft.ComparisonType.EQUAL,
						"ilayVisit", this.getPrimaryColumnValue());
					select.filters.add("serviceNotNullFilter", serviceNotNullFilter);
					select.filters.add("statusFilter", statusFilter);
					select.filters.add("visitToDoctorFilter", visitToDoctorFilter);
					select.getEntityCollection(function(result){
						if(result.success) {
							if(result.collection.getCount()){
								for(var i = 0; i < result.collection.getCount(); i++) {
									if(!result.collection.getByIndex(i).get("ilaySelfAssigning") && 
										!result.collection.getByIndex(i).get("ilayContactCentreAssign") &&
										!result.collection.getByIndex(i).get("ilayAssignToAnDoctor") &&
										!result.collection.getByIndex(i).get("ilayAssignToMe")){
										this.showInformationForRecomend();
									}else{
										this.invokeProcess();
									}
								}
							}else{
								this.invokeProcess();
							}
						}
					}, this);
				//- vlad [IL-382]
				}else{
					this.invokeProcess();
				}
			
			},
			//+ vlad [IL-382]
			showInformationForRecomend: function(){
				buttonsConfig = {
					buttons: [this.Terrasoft.MessageBoxButtons.OK.returnCode],
					defaultButton: 0
				};
				message = "Оберіть спосіб запису пацієнта по кожній рекомендації";
				this.Terrasoft.utils.showInformation(message, this.Terrasoft.emptyFn, this, buttonsConfig);
			},
			//- vlad [IL-382]
			
			invokeProcess: function() {
				this.set("ilayInvokeProcess", true);
				this.save({
					isCustomSilent: false
				});
			},
			
			// регулирует изменение внешнего вида кнопки "Далі"
			//color_code:
			// 1 - GREY
			// 2 - GREEN - default style
			// 3 - RED
			continueProcessButtonHandleRender: function(color_code, value) {
				var el = document.getElementById("ilayActivityType1PageContinueProcessButton-textEl");
				if(Ext.isEmpty(el)){
					return;
				}
				if(color_code === 1){
					el.classList.add("continue-button-grey");
					this.removeClass(el, "continue-button-red");
				}else if(color_code === 3){
					el.classList.add("continue-button-red");
					this.removeClass(el, "continue-button-grey");
				}else{
					this.removeClass(el, "continue-button-grey");
					this.removeClass(el, "continue-button-red");
				}
				if(!Ext.isEmpty(value)){
					el.innerHTML = value;
				}
			},
			
			//binding visibility of page components
			// step = "" - null
			// step.value - guid
			// D26987DA-4F8D-429E-BB08-66744DDD047C - додати сервіси
			// 221D1E9C-E0BD-4A38-BABF-0ED169F422FD - Обрати сервіси
			// 2B929790-1A32-4AF2-B47D-FA5F5AC5A91D - заповнити мед документи
			getContinueProcessButtonVisibility: function(){
				return this.get("ilayIsContinueButtonEnable");
			},
			getCourseVisibility: function() {
				var step = this.get("ilayProcessStep");
				if (step === "" || step === undefined){
					return true;
				}
				if (step.value.toUpperCase() === "2B929790-1A32-4AF2-B47D-FA5F5AC5A91D" || step.value.toUpperCase() === "7C77AB3D-03C6-4F42-8CBD-059B50B8C090"){
					return false;
				}else{
					return true;
				}
			},
			getServiceVisibility: function() {
				var step = this.get("ilayProcessStep");
				if (step === "" || step === undefined){
					return true;
				}
				if (step.value.toUpperCase() === "D26987DA-4F8D-429E-BB08-66744DDD047C" || step.value.toUpperCase() === "2B929790-1A32-4AF2-B47D-FA5F5AC5A91D" || step.value.toUpperCase() === "7C77AB3D-03C6-4F42-8CBD-059B50B8C090"){
					return false;
				}else{
					return true;
				}
			},
			getMedDocVisibility: function() {
				var step = this.get("ilayProcessStep");
				if (step === "" || step === undefined){
					return true;
				}
				if (step.value.toUpperCase() === "D26987DA-4F8D-429E-BB08-66744DDD047C" || step.value.toUpperCase() === "221D1E9C-E0BD-4A38-BABF-0ED169F422FD" || step.value.toUpperCase() === "7C77AB3D-03C6-4F42-8CBD-059B50B8C090"){
					return false;
				}else{
					return true;
				}
			},
			getRecomendVisibility: function() {
				var step = this.get("ilayProcessStep");
				if (step === "" || step === undefined){
					return true;
				}
				if (step.value.toUpperCase() === "7C77AB3D-03C6-4F42-8CBD-059B50B8C090"){
					return true;
				}else{
					return false;
				}
			},
			getFullVisibility: function() {
				var step = this.get("ilayProcessStep");
				if (step === "" || step === undefined){
					return true;
				}
				if (step.value.toUpperCase() === "EC7E8E2F-5EB1-43C9-BDE3-6C15969345E1"){
					return true;
				}else{
					return false;
				}
			},
			deleteReminding: function(next) {
				var deleteQuery = Ext.create('Terrasoft.DeleteQuery', 
					{rootSchemaName: 'Reminding'}
				);
				deleteQuery.filters.add('SubjectId', 
					deleteQuery.createColumnFilterWithParameter(Terrasoft.ComparisonType.EQUAL, 'SubjectId', this.get("Id")));
				deleteQuery.execute(function (response) { 
					if(response.success) {
						next();
					}
				}, this);
			},

			//Den> [IL-193] Візит до лікаря: напоминание о том, что пациент уже в клинике
			//-------------------------------------------------------------------------------
			//Заменен метод insertReminding который ранее добавлял уведомление о конце визита.
			//Теперь метод insertReminding - универсальный метод добавления уведомления.
			//Уведомление о конце визита теперь добавляется в insertEndVisitReminding.
			insertEndVisitReminding: function(next) {
				var dueDate = this.get("DueDate"),
					status = this.get("ilayVisitStatus"),
					doctor = this.get("Owner");
				if(dueDate && dueDate.getTime() > new Date().getTime() && doctor && 
					status && status.value == "6627b0f3-bc5f-44dd-923d-59565b8ceead") {
					var dueDateCopy = Terrasoft.deepClone(dueDate);
					dueDateCopy.setMinutes(dueDateCopy.getMinutes() - 5);
					var dateTimeStr = dueDate.toLocaleString();
					var dateStr = dateTimeStr.substring(0, dateTimeStr.indexOf(','));
					var timeStr = dateTimeStr.substring(dateTimeStr.indexOf(',') + 1, dateTimeStr.length);
					var subjectCaption = "Через 5 хвилин, " + dateStr + " РІ"+ timeStr + " візит буде завершено";
					this.insertReminding(subjectCaption, dueDateCopy, next);
				}
			},

			/**
			* Добавляет напоминание о том, что пациент уже в клинике
			*/
			insertPacientInHospitalReminding: function() {
				var startDate = this.get("StartDate"),
					startDateCopy = Terrasoft.deepClone(startDate),
					currentDate = new Date(),
					startDateTimeString = startDate.toLocaleString(),
					//startDateStr = startDateTimeString.substring(0, startDateTimeString.indexOf(',')),
					startTimeStr = startDateTimeString.substring(startDateTimeString.indexOf(',') + 1, startDateTimeString.length),
					patient = this.get("ilayPatient");
					subjectCaption = '';

				startDateCopy.setMinutes(startDateCopy.getMinutes() - 5)

				if (startDateCopy.getTime() > currentDate.getTime() && patient) {
					subjectCaption = "Через 5 хвилин, о " + startTimeStr + 
						" має бути розпочато візит пацієнта " + patient.displayValue +". Пацієнт вже знаходиться в клініці.";
					this.insertReminding(subjectCaption, startDateCopy);
				} else {
					subjectCaption = "Пацієнт " + patient.displayValue + 
						" вже знаходиться в клініці. Його візит має розпочатись менше ніж через 5 хвилин, о " + startTimeStr + ".";
					currentDate.setMinutes(currentDate.getMinutes() + 1);
					this.insertReminding(subjectCaption, currentDate);
				}
			},

			/**
			* Метод для добавления уведомления.
			* @param {String} Сообщение уведомления.
			* @param {Date} Время уведомления.
			* @param {Function} callback 
			*/
			insertReminding: function(subjectCaption, remindTime, next) {
				var doctor = this.get("Owner");
				var insert = Ext.create('Terrasoft.InsertQuery', {
					rootSchemaName: 'Reminding'
				});
				insert.setParameterValue('NotificationType', "9ee66abe-ec9d-4667-8995-29e8765de2d5", Terrasoft.DataValueType.GUID);
				insert.setParameterValue('SubjectCaption', subjectCaption, Terrasoft.DataValueType.TEXT);
				insert.setParameterValue('SubjectId', this.get("Id"), Terrasoft.DataValueType.GUID);
				insert.setParameterValue('Contact', doctor.value, Terrasoft.DataValueType.GUID);
				insert.setParameterValue('RemindTime', remindTime, Terrasoft.DataValueType.DATE);
				//insert.setParameterValue('TypeCaption', "test", Terrasoft.DataValueType.TEXT);
				insert.setParameterValue('Author', "410006e1-ca4e-4502-a9ec-e54d922d2c00", Terrasoft.DataValueType.GUID);
				insert.setParameterValue('SysEntitySchema', "c449d832-a4cc-4b01-b9d5-8a12c42a9f89", Terrasoft.DataValueType.GUID);
				insert.execute(function(result) {
					if(result.success){
						typeof next === "function" && next();
					}
				}, this);
			},
			//Den< [IL-193]

			createReminding: function() {
				Terrasoft.chain(
					/*function (next) {
						this.deleteReminding(next);
					},*/
					function (next) {
						this.insertEndVisitReminding(next);
					},
				this);
			},
			getPhotoImage: function() {
				var primaryImageColumnValue = this.get("ilayPhoto");
				if(primaryImageColumnValue) {
					return this.getSchemaImageUrl(primaryImageColumnValue);
				}
				return this.Terrasoft.ImageUrlBuilder.getUrl(resources.localizableImages.DefaultPhoto);
			},
			
			syncPhotoOnInit: function() {
				if(this.get("ilayPatient")) {
					var patientId = this.get("ilayPatient").value;
					var select = Ext.create("Terrasoft.EntitySchemaQuery", {
						rootSchemaName: "Contact"
					});
					select.addColumn("Photo");
					var filterId = select.createColumnFilterWithParameter(Terrasoft.ComparisonType.EQUAL, "Id", patientId);
					select.filters.add("filterId", filterId);
					var that = this;
					select.getEntityCollection(function(result){
						if(result.success) {
							var collection = result.collection;
							if(collection.getCount()) {
								var contactPhotoObj = collection.getByIndex(0).get("Photo");
								if(Ext.isEmpty(contactPhotoObj)) {
									return;
								}
								var contactPhotoRef = contactPhotoObj.value;
								if(that.get("ilayPhoto")) {
									var activityPhotoRef = that.get("ilayPhoto").value;
									if(contactPhotoRef !== activityPhotoRef) {
										//need syncing
										that.setPhoto(contactPhotoRef);
									}
								} else {
									that.setPhoto(contactPhotoRef);
								}
							}
						}
					});
				}
			},
			setPhoto: function(photoId) {
				var imageData = {
					value: photoId,
					displayValue: "ilayPhoto"
				};
				this.set("ilayPhoto", imageData);
			},
			ilayPatientChanged: function () {
				var patientObj = this.get("ilayPatient");
				if(Ext.isEmpty(patientObj)){
					this.set("ilayPhoto", null);
					this.unsetSigns();
				} else {
					this.openVisitExist(patientObj.value, function(exist, startDate) {
						if (exist) {
							var buttonsConfig = {
								buttons: [this.Terrasoft.MessageBoxButtons.OK.returnCode],
								defaultButton: 0
							};
							var that = this;
							message = "У пацієнта є незавершений візит. Дата початку візиту: " + startDate.toLocaleString("ru");
							this.Terrasoft.utils.showInformation(message, function() {
								that.set("ilayPatient", null);
								that.unsetSigns();
							}, this, buttonsConfig);
						} else {
							if(patientObj.Photo) {
								this.setPhoto(patientObj.Photo.value);
							} else {
								this.set("ilayPhoto", null);
							}
							this.setSigns(patientObj);
						}
					}, this);
				}
			},
			// проверка на то, существуют ли незакрытые визиты по выбраному пациенту
			// + [IL - 352]
			openVisitExist: function(patientId, callback, scope) {
				var select = Ext.create("Terrasoft.EntitySchemaQuery", {
					rootSchemaName: "Activity"
				});
				select.addColumn("StartDate");
				var patientFilter = select.createColumnFilterWithParameter(Terrasoft.ComparisonType.EQUAL, "ilayPatient", patientId);
				// тип = Візит до лікаря
				var activityTypeFilter = select.createColumnFilterWithParameter(Terrasoft.ComparisonType.EQUAL, "Type", "5EE3B705-CF5C-4AC4-BB61-FFC7A4F485BA");
				// статус = Йде прийом
				var activityStatusFilter = select.createColumnFilterWithParameter(Terrasoft.ComparisonType.EQUAL, "ilayVisitStatus", "6627B0F3-BC5F-44DD-923D-59565B8CEEAD");
				select.filters.add("patientFilter", patientFilter);
				select.filters.add("activityTypeFilter", activityTypeFilter);
				select.filters.add("activityStatusFilter", activityStatusFilter);
				select.getEntityCollection(function(result) {
					if (result.success) {
						var collection = result.collection;
						if (collection.getCount()) {
							var startDate = collection.getByIndex(0).get("StartDate");
							callback.call(scope, true, startDate);
						}
					}
					callback.call(scope, false);
				}, this);
			},
			// - [IL - 352]
			
			handleSigns: function() {
				var patientObj = this.get("ilayPatient");
				if(Ext.isEmpty(patientObj)){
					this.unsetSigns;
				} else {
					this.setSigns(patientObj);
				}
			},
			setSigns: function(val) {
				this.set("ilaySignDebt", val.ilaySignDebt);
				this.set("ilaySignAttention", val.ilaySignAttention);
				this.set("ilaySignPassport", val.ilaySignPassport);
				this.set("ilaySignInsurance", val.ilaySignInsurance);
				this.set("ilaySignToughCase", val.ilaySignToughCase);
				this.set("ilaySignVip", val.ilaySignVip);
			},
			unsetSigns: function(){
				this.set("ilaySignDebt", false);
				this.set("ilaySignAttention", false);
				this.set("ilaySignPassport", false);
				this.set("ilaySignInsurance", false);
				this.set("ilaySignToughCase", false);
				this.set("ilaySignVip", false);
			},
			dueDateChanged: function() {
				var status = this.get("ilayVisitStatus");
				var dueDate = this.get("DueDate");
				if(status && status.value == "a69594d0-3b62-441c-8c61-18b951f6bfed"
					&& dueDate && dueDate.getTime() > new Date().getTime()) {
					this.loadLookupDisplayValue("ilayVisitStatus", "6627b0f3-bc5f-44dd-923d-59565b8ceead");
				}
			},
			onMoveVisitButtonClick: function() {
				
			},
			onSaved: function(response, config) {
				var statusId = this.get("ilayVisitStatus");
				if (config && config.isCustomSilent) {
					this.callParent(arguments);
					if (statusId.value && config.needClose) {
						this.onCloseCardButtonClick();
					}
				} else {
					this.callParent(arguments);
					this.createReminding();
					if (statusId.value && config && config.needClose) {
						this.onCloseCardButtonClick();
					}
				}
			},
			callbackSelectedReason: function(args) {
				if (args && args.selectedRows && args.selectedRows.collection.getCount() > 0) {
					var reasonId = args.selectedRows.collection.keys[0];
					var currContact = Terrasoft.SysValue.CURRENT_USER_CONTACT.value;
					var currDate = new Date();
					this.loadLookupDisplayValue("ilayReasonCancelVisit", reasonId);
					this.loadLookupDisplayValue("ilayContactCancelVisit", currContact);
					this.set("ilayDateCancelVisit", currDate);
					this.set("ShowInScheduler", false);
					this.loadLookupDisplayValue("ilayVisitStatus", "201cfba8-58e6-df11-971b-001d60e938c6");
					var cfg = {
						isCustomSilent: false
					};
					this.save(cfg);
				}
			},
			onConfirmButtonClick: function() {
				this.loadLookupDisplayValue("ilayVisitStatus", "6e1798c3-77e3-467b-93f7-4dcc7e336dfa");
				this.save({
					isCustomSilent: false,
					needClose: true
				});
			},
			onPacientInHospitalButtonClick: function() {
				this.loadLookupDisplayValue("ilayVisitStatus", "46137577-b168-4836-a5e0-0f785885d83c");
				this.insertPacientInHospitalReminding();
				this.save({
					isCustomSilent: false,
					needClose: true
				});
			},
			onReceptionButtonClick: function() {
				this.loadLookupDisplayValue("ilayVisitStatus", "6627b0f3-bc5f-44dd-923d-59565b8ceead");
				this.save({
					isCustomSilent: false
				});
			},
			onCancelVisitButtonClick: function() {
				var scope = this;
				var config = {};
				Terrasoft.utils.showMessage({
					caption: "Ви дійсно бажаєте скасувати візит?",
					buttons: [{
						className: "Terrasoft.Button",
						returnCode: "Yes",
						style: Terrasoft.controls.ButtonEnums.style.GREEN,
						caption: "Так",
						id: "CancelVisitYesButton"
					}, {
						className: "Terrasoft.Button",
						returnCode: "No",
						style: Terrasoft.controls.ButtonEnums.style.GREEN,
						caption: "Ні",
						id: "CancelVisitNoButton"
					}],
					handler: function(buttonCode) {
						if (buttonCode === "No") {
							return;
						}
						if (buttonCode === "Yes") {
							config.entitySchemaName = "ilayReasonCancelVisit";
							config.columns = ["Name"];
							LookupUtilities.Open(scope.sandbox, config, scope.callbackSelectedReason, scope, null, false, false);
						}
					}
				});
			},
			onFinishVisitButtonClick: function () {
				this.loadLookupDisplayValue("ilayVisitStatus", "4BDBB88F-58E6-DF11-971B-001D60E938C6".toLowerCase());
				this.save({
					isCustomSilent: false
				});
			},
			onDiscardChangesClick: function() {
				if (this.isNew) {
					this.sandbox.publish("BackHistoryState");
					return;
				}
				this.set("IsEntityInitialized", false);
				this.loadEntity(this.getPrimaryColumnValue(), function() {
					this.updateButtonsVisibility(false, {
						force: true
					});
					this.initMultiLookup();
					this.set("IsEntityInitialized", true);
					this.discardDetailChange();
					this.statusChanged();
				}, this);
				if (this.get("ForceUpdate")) {
					this.set("ForceUpdate", false);
				}
			},
			initCardActionHandler: function() {
				this.callParent(arguments);
				this.on("change:ShowCancelVisitButton", function(model, value) {
					this.publishPropertyValueToSection("ShowCancelVisitButton", value);
				}, this);
				this.on("change:ShowMoveVisitButton", function(model, value) {
					this.publishPropertyValueToSection("ShowMoveVisitButton", value);
				}, this);
				this.on("change:ShowConfirmButton", function(model, value) {
					this.publishPropertyValueToSection("ShowConfirmButton", value);
				}, this);
				this.on("change:ShowPacientInHospitalButton", function(model, value) {
					this.publishPropertyValueToSection("ShowPacientInHospitalButton", value);
				}, this);
				this.on("change:ShowReceptionButton", function(model, value) {
					this.publishPropertyValueToSection("ShowReceptionButton", value);
				}, this);
				this.on("change:ShowFinishVisitButton", function(model, value) {
					this.publishPropertyValueToSection("ShowFinishVisitButton", value);
				}, this);
			},
			statusChanged: function() {
				/** 
				* id									name
				* 384D4B84-58E6-DF11-971B-001D60E938C6	Не розпочато
				* 394D4B84-58E6-DF11-971B-001D60E938C6	В роботі
				* 4BDBB88F-58E6-DF11-971B-001D60E938C6	Завершено
				* 201CFBA8-58E6-DF11-971B-001D60E938C6	Скасовано
				* 46137577-B168-4836-A5E0-0F785885D83C	Пацієнт в клініці
				* 937FDE8C-2A29-4DB2-A854-C4A0B837966B	Заплановано
				* 6E1798C3-77E3-467B-93F7-4DCC7E336DFA	Підтверджено
				* 129D146E-97A8-4F3B-ABEE-B46F9CB44584	Пацієнт спізнюється
				* A69594D0-3B62-441C-8C61-18B951F6BFED	Прийом затримується
				* 6627B0F3-BC5F-44DD-923D-59565B8CEEAD	Йде прийом
				* DE88D417-5DB5-4393-BD52-60E47046ADA5	Затверджено
				* F4A96655-15DE-4559-B87F-A3F573C276D0	Перенесено
				*/
				if(this.get("ilayVisitStatus")) {
					var status = this.get("ilayVisitStatus").value;
					// «Заплановано», «Підтверджено», «Пацієнт в клініці», «Пацієнт спізнюється», «Йде прийом», (визит уже сохранен)
					if((status === "937fde8c-2a29-4db2-a854-c4a0b837966b" || status === "6e1798c3-77e3-467b-93f7-4dcc7e336dfa" ||
						status === "46137577-b168-4836-a5e0-0f785885d83c" || status === "129d146e-97a8-4f3b-abee-b46f9cb44584" ||
						status === "6627b0f3-bc5f-44dd-923d-59565b8ceead") && !this.isNew) {
						this.set("ShowCancelVisitButton", true);
						this.set("ShowMoveVisitButton", true);
					}else {
						this.set("ShowCancelVisitButton", false);
						this.set("ShowMoveVisitButton", false);
						this.set("ShowFinishVisitButton", false);
					}
					// «Заплановано» , «Пацієнт спізнюється»
					if(status === "937fde8c-2a29-4db2-a854-c4a0b837966b" || status === "129d146e-97a8-4f3b-abee-b46f9cb44584") {
						this.set("ShowConfirmButton", true);
					} else {
						this.set("ShowConfirmButton", false);
						this.set("ShowFinishVisitButton", false);
					}
					// «Підтверджено», «Пацієнт спізнюється»
					if(status === "6e1798c3-77e3-467b-93f7-4dcc7e336dfa" || status === "129d146e-97a8-4f3b-abee-b46f9cb44584") {
						this.set("ShowPacientInHospitalButton", true);
					} else {
						this.set("ShowPacientInHospitalButton", false);
						this.set("ShowFinishVisitButton", false);
					}
					
					// «Пацієнт спізнюється»
					if(status === "46137577-b168-4836-a5e0-0f785885d83c") {
						this.set("ShowReceptionButton", true);
					} else {
						this.set("ShowReceptionButton", false);
						this.set("ShowFinishVisitButton", false);
					}
					
					// «Йде прийом», «Прийом затримується»
					if(status === "6627b0f3-bc5f-44dd-923d-59565b8ceead" || status === "a69594d0-3b62-441c-8c61-18b951f6bfed"){
					//	this.set("ShowFinishVisitButton", true);
					}else{
						this.set("ShowFinishVisitButton", false);
					}
					
					// + 11.07 [IL - 258]
					if(status.toUpperCase() === "4BDBB88F-58E6-DF11-971B-001D60E938C6" ||
						status.toUpperCase() === "201CFBA8-58E6-DF11-971B-001D60E938C6" ||
						status.toUpperCase() === "F4A96655-15DE-4559-B87F-A3F573C276D0"){
							this.publishIntoServListDetail(false);
					}else{
						this.publishIntoServListDetail(true);
					}
					
				}else {
					this.set("ShowCancelVisitButton", false);
					this.set("ShowConfirmButton", false);
					this.set("ShowPacientInHospitalButton", false);
					this.set("ShowReceptionButton", false);
					this.set("ShowFinishVisitButton", false);
				}

			},
			
			publishIntoServListDetail: function(val){
				this.sandbox.publish("ServListDetailButtonVisibilityChange", val, ["ServListDetailAddNewButtonPubSub"]);
			},
			// - 11.07 [IL - 258]
			
			init: function() {
				this.callParent(arguments);
				this.sandbox.subscribe("CustomButtonClick",
					this.onCustomButtonClicked, this,
					[this.sandbox.id]
				);
				this.sandbox.subscribe("FilterButtonClick",
					this.filterButtonClickHandler, this,
					["FilterButtonClick_id"]
				);
				this.sandbox.subscribe("ServiceLoadedIntoActivity",
					this.invokeStatusChange, this,
					["ServiceLoadedIntoActivity_id"]
				);
				this.sandbox.subscribe("SetServiceCodeIntoActivity",
					this.setServiceCode, this,
					["SetServiceCodeIntoActivity_id"]
				);
			},
			setServiceCode: function(code){
				if(this.getServiceVisibility()){
					this.set("CurrentServiceCode", code);
					// 1 - GREY
					// 2 - GREEN
					// 3 - RED
					// 4 - GREEN, change value
					var btnCaption = "Далі";
					var color = code;
					if (code === 4){
						btnCaption = "Сформувати акти";
						color = 2;
					}
					this.continueProcessButtonHandleRender(color, btnCaption);
				}
			},
			
			invokeStatusChange: function(){
				this.statusChanged();
			},
			
			filterButtonClickHandler: function() {
				//console.log("subs recieved");
				this.updateDetails();
			},
			onCustomButtonClicked: function(tag) {
				var action = arguments[0] || arguments[3];
				this[action]();
			},
			
			onEntityInitialized: function() {
				this.callParent(arguments);
				// устанавливает поле ilayPhoto с контакта, для тех случаев, когда активность была автоматически
				// создана с указанным контактом и откривается первый раз (или обновляет если поменялось на контакте).
				this.syncPhotoOnInit();
				this.renderAdvice();
				this.statusChanged();
				this.handleSigns();
				if (this.isNewMode()) {
					this.set("ShowInScheduler", true);
					this.loadLookupDisplayValue("ilayVisitStatus", "937FDE8C-2A29-4DB2-A854-C4A0B837966B");
					this.loadLookupDisplayValue("Status","4BDBB88F-58E6-DF11-971B-001D60E938C6");
					this.loadLookupDisplayValue("ActivityCategory", "D3797437-0648-4C42-BF53-3F0A0155509C");
				}
				var scheduleItemPatient = this.sandbox.publish("GetScheduleItemPatient");
				if (scheduleItemPatient && this.get("IsSeparateMode") && !this.get("IsProcessMode") &&
					this.get("Operation") !== Enums.CardStateV2.ADD &&
					this.get("Operation") !== Enums.CardStateV2.COPY) {
					this.loadLookupDisplayValue("ilayPatient", scheduleItemPatient);
				}
				var scheduleItemTitle = this.sandbox.publish("GetScheduleItemTitle");
				if (scheduleItemTitle && this.get("IsSeparateMode") && !this.get("IsProcessMode") &&
					this.get("Operation") !== Enums.CardStateV2.ADD &&
					this.get("Operation") !== Enums.CardStateV2.COPY) {
					this.set("Title", scheduleItemTitle);
				}
				// + vlad [IL-286]
				if(this.isNew){
					this.calcDurationHandler();
				}
				// - vlad [IL-286]
				if(this.getContinueProcessButtonVisibility()){
					if(Ext.isEmpty(this.get("ilayCourse"))){
						this.continueProcessButtonHandleRender(1);
					}
				}
			},
			// + vlad [IL-286]
			calcDurationHandler: function(){
				var startDate = this.get("StartDate");
				var category  = this.get("ActivityCategory");
				var medDirect = this.get("ilayMedDirection");
				if(Ext.isEmpty(startDate)){
					return;
				}
				// добавляем 30 минут по умолчанию
				var duration = 30;
				if(Ext.isEmpty(category) || Ext.isEmpty(medDirect)){
					this.set("DueDate", new Date(startDate.getTime() + duration*60000));
					return;
				}
				var select = this.Ext.create("Terrasoft.EntitySchemaQuery", {
					rootSchemaName: 'ilayVisitDuration'
				});
				select.addColumn("ilayDuration");
				var filter1 = select.createColumnFilterWithParameter(Terrasoft.ComparisonType.EQUAL, "ilayVisitCategoryId", category.Id);
				var filter2 = select.createColumnFilterWithParameter(Terrasoft.ComparisonType.EQUAL, "ilayMedDirectionId", medDirect.Id);
				
				select.filters.add("filter1", filter1);
				select.filters.add("filter2", filter2);
				select.getEntityCollection(function(result) {
					if (result.success){
						var collection = result.collection;
						if (collection.getCount()){
							duration = collection.getByIndex(0).get("ilayDuration");
						}
						var newDueTime = new Date(startDate.getTime() + duration*60000);
						this.set("DueDate", newDueTime);
					}
				}, this);
			},
			// - vlad [IL-286]
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
			initHeader: function() {
				//if (this.get("IsSeparateMode")) {
					var entityCaption = this.getHeader();
					if(this.get("Owner")) {
						entityCaption += " " + this.get("Owner").displayValue;
					}
					this.sandbox.publish("InitDataViews", {caption: entityCaption});
					this.initContextHelp();
			//	}
			},
			
			asyncValidate: function(callback, scope) {
				this.callParent([function(response) {
					if (!this.validateResponse(response)) {
						return;
					}
					Terrasoft.chain(
						function(next) {
							this.isVisitToDoctorExist(function(response) {
								if (this.validateResponse(response)) {
									next();
								}
							}, this);
						},
						function(next) {
							callback.call(scope, response);
							next();
					}, this);
				}, this]);
			},
			
			getDateWithTimeZone: function(date) {
				Date.prototype.addHours= function(){
					var copiedDate = new Date(date.getTime());
					copiedDate.setHours(copiedDate.getHours() + date.getTimezoneOffset() / 60);
					return copiedDate;
				}
			},
			isVisitToDoctorExist: function(callback, scope) {
				var result = {
					success: true
				};
				if(this.get("StartDate") && this.get("DueDate") && this.get("ilayCabinet") && 
					this.get("Type").value == "5ee3b705-cf5c-4ac4-bb61-ffc7a4f485ba") {
					var todayDate = Ext.Date.clearTime(Terrasoft.deepClone(this.get("StartDate")));
					var todayDateTimeZone = new Date(new Date(todayDate.getTime()).setHours(todayDate.getHours() - todayDate.getTimezoneOffset() / 60));
					var startDateTmp = Terrasoft.deepClone(this.get("StartDate"));
					var tomorrowDate = Ext.Date.clearTime(new Date(startDateTmp.setDate(startDateTmp.getDate() + 1)));
					var tomorrowDateTimeZone = new Date(new Date(tomorrowDate.getTime()).setHours(tomorrowDate.getHours() - tomorrowDate.getTimezoneOffset() / 60));
					var entity = Ext.create("Terrasoft.EntitySchemaQuery", {
						rootSchemaName: "Activity"
					});
					entity.addColumn("Id");
					entity.addColumn("StartDate");
					entity.addColumn("DueDate");
					entity.filters.addItem(entity.createColumnFilterWithParameter(
					this.Terrasoft.ComparisonType.EQUAL, "Type", "5ee3b705-cf5c-4ac4-bb61-ffc7a4f485ba")); // визит к доктору
					entity.filters.addItem(entity.createColumnFilterWithParameter(
					this.Terrasoft.ComparisonType.NOT_EQUAL, "ilayVisitStatus", "201CFBA8-58E6-DF11-971B-001D60E938C6")); // not canceled
					entity.filters.addItem(entity.createColumnFilterWithParameter(
					this.Terrasoft.ComparisonType.NOT_EQUAL, "ilayVisitStatus", "F4A96655-15DE-4559-B87F-A3F573C276D0")); // not moved
					entity.filters.addItem(entity.createColumnFilterWithParameter(
					this.Terrasoft.ComparisonType.GREATER_OR_EQUAL, "StartDate", todayDateTimeZone));
					entity.filters.addItem(entity.createColumnFilterWithParameter(
					this.Terrasoft.ComparisonType.LESS_OR_EQUAL, "StartDate", tomorrowDateTimeZone));
					entity.filters.addItem(entity.createColumnFilterWithParameter(
					this.Terrasoft.ComparisonType.EQUAL, "ilayCabinet", this.get("ilayCabinet").value)); // за текущий кабинет
					entity.filters.addItem(entity.createColumnFilterWithParameter(
					this.Terrasoft.ComparisonType.NOT_EQUAL, "Id", this.get("Id")));
					entity.getEntityCollection(function(result) {
						if (result.success) {
							if(result.collection.getCount() > 0) {
								for(var i = 0; i < result.collection.getCount(); i++) {
									var startDate = result.collection.getByIndex(i).get("StartDate");
									var dueDate = result.collection.getByIndex(i).get("DueDate");
									if((this.get("StartDate").getTime() >= startDate.getTime()  && this.get("StartDate").getTime() < dueDate.getTime()) ||
										(this.get("DueDate").getTime() > startDate.getTime() && this.get("DueDate").getTime() <= dueDate.getTime()) ||
										(this.get("StartDate").getTime() < startDate.getTime() && this.get("DueDate").getTime() > dueDate.getTime())) {
										result.success = false;
										result.message = "На цей час призначено інший Візит до лікаря. Оберіть інший час.";
										callback.call(scope, result);
									}
								}
								callback.call(scope, result);
							}else{
								callback.call(scope, result);
							}
						}else{
							callback.call(scope, result);
						}
					}, this);
				}else{
					callback.call(scope, result);
				}
			}
		},
		rules: {},
		userCode: {},
		messages: {
			"GetScheduleItemPatient": {
				mode: Terrasoft.MessageMode.PTP,
				direction: Terrasoft.MessageDirectionType.PUBLISH
			},
			"GetScheduleItemTitle": {
				mode: Terrasoft.MessageMode.PTP,
				direction: Terrasoft.MessageDirectionType.PUBLISH
			},
			"CustomButtonClick": {
				mode: Terrasoft.MessageMode.PTP,
				direction: Terrasoft.MessageDirectionType.SUBSCRIBE
			},
			"FilterButtonClick": {
				mode: Terrasoft.MessageMode.PTP,
				direction: Terrasoft.MessageDirectionType.SUBSCRIBE
			},
			"SetCurrentServiceListFilter": {
				mode: Terrasoft.MessageMode.PTP,
				direction: Terrasoft.MessageDirectionType.PUBLISH
			},
			"ServListDetailButtonVisibilityChange": {
				mode: Terrasoft.MessageMode.PTP,
				direction: Terrasoft.MessageDirectionType.PUBLISH
			},
			"ServiceLoadedIntoActivity" : {
				mode: Terrasoft.MessageMode.PTP,
				direction: Terrasoft.MessageDirectionType.SUBSCRIBE
			},
			"SetServiceCodeIntoActivity" : {
				mode: Terrasoft.MessageMode.PTP,
				direction: Terrasoft.MessageDirectionType.SUBSCRIBE
			}
		}
	};
});
