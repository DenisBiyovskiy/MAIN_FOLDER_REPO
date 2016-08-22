define("ilaySchema10Detail", ["LookupUtilities"], function(LookupUtilities) {
	return {
		entitySchemaName: "ilayDocModel",
		details: /**SCHEMA_DETAILS*/{}/**SCHEMA_DETAILS*/,
		diff: /**SCHEMA_DIFF*/[
			{
				"operation": "insert",
				"parentName": "Detail",
				"propertyName": "tools",
				"name": "CopyModels",
				"values": {
					"itemType": Terrasoft.ViewItemType.BUTTON,
					"style": Terrasoft.controls.ButtonEnums.style.GREEN,
					"caption": "Копіювати шаблон",
					"click": {"bindTo": "onCopyModelsButtonClick"},
					"classes": {
						"wrapperClass": "copy-btn",
						"pressedClass": "copy-pressed"
					},
					"visible": true
				}
			}
		]/**SCHEMA_DIFF*/,
		methods: {
			/**
			 * Открывает Lookup шаблонов документов при нажатии на кнопку "Копіювати шаблон"
			 */
			onCopyModelsButtonClick: function() {
				console.log(this.get("ActiveRow"));
				var config = {
					entitySchemaName: "ilayDocModel",
					multiSelect: true,
					columns: ["ilayName", "ilayProduct", "ilayStatus"]
				};
				LookupUtilities.Open(this.sandbox, config, this.copyModels, this, null, false, false);
			},
			
			/**
			 * Обработчик результата выборки шаблонов из лукапа.
			 * @param {Object} в Scope передается массив результатов мультивыбора. 
			 */
			copyModels: function(scope) {
				if (scope && scope.selectedRows && scope.selectedRows.collection) {
					
					// Хранит Id изначальных шаблонов и их копий, для дальнейшего копирования характеристик.
					// var OriginalCopyIds = {
					// 	originalIds: [],
					// 	copyIds: [],
					// 	idsMap: {}
					// };
					var idsMap = {};
					var batchQuery = Ext.create("Terrasoft.BatchQuery");
					var docModels = scope.selectedRows.collection.items;
					for (var i = docModels.length - 1; i >= 0; i--) {
						
						var docModelId = Terrasoft.generateGUID();
						
						// OriginalCopyIds.originalIds.push(docModels[i].Id);
						// OriginalCopyIds.copyIds.push(docModelId);
						
						idsMap[docModels[i].Id] = docModelId;
						
						batchQuery.add(this.getDocsModelInsertQuery(docModels[i], docModelId));
						batchQuery.add(this.getDocSpecificationSelectQuery(docModels[i].Id))
					}
					batchQuery.execute(function(result) {
						this.copyDocSpecifications(idsMap, result);
					}, this);
				}
			},
			
			/**
			 * Возвращает Insert запрос для копирования шаблона.
			 * @param {Object} docModel
			 * @param {String} Id
			 */
			getDocsModelInsertQuery: function(docModel, docModelId) {
				var insert = this.Ext.create("Terrasoft.InsertQuery", {
					rootSchemaName: "ilayDocModel"
				});
				insert.setParameterValue("Id", docModelId, this.Terrasoft.DataValueType.GUID);
				insert.setParameterValue("ilayName", docModel.ilayName, this.Terrasoft.DataValueType.TEXT);
				insert.setParameterValue("ilayProduct", this.get("MasterRecordId"), this.Terrasoft.DataValueType.GUID);
				if (!Ext.isEmpty(docModel.ilayStatus)) insert.setParameterValue("ilayStatus", docModel.ilayStatus.value, this.Terrasoft.DataValueType.GUID);
				return insert;
			},
			
			 /**
			 * Возвращает Select запрос для выборки характеристик шаблона.
			 * @param {Object} docModel
			 * @param {String} Id
			 */
			 getDocSpecificationSelectQuery: function(originalId) {
			 	
			 	var selectQuery = Ext.create("Terrasoft.EntitySchemaQuery", {
			 		rootSchemaName: "ilayDocSpecification"
			 	});
				selectQuery.allColumns = true;
				selectQuery.filters.addItem(selectQuery.createColumnFilterWithParameter(
					this.Terrasoft.ComparisonType.EQUAL, "ilayDocModel", originalId
				));
				
				return selectQuery;
			 },
			
			/**
			 * Копирует характеристики шаблонов.
			 * @param {Object} OriginalCopyIds
			 */
			copyDocSpecifications: function(idsMap, result) {
				if(result.success){
					console.log("success");
					for (var i = 0; i < result.queryResults.length; i++) {
						var currentResult = result.queryResults[i];
						if (!Ext.isEmpty(currentResult.rows)) {
							var batchQuery = Ext.create("Terrasoft.BatchQuery");
							for (var j = 0; j < currentResult.rows.length; j++) {
								batchQuery.add(this.getIlayDocSpecificationInsertQuery(currentResult.rows[j], idsMap[currentResult.rows[j].ilayDocModel.value]));
							}
							batchQuery.execute(function(result) {
								console.log("success2");
								this.updateDetail({reloadAll: true});
							}, this);
						}
					}
				}
			 },
			 
			 /**
			 * Возвращает Insert запрос для копирования характеристик шаблона.
			 * @param {Object} docModel
			 * @param {String} Id
			 */
			getIlayDocSpecificationInsertQuery: function(fields, Id) {
					var insert = this.Ext.create("Terrasoft.InsertQuery", {
						rootSchemaName: "ilayDocSpecification"
					});
					
					insert.setParameterValue("ilayDocModel", Id, Terrasoft.DataValueType.GUID);
					insert.setParameterValue("StringValue", fields["StringValue"], Terrasoft.DataValueType.TEXT);
					insert.setParameterValue("IntValue", fields["IntValue"], Terrasoft.DataValueType.INTEGER);
					insert.setParameterValue("FloatValue", fields["FloatValue"], Terrasoft.DataValueType.FLOAT);
					insert.setParameterValue("BooleanValue", fields["BooleanValue"], Terrasoft.DataValueType.BOOLEAN);
					if(fields["Specification"]) {
						insert.setParameterValue("Specification", fields["Specification"].value, Terrasoft.DataValueType.GUID);
					}
					if(fields["ListItemValue"]) {
						insert.setParameterValue("ListItemValue",
							fields["ListItemValue"].value, Terrasoft.DataValueType.GUID);
					}
					if(fields["ilaySerialNumber"]) {
						insert.setParameterValue("ilaySerialNumber", fields["ilaySerialNumber"], Terrasoft.DataValueType.INTEGER);
					}
					if(fields["ilayIsRequired"]) {
						insert.setParameterValue("ilayIsRequired", fields["ilayIsRequired"].value, Terrasoft.DataValueType.GUID);
					}
					return insert;
			}
		},
		attributes: {}
	};
});
