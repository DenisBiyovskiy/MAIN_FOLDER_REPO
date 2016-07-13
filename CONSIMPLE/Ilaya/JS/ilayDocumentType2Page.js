define('ilayDocumentType2Page', ['ilayDocumentType2PageResources', 'GeneralDetails', 'ilayConfigurationConstants', 'css!ilaySpecificationDetailCSS'],
function(resources, GeneralDetails, ilayCConst) {
	return {
		entitySchemaName: 'Document',
		details: /**SCHEMA_DETAILS*/{
			"ilayDiagnosisInCourse4be866a70f8b": {
				"schemaName": "ilaySchema5Detail",
				"entitySchemaName": "ilayDiagnosisInCourse",
				"filter": {
					"detailColumn": "ilayVisitToDoctor",
					"masterColumn": "ilayVisit" 
				},
				"filterMethod": "DiagnosisInCourseFilters",
				"defaultValues": {
					"ilayPatient": {
						"masterColumn": "ilayPatient"
					},
					"ilayCourse": {
						"masterColumn": "ilayCourse"
					},
					"ilayVisitToDoctor": {
						"masterColumn": "ilayVisit"
					}
				},
				subscriber: function(cfg) {
					if (cfg && cfg.rows && (cfg.action == "edit")) {
						this.copyRecomendation(cfg.rows);
					}
				}
			},
			"ilayRecomendInMedDocExaminationDetail": {
				"schemaName": "ilayRecomendInMedDocExaminationDetailV2",
				"entitySchemaName": "ilayRecomendInMedDoc",
				"filter": {
					"detailColumn": "ilayVisit",
					"masterColumn": "ilayVisit"
				},
				"filterMethod": "RecomendInMedDocExamination",
				"defaultValues": {
					"ilayRecomendType": {
						"value": "82c93b9b-4e2c-48f8-a4b5-f524c9384e7e"
					}
				}
			},
			"ilayRecomendInMedDocHealthingDetail": {
				"schemaName": "ilayRecomendInMedDocHealthingDetailV2",
				"entitySchemaName": "ilayRecomendInMedDoc",
				"filter": {
					"detailColumn": "ilayVisit",
					"masterColumn": "ilayVisit"
				},
				"filterMethod": "RecomendInMedDocHealthing",
				"defaultValues": {
					"ilayRecomendType": {
						"value": "158b6326-0aed-43fd-aa7f-4e1069d756e8"
					}
				}
			},
			"ilayRecomendInMedDocOtherDetail": {
				"schemaName": "ilayRecomendInMedDocOtherDetailV2",
				"entitySchemaName": "ilayRecomendInMedDoc",
				"filter": {
					"detailColumn": "ilayMedDocument",
					"masterColumn": "ilayVisit"
				},
				"filterMethod": "RecomendInMedDocOther",
				"defaultValues": {
					"ilayRecomendType": {
						"value": "93368f47-8d7d-4de4-a54f-9a65d67cbe0d"
					}
				}
			},
			"ilayMedDocSpecificDetailV2": {
				"schemaName": "ilayMedDocSpecificDetailV2",
				"entitySchemaName": "ilayMedDocSpecific",
				"filter": {
					"detailColumn": "ilayMedDoc",
					"masterColumn": "Id"
				},
				subscriber: function(cfg) {
					if (cfg && cfg.rows && (cfg.action == "edit")) {
						this.onMedDocSpecEdit(cfg.rows);
					}
				}
			},
		}/**SCHEMA_DETAILS*/,
		messages: {
			/**
			 * @message ServButtVisible
			 * Сделать видимой кнопку "Скасувати"
			 */
			"ServButtVisible": {
				mode: Terrasoft.MessageMode.PTP,
				direction: Terrasoft.MessageDirectionType.PUBLISH
			}
		},
		diff: /**SCHEMA_DIFF*/[
	{
		"operation": "insert",
		"name": "ilayModelName2dd1768d46f6",
		"values": {
			"layout": {
				"column": 0,
				"row": 0,
				"colSpan": 12,
				"rowSpan": 1
			},
			"bindTo": "ilayModelName",
			"caption": {
				"bindTo": "Resources.Strings.ilayModelNameCaption"
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
		"index": 0
	},
	{
		"operation": "insert",
		"name": "ilayDocumentType2Page5Tab",
		"values": {
			"items": [],
			"caption": {
				"bindTo": "Resources.Strings.ilayDocumentType2Page5TabCaption"
			}
		},
		"parentName": "Tabs",
		"propertyName": "tabs",
		"index": 0
	},
	{
		"operation": "insert",
		"name": "ilayMedDocSpecificDetailV2",
		"values": {
			"itemType": 2
		},
		"parentName": "ilayDocumentType2Page5Tab",
		"propertyName": "items",
		"index": 0
	},
	{
		"operation": "insert",
		"name": "ilayDiagnosisInCourse4be866a70f8b",
		"values": {
			"itemType": 2
		},
		"parentName": "ilayDocumentType2Page5Tab",
		"propertyName": "items",
		"index": 1
	},
	{
		"operation": "insert",
		"name": "ilayRecomendInMedDocExaminationDetail",
		"values": {
			"itemType": 2
		},
		"parentName": "ilayDocumentType2Page5Tab",
		"propertyName": "items",
		"index": 2
	},
	{
		"operation": "insert",
		"name": "ilayRecomendInMedDocHealthingDetail",
		"values": {
			"itemType": 2
		},
		"parentName": "ilayDocumentType2Page5Tab",
		"propertyName": "items",
		"index": 3
	},
	{
		"operation": "insert",
		"name": "ilayRecomendInMedDocOtherDetail",
		"values": {
			"itemType": 2
		},
		"parentName": "ilayDocumentType2Page5Tab",
		"propertyName": "items",
		"index": 4
	},
	{
		"operation": "merge",
		"name": "GeneralInfoTabContainer",
		"values": {
			"caption": {
				"bindTo": "Resources.Strings.GeneralInfoTabContainerCaption"
			}
		}
	},
	{
		"operation": "insert",
		"name": "groupc8cdebeb88da",
		"values": {
			"itemType": 15,
			"caption": {
				"bindTo": "Resources.Strings.groupc8cdebeb88daCaption"
			},
			"items": [],
			"controlConfig": {
				"collapsed": false
			}
		},
		"parentName": "GeneralInfoTabContainer",
		"propertyName": "items",
		"index": 0
	},
	{
		"operation": "insert",
		"name": "groupc8cdebeb88da_gridLayout",
		"values": {
			"itemType": 0,
			"items": []
		},
		"parentName": "groupc8cdebeb88da",
		"propertyName": "items",
		"index": 0
	},
	{
		"operation": "insert",
		"name": "Date1d2eb2f484f3",
		"values": {
			"layout": {
				"column": 0,
				"row": 0,
				"colSpan": 12,
				"rowSpan": 1
			},
			"bindTo": "Date",
			"caption": {
				"bindTo": "Resources.Strings.DateCaption"
			},
			"enabled": true
		},
		"parentName": "groupc8cdebeb88da_gridLayout",
		"propertyName": "items",
		"index": 0
	},
	{
		"operation": "insert",
		"name": "Statef873e523cb4f",
		"values": {
			"layout": {
				"column": 12,
				"row": 0,
				"colSpan": 12,
				"rowSpan": 1
			},
			"bindTo": "State",
			"caption": {
				"bindTo": "Resources.Strings.StateCaption"
			},
			"enabled": true,
			"textSize": "Default",
			"contentType": 3,
			"labelConfig": {
				"visible": true
			}
		},
		"parentName": "groupc8cdebeb88da_gridLayout",
		"propertyName": "items",
		"index": 1
	},
	{
		"operation": "insert",
		"name": "Numberba51112bfe3a",
		"values": {
			"layout": {
				"column": 0,
				"row": 1,
				"colSpan": 12,
				"rowSpan": 1
			},
			"bindTo": "Number",
			"caption": {
				"bindTo": "Resources.Strings.NumberCaption"
			},
			"enabled": true
		},
		"parentName": "groupc8cdebeb88da_gridLayout",
		"propertyName": "items",
		"index": 2
	},
	{
		"operation": "insert",
		"name": "Type76b567cf7a80",
		"values": {
			"layout": {
				"column": 12,
				"row": 1,
				"colSpan": 12,
				"rowSpan": 1
			},
			"bindTo": "Type",
			"caption": {
				"bindTo": "Resources.Strings.TypeCaption"
			},
			"enabled": true,
			"textSize": "Default",
			"contentType": 3,
			"labelConfig": {
				"visible": true
			}
		},
		"parentName": "groupc8cdebeb88da_gridLayout",
		"propertyName": "items",
		"index": 3
	},
	{
		"operation": "insert",
		"name": "ilayPatientb5472df3a8be",
		"values": {
			"layout": {
				"column": 12,
				"row": 0,
				"colSpan": 12,
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
		"name": "groupc9c61de5b63b",
		"values": {
			"itemType": 15,
			"caption": {
				"bindTo": "Resources.Strings.groupc9c61de5b63bCaption"
			},
			"items": [],
			"controlConfig": {
				"collapsed": false
			}
		},
		"parentName": "GeneralInfoTabContainer",
		"propertyName": "items",
		"index": 2
	},
	{
		"operation": "insert",
		"name": "groupc9c61de5b63b_gridLayout",
		"values": {
			"itemType": 0,
			"items": []
		},
		"parentName": "groupc9c61de5b63b",
		"propertyName": "items",
		"index": 0
	},
	{
		"operation": "insert",
		"name": "ilayVisitaac7180ed420",
		"values": {
			"layout": {
				"column": 0,
				"row": 0,
				"colSpan": 12,
				"rowSpan": 1
			},
			"bindTo": "ilayVisit",
			"caption": {
				"bindTo": "Resources.Strings.ilayVisitCaption"
			},
			"enabled": true
		},
		"parentName": "groupc9c61de5b63b_gridLayout",
		"propertyName": "items",
		"index": 0
	},
	{
		"operation": "insert",
		"name": "ilayCourse51a03e92243a",
		"values": {
			"layout": {
				"column": 12,
				"row": 0,
				"colSpan": 12,
				"rowSpan": 1
			},
			"bindTo": "ilayCourse",
			"caption": {
				"bindTo": "Resources.Strings.ilayCourseCaption"
			},
			"enabled": true
		},
		"parentName": "groupc9c61de5b63b_gridLayout",
		"propertyName": "items",
		"index": 1
	},
	{
		"operation": "insert",
		"name": "Owner95bba79d1138",
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
		"parentName": "groupc9c61de5b63b_gridLayout",
		"propertyName": "items",
		"index": 2
	},
	{
		"operation": "insert",
		"name": "ilayPatientServicea063c3bbd20e",
		"values": {
			"layout": {
				"column": 12,
				"row": 1,
				"colSpan": 12,
				"rowSpan": 1
			},
			"bindTo": "ilayPatientService",
			"caption": {
				"bindTo": "Resources.Strings.ilayPatientServiceCaption"
			},
			"enabled": true
		},
		"parentName": "groupc9c61de5b63b_gridLayout",
		"propertyName": "items",
		"index": 3
	},
	{
		"operation": "merge",
		"name": "HistoryTabContainer",
		"values": {
			"caption": {
				"bindTo": "Resources.Strings.HistoryTabContainerCaption"
			}
		}
	},
	{
		"operation": "merge",
		"name": "NotesAndFilesTab",
		"values": {
			"caption": {
				"bindTo": "Resources.Strings.NotesAndFilesTabCaption"
			}
		}
	},
	{
		"operation": "remove",
		"name": "Number"
	},
	{
		"operation": "remove",
		"name": "Date"
	},
	{
		"operation": "remove",
		"name": "Type"
	},
	{
		"operation": "remove",
		"name": "Owner"
	},
	{
		"operation": "remove",
		"name": "State"
	},
	{
		"operation": "remove",
		"name": "GeneralInfoGroup"
	},
	{
		"operation": "remove",
		"name": "GeneralInfoBlock"
	},
	{
		"operation": "remove",
		"name": "Account"
	},
	{
		"operation": "remove",
		"name": "Contact"
	},
	{
		"operation": "remove",
		"name": "EntityConnections"
	},
	{
		"operation": "move",
		"name": "ESNTab",
		"parentName": "Tabs",
		"propertyName": "tabs",
		"index": 4
	},
	//Кнопка "Скасувати". And this too. :)
	{
		"operation": "insert",
		"parentName": "LeftContainer",
		"propertyName": "items",
		"name": "CancelServiceButton",
		"values": {
			"itemType": Terrasoft.ViewItemType.BUTTON,
			"caption": {"bindTo": "Resources.Strings.ActionButtonsCardCaption" },
			"click": {"bindTo": "onCancelServiceButtonClick"},
			"style": Terrasoft.controls.ButtonEnums.style.RED,
			"classes": {
				"textClass": ["actions-button-margin-right"],
				"wrapperClass": ["actions-button-margin-right"]
			},
			"visible": {"bindTo": "isCancelServiceButtonVisible"}
		}
	}	
]/**SCHEMA_DIFF*/,
		attributes: {
			"ilayModelName": {
					lookupListConfig: {filter: function() {
						var mainGroup = new this.Terrasoft.createFilterGroup();
						mainGroup.name = "MainGroup";
						mainGroup.logicalOperation = this.Terrasoft.LogicalOperatorType.AND;
						
						var statusFilter = this.Terrasoft.createColumnFilterWithParameter(
						this.Terrasoft.ComparisonType.EQUAL, "ilayStatus", "c0ad5502-f232-4075-b9ea-3815ae4dc299");
						mainGroup.add(statusFilter);
						if(this.get("ilayPatientService") && this.get("ilayPatientService").ilayService) {
							var productFilter = this.Terrasoft.createColumnFilterWithParameter(
							this.Terrasoft.ComparisonType.EQUAL, "ilayProduct", this.get("ilayPatientService").ilayService.value);
							mainGroup.add(productFilter);
						}
						return mainGroup;
					}
				}
			},
			"ilayPatientService": {
				lookupListConfig: {
					columns: ["ilayService"]
				}
			},
			"CancelServiceButtonClicked": {
				dataValueType: Terrasoft.DataValueType.BOOLEAN,
				value : false
			}
		},
		methods: {
			//Den>>
			/*
			* Проверяет заполнены ли все обязательные поля в детали, и показывает кнопку печати.
			*/
			onMedDocSpecEdit: function (rows) {
				console.log("onMedDocSpecEdit");
			},
			isCancelServiceButtonVisible: function() {
				if(this.get("State")){
					//Підготовка
					return this.get("State").value === "1FCD639A-E581-4E2E-815B-7A7EE341BAC1".toLowerCase();
				}
			},
			/**
			 * Выполняет подписки на сообщения, которые понадобятся разделу.
			 * @protected
			 */
			SetServButtVisible: function() {
				this.sandbox.publish("ServButtVisible", null, [this.sandbox.id]);
			},
			onEntityInitialized: function() {
				this.callParent(arguments);
				if(this.isCancelServiceButtonVisible()){
					this.SetServButtVisible();
				}
			},
			updateServAndDocs: function() {
				console.log("Let's play whith some sql queries!");
				
				var patServ = this.get("ilayPatientService") ? this.get("ilayPatientService").value : null;
				var docStatePrep = "1FCD639A-E581-4E2E-815B-7A7EE341BAC1".toLowerCase();// Підготовка
				var docStateCalceled = "34CEE9D7-6C86-4230-8504-F7F9370AA942".toLowerCase();// Скасовано
				var ilayPerfomStatus = "766AFF6D-ECA4-4059-9553-A53E93F06015".toLowerCase();// Рекомендовано
				var ilayMedDocSignId = "4B6B7735-46E4-4AC1-9FBD-2CAE77392C6E".toLowerCase();// Не підписано
				
				var batchQuery = Ext.create("Terrasoft.BatchQuery");
				
				var updateQuery = this.Ext.create("Terrasoft.UpdateQuery", {
						rootSchemaName: "ilayServList"
					});
				updateQuery.filters.addItem(this.Terrasoft.createColumnFilterWithParameter(
					this.Terrasoft.ComparisonType.EQUAL, "Id", patServ));
				updateQuery.setParameterValue("ilayPerform", false, this.Terrasoft.DataValueType.BOOLEAN);
				updateQuery.setParameterValue("ilayPerfomStatus", ilayPerfomStatus, this.Terrasoft.DataValueType.GUID);
				updateQuery.setParameterValue("ilayMedDocSign", ilayMedDocSignId, this.Terrasoft.DataValueType.GUID);
				batchQuery.add(updateQuery);
				
				updateQuery = this.Ext.create("Terrasoft.UpdateQuery", {
						rootSchemaName: "Document"
					});
				updateQuery.filters.addItem(this.Terrasoft.createColumnFilterWithParameter(
					this.Terrasoft.ComparisonType.EQUAL, "Id", this.get("Id")));
				updateQuery.setParameterValue("State", docStateCalceled, this.Terrasoft.DataValueType.GUID);
				batchQuery.add(updateQuery);

				updateQuery = this.Ext.create("Terrasoft.UpdateQuery", {
						rootSchemaName: "Document"
					});
				updateQuery.filters.add("updateFilter1", this.Terrasoft.createColumnFilterWithParameter(
					this.Terrasoft.ComparisonType.EQUAL, "[ilayDocService:ilayDocument:Id].ilayService", patServ));
				updateQuery.filters.add("updateFilter2", this.Terrasoft.createColumnFilterWithParameter(
					this.Terrasoft.ComparisonType.EQUAL, "State", docStatePrep));
				updateQuery.setParameterValue("State", docStateCalceled, this.Terrasoft.DataValueType.GUID);
				batchQuery.add(updateQuery);
				
				batchQuery.execute(function() {
					this.onCloseCardButtonClick();
				}, this);
			},
			onCancelServiceButtonClick: function() {
				this.showConfirmationDialog(this.get("Resources.Strings.MessageCancelVisit"),
					function(returnCode) {
						if (returnCode === ilayCConst.Buttons.Yes.returnCode) {
							this.set("CancelServiceButtonClicked", true);
							this.save();
						}
						if (returnCode === ilayCConst.Buttons.No.returnCode) {
							console.log("ОХРАААНА ОТМЕНА!");
						}
					}, [ilayCConst.Buttons.Yes, ilayCConst.Buttons.No], {style: Terrasoft.MessageBoxStyles.RED}
				);
			},
			//Den<<
			/**
			 * Проверяет заполнено ли хотябы одно из полей "Контакт" или "Контрагент".
			 * @param {Function} callback Функция обратного вызова.
			 * @param {Object} scope Контекст выполнения.
			 */
			validateAccountOrContactFilling: function(callback, scope) {
				var result = {
					success: true
				};
				callback.call(scope || this, result);
			},
			onSaved: function(response, config) {
				var args = arguments;
				if(this.get("CancelServiceButtonClicked")) {
					this.updateServAndDocs();
				}
				if(this.get("ilayModelName")) {
					Terrasoft.chain(
						function(next) {
							this.deleteMedDocSpecific(next);
						},
						function(next) {
							this.selectMedDocSpecific(next);
						},
						function(next, collection) {
							this.insertMedDocSpecific(next, collection);
						},
						function(next) {
							this.superclass.onSaved.apply(this, args)
						},
						this);
				}else {
					this.callParent(arguments);
				}
			},
			deleteMedDocSpecific: function(next) {
				var deleteQuery = Ext.create('Terrasoft.DeleteQuery', {rootSchemaName: 'ilayMedDocSpecific'});
				deleteQuery.filters.add('IdFilter', deleteQuery.createColumnFilterWithParameter(Terrasoft.ComparisonType.EQUAL, 'ilayMedDoc', this.get("Id")));
				deleteQuery.execute(function (response) {
					if(response.success){
						next();
					}
				}, this);
			},
			selectMedDocSpecific: function(next) {
				var selectQuery = Ext.create("Terrasoft.EntitySchemaQuery", {rootSchemaName: "ilayDocSpecification"});
				selectQuery.addColumn("Id");
				selectQuery.addColumn("ilayDocModel");
				selectQuery.addColumn("StringValue");
				selectQuery.addColumn("IntValue");
				selectQuery.addColumn("FloatValue");
				selectQuery.addColumn("BooleanValue");
				selectQuery.addColumn("Specification");
				selectQuery.addColumn("ListItemValue");
				selectQuery.addColumn("ilaySerialNumber");
				selectQuery.addColumn("Specification.Type");
				selectQuery.filters.addItem(selectQuery.createColumnFilterWithParameter(this.Terrasoft.ComparisonType.EQUAL, "ilayDocModel", this.get("ilayModelName").value));
				selectQuery.getEntityCollection(function(result) {
					if (result.success) {
						next(result.collection);
					}
				}, this);
			},
			insertMedDocSpecific: function(next, collection) {
				var batchQuery = Ext.create("Terrasoft.BatchQuery");
				collection.each(function(item) {
					var insert = Ext.create("Terrasoft.InsertQuery", {
						rootSchemaName: "ilayMedDocSpecific"
					});
					insert.setParameterValue("ilayMedDoc",
						this.get("Id"), Terrasoft.DataValueType.GUID);
					if(item.get("ilayDocModel")) {
						insert.setParameterValue("ilayDocModel",
							item.get("ilayDocModel").value, Terrasoft.DataValueType.GUID);
					}
					if(item.get("StringValue")) {
						insert.setParameterValue("StringValue",
							item.get("StringValue"), Terrasoft.DataValueType.TEXT);
					}
					if(item.get("IntValue")) {
						insert.setParameterValue("IntValue",
							item.get("IntValue"), Terrasoft.DataValueType.INTEGER);
					}
					if(item.get("FloatValue")) {
						insert.setParameterValue("FloatValue",
							item.get("FloatValue"), Terrasoft.DataValueType.FLOAT);
					}
					if(item.get("BooleanValue")) {
						insert.setParameterValue("BooleanValue",
							item.get("BooleanValue"), Terrasoft.DataValueType.BOOLEAN);
					}
					if(item.get("Specification")) {
						insert.setParameterValue("Specification",
							item.get("Specification").value, Terrasoft.DataValueType.GUID);
					}
					if(item.get("ListItemValue")) {
						insert.setParameterValue("ListItemValue",
							item.get("ListItemValue").value, Terrasoft.DataValueType.GUID);
					}
					if(item.get("ilaySerialNumber")) {
						insert.setParameterValue("ilaySerialNumber",
							item.get("ilaySerialNumber"), Terrasoft.DataValueType.INTEGER);
					}
					if(item.get("Specification").Type) {
						insert.setParameterValue("ilaySpecificType",
							item.get("Specification").Type.value, Terrasoft.DataValueType.GUID);
					}
					
					batchQuery.add(insert);
				}, this);
				batchQuery.execute(this.onInsertedMedDocSpecific(next), this);
			},
			onInsertedMedDocSpecific : function(next) {
				this.updateDetail(
				{
					detail: "ilayMedDocSpecificDetailV2",
					reloadAll: true
				});
				next();
			},
			DiagnosisInCourseFilters: function() {
				var ilayVisit = this.get("ilayVisit") ? this.get("ilayVisit").value : "emptyValue";
				var filterGroup = new this.Terrasoft.createFilterGroup();
				filterGroup.logicalOperation = this.Terrasoft.LogicalOperatorType.AND;
				filterGroup.add("ilayDiagnosisInCourseNoNull", this.Terrasoft.createColumnFilterWithParameter(
				this.Terrasoft.ComparisonType.IS_NOT_NULL, "ilayVisitToDoctor"));
				filterGroup.add("ilayDiagnosisInCourse", this.Terrasoft.createColumnFilterWithParameter(
				this.Terrasoft.ComparisonType.EQUAL, "ilayVisitToDoctor", ilayVisit ));
				return filterGroup;
			},
			RecomendInMedDocExamination: function() {
				var ilayDoc =  this.get("Id");
				var filterGroup = new this.Terrasoft.createFilterGroup();
				filterGroup.logicalOperation = this.Terrasoft.LogicalOperatorType.AND;
				filterGroup.add("ilayDoc", this.Terrasoft.createColumnFilterWithParameter(
				this.Terrasoft.ComparisonType.EQUAL, "ilayMedDocument", ilayDoc));
				filterGroup.add("ilayRecomendType", this.Terrasoft.createColumnFilterWithParameter(
				this.Terrasoft.ComparisonType.EQUAL, "ilayRecomendType", "82c93b9b-4e2c-48f8-a4b5-f524c9384e7e"));
				return filterGroup;
			},
			RecomendInMedDocHealthing: function() {
				var ilayDoc =  this.get("Id");
				var filterGroup = new this.Terrasoft.createFilterGroup();
				filterGroup.logicalOperation = this.Terrasoft.LogicalOperatorType.AND;
				filterGroup.add("ilayDoc", this.Terrasoft.createColumnFilterWithParameter(
				this.Terrasoft.ComparisonType.EQUAL, "ilayMedDocument", ilayDoc));
				filterGroup.add("ilayRecomendType", this.Terrasoft.createColumnFilterWithParameter(
				this.Terrasoft.ComparisonType.EQUAL, "ilayRecomendType", "158b6326-0aed-43fd-aa7f-4e1069d756e8"));
				return filterGroup;
			},
			RecomendInMedDocOther: function() {
				var ilayDoc =  this.get("Id");
				var filterGroup = new this.Terrasoft.createFilterGroup();
				filterGroup.logicalOperation = this.Terrasoft.LogicalOperatorType.AND;
				filterGroup.add("ilayDoc", this.Terrasoft.createColumnFilterWithParameter(
				this.Terrasoft.ComparisonType.EQUAL, "ilayMedDocument", ilayDoc));
				filterGroup.add("ilayRecomendType", this.Terrasoft.createColumnFilterWithParameter(
				this.Terrasoft.ComparisonType.EQUAL, "ilayRecomendType", "93368f47-8d7d-4de4-a54f-9a65d67cbe0d"));
				return filterGroup;
			},
			//Мне не понятно на кой ляд это тут нужно. Дублирование кода из базовых схем.
			//Андрей сказал для работы сабскрайбера в детали, но он работает и так.. пока оставим закоменченым.
			subscribeDetailEvents: function(detailConfig, detailName) {
				this.callParent(arguments);
				var detailId = this.getDetailId(detailName);
				var detail = this.Terrasoft.deepClone(detailConfig);
				var sandbox = this.sandbox;
				sandbox.subscribe("DetailChanged", function(args) {
					return this.onDetailChanged(detail, args);
				}, this, [detailId]);
			},
			onDetailChanged: function(detail, args) {
				var subscriber = detail.subscriber;
				if (this.Ext.isFunction(subscriber)) {
					subscriber.call(this, args);
				} else if (this.Ext.isObject(subscriber)) {
					var methodName = subscriber.methodName;
					if (this.Ext.isFunction(this[methodName])) {
						this[methodName](args);
					}
				}
			},
			copyRecomendation: function(arr) {
				if(arr) {
					this.showBodyMask();
					Terrasoft.AjaxProvider.request({
						url: '../rest/MedDocHelper/copyRecomendation',
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'application/json'
						},
						method: 'POST',
						timeout: (5 * 10000),
						jsonData: Ext.encode({
								diagnosis: arr,
								medDocId: this.get("Id")
						}),
						callback: function(request, success, response) {
							this.hideBodyMask();
							if (success) {
								this.updateDetail({detail: "ilayRecomendInMedDocExaminationDetail", reloadAll: true});
								this.updateDetail({detail: "ilayRecomendInMedDocHealthingDetail", reloadAll: true});
								this.updateDetail({detail: "ilayRecomendInMedDocOtherDetail", reloadAll: true});
							}
						},
						scope: this
					});
				}
			},
				validateAccountOrContactFilling: function(callback, scope) {
					var account = this.get("Account");
					var contact = this.get("Contact");
					var result = {
						success: true
					};/*
					if (this.Ext.isEmpty(account) && this.Ext.isEmpty(contact)) {
						var accountColumnCaption = this.getColumnByName("Account").caption;
						var contactColumnCaption = this.getColumnByName("Contact").caption;
						result.message = this.Ext.String.format(
								this.get("Resources.Strings.WarningAccountContactRequire"),
								accountColumnCaption, contactColumnCaption);
						result.success = false;
					}*/
					callback.call(scope || this, result);
				}
		},
		rules: {},
		userCode: {}
	};
});
