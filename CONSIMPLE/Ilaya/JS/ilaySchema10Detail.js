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
				LookupUtilities.Open(this.sandbox, config, function(scope, args) {
					if (scope && scope.selectedRows && scope.selectedRows.collection) {
						
						// Хранит Id изначальных шаблонов и их копий, для дальнейшего копирования характеристик.
						var OriginalCopyIds = {
							originalIds: [],
							copyIds: []
						};
						var batchQuery = Ext.create("Terrasoft.BatchQuery");
						var docModels = scope.selectedRows.collection.items;
						for (var i = docModels.length - 1; i >= 0; i--) {
							var docModelId = Terrasoft.generateGUID();
							OriginalCopyIds.originalIds.push(docModels[i].Id);
							OriginalCopyIds.copyIds.push(docModelId);
							batchQuery.add(this.getDocsModelInsertQuery(docModels[i], docModelId));
						}
						batchQuery.execute(function() {
							this.copyDocSpecifications(OriginalCopyIds);
						}, this);
					}
				}, this, null, false, false);
			},
			
			/**
			 * Возвращает Insert запрос для копирования шаблона.
			 * @param {Object} docModel
			 * @param {String} Id
			 */
			getDocsModelInsertQuery: function(docModel, docModelId) {
				if (docModel && docModel.ilayStatus && docModelId) {
					var insert = this.Ext.create("Terrasoft.InsertQuery", {
						rootSchemaName: "ilayDocModel"
					});
					insert.setParameterValue("Id", docModelId, this.Terrasoft.DataValueType.GUID);
					insert.setParameterValue("ilayName", docModel.ilayName, this.Terrasoft.DataValueType.TEXT);
					insert.setParameterValue("ilayProduct", this.get("MasterRecordId"), this.Terrasoft.DataValueType.GUID);
					insert.setParameterValue("ilayStatus", docModel.ilayStatus.value, this.Terrasoft.DataValueType.GUID);
					return insert;
				}
			},
			
			/**
			 * Копирует характеристики шаблонов.
			 * @param {Object} OriginalCopyIds
			 */
			 copyDocSpecifications: function(OriginalCopyIds) {
				for (var i = OriginalCopyIds.originalIds.length - 1; i >= 0; i--) {
					this.getDocSpecificationSelectQuery(OriginalCopyIds.originalIds[i]);
				}
			 }
		},
		attributes: {}
	};
});
