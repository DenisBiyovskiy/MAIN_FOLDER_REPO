define("DocumentSectionV2", ["VisaHelper", "BaseFiltersGenerateModule",	"DocumentSectionGridRowViewModel"],
	function(VisaHelper, BaseFiltersGenerateModule) {
		return {
			entitySchemaName: "Document",
			methods: {
				//Den>
				/**
				* Проверяет заполнены ли все обязательные поля в детали, и показывает кнопку печати.
				*/
				checkRequiredFieldsFilled: function (callback, scope) {
					var esq = Ext.create("Terrasoft.EntitySchemaQuery", {
						rootSchemaName: "ilayMedDocSpecific"
					});
					esq.addColumn("ilayFactValueForEditableGrid");
					esq.filters.addItem(esq.createColumnFilterWithParameter(
						this.Terrasoft.ComparisonType.EQUAL, "ilayMedDoc", this.get("ActiveRow")));
					esq.filters.addItem(esq.createColumnFilterWithParameter(
						this.Terrasoft.ComparisonType.EQUAL, "ilayIsRequired", true));
					esq.getEntityCollection(function(result) {
						if (result.success) {
							var requiredFieldsFilled = true;
							for (var i = 0; i < result.collection.getCount(); i++) {
								if (result.collection.getByIndex(i).get("ilayFactValueForEditableGrid") === "") {
									requiredFieldsFilled = false;
								}
							}
							if (requiredFieldsFilled) {
								callback.call(scope || this);
							} else {
								Terrasoft.utils.showMessage({
									caption: this.get("Resources.Strings.RequiredFieldsNotFilled"),
									buttons: ["ok"],
									style: Terrasoft.MessageBoxStyles.RED
								});
							}
						}
					}, this);
				},
				//Den<
				
				/**
				 * По нажатию на кнопку печать Документы с типом Медицинский и Бухгалтерский
				 * переводятся в состояние "Підписан"
				 * Генерирует отчет.
				 * @protected
				 * @param {Terrasoft.BaseViewModel} printForm Конфигурационный объект.
				 */
				generatePrintForm: function(printForm) {
					//Den>
					Terrasoft.chain(
						function(next) {
							if (this.get("ilayCardValuesCollection").Type === "2F3F339E-7A37-4772-8C87-C4DFF260B341".toLowerCase()) {
								this.checkRequiredFieldsFilled(next, this);
							} else {
								next();
							}
						},
						function(next) {
					//Den<
							this.showBodyMask();
							var filters = this.getReportFilters();
							var reportParameters;
							if (filters instanceof Terrasoft.FilterGroup) {
								reportParameters = {Filters: filters.serialize()};
							} else {
								reportParameters = filters;
							}
							var selectedRows = this.getPrimaryColumnValue() || this.getSelectedItems() || Terrasoft.GUID_EMPTY;
							var data = {
								reportParameters: Ext.JSON.encode(reportParameters),
								reportSchemaUId: printForm.getReportSchemaUId(),
								templateId: printForm.getTemplateId(),
								recordId: this.getPrimaryColumnValue() || Terrasoft.GUID_EMPTY,
				
								entitySchemaUId: this.getEntitySchemaUId(), //TODO !!!!!!!!!!
				
								caption: printForm.getCaption(),
								convertInPDF: printForm.get("ConvertInPDF")
							};
							var serviceConfig = {
								serviceName: "ilayReportService",
								//serviceName: "ilaySourceCode1",
								methodName: "CreateReport",
								data: data,
								timeout: 20 * 60 * 1000
							};
							var callback = this.Terrasoft.emptyFn;
							if (Ext.isArray(selectedRows) && selectedRows.length > 1) {
								delete data.recordId;
								data.recordIds = selectedRows;
								serviceConfig.methodName = "CreateReportsList";
								callback = function(response) {
									var keys = response.CreateReportsListResult;
									for (var i = 0; i < keys.length; i++) {
										this.downloadReport(printForm.getCaption(), keys[i]);
									}
								};
							} else {
								callback = function(response) {
									var key = response.CreateReportResult;
									this.downloadReport(printForm.getCaption(), key);
								};
							}
							this.callService(serviceConfig, function(response) {
								this.hideBodyMask();
								callback.call(this, response);
							}, this);
					//Den>
							this.sandbox.publish("PrintButtonPressed", null, [this.getCardModuleSandboxId()]); 
							this.set("isCSButtonVisible", false);
							next();
						},
					this
					);
					//Den<
				},
				
				/**
				 * Загружает отчет.
				 * @protected
				 * @param {String} caption Заголовок.
				 * @param {String} key Идентификатор отчета.
				 */
				downloadReport: function(caption, key) {
					var report = document.createElement("a");
					report.href = "../rest/ilayReportService/ilayGetReportFile/" + key;
					//report.download = caption; открываем сразу в браузере.
					//так же для этого в классе ReportService в методе GetReportFile установлено "Content-Disposition", "inline;
					document.body.appendChild(report);
					//report.click();
					window.open(report.href);
					document.body.removeChild(report);
				},
				
				/**
				 * Обрабатывает сообщение о завершении отрисовки страницы редактирования.
				 * from BaseSectionV2
				 * @protected
				 */
				onCardRendered: function() {
					this.callParent(arguments);
					this.refreshCardValuesCollection(this.initCardPrintForms, this);
				},
				
				/**
				 * Синхронный метод обновления атрибута ilayCardValuesCollection.
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
				initCardPrintForms: function(callback, scope) {
					var reportsEsq = this.getModulePrintFormsESQ();
					var reportsEsq = this.getModulePrintFormsESQ();
					if(!this.get("ilayCardValuesCollection")) {
						return;
					}
					var	docType = this.get("ilayCardValuesCollection").Type;
					var	docCategory = this.get("ilayCardValuesCollection").ilayCategory;
					var	docModel = this.get("ilayCardValuesCollection").ilayModelName;
					
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
						if (result.collection.isEmpty()) {
							this.set("IsCardPrintButtonVisible", false);
						}
						if (callback) {
							callback.call(scope || this);
						}
					}, this);
				},
				/**
				 * Возвращает признак отображения кнопки "Скасувати"
				 */
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
				},
				/**
				 * Нажата кнопка печать.
				 */
				"PrintButtonPressed": {
					mode: Terrasoft.MessageMode.PTP,
					direction: Terrasoft.MessageDirectionType.PUBLISH
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
