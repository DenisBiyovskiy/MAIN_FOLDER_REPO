define("ilayTariffPlanSelectionViewModel", ["ilayTariffPlanSelectionViewModelResources", "MoneyModule", "MaskHelper",
	"ProductUtilitiesV2", "ProductManagementDistributionConstants"],
	function(resources, MoneyModule, MaskHelper, ProductUtilities, DistributionConstants) {
		/**
		 * Генерирует конфигурацию модели представления модуля выбора продуктов
		 * @param {Object} sandbox
		 * @param {Object} Terrasoft
		 * @param {Object} Ext
		 * @return {Object}
		 */
		function generate(sandbox, Terrasoft, Ext) {
			var viewModelConfig = {
				columns: {
					/**
					 * Наименование продукта
					 * @type {Terrasoft.dataValueType.TEXT}
					 */
					Name: {
						type: Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN,
						name: "Name"
					},
					//Den> [IL-439]
					ilayPackage: {
						type: Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN,
						name: "ilayPackage"
					},
					//Den< [IL-439]
					/**
					 * Цена продукта
					 * @type {Terrasoft.dataValueType.FLOAT}
					 */
					Price: {
						type: Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN,
						name: "Price"
					},
					
					ilayTypeCondition: {
						type: Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN,
						name: "ilayTypeCondition"
					},
					
					ilayConditionValue: {
						type: Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN,
						name: "ilayConditionValue"
					},
					
					ilayPriceValue: {
						type: Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN,
						name: "ilayPriceValue"
					}
				},
				values: {
					/**
					 * Название схемы
					 * @type {Terrasoft.dataValueType.TEXT}
					 */
					EntitySchemaName: "Product",

					/**
					 * Схема
					 * @type {Object}
					 */
					EntitySchema: null,

					/**
					 * Название схемы детали
					 * @type {Terrasoft.dataValueType.TEXT}
					 */
					ProductDetailEntitySchemaName: null,

					/**
					 * Схема детали
					 * @type {Terrasoft.dataValueType.TEXT}
					 */
					MasterEntitySchemaName: null,

					/**
					 * Идентификатор записи детали
					 * @type {Terrasoft.dataValueType.GUID}
					 */
					MasterRecordId: null,

					/**
					 * Запись детали
					 * @type {Object}
					 */
					MasterEntity: null,

					/**
					 * Текущее представление
					 * @type {Terrasoft.dataValueType.TEXT}
					 */
					CurrentDataView: "GridDataView",

					/**
					 * Коллекция представлений модуля
					 * @type {Terrasoft.Collection}
					 */
					DataViews: null,

					/**
					 * Коллекция записей реестра
					 * @type {Terrasoft.Collection}
					 */
					GridData: new Terrasoft.Collection(),

					/**
					 * Коллекция записей реестра представления
					 * @type {Terrasoft.Collection}
					 */
					DataViewGridCollection: new Terrasoft.Collection(),

					/**
					 * Коллекция записей реестра представления корзины
					 * @type {Terrasoft.Collection}
					 */
					BasketViewGridCollection: new Terrasoft.Collection(),

					/**
					 * Коллекция фильтров каталога
					 * @type {Object}
					 */
					CatalogueFilters: null,
					
					/**
					 * Заголовок колонки Код
					 * @type {Terrasoft.dataValueType.TEXT}
					 */
					CodeLabel: resources.localizableStrings.CodeCaption,

					/**
					 * Заголовок колонки Название
					 * @type {Terrasoft.dataValueType.TEXT}
					 */
					NameLabel: resources.localizableStrings.NameCaption,
					
					/**
					 * Заголовок колонки Пакет
					 * @type {Terrasoft.dataValueType.TEXT}
					 */
					ilayPackageLabel: resources.localizableStrings.PackageCaption,//Den [IL-439]

					/**
					 * Заголовок колонки Цена
					 * @type {Terrasoft.dataValueType.TEXT}
					 */
					PriceLabel: resources.localizableStrings.PriceCaption,
					
					ilayTypeConditionLabel: resources.localizableStrings.ilayTypeConditionCaption,
					
					ilayConditionValueLabel: resources.localizableStrings.ilayConditionValueCaption,
					
					ilayPriceValueLabel: resources.localizableStrings.ilayPriceValueCaption,
					/**
					 * Название модуля
					 * @type {Terrasoft.dataValueType.TEXT}
					 */
					ModuleName: "ilayTariffPlanSelectionModule",

					/**
					 * Признак того, что нужно пересчитать продукт.
					 * @type {Boolean}
					 */
					NeedRecalc: false,

					/**
					 * Признак того, что нужно сохранить набор после пересчета.
					 * @type {Boolean}
					 */
					NeedSave: false,
					
					MainTypeConditionEnumList: new Terrasoft.Collection()
				},
				methods: {
					/**
					 *
					 */
					onGetItemConfig: function() {
						//console.log(arguments);
					},
// Initialization
					/**
					 * Инициализирует модуль подбора продуктов.
					 * @protected
					 * @param {Object} config Конфиг.
					 */
					init: function(config) {
						MaskHelper.ShowBodyMask();
						this.registerMessages();
						if (config) {
							this.set("EntitySchema", config.EntitySchema);
							this.set("ProductDetailEntitySchemaName", config.productDetailEntitySchemaName || null);
							this.set("MasterEntitySchemaName", /*config.masterEntitySchemaName || null*/"ilayPricePlan");
							this.set("MasterRecordId", config.masterRecordId || null);
							this.requestMasterEntityData(this.initCallback);
						} else {
							this.initCallback();
						}
					},

					/**
					 * Дополнителная инициализация модуля
					 * Callback функция
					 * @protected
					 */
					initCallback: function() {
						this.set("CurrentDataView", "GridDataView");
						this.subscribeMessages();
						this.loadGridData();
					},

					/**
					 * Запрашивает данные по записи детали.
					 * @protected
					 * @param {Function} callback функция.
					 */
					requestMasterEntityData: function(callback) {
						if (this.get("MasterRecordId")) {
							var select = Ext.create("Terrasoft.EntitySchemaQuery", {
								rootSchemaName: this.get("MasterEntitySchemaName")
							});
							
							select.addMacrosColumn(Terrasoft.QueryMacrosType.PRIMARY_COLUMN, "Id");
							select.addColumn("ilayPriceStatus");
							select.addColumn("ilayPriceType");
							select.addMacrosColumn(Terrasoft.QueryMacrosType.PRIMARY_DISPLAY_COLUMN, "Name");
							select.getEntity(this.get("MasterRecordId"), function(result) {
								if (result.success) {
									this.set("MasterEntity", result.entity);
									callback.call(this);
								}
							}, this);
						}
					},

					/**
					 * Загружает следующую порцию записей в реестр
					 * @protected
					 */
					onLoadNext: function() {
						if (this.get("CurrentDataView") === "GridDataView") {
							this.loadGridData();
						}
					},

					/**
					 * Регистрация событий
					 * @protected
					 */
					registerMessages: function() {
						var messages = {
							/**
							 * @message CardSaved
							 * Принимает информацию, о том, что родительская страница сохранилась
							 */
							"CardSaved": {
								mode: Terrasoft.MessageMode.BROADCAST,
								direction: Terrasoft.MessageDirectionType.PUBLISH
							}

						};
						sandbox.registerMessages(messages);
					},

					/**
					 * Удаление регистрации событий
					 * @protected
					 */
					unRegisterMessages: function() {
						sandbox.unRegisterMessages(["ChangeDataView"]);
					},

					/**
					 * Подписка на события
					 * @protected
					 */
					subscribeMessages: function() {
						sandbox.subscribe("ChangeDataView", this.changeDataView, this,
							["ViewModule_MainHeaderModule_" + this.get("ModuleName")]);
						this.initDataViews(false);
						sandbox.subscribe("NeedHeaderCaption", function() {
							this.initDataViews();
						}, this);
					},

					/**
					 * Инициализирует верхнюю панель.
					 * @protected
					 * @param {Boolean} isCommandLineVisible
					 */
					initDataViews: function(isCommandLineVisible) {
						sandbox.publish("InitDataViews", {
							caption: this.getModuleCaption(),
							dataViews: this.getDataViews(),
							isCommandLineVisible: isCommandLineVisible,
							moduleName: this.get("ModuleName")
						});
					},

					/**
					 * Изменяет текущее представление.
					 * @protected
					 * @param {Object} viewConfig Конфиг представления.
					 */
					changeDataView: function(viewConfig) {
						if (viewConfig.moduleName === this.get("ModuleName")) {
							if (this.get("CurrentDataView") === viewConfig.tag) {
								return;
							}
							var wAC = Ext.get("workingAreaContainer");
							if (viewConfig.tag === "BasketDataView") {
								this.set("CurrentDataView", viewConfig.tag);
								if (!wAC.hasCls("no-folders")) {
									wAC.addCls("no-folders");
								}
								this.saveDataViewGridCollection();
								this.loadBasketGridData();
								sandbox.publish("UpdateQuickSearchFilterString", {
									newSearchStringValue: "",
									newSearchStringValue1: "",
									autoApply: false
								});
							} else {
								this.set("CurrentDataView", viewConfig.tag);
								wAC.removeCls("no-folders");
								sandbox.publish("UpdateQuickSearchFilterString", {
									newSearchStringValue: this.get("QuickSearchFilterString"),
									newSearchStringValue1: this.get("QuickSearchFilterString1"),
									autoApply: false
								});
								this.reloadDataViewGridCollection();
							}
						}
					},

					/**
					 * Выполняет Сохранение коллекции представления данных
					 * @protected
					 */
					saveDataViewGridCollection: function() {
						var gridData = this.getGridData();
						var dataCollection = new Terrasoft.Collection();
						gridData.each(function(item) {
							dataCollection.add(item.get("Id"), item);
						}, this);
						this.set("DataViewGridCollection", dataCollection);
					},

					/**
					 * Выполняет перезагрузку представления данных
					 * @protected
					 */
					reloadDataViewGridCollection: function() {
						var collection = this.get("DataViewGridCollection");
						var basket = this.getBasketData();
						basket.each(function(basketItem) {
							var basketItemConditionValue = basketItem.get("ilayConditionValue");
							var basketItemTypeCondition = basketItem.get("ilayTypeCondition");
							var item = collection.find(basketItem.get("Id"));
							if (item) {
								var conditionValue = item.get("ilayConditionValue");
								if (basketItemConditionValue !== conditionValue) {
									item.set("ilayConditionValue", basketItemConditionValue);
								}
								var typeCondition = item.get("ilayTypeCondition");
								if (typeCondition !== basketItemTypeCondition) {
									item.set("ilayTypeCondition", basketItemTypeCondition);
								}
							}
						}, this);
						var gridData = this.getGridData();
						gridData.clear();
						gridData.loadAll(collection);
					},

					/**
					 * Выполняет загрузку представления корзины
					 * @protected
					 * @virtual
					 */
					loadBasketGridData: function() {
						var dataCollection = new Terrasoft.Collection();
						var basket = this.getBasketData();
						basket.each(function(item) {
							if ((item.get("ilayConditionValue") > 0 && item.get("ilayTypeCondition")) || 
								(item.get("ilayTypeCondition") && item.get("ilayTypeCondition").value == "62164daa-693e-4da2-8748-8b58f9735baf")) { // інше
								var cloneItem = this.cloneProduct(item);
								this.prepareItem(cloneItem);
								cloneItem.on("change", this.onDataGridItemChanged, this);
								cloneItem.on("change:ilayTypeCondition", this.onTypeConditionChanged, this);
								cloneItem.on("change:ilayConditionValue", this.onConditionValueChanged, this);
								dataCollection.add(cloneItem.get("Id"), cloneItem);
							}
						}, this);
						var gridData = this.getGridData();
						gridData.clear();
						gridData.loadAll(dataCollection);
						this.set("BasketViewGridCollection", dataCollection);
					},

					/**
					 * Клонирует запись продукта.
					 * @param {Object} product Продукт.
					 * @return {BaseViewModel} Возвращает копию записи продукта.
					 */
					cloneProduct: function(product) {
						var values = Ext.apply(product.values, product.changedValues);
						return this.getGridRecordByItemValues(values, this.get("EntitySchema"));
					},

					/**
					 * Выполняет загрузку представления списка
					 * @protected
					 * @virtual
					 */
					loadGridData: function(rowCount, callback) {//Den 
						MaskHelper.ShowBodyMask();
						var sortColumnLastValue = this.get("sortColumnLastValue");
						var batchQuery = Ext.create("Terrasoft.BatchQuery");
						var esq = this.getGridDataESQ();
						rowCount ? esq.rowCount = rowCount : esq.rowCount = 30;//Den
						this.initQueryColumns(esq);
						esq.addColumn("[ilayPriceForService:ilayService:Id].ilayPackage.Name","ilayPackageName");//Den
						//esq.addColumn("ilayPackage");//Den
						this.initQueryFilters(esq);
						esq.filters.add("NotPackageFilter",
								Terrasoft.createColumnFilterWithParameter(Terrasoft.ComparisonType.NOT_EQUAL,
									"Category",
									"CFD4842D-437B-42B1-8D32-13F6041F3767"));
						this.initializePageableOptions(esq, sortColumnLastValue);
						esq.isDistinct = true;
						batchQuery.add(esq);
						var masterEntity = this.get("MasterEntity");
						if (masterEntity) {
							var esqEntitySchemaName  = "ilayPriceForService";
							var partColumnName = "[" + esqEntitySchemaName + ":ilayService:Id].";
							//BasePricePlan priceValue subquery
							var itemConfig = {
								columnPath: partColumnName + "ilayPriceValue",
								parentCollection: this
							};
							var column = Ext.create("Terrasoft.SubQueryExpression", itemConfig);
							/*column.subFilters.addItem(Terrasoft.createColumnFilterWithParameter(Terrasoft.ComparisonType.EQUAL, 
										"ilayService",
										partColumnName + "Id"));*/
							column.subFilters.addItem(Terrasoft.createFilter(Terrasoft.ComparisonType.EQUAL, 
										"ilayPackage",
										partColumnName + "ilayPackage.Id"));
							/*column.subFilters.addItem(Terrasoft.createFilter(Terrasoft.ComparisonType.EQUAL, 
										"ilayPackage",
										partColumnName + "ilayPackage"));*/
							//----------
							/*var subQuery = this.getGridDataESQ();
							subQuery.addColumn("ilayPriceValue");
							this.initQueryFilters(subQuery);
							subQuery.filters.add("SubServiceFilter", 
									Terrasoft.createColumnFilterWithParameter(Terrasoft.ComparisonType.EQUAL, 
										"ilayService",
										partColumnName + "Id"));
							subQuery.filters.add("SubPackageFilter", 
									Terrasoft.createColumnFilterWithParameter(Terrasoft.ComparisonType.EQUAL, 
										"ilayPackage",
										partColumnName + "ilayPackage"));*/
							//BasePricePlan priceValue subquery
							var productInCountEsq = this.getGridDataESQ();
							productInCountEsq.addColumn(partColumnName + "Id", esqEntitySchemaName + "Id");
							productInCountEsq.addColumn(partColumnName + "ilayService.Code", "Code");
							if (masterEntity.get("ilayPriceType") && masterEntity.get("ilayPriceType").value === "d7c71086-bb98-48ef-88d3-b025487ed787")
							{
								productInCountEsq.addColumn(partColumnName + "ilayService.Price", "Price");
							} else {
								var esqColumn = productInCountEsq.addColumn("Price");
								esqColumn.expression = column;
							}
							productInCountEsq.addColumn(partColumnName + "ilayTypeCondition", "ilayTypeCondition");
							productInCountEsq.addColumn(partColumnName + "ilayConditionValue", "ilayConditionValue");
							productInCountEsq.addColumn(partColumnName + "ilayPriceValue", "ilayPriceValue");
							productInCountEsq.addColumn(partColumnName + "ilayPackage", "ilayPackage");//Den [IL-439]
							productInCountEsq.addColumn(partColumnName + "ilayPackage.Name", "ilayPackageName");//Den [IL-439]
							productInCountEsq.filters.addItem(
								Terrasoft.createColumnFilterWithParameter(Terrasoft.ComparisonType.EQUAL,
									Ext.String.format("{0}{1}.Id", partColumnName, "ilayPrice"),
									masterEntity.get("Id")));
							//Den> Убран следующий фильтр, чтобы в подпоре отображались с типом "Інше", и не указанным ilayConditionValue.
							//productInCountEsq.filters.addItem(Terrasoft.createColumnIsNotNullFilter(partColumnName + "ilayConditionValue"));
							//а этот, чтобы отображались добавленные триггером с пустыми значениями.
							//productInCountEsq.filters.addItem(Terrasoft.createColumnIsNotNullFilter(partColumnName + "ilayTypeCondition"));
							//Den<
							this.initQueryFilters(productInCountEsq);
							batchQuery.add(productInCountEsq);
						}
						this.set("sortColumnLastValue", null);
						batchQuery.execute(function(response) {
							if(typeof callback === "function") {
								this.onGridDataLoaded(response, callback);
							} else {
								this.onGridDataLoaded(response);
							}
						}, this);//Den
					},

// Grid
					/**
					 * Создает экземпляр класса Terrasoft.EntitySchemaQuery.
					 * Инициализирует его свойствами rootSchema.
					 * @protected
					 * @return {Terrasoft.EntitySchemaQuery} Возвращает экземпляр класса Terrasoft.EntitySchemaQuery.
					 */
					getGridDataESQ: function() {
						var esq = Ext.create("Terrasoft.EntitySchemaQuery", {
							rootSchemaName: this.get("EntitySchemaName")
						});
						esq.addMacrosColumn(Terrasoft.QueryMacrosType.PRIMARY_COLUMN, "Id");
						var column = esq.addMacrosColumn(Terrasoft.QueryMacrosType.PRIMARY_DISPLAY_COLUMN, "Name");
						column.orderPosition = 0;
						column.orderDirection = Terrasoft.OrderDirection.ASC;
						return esq;
					},

					/**
					 * Инициализирует колонки запроса
					 * @protected
					 * @param {Terrasoft.EntitySchemaQuery} esq
					 */
					initQueryColumns: function(esq) {
						esq.addColumn("Price");
						esq.addColumn("Code");
					},

					/**
					 * Инициализирует фильтры запроса
					 * @protected
					 * @param {Terrasoft.EntitySchemaQuery} esq
					 */
					initQueryFilters: function(esq) {
						var catalogueFilters = this.get("CatalogueFilters");
						var quickSearchFilters = this.get("QuickSearchFilters");
						if (catalogueFilters) {
							esq.filters.add("CatalogueFilters", catalogueFilters);
						}
						if (quickSearchFilters) {
							esq.filters.add("QuickSearchFilters", quickSearchFilters);
						}
					},

					/**
					 * Обрабатывает ответ запроса загрузки данных для реестра.
					 * @protected
					 * @param {Object} response Ответ сервера.
					 */
					onGridDataLoaded: function(response, callback) {//Den
						if (!response.success) {
							return;
						}
						var dataCollection = new Terrasoft.Collection();
						this.prepareResponseCollection(dataCollection, response);
						var lastValue = null;
						var gridData = this.getGridData();
						var canLoadData = false;
						if (dataCollection.getCount()) {
							var lastItemIndex = dataCollection.getCount() - 1;
							var lastItem = dataCollection.getByIndex(lastItemIndex);
							var products = gridData.collection.filterBy(
								function(res) {
									var resId = res.get("RealRecordId");
									return resId === lastItem.get("RealRecordId");
								}
							);
							if ((products.length <= 0)) {
								lastValue = lastItem.get("Name");
								canLoadData = true;
							}
						}
						this.set("sortColumnLastValue", lastValue);
						if (canLoadData) {
							gridData.loadAll(dataCollection);
						}
						MaskHelper.HideBodyMask();
						if(typeof callback === "function") callback(this);//Den
					},

					/**
					 * Возвращает тип данных колонки
					 * @protected
					 * @param {Object} record Элемент коллекции виз
					 * @param {String} columnName Название колонки
					 * @returns {Object} Тип данных колонки
					 */
					getDataValueType: function(record, columnName) {
						var recordColumn = record.columns[columnName] ?
							record.columns[columnName] :
							record.entitySchema.columns[columnName];
						return recordColumn ? recordColumn.dataValueType : null;
					},

					/**
					 * Инициализирует свойства постраничности EntitySchemaQuery
					 * @protected
					 * @param {Terrasoft.EntitySchemaQuery} select Запрос
					 * @param {String} sortColumnLastValue Последнее значение в реестре
					 * @private
					 */
					initializePageableOptions: function(select, sortColumnLastValue) {
						if (sortColumnLastValue && this.get("GridData").getCount()) {
							select.filters.add("LastValueFilter", Terrasoft.createColumnFilterWithParameter(
								Terrasoft.ComparisonType.GREATER,
								"Name", sortColumnLastValue));
						}
					},

					/**
					 * Возвращает конфигурацию колонок записи в реестре
					 * @returns {Object}
					 */
					getProductRowConfig: function() {
						var rowConfig = {
							Code: {
								dataValueType: Terrasoft.DataValueType.TEXT
							},
							Id: {
								dataValueType: Terrasoft.DataValueType.GUID
							},
							Name: {
								dataValueType: Terrasoft.DataValueType.TEXT
							},
							Price: {
								dataValueType: Terrasoft.DataValueType.FLOAT
							},
							ilayTypeCondition: {
								dataValueType: Terrasoft.DataValueType.LOOKUP,
								isLookup: true,
								referenceSchemaName: "ilayConditionType"
							},
							//Den>
							ilayPackage: {
								dataValueType: Terrasoft.DataValueType.TEXT
							},
							//Den<
							ilayConditionValue: {
								dataValueType: Terrasoft.DataValueType.FLOAT
							},
							ilayPriceValue: {
								dataValueType: Terrasoft.DataValueType.FLOAT
							}
						};
						return rowConfig;
					},

					/**
					 * Возвращает стандартную конфигурацию строки реестра.
					 * @protected
					 * @param {Terrasoft.Collection} rowValues Значения строки.
					 * @param {Terrasoft.EntitySchema} entitySchema Схема записи.
					 * @return {BaseViewModel}
					 */
					getGridRecordByItemValues: function(rowValues, entitySchema) {
						var gridRecord = Ext.create("Terrasoft.BaseViewModel", {
							entitySchema: entitySchema,
							rowConfig: this.getProductRowConfig(),
							values: rowValues,
							isNew: false,
							isDeleted: false,
							methods: {

							}
						});
						return gridRecord;
					},

					/**
					 * Модифицирует коллекции данных перед загрузкой в реестр.
					 * @protected
					 * @param {Terrasoft.Collection} collection Коллекция элементов реестра.
					 * @param {Object} response Ответ сервера.
					 */
					prepareResponseCollection: function(collection, response) {
						var esqEntitySchemaName = "ilayPriceForServiceId";
						var productSelectResponse = response.queryResults[0];
						var productInEntityResponse = response.queryResults[response.queryResults.length - 1];
						var basket = this.getBasketData();
						Terrasoft.each(productInEntityResponse.rows, function(row) {
							var item = this.getGridRecordByItemValues(row, this.get("EntitySchema"));
							var itemId = item.get("Id");
							item.set("RealRecordId", itemId);
							//Den>
							var packageId = item.get("ilayPackage") ? item.get("ilayPackage").value : null;
							
							var customKey = packageId ? itemId + "_" + item.get(esqEntitySchemaName) + "_" + packageId
													  : itemId + "_" + item.get(esqEntitySchemaName);
							//Den<
							item.set("Id", customKey);
							var masterEntity = this.get("MasterEntity");
							var entityCaption = Terrasoft.configuration.ModuleStructure[this.get("MasterEntitySchemaName")];
							entityCaption = entityCaption.moduleCaption.substr(0, entityCaption.moduleCaption.length - 1);
							var captionMasterEntity = entityCaption + " " + masterEntity.get("Name");
							if (!basket.contains(customKey)) {
								basket.add(customKey, item);
							}
						}, this);
						basket.each(function(item) {
							var products = productSelectResponse.rows.filter(
								function(res) {
									var resId = res.RealRecordId || res.Id;
									return resId === item.get("RealRecordId");
								}
							);
							if (products.length) {
								var detailRecordId = item.get(esqEntitySchemaName);
								Terrasoft.each(products, function(pr) {
									var product = Terrasoft.deepClone(pr);
									var productId = product.RealRecordId || product.Id;
									//Den>
									var packageId = item.get("ilayPackage") ? item.get("ilayPackage").value : null;
									var customKey = detailRecordId && packageId 
													? productId + "_" + detailRecordId + "_" + packageId 
													: productId + "_" + detailRecordId; 
									//Den<
									product.RealRecordId = productId;
									product.Id = customKey;
									product.Price = item.get("Price");
									product.Code = item.get("Code");
									product[esqEntitySchemaName] = item.get(esqEntitySchemaName);
									product.Name = item.get("Name");
									product.ilayPackage = item.get("ilayPackage");//Den [IL-439]
									
									product.ilayTypeCondition = item.get("ilayTypeCondition");
									product.ilayConditionValue = item.get("ilayConditionValue");
									//product.ilayPriceValue = ProductUtilities.getFormattedNumberValue(item.get("ilayPriceValue"));
									product.ilayPriceValue = item.get("ilayPriceValue");
									
									var masterEntity = this.get("MasterEntity");
									Ext.Array.insert(productSelectResponse.rows,
										Ext.Array.indexOf(productSelectResponse.rows, pr, 0), [product]);
									if (productId === pr.Id && !packageId) {
										Ext.Array.remove(productSelectResponse.rows, pr);
									}
								}, this);
							}
						}, this);
						if (!Ext.isEmpty(this.get("QuickSearchFilterString1"))) {
							Terrasoft.each(productInEntityResponse.rows, function(row) {
								var item = this.getGridRecordByItemValues(row, this.get("EntitySchema"));
								this.prepareItem(item);
								var price = item.get("Price");
								item.on("change", this.onDataGridItemChanged, this);
								item.on("change:ilayTypeCondition", this.onTypeConditionChanged, this);
								item.on("change:ilayConditionValue", this.onConditionValueChanged, this);
								var gridData = this.getGridData();
								if (!collection.contains(row.Id) && !gridData.contains(row.Id)) {
									collection.add(row.Id, item);
								}
							}, this);
							this.calcSummary();
						} else {
							Terrasoft.each(productSelectResponse.rows, function(row) {
								var item = this.getGridRecordByItemValues(row, this.get("EntitySchema"));
								this.prepareItem(item);
								var price = item.get("Price");
								item.on("change", this.onDataGridItemChanged, this);
								item.on("change:ilayTypeCondition", this.onTypeConditionChanged, this);
								item.on("change:ilayConditionValue", this.onConditionValueChanged, this);
								var gridData = this.getGridData();
								if (!collection.contains(row.Id) && !gridData.contains(row.Id)) {
									collection.add(row.Id, item);
								}
							}, this);
							this.calcSummary();
						}
					},
					
					onTypeConditionChanged: function(model, item) {
						this.set("NeedRecalc", true);
						model.validate = this.validate;
						if(model) {
							var price = parseFloat(model.get("Price"));
							if(model.get("ilayConditionValue") > 0 && model.get("ilayTypeCondition")) {
								var discount = price / 100 * parseFloat(model.get("ilayConditionValue"));
								var priceValue = 0.0;
								if(model.get("ilayTypeCondition").value == "21e484f9-1557-4a8e-98af-58874d18701f") { // скидка
									//priceValue = ProductUtilities.getFormattedNumberValue(price - discount);
									priceValue = price - discount;
									model.set("ilayPriceValue", priceValue);
									this.set("NeedRecalc", false);
								}else{
									if(model.get("ilayTypeCondition").value == "645F9902-0FE3-4981-960A-AE62D18E7031".toLowerCase()) {//Націнка
										//priceValue = ProductUtilities.getFormattedNumberValue(price + discount);
										priceValue = price + discount;
										model.set("ilayPriceValue", priceValue);
										this.set("NeedRecalc", false);
									} else {//Інше //Den
										priceValue = price;
										model.set("ilayPriceValue", priceValue);
										this.set("NeedRecalc", false);
									}
								}
							}else{
								//model.set("ilayPriceValue", ProductUtilities.getFormattedNumberValue(price));
								model.set("ilayPriceValue", price);
								this.set("NeedRecalc", false);
							}
						}
					},
					
					onConditionValueChanged: function(model, item, options) {
						this.onTypeConditionChanged(model, item, options);
					},
					
					fillTypeConditionItems: function(filter, list) {
						if (list === null) {
							return;
						}
						list.clear();
						var select = Ext.create("Terrasoft.EntitySchemaQuery", {
							rootSchemaName: "ilayConditionType"
						});
						select.addMacrosColumn(Terrasoft.QueryMacrosType.PRIMARY_COLUMN, "Id");
						var column = select.addMacrosColumn(Terrasoft.QueryMacrosType.PRIMARY_DISPLAY_COLUMN, "Name");
						column.orderDirection = Terrasoft.OrderDirection.ASC;
						select.getEntityCollection(function(result) {
							var collection = result.collection;
							var columns = {};
							if (collection && collection.collection.length > 0) {
								Terrasoft.each(collection.collection.items, function(item) {
									var id = item.get("Id");
									var it = {
										displayValue: item.get("Name"),
										value: id
									};
									if (!list.contains(id)) {
										columns[id] = it;
									}
								}, this);
								list.loadAll(columns);
							}
						}, this);
					},
					//Den>
					// fillPackagesList: function(filter, list) {
					// 	if (list === null) {
					// 		return;
					// 	}
					// 	list.clear();
					// 	var select = Ext.create("Terrasoft.EntitySchemaQuery", {
					// 		rootSchemaName: "Product"
					// 	});
					// 	select.addMacrosColumn(Terrasoft.QueryMacrosType.PRIMARY_COLUMN, "Id");
					// 	select.filters.addItem(select.createColumnFilterWithParameter(
					// 		Terrasoft.ComparisonType.EQUAL, "Category", "cfd4842d-437b-42b1-8d32-13f6041f3767"))//Пакет
					// 	var column = select.addMacrosColumn(Terrasoft.QueryMacrosType.PRIMARY_DISPLAY_COLUMN, "Name");
					// 	column.orderDirection = Terrasoft.OrderDirection.ASC;
					// 	select.getEntityCollection(function(result) {
					// 		var collection = result.collection;
					// 		var columns = {};
					// 		if (collection && collection.collection.length > 0) {
					// 			Terrasoft.each(collection.collection.items, function(item) {
					// 				var id = item.get("Id");
					// 				var it = {
					// 					displayValue: item.get("Name"),
					// 					value: id
					// 				};
					// 				if (!list.contains(id)) {
					// 					columns[id] = it;
					// 				}
					// 			}, this);
					// 			list.loadAll(columns);
					// 		}
					// 	}, this);
					// },
					//Den<
					mainFillTypeConditionItems: function (filter, list) {
						if (list === null) {
							return;
						}
						list.clear();
						var select = Ext.create("Terrasoft.EntitySchemaQuery", {
							rootSchemaName: "ilayConditionType"
						});
						select.addMacrosColumn(Terrasoft.QueryMacrosType.PRIMARY_COLUMN, "Id");
						var column = select.addMacrosColumn(Terrasoft.QueryMacrosType.PRIMARY_DISPLAY_COLUMN, "Name");
						column.orderDirection = Terrasoft.OrderDirection.ASC;
						select.filters.addItem(select.createColumnFilterWithParameter(
							Terrasoft.ComparisonType.NOT_EQUAL, "Id", "62164daa-693e-4da2-8748-8b58f9735baf")); // Інше
						select.getEntityCollection(function(result) {
							var collection = result.collection;
							var columns = {};
							if (collection && collection.collection.length > 0) {
								Terrasoft.each(collection.collection.items, function(item) {
									var id = item.get("Id");
									var it = {
										displayValue: item.get("Name"),
										value: id
									};
									if (!list.contains(id)) {
										columns[id] = it;
									}
								}, this);
								list.loadAll(columns);
							}
						}, this);
					},
					
					onApplytoAllButtonClick: function() {//Den
						var model = this.get("GridData").collection.items[0].model;
						//var arr = this.get("GridData").collection.items;//Den
						this.loadGridData(-1, function(scope) {
							var arr = scope.get("GridData").collection.items;//Den
							var mainTypeCondition = scope.get("MainTypeCondition");
							var mainConditionValue = scope.get("MainConditionValue");
							if (model && (mainTypeCondition || mainConditionValue)) {
								for(var i = 0; i < arr.length; i++){
									if(mainConditionValue && scope.get("GridData").collection.items[i].model.get("ilayConditionValue") != mainConditionValue) {
										scope.get("GridData").collection.items[i].model.set("ilayConditionValue", ProductUtilities.getFormattedNumberValue(mainConditionValue));
									}
									var ilayTypeCond = scope.get("GridData").collection.items[i].model.get("ilayTypeCondition");
									if(mainTypeCondition && ilayTypeCond != mainTypeCondition) {
										if(ilayTypeCond ? ilayTypeCond.value === "62164DAA-693E-4DA2-8748-8B58F9735BAF".toLowerCase() : false) {
											scope.get("GridData").collection.items[i].model.set("ilayConditionValue", ProductUtilities.getFormattedNumberValue(100));
										} else {
											scope.get("GridData").collection.items[i].model.set("ilayTypeCondition", mainTypeCondition);
										}
									}
								}
							}
						}, this);
					},
					
					/**
					 * Обрабатывает запись продукта перед загрузкой в реестр
					 * @protected
					 * @param {Object} item Запись продукта.
					 */
					prepareItem: function(item) {
						item.sandbox = sandbox;
						if (!item.get("RealRecordId")) {
							item.set("RealRecordId", item.get("Id"));
						}
						item.set("MasterEntitySchemaName", this.get("MasterEntitySchemaName"));
						item.set("MasterRecordId", this.get("MasterRecordId"));
						
						item.set("TypeConditionEnumList", new Terrasoft.Collection());
						item.set("packagesList", new Terrasoft.Collection());
						var packageName = item.get("ilayPackage") ? item.get("ilayPackage").displayValue : "";//Den
						item.set("ilayPackage", packageName);//Den
						item.fillTypeConditionItems = this.fillTypeConditionItems;
						//item.fillPackagesList = this.fillPackagesList;//Den
						
						var price = item.get("Price");
						if (!price) {
							price = 0;
						}
						item.set("Price", parseFloat(price).toFixed(2));
						item.set("PriceDisplayValue", ProductUtilities.getFormattedNumberValue(price));
						
						var ilayPriceValue = item.get("ilayPriceValue");
						if(!ilayPriceValue) {
							ilayPriceValue = 0;
						}
						//ilayPriceValue = ilayPriceValue.toString().replace(/\s/g, '');
						//item.set("ilayPriceValue", ProductUtilities.getFormattedNumberValue(ilayPriceValue));
						item.set("ilayPriceValue", ilayPriceValue);
					},
					/**
					 * Выделяет и собирает измененные элементы, чтобы потом сохранить.
					 * @protected
					 * @param {BaseViewModel} item Продукт.
					 */
					onDataGridItemChanged: function(item) {
						var basket = this.getBasketData();
						var itemId = item.get("Id");
						var itemConditionValue = item.get("ilayConditionValue") || 0;
						if (itemConditionValue < 0) {
							itemConditionValue = 0;
							item.set("ilayConditionValue", 0);
						}
						var itemTypeCondition = item.get("ilayTypeCondition");
						var existingItem = basket.find(itemId);
						if ((itemConditionValue > 0 && itemTypeCondition) || (itemTypeCondition && itemTypeCondition.value == "62164daa-693e-4da2-8748-8b58f9735baf")) {
							if (!existingItem) {
								basket.add(itemId, item);
								existingItem = basket.find(itemId);
							} else {
								existingItem.set("ilayConditionValue", itemConditionValue);
								existingItem.set("ilayPriceValue", item.get("ilayPriceValue"));
								existingItem.set("ilayTypeCondition", item.get("ilayTypeCondition"));
								//existingItem.set("ilayPackage", item.get("ilayPackage"));//Den
							}
						} else if (existingItem) {
							basket.removeByKey(itemId);
						}
						if (existingItem && item) {
							this.calcSummary();
						}
					},
					/**
					 * Получает коллекцию выбранных элементов реестра.
					 * @protected
					 * @returns {Object} Возвращает коллекцию данных корзины
					 */
					getBasketData: function() {
						var baskedData = this.get("BasketData");
						if (!baskedData) {
							baskedData = new Terrasoft.Collection();
							this.set("BasketData", baskedData);
						}
						return baskedData;
					},

					/**
					 * Получает коллекцию элементов реестра.
					 * @protected
					 * @returns {Object} Возвращает коллекцию данных
					 */
					getGridData: function() {
						var gridData = this.get("GridData");
						if (!gridData) {
							gridData = new Terrasoft.Collection();
							this.set("GridData", gridData);
						}
						return gridData;
					},
					/**
					 * Получает коллекцию представлений модуля.
					 * @protected
					 * @returns {Collection}
					 */
					getDataViews: function() {
						var moduleCaption = this.getModuleCaption();
						var gridDataView = {
							name: "GridDataView",
							active: true,
							caption: moduleCaption,
							hint: resources.localizableStrings.ProductsListDataViewHint,
							icon: resources.localizableImages.GridDataViewIcon
						};
						var basketDataView = {
							name: "BasketDataView",
							caption: moduleCaption,
							hint: resources.localizableStrings.CartDataViewHint,
							icon: resources.localizableImages.BasketDataViewIcon
						};
						var dataViews = Ext.create("Terrasoft.Collection");
						dataViews.add(gridDataView.name, gridDataView, 0);
						dataViews.add(basketDataView.name, basketDataView, 1);
						this.set("DataViews", dataViews);
						return dataViews;
					},

					/**
					 * Получает заголовок модуля.
					 * @protected
					 * @returns {string}
					 */
					getModuleCaption: function() {
						var entity = this.get("MasterEntity");
						//var entityCaption = this.getEntityCaption();
						return /*"Тарифний план" + " " + */entity.get("Name");
					},

					/**
					 * Получает заголовок сущности.
					 * @protected
					 * @returns {string}
					 */
					getEntityCaption: function() {
						var entityCaption = Terrasoft.configuration.ModuleStructure[this.get("MasterEntitySchemaName")];
						return entityCaption.moduleCaption.substr(0, entityCaption.moduleCaption.length - 1);
					},

					/**
					 * Обрабатывает нажатие на колонку Доступно в реестре
					 * @protected
					 */
					onAvailableClick: function() {
						//console.log(arguments);
					},

// Summary
					/**
					 * Вычисляет строку итогов по выбранным продуктам
					 * @protected
					 */
					calcSummary: function() {
						var totalAmount = 0.0;
						var lineItemsCount = 0;

						var basket = this.getBasketData();
						basket.each(function(item) {
							var isTypeCondition = Ext.isEmpty(item.get("ilayTypeCondition"));
							var conditionValue = parseFloat(item.get("ilayConditionValue"));
							//var priceValue = item.get("ilayPriceValue").toString().replace(/\s/g, ''); // удалить пробелы
							//totalAmount += (!isTypeCondition && conditionValue > 0) ? parseFloat(priceValue) : 0.0;
							var priceValue = item.get("ilayPriceValue");
							totalAmount += (!isTypeCondition && conditionValue > 0) ? /*parseFloat(priceValue)*/priceValue : 0.0;
							var count = (!isTypeCondition && conditionValue > 0) ||
								(!isTypeCondition && item.get("ilayTypeCondition").value == "62164daa-693e-4da2-8748-8b58f9735baf") ? 1 : 0;
							lineItemsCount += count;
						}, this);

						this.set("TotalAmount", ProductUtilities.getFormattedNumberValue(totalAmount));
						this.set("LineItemsCount", lineItemsCount);
					},

					/**
					 * Выпоняет сохранение выбранных продуктов и обновление существующих.
					 * @protected
					 */
					saveSelectedProducts: function() {
						if (this.get("NeedRecalc") === true) {
							this.set("NeedSave", true);
							return;
						}
						MaskHelper.ShowBodyMask();
						var selectedProducts = this.getBasketData();
						if (Ext.isEmpty(this.get("MasterEntitySchemaName")) ||
							Ext.isEmpty(this.get("MasterRecordId")) ||
							(selectedProducts.getCount() < 1)) {
							this.afterSave();
							return;
						}
						var batchQuery = Ext.create("Terrasoft.BatchQuery");
						var rootSchemaName = "ilayPriceForService";
						selectedProducts.each(function(item) {
							if (item.get("ilayPriceForServiceId")) {
								var update = Ext.create("Terrasoft.UpdateQuery", {
									rootSchemaName: rootSchemaName
								});
								update.filters.add("IdFilter", Terrasoft.createColumnFilterWithParameter(Terrasoft.ComparisonType.EQUAL, "Id",
									item.get("ilayPriceForServiceId")));	
								if (item.get("ilayTypeCondition")) {
									update.setParameterValue("ilayTypeCondition",
										item.get("ilayTypeCondition").value, Terrasoft.DataValueType.GUID);
								}
								//Den>
								// if (item.get("ilayPackage")) {
								// 	update.setParameterValue("ilayPackage",
								// 		item.get("ilayPackage").value, Terrasoft.DataValueType.GUID);
								// }
								//Den<
								if (item.get("ilayConditionValue")) {
									var conditionValue = parseFloat(item.get("ilayConditionValue").toString().replace(/\s/g, '').replace(",", "."));
									update.setParameterValue("ilayConditionValue",
										conditionValue, Terrasoft.DataValueType.FLOAT);
								}
								if (item.get("ilayPriceValue")) {
									//var priceValue = parseFloat(item.get("ilayPriceValue").toString().replace(/\s/g, '').replace(",", "."));
									var priceValue = item.get("ilayPriceValue");
									update.setParameterValue("ilayPriceValue",
										priceValue, Terrasoft.DataValueType.FLOAT);
								}
								if(this.get("MasterEntity") && this.get("MasterEntity").get("ilayPriceStatus")) {
									update.setParameterValue("ilayPriceStatus",
										this.get("MasterEntity").get("ilayPriceStatus").value, Terrasoft.DataValueType.GUID);
								}
								batchQuery.add(update);
							}else{
								var insert = Ext.create("Terrasoft.InsertQuery", {
									rootSchemaName: rootSchemaName
								});
								if (this.get("MasterRecordId")) {
									insert.setParameterValue("ilayPrice",
										this.get("MasterRecordId"), Terrasoft.DataValueType.GUID);
								}
								if (item.get("Id")) {
									insert.setParameterValue("ilayService",
										item.get("Id"), Terrasoft.DataValueType.GUID);
								}
								
								if (item.get("ilayTypeCondition")) {
									insert.setParameterValue("ilayTypeCondition",
										item.get("ilayTypeCondition").value, Terrasoft.DataValueType.GUID);
								}
								//Den>
								// if (item.get("ilayPackage")) {
								// 	insert.setParameterValue("ilayPackage",
								// 		item.get("ilayPackage").value, Terrasoft.DataValueType.GUID);
								// }
								//Den<
								if (item.get("ilayConditionValue")) {
									var conditionValue = parseFloat(item.get("ilayConditionValue").toString().replace(/\s/g, '').replace(",", "."));
									insert.setParameterValue("ilayConditionValue",
										conditionValue, Terrasoft.DataValueType.FLOAT);
								}
								if (item.get("ilayPriceValue")) {
									//var priceValue = parseFloat(item.get("ilayPriceValue").toString().replace(/\s/g, '').replace(",", "."));
									var priceValue = item.get("ilayPriceValue");
									insert.setParameterValue("ilayPriceValue",
										priceValue, Terrasoft.DataValueType.FLOAT);
								}
								if(this.get("MasterEntity") && this.get("MasterEntity").get("ilayPriceStatus")) {
									insert.setParameterValue("ilayPriceStatus",
										this.get("MasterEntity").get("ilayPriceStatus").value, Terrasoft.DataValueType.GUID);
								}
								batchQuery.add(insert);
							}
						}, this);
						batchQuery.execute(this.afterSave, this);
					},

					/**
					 * Сохраняет выбранные продукты.
					 * @protected
					 */
					saveBasketData: function() {
						this.saveSelectedProducts();
					},

					/**
					 * Ищет выбранные продукты.
					 * @protected
					 * @returns {Collection} Возвращает коллекцию выбранных элементов.
					 */
					findSelectedProducts: function() {
						
					},
// Button handlers

					/**
					 * Дополнительная обработка после сохранения.
					 * @protected
					 */
					afterSave: function() {
						this.initDataViews(true);
						sandbox.publish("ProductSelectionSave", this.findSelectedProducts(), [sandbox.id]);
						sandbox.publish("BackHistoryState");
						MaskHelper.HideBodyMask();
					},

					/**
					 * Обрабатывает нажатие кнопки Сохранить.
					 * @protected
					 */
					onSaveButtonClick: function() {
						this.saveBasketData();
					},

					/**
					 * Обрабатывает нажатие кнопки Отмена.
					 * @protected
					 */
					onCancelButtonClick: function() {
						this.afterSave();
					},

// Quick Search Module
					/**
					 * Загружает модуль строки поиска.
					 * @protected
					 * @param {Object} renderTo Контейнер для отображения.
					 */
					loadQuickSearchModule: function(renderTo) {
						var quickSearchModuleId = sandbox.id + "_QuickSearchModule";
						sandbox.subscribe("QuickSearchFilterInfo", function() {
							return this.getQuickSearchFilterConfig();
						}, this);
						sandbox.subscribe("UpdateQuickSearchFilter", function(filterItem) {
							this.onQuickSearchFilterUpdate(filterItem.key, filterItem.filters, filterItem.filtersValue);
						}, this);
						//Den>
						//sandbox.loadModule("QuickSearchModule", {
						sandbox.loadModule("ilayQuickSearchModuleForTariffSelection", {
						//Den<
							renderTo: renderTo,
							id: quickSearchModuleId
						});
					},

					/**
					 * Получает конфигурацию модуля строки поиска.
					 * @protected
					 * @returns {Object}
					 */
					getQuickSearchFilterConfig: function() {
						return {
							InitSearchString: "",
							SearchStringPlaceHolder: resources.localizableStrings.SearchStringPlaceHolder,
							FilterColumns: [
								{
									Column: "Name",
									ComparisonType: Terrasoft.ComparisonType.START_WITH
								},
								{
									Column: "Code",
									ComparisonType: Terrasoft.ComparisonType.START_WITH
								}
							]
						};
					},

					/**
					 * Обрабатывает изменение фильтров поиска.
					 * @protected
					 * @param {String} filterKey Ключ фильтра.
					 * @param {Terrasoft.data.filters.FilterGroup} filterItem Группа фильтров.
					 * @param {Terrasoft.Collection} filtersValue Значение фильтра.
					 */
					onQuickSearchFilterUpdate: function(filterKey, filterItem, filtersValue) {
						MaskHelper.ShowBodyMask();
						var currentDataView = this.get("CurrentDataView");
						if (currentDataView === "GridDataView") {
							//Den>
							var s = filtersValue.split(resources.localizableStrings.ilaySplitFilterValueKey);
							this.set("QuickSearchFilterString", s[0]);
							this.set("QuickSearchFilterString1", s[1]);
							//Den<
							this.set("QuickSearchFilters", filterItem);
							var grid = this.getGridData();
							grid.clear();
							this.loadGridData();
						} else if (currentDataView === "BasketDataView") {
							var collection = this.get("BasketViewGridCollection");
							var filteredCollection = Ext.isEmpty(filtersValue) ?
								collection :
								collection.filterByFn(
								function(item) {
									return (item.get("Name").indexOf(filtersValue) === 0 ||
										item.get("Code").indexOf(filtersValue) === 0);
								}
							);
							var gridData = this.getGridData();
							gridData.clear();
							gridData.loadAll(filteredCollection);
							MaskHelper.HideBodyMask();
						}
					},
// Folders Manager
					/**
					 * Загружает модуль менеджера групп.
					 * @protected
					 * @param {Object} renderTo Контейнер для отображения.
					 */
					loadFolderManager: function(renderTo) {
						this.set("FoldresModuleRenderTo", renderTo);
						var folderManagerModuleId = sandbox.id + "_FolderManagerModule";
						sandbox.subscribe("FolderInfo", function() {
							return this.getFolderManagerConfig(this.get("EntitySchema"));
						}, this, [folderManagerModuleId]);
						sandbox.subscribe("UpdateCatalogueFilter", function(filterItem) {
							this.onFilterUpdate(filterItem.key, filterItem.filters, filterItem.filtersValue);
						}, this);
						sandbox.loadModule("FolderManager", {
							renderTo: renderTo,
							id: folderManagerModuleId
						});
					},

					/**
					 * Возвращает настройку менеджера групп.
					 * @protected
					 * @overriden
					 * @param {Terrasoft.EntitySchema} schema Схема.
					 * @returns {Object}
					 */
					getFolderManagerConfig: function(schema) {
						var filterValues = [{
							columnPath: "IsArchive",
							value: false
						}];
						var config = {
							entitySchemaName: "ProductFolder",
							sectionEntitySchema: schema,
							activeFolderId: null,
							catalogueRootRecordItem: {
								value: DistributionConstants.ProductFolder.RootCatalogueFolder.RootId,
								displayValue: resources.localizableStrings.ProductCatalogueRootCaption
							},
							catalogAdditionalFiltersValues: filterValues,
							isProductSelectMode: true,
							closeVisible: false
						};
						return config;
					},

					/**
					 * Обрабатывает изменение фильтров.
					 * @protected
					 * @param {String} filterKey Ключ фильтра.
					 * @param {Terrasoft.data.filters.FilterGroup} filterItem Фильтр.
					 */
					onFilterUpdate: function(filterKey, filterItem) {
						if (this.get("CurrentDataView") === "GridDataView") {
							this.set("CatalogueFilters", filterItem);
							var grid = this.getGridData();
							grid.clear();
							this.loadGridData();
						}
					}
				}
			};
			return viewModelConfig;
		}

		return {
			generate: generate
		};
	}
);
