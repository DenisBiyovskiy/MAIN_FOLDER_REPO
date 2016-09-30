define(
	'ilayCoursePage', ['ilayCoursePageResources', 'GeneralDetails', 'ilayConfigurationConstants', 'BusinessRuleModule', 'MaskHelper'], 
function(resources, GeneralDetails, ilayConfigurationConstants, BusinessRuleModule, MaskHelper) {
	return {
		entitySchemaName: 'ilayCourse',
		details: /**SCHEMA_DETAILS*/{
	"ilayCoursed7dc914b1116": {
		"schemaName": "ilayCourseDetail",
		"entitySchemaName": "ilayCourse",
		"filter": {
			"detailColumn": "ilayMainCourse",
			"masterColumn": "Id"
		}
	},
	"ilayCourseAnamnesis37a80fe423ee": {
		"schemaName": "ilaySchema4Detail",
		"entitySchemaName": "ilayCourseAnamnesis",
		"filter": {
			"detailColumn": "ilayCourse",
			"masterColumn": "Id"
		}
	},
	"Activityf4e4c69fbcde": {
		"schemaName": "ActivityDetailV2",
		"entitySchemaName": "Activity",
		"filter": {
			"detailColumn": "ActivityConnection",
			"masterColumn": "Id"
		}
	},
	"Activity1b13c741c27d": {
		"schemaName": "ilayActivityType1Detail",
		"entitySchemaName": "Activity",
		"filter": {
			"detailColumn": "ilayCourse",
			"masterColumn": "Id"
		}
	},
	"ilayDiagnosisInCourse90b7ddf660b5": {
		"schemaName": "ilaySchema5Detail",
		"entitySchemaName": "ilayDiagnosisInCourse",
		"filter": {
			"detailColumn": "ilayCourse",
			"masterColumn": "Id"
		}
	},
	"ilayDiagnosisInCoursedcbacc8ef154": {
		"schemaName": "ilaySchema5Detail",
		"entitySchemaName": "ilayDiagnosisInCourse",
		"filter": {
			"detailColumn": "ilayCourse",
			"masterColumn": "Id"
		}
	},
	"ilayServListfc85c6195d45": {
		"schemaName": "ilayServListDetail",
		"entitySchemaName": "ilayServList",
		"filter": {
			"detailColumn": "ilayCourse",
			"masterColumn": "Id"
		},
		"defaultValues": {
			"ilayDoctor": {
				"masterColumn": "ilayDoctor"
			},
			"ilayPaymentStatus": {
				"value": "fdbd93d7-752e-494c-a258-f3c159de2148"
			},
			"ilayPerfomStatus": {
				"value": "766aff6d-eca4-4059-9553-a53e93f06015"
			}
		}
	},
	"Document31e1031147ac": {
		"schemaName": "DocumentDetailV2",
		"entitySchemaName": "Document",
		"filter": {
			"detailColumn": "ilayCourse",
			"masterColumn": "Id"
		}
	}
}/**SCHEMA_DETAILS*/,
		diff: /**SCHEMA_DIFF*/[
	{
		"operation": "insert",
		"name": "ilayName",
		"values": {
			"layout": {
				"column": 0,
				"row": 0,
				"colSpan": 24,
				"rowSpan": 1
			},
			"caption": {
				"bindTo": "Resources.Strings.ilayNameCaption"
			},
			"textSize": "Default",
			"contentType": 1,
			"labelConfig": {
				"visible": true
			},
			"enabled": false
		},
		"parentName": "Header",
		"propertyName": "items",
		"index": 0
	},
	{
		"operation": "insert",
		"name": "ilayCourseTypef02b4df12069",
		"values": {
			"layout": {
				"column": 0,
				"row": 1,
				"colSpan": 12,
				"rowSpan": 1
			},
			"bindTo": "ilayCourseType",
			"caption": {
				"bindTo": "Resources.Strings.ilayCourseTypeCaption"
			},
			"textSize": 0,
			"contentType": 3,
			"labelConfig": {
				"visible": true
			},
			"enabled": true
		},
		"parentName": "Header",
		"propertyName": "items",
		"index": 1
	},
	{
		"operation": "insert",
		"name": "ilayDoctorfc608a68c5b6",
		"values": {
			"layout": {
				"column": 12,
				"row": 1,
				"colSpan": 12,
				"rowSpan": 1
			},
			"bindTo": "ilayDoctor",
			"caption": {
				"bindTo": "Resources.Strings.ilayDoctorCaption"
			},
			"textSize": 0,
			"contentType": 5,
			"labelConfig": {
				"visible": true
			},
			"enabled": true
		},
		"parentName": "Header",
		"propertyName": "items",
		"index": 2
	},
	{
		"operation": "insert",
		"name": "ilayPatientInCourse1af9e3efef55",
		"values": {
			"layout": {
				"column": 12,
				"row": 2,
				"colSpan": 12,
				"rowSpan": 1
			},
			"bindTo": "ilayPatientInCourse",
			"caption": {
				"bindTo": "Resources.Strings.ilayPatientInCourseCaption"
			},
			"textSize": 0,
			"contentType": 5,
			"labelConfig": {
				"visible": true
			},
			"enabled": {
				"bindTo": "isNewCourse"
			}
		},
		"parentName": "Header",
		"propertyName": "items",
		"index": 3
	},
	{
		"operation": "insert",
		"name": "ilayCourseStatus83ceb8ea98ce",
		"values": {
			"layout": {
				"column": 0,
				"row": 2,
				"colSpan": 12,
				"rowSpan": 1
			},
			"bindTo": "ilayCourseStatus",
			"caption": {
				"bindTo": "Resources.Strings.ilayCourseStatusCaption"
			},
			"textSize": 0,
			"contentType": 3,
			"labelConfig": {
				"visible": true
			},
			"enabled": true
		},
		"parentName": "Header",
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
		"index": 0
	},
	{
		"operation": "insert",
		"name": "group60c43ec24add",
		"values": {
			"itemType": 15,
			"caption": {
				"bindTo": "Resources.Strings.group60c43ec24addCaption"
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
		"name": "group60c43ec24add_gridLayout",
		"values": {
			"itemType": 0,
			"items": []
		},
		"parentName": "group60c43ec24add",
		"propertyName": "items",
		"index": 0
	},
	{
		"operation": "insert",
		"name": "ilayStarted7fe9ef9c102f",
		"values": {
			"layout": {
				"column": 0,
				"row": 0,
				"colSpan": 12,
				"rowSpan": 1
			},
			"bindTo": "ilayStarted",
			"caption": {
				"bindTo": "Resources.Strings.ilayStartedCaption"
			},
			"textSize": 0,
			"labelConfig": {
				"visible": true
			},
			"enabled": true
		},
		"parentName": "group60c43ec24add_gridLayout",
		"propertyName": "items",
		"index": 0
	},
	{
		"operation": "insert",
		"name": "ilayPlanFinished70fa93bce5a6",
		"values": {
			"layout": {
				"column": 0,
				"row": 1,
				"colSpan": 12,
				"rowSpan": 1
			},
			"bindTo": "ilayPlanFinished",
			"caption": {
				"bindTo": "Resources.Strings.ilayPlanFinishedCaption"
			},
			"textSize": 0,
			"labelConfig": {
				"visible": true
			},
			"enabled": true
		},
		"parentName": "group60c43ec24add_gridLayout",
		"propertyName": "items",
		"index": 1
	},
	{
		"operation": "insert",
		"name": "ilayActualFinishedf9f8200c6e10",
		"values": {
			"layout": {
				"column": 12,
				"row": 0,
				"colSpan": 12,
				"rowSpan": 1
			},
			"bindTo": "ilayActualFinished",
			"caption": {
				"bindTo": "Resources.Strings.ilayActualFinishedCaption"
			},
			"textSize": 0,
			"labelConfig": {
				"visible": true
			},
			"enabled": true
		},
		"parentName": "group60c43ec24add_gridLayout",
		"propertyName": "items",
		"index": 2
	},
	{
		"operation": "insert",
		"name": "ilayPlanChildBirthe555ff286244",
		"values": {
			"layout": {
				"column": 12,
				"row": 1,
				"colSpan": 12,
				"rowSpan": 1
			},
			"bindTo": "ilayPlanChildBirth",
			"caption": {
				"bindTo": "Resources.Strings.ilayPlanChildBirthCaption"
			},
			"textSize": 0,
			"labelConfig": {
				"visible": true
			},
			"enabled": true
		},
		"parentName": "group60c43ec24add_gridLayout",
		"propertyName": "items",
		"index": 3
	},
	{
		"operation": "insert",
		"name": "groupb7235be152dd",
		"values": {
			"itemType": 15,
			"caption": {
				"bindTo": "Resources.Strings.groupb7235be152ddCaption"
			},
			"items": [],
			"controlConfig": {
				"collapsed": false
			}
		},
		"parentName": "GeneralInfoTab",
		"propertyName": "items",
		"index": 1
	},
	{
		"operation": "insert",
		"name": "groupb7235be152dd_gridLayout",
		"values": {
			"itemType": 0,
			"items": []
		},
		"parentName": "groupb7235be152dd",
		"propertyName": "items",
		"index": 0
	},
	{
		"operation": "insert",
		"name": "ilayMedDirectione71e2bff13a4",
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
			"contentType": 5,
			"labelConfig": {
				"visible": true
			},
			"enabled": {
				"bindTo": "isNewCourse"
			}
		},
		"parentName": "groupb7235be152dd_gridLayout",
		"propertyName": "items",
		"index": 0
	},
	{
		"operation": "insert",
		"name": "ilayCourseDirectiond4f4c3607846",
		"values": {
			"layout": {
				"column": 12,
				"row": 0,
				"colSpan": 12,
				"rowSpan": 1
			},
			"bindTo": "ilayCourseDirection",
			"caption": {
				"bindTo": "Resources.Strings.ilayCourseDirectionCaption"
			},
			"textSize": 0,
			"contentType": 5,
			"labelConfig": {
				"visible": true
			},
			"enabled": {
				"bindTo": "isNewCourse"
			}
		},
		"parentName": "groupb7235be152dd_gridLayout",
		"propertyName": "items",
		"index": 1
	},
	{
		"operation": "insert",
		"name": "ilaySocProjectaacbaaac890d",
		"values": {
			"layout": {
				"column": 0,
				"row": 2,
				"colSpan": 12,
				"rowSpan": 1
			},
			"bindTo": "ilaySocProject",
			"caption": {
				"bindTo": "Resources.Strings.ilaySocProjectCaption"
			},
			"textSize": 0,
			"labelConfig": {
				"visible": true
			},
			"enabled": true
		},
		"parentName": "groupb7235be152dd_gridLayout",
		"propertyName": "items",
		"index": 2
	},
	{
		"operation": "insert",
		"name": "ilayMainCourse69bc56e80198",
		"values": {
			"layout": {
				"column": 12,
				"row": 1,
				"colSpan": 12,
				"rowSpan": 1
			},
			"bindTo": "ilayMainCourse",
			"caption": {
				"bindTo": "Resources.Strings.ilayMainCourseCaption"
			},
			"enabled": true
		},
		"parentName": "groupb7235be152dd_gridLayout",
		"propertyName": "items",
		"index": 3
	},
	{
		"operation": "insert",
		"name": "ilayCategoryfdbc442e81dd",
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
			"contentType": 5,
			"labelConfig": {
				"visible": true
			},
			"enabled": true
		},
		"parentName": "groupb7235be152dd_gridLayout",
		"propertyName": "items",
		"index": 4
	},
	{
		"operation": "insert",
		"name": "ilayLead",
		"values": {
			"layout": {
				"column": 12,
				"row": 2,
				"colSpan": 12,
				"rowSpan": 1
			},
			"bindTo": "ilayLead",
			"caption": {
				"bindTo": "Resources.Strings.ilayLeadCaption"
			},
			"textSize": 0,
			"contentType": 5,
			"labelConfig": {
				"visible": true
			},
			"enabled": true
		},
		"parentName": "groupb7235be152dd_gridLayout",
		"propertyName": "items",
		"index": 5
	},
	{
		"operation": "insert",
		"name": "group7b1674600d94",
		"values": {
			"itemType": 15,
			"caption": {
				"bindTo": "Resources.Strings.group7b1674600d94Caption"
			},
			"items": [],
			"controlConfig": {
				"collapsed": false
			}
		},
		"parentName": "GeneralInfoTab",
		"propertyName": "items",
		"index": 2
	},
	{
		"operation": "insert",
		"name": "group7b1674600d94_gridLayout",
		"values": {
			"itemType": 0,
			"items": []
		},
		"parentName": "group7b1674600d94",
		"propertyName": "items",
		"index": 0
	},
	{
		"operation": "insert",
		"name": "ilayCauseOfClosinged126b70bf79",
		"values": {
			"layout": {
				"column": 0,
				"row": 0,
				"colSpan": 12,
				"rowSpan": 1
			},
			"bindTo": "ilayCauseOfClosing",
			"caption": {
				"bindTo": "Resources.Strings.ilayCauseOfClosingCaption"
			},
			"enabled": true
		},
		"parentName": "group7b1674600d94_gridLayout",
		"propertyName": "items",
		"index": 0
	},
	{
		"operation": "insert",
		"name": "ilayStateCourse3eb4a9471640",
		"values": {
			"layout": {
				"column": 12,
				"row": 0,
				"colSpan": 12,
				"rowSpan": 1
			},
			"bindTo": "ilayStateCourse",
			"caption": {
				"bindTo": "Resources.Strings.ilayStateCourseCaption"
			},
			"textSize": 0,
			"contentType": 5,
			"labelConfig": {
				"visible": true
			},
			"enabled": true
		},
		"parentName": "group7b1674600d94_gridLayout",
		"propertyName": "items",
		"index": 1
	},
	{
		"operation": "insert",
		"name": "ilayStateCommentbe578d6fd157",
		"values": {
			"layout": {
				"column": 0,
				"row": 1,
				"colSpan": 24,
				"rowSpan": 2
			},
			"bindTo": "ilayStateComment",
			"caption": {
				"bindTo": "Resources.Strings.ilayStateCommentCaption"
			},
			"textSize": 0,
			"contentType": 0,
			"labelConfig": {
				"visible": true
			},
			"enabled": true
		},
		"parentName": "group7b1674600d94_gridLayout",
		"propertyName": "items",
		"index": 2
	},
	{
		"operation": "insert",
		"name": "ilayCourseAnamnesis37a80fe423ee",
		"values": {
			"itemType": 2
		},
		"parentName": "GeneralInfoTab",
		"propertyName": "items",
		"index": 3
	},
	{
		"operation": "insert",
		"name": "ilayServListfc85c6195d45",
		"values": {
			"itemType": 2
		},
		"parentName": "GeneralInfoTab",
		"propertyName": "items",
		"index": 4
	},
	{
		"operation": "insert",
		"name": "ilayCoursePage4Tab",
		"values": {
			"items": [],
			"caption": {
				"bindTo": "Resources.Strings.ilayCoursePage4TabCaption"
			}
		},
		"parentName": "Tabs",
		"propertyName": "tabs",
		"index": 1
	},
	{
		"operation": "insert",
		"name": "group7b1e79bed5ba",
		"values": {
			"itemType": 15,
			"caption": {
				"bindTo": "Resources.Strings.group7b1e79bed5baCaption"
			},
			"items": [],
			"controlConfig": {
				"collapsed": false
			}
		},
		"parentName": "ilayCoursePage4Tab",
		"propertyName": "items",
		"index": 0
	},
	{
		"operation": "insert",
		"name": "group7b1e79bed5ba_gridLayout",
		"values": {
			"itemType": 0,
			"items": []
		},
		"parentName": "group7b1e79bed5ba",
		"propertyName": "items",
		"index": 0
	},
	{
		"operation": "insert",
		"name": "ilayTotalCost956dcfa3cf7b",
		"values": {
			"layout": {
				"column": 0,
				"row": 0,
				"colSpan": 12,
				"rowSpan": 1
			},
			"bindTo": "ilayTotalCost",
			"caption": {
				"bindTo": "Resources.Strings.ilayTotalCostCaption"
			},
			"textSize": 0,
			"labelConfig": {
				"visible": true
			},
			"enabled": true
		},
		"parentName": "group7b1e79bed5ba_gridLayout",
		"propertyName": "items",
		"index": 0
	},
	{
		"operation": "insert",
		"name": "ilayActSumm2f13b30f9377",
		"values": {
			"layout": {
				"column": 0,
				"row": 1,
				"colSpan": 12,
				"rowSpan": 1
			},
			"bindTo": "ilayActSumm",
			"caption": {
				"bindTo": "Resources.Strings.ilayActSummCaption"
			},
			"textSize": 0,
			"labelConfig": {
				"visible": true
			},
			"enabled": true
		},
		"parentName": "group7b1e79bed5ba_gridLayout",
		"propertyName": "items",
		"index": 1
	},
	{
		"operation": "insert",
		"name": "ilayPaySummc21b1f4aa3e5",
		"values": {
			"layout": {
				"column": 12,
				"row": 0,
				"colSpan": 12,
				"rowSpan": 1
			},
			"bindTo": "ilayPaySumm",
			"caption": {
				"bindTo": "Resources.Strings.ilayPaySummCaption"
			},
			"textSize": 0,
			"labelConfig": {
				"visible": true
			},
			"enabled": true
		},
		"parentName": "group7b1e79bed5ba_gridLayout",
		"propertyName": "items",
		"index": 2
	},
	{
		"operation": "insert",
		"name": "ilayCourseDebt267ffcc187e1",
		"values": {
			"layout": {
				"column": 12,
				"row": 1,
				"colSpan": 12,
				"rowSpan": 1
			},
			"bindTo": "ilayCourseDebt",
			"caption": {
				"bindTo": "Resources.Strings.ilayCourseDebtCaption"
			},
			"textSize": 0,
			"labelConfig": {
				"visible": true
			},
			"enabled": true
		},
		"parentName": "group7b1e79bed5ba_gridLayout",
		"propertyName": "items",
		"index": 3
	},
	{
		"operation": "insert",
		"name": "Document31e1031147ac",
		"values": {
			"itemType": 2
		},
		"parentName": "ilayCoursePage4Tab",
		"propertyName": "items",
		"index": 1
	},
	{
		"operation": "insert",
		"name": "ilayCoursePage3Tab",
		"values": {
			"items": [],
			"caption": {
				"bindTo": "Resources.Strings.ilayCoursePage3TabCaption"
			}
		},
		"parentName": "Tabs",
		"propertyName": "tabs",
		"index": 2
	},
	{
		"operation": "insert",
		"name": "ilayCoursed7dc914b1116",
		"values": {
			"itemType": 2
		},
		"parentName": "ilayCoursePage3Tab",
		"propertyName": "items",
		"index": 0
	},
	{
		"operation": "insert",
		"name": "Activityf4e4c69fbcde",
		"values": {
			"itemType": 2
		},
		"parentName": "ilayCoursePage3Tab",
		"propertyName": "items",
		"index": 1
	},
	{
		"operation": "insert",
		"name": "Activity1b13c741c27d",
		"values": {
			"itemType": 2
		},
		"parentName": "ilayCoursePage3Tab",
		"propertyName": "items",
		"index": 2
	},
	{
		"operation": "insert",
		"name": "ilayDiagnosisInCoursedcbacc8ef154",
		"values": {
			"itemType": 2
		},
		"parentName": "ilayCoursePage3Tab",
		"propertyName": "items",
		"index": 3
	}
]/**SCHEMA_DIFF*/,
		attributes: {
			"getValuesOfPatientAndMedDirection": {
				dependencies: [{
					columns: ["ilayPatientInCourse", "ilayMedDirection"],
					methodName: "getValuesOfPatientAndMedDirection"
				}]
			},
			
			"insertCourseDirection": {
				dependencies: [{
					columns: ["ilayMedDirection"], 
					methodName: "insertCourseDirection"
				}]
			},
			
			"ilayMedDirection": {
				dataValueType: Terrasoft.DataValueType.LOOKUP,
				lookupListConfig: {
					columns: ["ilayDirection"]
				}
 			}
 			
		},
		methods: {
			
			onEntityInitialized: function() {
				this.callParent(arguments);
				if (this.isNewMode()){
					this.loadLookupDisplayValue("ilayCourseStatus", ilayConfigurationConstants.Course.Status.InPlane); // Запланований
				}
				// + [IL-215]
				// При выборе курса пользователь может добавить новый курс на lookupPage.
				// Необходимо чтобы эти добавленные курсы заполнялись полями по умолчанию в зависимости от тек. визита
				this.getDefaultsFromStorage();
				// + [IL-215]
			},
			
			// Задание названия карточки "Курсы"
			getHeader: function() {
				return this.get("Resources.Strings.ilayaPageCaption");
			},
			
			// Метод, влияющий на видимость поля "Причина закриття"
			getCourseStatus: function() {
				var courseStatus = this.get("ilayCourseStatus");
				var courseType = this.get("ilayCourseType");
				
				if ((courseType != null)
					&& (courseStatus != null)
					&& (courseStatus.value == ilayConfigurationConstants.Course.Status.Closed)) // Закритий
				{
					return true;
				}
				
				return false;
			},
			
			// Метод, влияющий на обязательность поля "Причина закриття"
			getCourseType: function() {
				var courseStatus = this.get("ilayCourseStatus");
				var courseType = this.get("ilayCourseType");
				
				if ((courseType != null)
					&& (courseType.value == ilayConfigurationConstants.Course.Type.Medicative) // Лікувальний
					&& (courseStatus != null)
					&& (courseStatus.value == ilayConfigurationConstants.Course.Status.Closed)) // Закритий
				{
					return true;
				}
				
				return false;
			},
			
			// Метод для генерации названия курса по шаблону 
			getValuesOfPatientAndMedDirection: function() {
				var patientInCourse = this.get("ilayPatientInCourse");
				var medDirection = this.get("ilayMedDirection");
				var countOfCourse = 0;
				
				if ((patientInCourse != null) && (medDirection != null))
				{
					//var patientName = patientInCourse.displayValue.substring(0, patientInCourse.displayValue.indexOf(" "));
					var medDirectionName = medDirection.displayValue;
					
					var esq = this.Ext.create("Terrasoft.EntitySchemaQuery",{
						rootSchemaName: "ilayCourse"
					});
					
					esq.addAggregationSchemaColumn("Id", Terrasoft.AggregationType.COUNT, "CountId", Terrasoft.AggregationEvalType.DISTINCT);
					
					esq.filters.logicalOperation = Terrasoft.LogicalOperatorType.AND;
					
					var esqFilter1 = esq.createColumnFilterWithParameter(Terrasoft.ComparisonType.EQUAL, "ilayPatientInCourse", patientInCourse.value); 
					esq.filters.add("esqFilter1", esqFilter1);
					
					var esqFilter2 = esq.createColumnFilterWithParameter(Terrasoft.ComparisonType.EQUAL, "ilayMedDirection", medDirection.value); 
					esq.filters.add("esqFilter2", esqFilter2);
					
					esq.getEntityCollection(function (result) {
						//Den> 
						//Убрана фамилия пациента из навания курса.
						if (result.success) {
							countOfCourse = result.collection.collection.items[0].values.CountId;
							this.set("ilayName", medDirectionName + "/" + (countOfCourse + 1));
						} else {
							this.set("ilayName", medDirectionName + "/" + 0);
						}
						//Den<
					}, this);
				}
			},
			
			// Метод, необходимый для блокировки полей "Пациент", "Медичний напрямок" и "Напрямок"
			isNewCourse: function() {
				if (this.isNewMode()) {
					return true;
				}
				
				return false
			},
			
			// Заполнение поля "Напрямок" в зависимости от выбранного значения в поле "Медичний напрямок"
			insertCourseDirection: function() {
				var medDirection = this.get("ilayMedDirection");
				if (Ext.isEmpty(medDirection)){
					return;
				}
				if(medDirection.ilayDirection){
					//Den> [IL-406] Ошибка заполнения "Медичного напрямку" при создании курса.
					//Передавали объект medDirection.ilayDirection а ожидается Guid.
					this.loadLookupDisplayValue("ilayCourseDirection", medDirection.ilayDirection.value);
					//Den< [IL-406]
				}else{
					var select = this.Ext.create("Terrasoft.EntitySchemaQuery", {
						rootSchemaName: 'ilayMedicalDirection'
					});
					select.addColumn("ilayDirection");
					var filter = select.createColumnFilterWithParameter(Terrasoft.ComparisonType.EQUAL, "Id", medDirection.Id);
					select.filters.add("filterId", filter);
					select.getEntityCollection(function(result) {
						// берем результаты выборки
						if (result.success){
							var collection = result.collection;
							if (collection.getCount()){
								//Den> [IL-406]
								//this.loadLookupDisplayValue("ilayCourseDirection", collection.getByIndex(0).get("ilayDirection"));
								medDirection.ilayDirection = collection.getByIndex(0).get("ilayDirection");
								medDirection.ilayDirection && this.loadLookupDisplayValue("ilayCourseDirection", medDirection.ilayDirection.value);
								//Den< [IL-406]
							}
						}
					}, this);
				}
				//this.loadLookupDisplayValue("ilayCourseDirection", this.get("ilayMedDirection").ilayDirection.value);
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
			
			// + [IL-215]
			// При выборе курса пользователь может добавить новый курс на lookupPage.
			// Необходимо чтобы эти добавленные курсы заполнялись полями по умолчанию в зависимости от тек. визита
			getDefaultsFromStorage() {
				if (sessionStorage.defaultDataFromVisit === undefined || sessionStorage.defaultDataFromVisit === "undefined"){
					return;
				}
				var defaultDataFromVisit = JSON.parse(sessionStorage.defaultDataFromVisit);
				this.set("ilayPatientInCourse", defaultDataFromVisit.patient);
				this.set("ilayDoctor", defaultDataFromVisit.doctor);
				this.set("ilayMedDirection", defaultDataFromVisit.medDirection);
				this.set("ilayLead", defaultDataFromVisit.lead);//Den
				if (!Ext.isEmpty(defaultDataFromVisit.startDate)){
					this.set("ilayStarted", new Date(defaultDataFromVisit.startDate));
				}
				sessionStorage.setItem("defaultDataFromVisit", undefined);
			}
			// - [IL-215]
		},
		rules: {
			
			"ilayMedDirection": {
				"FiltrationMedDirectionByCourseDirection": {
					ruleType: BusinessRuleModule.enums.RuleType.FILTRATION,
					autocomplete: true,
					autoClean: true,
					baseAttributePatch: "ilayDirection",
					comparisonType: Terrasoft.ComparisonType.EQUAL,
					type: BusinessRuleModule.enums.ValueType.ATTRIBUTE,
					attribute: "ilayCourseDirection"
				}
			}
		},
		userCode: {}
	};
});
