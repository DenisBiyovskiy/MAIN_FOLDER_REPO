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
				 * По нажатию на кнопку печать Документы с типом Медицинский и Бухгалтерский
				 * переводятся в состояние "Підписан"
				 */
				generatePrintForm: function(printForm) {
					this.callParent(arguments);
					this.setDocSigned();
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
