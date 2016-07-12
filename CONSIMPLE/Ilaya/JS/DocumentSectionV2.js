define("DocumentSectionV2", ["VisaHelper", "BaseFiltersGenerateModule",	"DocumentSectionGridRowViewModel"],
	function(VisaHelper, BaseFiltersGenerateModule) {
		return {
			entitySchemaName: "Document",
			methods: {
				/**
				 * Событие на изменение значения ActiveRow.
				 * from GridUtilitiesV2
				 */
				onActiveRowChange: function() {
					if (this.isAnySelected()) {
						//var sectionPrintMenuItems = this.get("SectionPrintMenuItems");
						var sectionPrintMenuItems = this.get("CardPrintMenuItems");
						var items = [];
						/*sectionPrintMenuItems.each(function(item){
							item.set("Visible", false);
							items.push(item.get("Id"));
						},this);*/
						for (var i = sectionPrintMenuItems.getCount() - 1; i >= 0; i--) {
							sectionPrintMenuItems.getByIndex(i).set("Visible", false);
							sectionPrintMenuItems.getByIndex(i).set("Enabled", false);
							items.push(sectionPrintMenuItems.getByIndex(i).get("Id"));
						}
						this.filtrateCollection(items, sectionPrintMenuItems);
					}
				},
				/**
				 * Обрабатывает сообщение о завершении отрисовки страницы редактирования.
				 * from BaseSectionV2
				 * @protected
				 */
				onCardRendered: function() {
					this.callParent(arguments);
					this.refreshCardValuesCollection(this.initCardPrintForms(), this);
				},
				/**
				 *Метод получения данных карточки.
				 * @param {Function} callback Функция обратного вызова.
				 * @param {Terrasoft.BaseViewModel} scope Контекст вызова функции обратного вызова.
				 */
				refreshCardValuesCollection: function(callback, scope) {
					var rowId = this.getActiveRow().get("Id");
					var esq = Ext.create("Terrasoft.EntitySchemaQuery", {
						rootSchemaName: "Document"
					});
					esq.addColumn("Type");
					esq.addColumn("ilayCategory");
					esq.addColumn("ilayModelName");
					esq.filters.add("LeadFilter", esq.createColumnFilterWithParameter(
					this.Terrasoft.ComparisonType.EQUAL, "Id", rowId));
					esq.getEntityCollection(function(result) {
						if(result.success){
							var resCollection = {
								Type: result.collection.getByIndex(0).get("Type") != "" ?
											result.collection.getByIndex(0).get("Type").value: null,
								ilayCategory: result.collection.getByIndex(0).get("ilayCategory") != "" ? 
											result.collection.getByIndex(0).get("ilayCategory").value: null,
								ilayModelName: result.collection.getByIndex(0).get("ilayModelName") != "" ? 
											result.collection.getByIndex(0).get("ilayModelName").value: null
							};
							this.set("ilayCardValuesCollection", resCollection);
							callback.call(scope || this);
						}
					}, this);
				},
				/**
				 * Инициализирует коллекцию возможных печатных форм для карточки.
				 * @protected
				 * @param {Function} callback Функция обратного вызова.
				 * @param {Terrasoft.BaseViewModel} scope Контекст вызова функции обратного вызова.
				 */
				initCardPrintForms: function(callback, scope, docType, docCategory, docModel) {
					var reportsEsq = this.getModulePrintFormsESQ();
					var reportsEsq = this.getModulePrintFormsESQ();
					
					var	docType = this.get("ilayCardValuesCollection").value;
					var	docCategory = this.get("ilayCategory") ? this.get("ilayCategory").value : null;
					var	docModel = this.get("ilayModelName") ? this.get("ilayModelName").value : null;
					
					//*****************************************************************
					var filterGroupByCategory = this.Terrasoft.createFilterGroup();
						filterGroupByCategory.logicalOperation = Terrasoft.LogicalOperatorType.OR;
						
					var byCategoryFilter = Terrasoft.createColumnFilterWithParameter(Terrasoft.ComparisonType.EQUAL,
						"=[ilayDocReports:ilayPrintForm:Id].ilayCategory", docCategory);
						filterGroupByCategory.add('byCategoryFilter', byCategoryFilter);
						
					var byCategoryNullFilter = 
						this.Terrasoft.createColumnIsNullFilter("=[ilayDocReports:ilayPrintForm:Id].ilayCategory");
						filterGroupByCategory.add('byCategoryNullFilter', byCategoryNullFilter);
					//*****************************************************************	
					var filterGroupByDocModel = this.Terrasoft.createFilterGroup();
						filterGroupByDocModel.logicalOperation = Terrasoft.LogicalOperatorType.OR;
					
					var byDocModelFilter = Terrasoft.createColumnFilterWithParameter(Terrasoft.ComparisonType.EQUAL,
						"=[ilayDocReports:ilayPrintForm:Id].ilayDocModel", docModel);
						filterGroupByDocModel.add('byDocModelFilter', byDocModelFilter);
						
					var byDocModelNullFilter = 
						this.Terrasoft.createColumnIsNullFilter("=[ilayDocReports:ilayPrintForm:Id].ilayDocModel");
						filterGroupByDocModel.add('byDocModelNullFilter', byDocModelNullFilter);
					//*****************************************************************	
					reportsEsq.filters.addItem(Terrasoft.createColumnFilterWithParameter(Terrasoft.ComparisonType.EQUAL,
						"ShowInCard", true));
					reportsEsq.filters.addItem(Terrasoft.createColumnFilterWithParameter(Terrasoft.ComparisonType.EQUAL,
						"=[ilayDocReports:ilayPrintForm:Id].ilayDocType", docType));
					reportsEsq.filters.addItem(filterGroupByCategory);
					reportsEsq.filters.addItem(filterGroupByDocModel);

					reportsEsq.getEntityCollection(function(result) {
						if (this.destroyed) {
							return;
						}
						if (result.success && !result.collection.isEmpty()) {
							var printFormsMenuCollection = result.collection;
							this.preparePrintFormsMenuCollection(printFormsMenuCollection);
							printFormsMenuCollection.each(function(item) {
								item.set("Click", {bindTo: "generateCardPrintForm"});
							}, this);
							var printMenuItems = this.preparePrintButtonCollection(this.moduleCardPrintFormsCollectionName);
							printMenuItems.loadAll(printFormsMenuCollection);
							this.set(this.moduleCardPrintFormsCollectionName, printMenuItems);
							this.getCardPrintButtonVisible();
						}
						if (callback) {
							callback.call(scope || this);
						}
					}, this);
				},
				filtrateCollection: function(items, sectionPrintMenuItems) {
					Terrasoft.chain(
						function(next) {
							var rowId = this.getActiveRow().get("Id");
							var esq = Ext.create("Terrasoft.EntitySchemaQuery", {
								rootSchemaName: "Document"
							});
							esq.addColumn("Type");
							esq.addColumn("ilayCategory");
							esq.addColumn("ilayModelName");
							esq.filters.add("LeadFilter", esq.createColumnFilterWithParameter(
							this.Terrasoft.ComparisonType.EQUAL, "Id", rowId));
							esq.getEntityCollection(function(result) {
								if(result.success){
									var DocValues = [];
									DocValues.push(result.collection.getByIndex(0).get("Type") != "" ?
													result.collection.getByIndex(0).get("Type"): null);
									DocValues.push(result.collection.getByIndex(0).get("ilayCategory") != "" ? 
													result.collection.getByIndex(0).get("ilayCategory"): null);
									DocValues.push(result.collection.getByIndex(0).get("ilayModelName") != "" ? 
													result.collection.getByIndex(0).get("ilayModelName"): null);
								}
								next(DocValues);
							}, this);
						},
						function(next, DocValues) {
							var reportsEsq = Ext.create("Terrasoft.EntitySchemaQuery", {
								rootSchemaName: "SysModuleReport"
							});
							
							//*****************************************************************
							var filterGroupByCategory = this.Terrasoft.createFilterGroup();
								filterGroupByCategory.logicalOperation = Terrasoft.LogicalOperatorType.OR;
								
							var byCategoryFilter = Terrasoft.createColumnFilterWithParameter(Terrasoft.ComparisonType.EQUAL,
								"=[ilayDocReports:ilayPrintForm:Id].ilayCategory", DocValues[1] ? DocValues[1].value : null);
								filterGroupByCategory.add('byCategoryFilter', byCategoryFilter);
								
							var byCategoryNullFilter = 
								this.Terrasoft.createColumnIsNullFilter("=[ilayDocReports:ilayPrintForm:Id].ilayCategory");
								filterGroupByCategory.add('byCategoryNullFilter', byCategoryNullFilter);
							//*****************************************************************	
							var filterGroupByDocModel = this.Terrasoft.createFilterGroup();
								filterGroupByDocModel.logicalOperation = Terrasoft.LogicalOperatorType.OR;
							
							var byDocModelFilter = Terrasoft.createColumnFilterWithParameter(Terrasoft.ComparisonType.EQUAL,
								"=[ilayDocReports:ilayPrintForm:Id].ilayDocModel", DocValues[2] ? DocValues[2].value : null);
								filterGroupByDocModel.add('byDocModelFilter', byDocModelFilter);
								
							var byDocModelNullFilter = 
								this.Terrasoft.createColumnIsNullFilter("=[ilayDocReports:ilayPrintForm:Id].ilayDocModel");
								filterGroupByDocModel.add('byDocModelNullFilter', byDocModelNullFilter);
							//*****************************************************************	
							reportsEsq.filters.addItem(Terrasoft.createColumnFilterWithParameter(Terrasoft.ComparisonType.EQUAL,
								"ShowInCard", true));
							reportsEsq.filters.addItem(Terrasoft.createColumnFilterWithParameter(Terrasoft.ComparisonType.EQUAL,
								"=[ilayDocReports:ilayPrintForm:Id].ilayDocType", DocValues[0] ? DocValues[0].value : null));
							reportsEsq.filters.addItem(filterGroupByCategory);
							reportsEsq.filters.addItem(filterGroupByDocModel);
							reportsEsq.getEntityCollection(function(result) {
								if (this.destroyed) {
									return;
								}
								if (result.success && !result.collection.isEmpty()) {
									for (var i = result.collection.getCount() - 1; i >= 0; i--) {
										if(items.indexOf(result.collection.getByIndex(i).get("Id")) != -1) 
										{
											sectionPrintMenuItems.get(result.collection.getByIndex(i).get("Id")).set("Visible", true);
											sectionPrintMenuItems.get(result.collection.getByIndex(i).get("Id")).set("Enabled", true);
										}
									}
									/*result.collection.each(function(item) {
										if(items.indexOf(item.get("Id")) != -1) 
											sectionPrintMenuItems.get(item.get("Id")).set("Visible", true);
									},this);*/
								}
							}, this);
							next();
						},
					this);
					
				},
				isCancelServiceButtonVisible: function() {
					return this.get("isCSButtonVisible");
				},
				/**
				 * Обработчик кнопки "Скасувати".
				 * @protected
				 */
				onCancelServiceButtonClick: function() {
					this.sandbox.publish("OnCardAction", "onCancelServiceButtonClick", [this.getCardModuleSandboxId()]);
				},
				/**
				 * Выполняет подписки на сообщения, которые понадобятся странице
				 * @protected
				 * @virtual
				 */
				subscribeSandboxEvents: function() {
					this.callParent(arguments);
					this.sandbox.subscribe("ServButtVisible", function() {
						this.set("isCSButtonVisible", true);
					}, this, [this.getCardModuleSandboxId()]);
				},
				closeCard: function() {
					this.callParent(arguments);
					this.set("isCSButtonVisible", false);
				}
			},
			attributes: {
				/**
				 * Флаг, указывает отображать ли кнопку "Скасувати"
				 */
				"isCSButtonVisible": {
					dataValueType: Terrasoft.DataValueType.BOOLEAN,
					"value": false
				},
				/**
				 * Флаг, указывает отображать ли кнопку "Скасувати"
				 */
				"ilayCardValuesCollection": {dataValueType: Terrasoft.DataValueType.COLLECTION}
			},
			messages: {
				/**
				 * @message ServButtVisible
				 * Срабатывает при открытии карточки с типом Мед.док. и делает видимой кнопку "Скасувати"
				 * @param {String} action Название действия
				 */
				"ServButtVisible": {
					mode: this.Terrasoft.MessageMode.PTP,
					direction: this.Terrasoft.MessageDirectionType.SUBSCRIBE
				}
			},
			diff: /**SCHEMA_DIFF*/[
				//Кнопка "Скасувати".
				{
					"operation": "insert",
					"name": "CombinedModeCancelServiceButton",
					"parentName": "CombinedModeActionButtonsCardLeftContainer",
					"propertyName": "items",
					"values": {
						"itemType": Terrasoft.ViewItemType.BUTTON,
						"caption": {"bindTo": "Resources.Strings.ActionButtonsCardCaption"},
						"click": {"bindTo": "onCancelServiceButtonClick"},
						"style": Terrasoft.controls.ButtonEnums.style.RED,
						"classes": {
							"textClass": ["actions-button-margin-right"],
							"wrapperClass": ["actions-button-margin-right"]
						},
						"visible": {bindTo: "isCancelServiceButtonVisible"}
					}
				}
			]/**SCHEMA_DIFF*/
		};
	});
