define("DocumentPageV2", ["BaseFiltersGenerateModule", "VisaHelper", "BusinessRuleModule", "ConfigurationConstants"],
	function(BaseFiltersGenerateModule, VisaHelper, BusinessRuleModule, ConfigurationConstants) {
		return {
			entitySchemaName: "Document",
			attributes: {},
			messages: {
				/**
				 * Нажата кнопка печать.
				 */
				"PrintButtonPressed": {
					mode: this.Terrasoft.MessageMode.PTP,
					direction: this.Terrasoft.MessageDirectionType.SUBSCRIBE
				}
			},
			details: /**SCHEMA_DETAILS*/{}/**SCHEMA_DETAILS*/,
			methods: {
				/**
				 * Выполняет подписки на сообщения, которые понадобятся странице
				 * @protected
				 * @virtual
				 */
				subscribeSandboxEvents: function() {
					this.callParent(arguments);
					this.sandbox.subscribe("PrintButtonPressed", this.setDocSigned, this, [this.sandbox.id]);
				},
				
				/**
				* Проверяет заполнены ли все обязательные поля в детали, и показывает кнопку печати.
				*/
				checkRequiredFieldsFilled: function (callback, scope) {
					var esq = Ext.create("Terrasoft.EntitySchemaQuery", {
						rootSchemaName: "ilayMedDocSpecific"
					});
					esq.addColumn("ilayFactValueForEditableGrid");
					esq.filters.addItem(esq.createColumnFilterWithParameter(
						this.Terrasoft.ComparisonType.EQUAL, "ilayMedDoc", this.get("Id")));
					esq.filters.addItem(esq.createColumnFilterWithParameter(
						this.Terrasoft.ComparisonType.EQUAL, "ilayIsRequired", true));
					esq.getEntityCollection(function(result) {
						if(result.success){
							var requiredFieldsFilled = true;
							for (var i = 0; i < result.collection.getCount(); i++) {
								if(result.collection.getByIndex(i).get("ilayFactValueForEditableGrid") === "") {
									requiredFieldsFilled = false;
								}
							}
							if(requiredFieldsFilled) {
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
				
				/**
				 * По нажатию на кнопку печать Документы с типом Медицинский и Бухгалтерский
				 * переводятся в состояние "Підписан"
				 * Генерирует отчет.
				 * @protected
				 * @param {Terrasoft.BaseViewModel} printForm Конфигурационный объект.
				 */
				generatePrintForm: function(printForm) {
					Terrasoft.chain(
						function(next) {
							if(this.get("Type").value === "2F3F339E-7A37-4772-8C87-C4DFF260B341".toLowerCase()){
								this.checkRequiredFieldsFilled(next, this);
							} else {
								next();
							}
						},
						function(next) {
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
								serviceName: "ReportService",
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
							this.setDocSigned();
							next();
						},
					this
					);
				},
				
				/**
				 * Документы с типом Медицинский и Бухгалтерский
				 * переводятся в состояние "Підписан"
				 */
				setDocSigned: function() {
					var docType = this.get("Type") ? this.get("Type").value : null,
						medDocType = "2F3F339E-7A37-4772-8C87-C4DFF260B341".toLowerCase(),
						buhDocType = "6CA82292-133E-4788-9E65-55A3C2C1E7BA".toLowerCase(),
						docSigned = "E40A989F-BBF3-4872-A4DC-361636E54F94".toLowerCase();
					if (docType === medDocType || docType === buhDocType) {
						this.loadLookupDisplayValue("State", docSigned);
					}
				},
				/**
				 * При открытии карточки фильтрует печатные формы по справочнику ilayDocReports
				 * @overridden
				 */
				initCardPrintForms: function(callback, scope) {
					var reportsEsq = this.getModulePrintFormsESQ();
					var	docType = this.get("Type").value;
					var	docCategory = this.get("ilayCategory") ? this.get("ilayCategory").value : null;
					var	docModel = this.get("ilayModelName") ? this.get("ilayModelName").value : null;
					
					//*****************************************************************
					var filterGroupByCategory = this.Terrasoft.createFilterGroup();
						filterGroupByCategory.logicalOperation = Terrasoft.LogicalOperatorType.OR;
						
					var byCategoryFilter = Terrasoft.createColumnFilterWithParameter(Terrasoft.ComparisonType.EQUAL,
						"=[ilayDocReports:ilayPrintForm:Id].ilayCategory", docCategory);
						filterGroupByCategory.add("byCategoryFilter", byCategoryFilter);
						
					var byCategoryNullFilter = 
						this.Terrasoft.createColumnIsNullFilter("=[ilayDocReports:ilayPrintForm:Id].ilayCategory");
						filterGroupByCategory.add("byCategoryNullFilter", byCategoryNullFilter);
					//*****************************************************************	
					var filterGroupByDocModel = this.Terrasoft.createFilterGroup();
						filterGroupByDocModel.logicalOperation = Terrasoft.LogicalOperatorType.OR;
					
					var byDocModelFilter = Terrasoft.createColumnFilterWithParameter(Terrasoft.ComparisonType.EQUAL,
						"=[ilayDocReports:ilayPrintForm:Id].ilayDocModel", docModel);
						filterGroupByDocModel.add("byDocModelFilter", byDocModelFilter);
						
					var byDocModelNullFilter = 
						this.Terrasoft.createColumnIsNullFilter("=[ilayDocReports:ilayPrintForm:Id].ilayDocModel");
						filterGroupByDocModel.add("byDocModelNullFilter", byDocModelNullFilter);
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
				}
			},
			rules: {},
			diff: /**SCHEMA_DIFF*/[]/**SCHEMA_DIFF*/
		};
	});
