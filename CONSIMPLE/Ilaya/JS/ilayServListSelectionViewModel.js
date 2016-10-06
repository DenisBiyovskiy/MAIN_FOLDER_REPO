define("ilayServListSelectionViewModel", ["ilayServListSelectionViewModelResources", "MaskHelper",
	"ProductUtilitiesV2", "ProductManagementDistributionConstants"],
	function(resources, MaskHelper, ProductUtilities, DistributionConstants) {

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
					
					
					/*ilayAddService: {
						type: Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN,
						name: "ilayAddService"
					}*/
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
					DetailColumnName: null,

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

					ilayAddServiceLabel: resources.localizableStrings.ilayAddServiceLabelCaption,
					
					ilayDirectionLabel: resources.localizableStrings.ilayDirectionLabelCaption,
					
					/**
					 * Название модуля
					 * @type {Terrasoft.dataValueType.TEXT}
					 */
					ModuleName: "ilayServListSelectionModule",

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
							this.set("DetailColumnName", config.detailColumnName || null);
							this.set("MasterEntitySchemaName", config.masterEntitySchemaName || null);
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
							if (this.get("DetailColumnName") == "ilayVisittoDoctor") {
								select.addColumn("ilayPatient");
								/////////////// 07.04.2016
								select.addColumn("ilayCourse");
								select.addColumn("Owner");
								select.addColumn("StartDate");
								///////////////
							}else if(this.get("DetailColumnName") == "ilayCourse") {
								select.addColumn("ilayPatientInCourse");
								select.addColumn("ilayDoctor");
							}else if (this.get("DetailColumnName") == "ilayLead") {
								select.addColumn("QualifiedContact");
								//return "Lead";
							}
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
									autoApply: false
								});
							} else {
								this.set("CurrentDataView", viewConfig.tag);
								wAC.removeCls("no-folders");
								sandbox.publish("UpdateQuickSearchFilterString", {
									newSearchStringValue: this.get("QuickSearchFilterString"),
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
						if(basket.collection.getCount() == 0) {
							collection.each(function(item) {
								item.set("ilayAddService", false);
							}, this);
						}
						basket.each(function(basketItem) {
							var basketItemAddService = basketItem.get("ilayAddService");
							var item = collection.find(basketItem.get("Id"));
							if (item) {
								var addService = item.get("ilayAddService");
								if (basketItemAddService !== addService) {
									item.set("ilayAddService", basketItemAddService);
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
							if (item.get("ilayAddService")) {
								var cloneItem = this.cloneProduct(item);
								this.prepareItem(cloneItem);
								cloneItem.on("change", this.onDataGridItemChanged, this);
								cloneItem.on("change:ilayAddService", this.onAddServiceChanged, this);
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
					loadGridData: function() {
						MaskHelper.ShowBodyMask();
						var sortColumnLastValue = this.get("sortColumnLastValue");
						var batchQuery = Ext.create("Terrasoft.BatchQuery");
						var esq = this.getGridDataESQ();
						esq.rowCount = 30;
						this.initQueryColumns(esq);
						this.initQueryFilters(esq);
						this.initializePageableOptions(esq, sortColumnLastValue);
						batchQuery.add(esq);
						/*var masterEntity = this.get("MasterEntity");
						if (masterEntity) {
							var esqEntitySchemaName  = "ilayServList";
							var partColumnName = "[" + esqEntitySchemaName + ":ilayService:Id].";
							var productInCountEsq = this.getGridDataESQ();
							productInCountEsq.addColumn(partColumnName + "Id", esqEntitySchemaName + "Id");
							productInCountEsq.addColumn(partColumnName + "ilayService.Code", "Code");
							productInCountEsq.addColumn(partColumnName + "ilayService.ilayDirection.Name", "ilayDirection");
							productInCountEsq.filters.addItem(
								Terrasoft.createColumnFilterWithParameter(Terrasoft.ComparisonType.EQUAL,
									Ext.String.format("{0}{1}.Id", partColumnName, this.get("DetailColumnName")),
									masterEntity.get("Id")));
							this.initQueryFilters(productInCountEsq);
							batchQuery.add(productInCountEsq);
						}*/
						this.set("sortColumnLastValue", null);
						batchQuery.execute(this.onGridDataLoaded, this);
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
						esq.addColumn("Code");
						esq.addColumn("Price");
						esq.addColumn("ilayDirection.Name");
						//Den>
						esq.addColumn("ilayProductsInPackage");
						esq.addColumn("Category");
						//Den<
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
					onGridDataLoaded: function(response) {
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
							ilayDirection: {
								dataValueType: Terrasoft.DataValueType.TEXT
							},
							ilayAddService: {
								dataValueType: Terrasoft.DataValueType.BOOLEAN
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
						/*var esqEntitySchemaName = "ilayServListId";
						var productSelectResponse = response.queryResults[0];
						var productInEntityResponse = response.queryResults[response.queryResults.length - 1];
						var basket = this.getBasketData();
						Terrasoft.each(productInEntityResponse.rows, function(row) {
							var item = this.getGridRecordByItemValues(row, this.get("EntitySchema"));
							var itemId = item.get("Id");
							item.set("RealRecordId", itemId);
							var customKey = itemId + "_" + item.get(esqEntitySchemaName);
							item.set("Id", customKey);
							item.set("ilayAddService", true);
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
									var customKey = detailRecordId ? productId + "_" + detailRecordId : productId;
									product.RealRecordId = productId;
									product.Id = customKey;
									product.Code = item.get("Code");
									product.ilayDirection = item.get("ilayDirection");
									product[esqEntitySchemaName] = item.get(esqEntitySchemaName);
									product.Name = item.get("Name");
									product.ilayAddService = item.get("ilayAddService");
									var masterEntity = this.get("MasterEntity");
									Ext.Array.insert(productSelectResponse.rows,
										Ext.Array.indexOf(productSelectResponse.rows, pr, 0), [product]);
									if (productId === pr.Id) {
										Ext.Array.remove(productSelectResponse.rows, pr);
									}
								}, this);
							}
						}, this);
						Terrasoft.each(productSelectResponse.rows, function(row) {
							var item = this.getGridRecordByItemValues(row, this.get("EntitySchema"));
							this.prepareItem(item);
							item.on("change", this.onDataGridItemChanged, this);
							item.on("change:ilayAddService", this.onAddServiceChanged, this);
							var gridData = this.getGridData();
							if (!collection.contains(row.Id) && !gridData.contains(row.Id)) {
								collection.add(row.Id, item);
							}
						}, this);
						this.calcSummary();*/
						var productSelectResponse = response.queryResults[0];
						Terrasoft.each(productSelectResponse.rows, function(row) {
							var item = this.getGridRecordByItemValues(row, this.get("EntitySchema"));
							this.prepareItem(item);
							item.on("change", this.onDataGridItemChanged, this);
							item.on("change:ilayAddService", this.onAddServiceChanged, this);
							var gridData = this.getGridData();
							if (!collection.contains(row.Id) && !gridData.contains(row.Id)) {
								collection.add(row.Id, item);
							}
						}, this);
						this.calcSummary();
					},
					
					onAddServiceChanged: function(model, item) {
						this.set("NeedRecalc", true);
						model.validate = this.validate;
						if(model) {
							//model.set("ilayAddService", item);
							//this.set("NeedRecalc", false);
							if(model.get("ilayAddService")) {
								this.set("NeedRecalc", false);
							}
						}
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
						if(item.get("ilayDirection.Name")) {
							item.set("ilayDirection", item.get("ilayDirection.Name"));
						}else{
							item.set("ilayDirection", item.get("ilayDirection"));
						}
						item.set("MasterEntitySchemaName", this.get("MasterEntitySchemaName"));
						item.set("MasterRecordId", this.get("MasterRecordId"));
					},
					/**
					 * Выделяет и собирает измененные элементы, чтобы потом сохранить.
					 * @protected
					 * @param {BaseViewModel} item Продукт.
					 */
					onDataGridItemChanged: function(item) {
						var basket = this.getBasketData();
						var itemId = item.get("Id");
						var itemAddService = item.get("ilayAddService");
						var existingItem = basket.find(itemId);
						if (itemAddService) {
							if (!existingItem) {
								basket.add(itemId, item);
								existingItem = basket.find(itemId);
							} else {
								existingItem.set("ilayAddService", itemAddService);
							}
						} else if (existingItem) {
							existingItem.set("ilayAddService", itemAddService);
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
						if (entity){
							return this.getEntityCaption() + " " + entity.get("Name");
						} else {
							return this.getEntityCaption();
						}
					},

					/**
					 * Получает заголовок сущности.
					 * @protected
					 * @returns {string}
					 */
					getEntityCaption: function() {
						//var entityCaption = Terrasoft.configuration.ModuleStructure[this.get("MasterEntitySchemaName")];
						//return entityCaption.moduleCaption.substr(0, entityCaption.moduleCaption.length - 1);
						if(this.get("MasterEntitySchemaName") == "Activity") {
							return "Візит до лікаря";
						}else if(this.get("MasterEntitySchemaName") == "Contact") {
							return "Пациент";
						}else {
							return "Курс";
						}
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
						var lineItemsCount = 0;

						var basket = this.getBasketData();
						basket.each(function(item) {
							var count = (item.get("ilayAddService")) ? 1 : 0;
							lineItemsCount += count;
						}, this);
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
							Ext.isEmpty(this.get("DetailColumnName")) ||
							(selectedProducts.getCount() < 1)) {
							this.afterSave();
							return;
						}
						var rootSchemaName = "ilayServList";
						var batchQuery = Ext.create("Terrasoft.BatchQuery");
						selectedProducts.each(function(item) {
							var insert = Ext.create("Terrasoft.InsertQuery", {
								rootSchemaName: rootSchemaName
							});
							/*
							[IL-241, IL-239] - убрать автозаполнение поля "ilayVisittoDoctor"
							if (this.get("MasterRecordId")) {
								insert.setParameterValue(this.get("DetailColumnName"),
									this.get("MasterRecordId"), Terrasoft.DataValueType.GUID);
							}
							*/
							//Den> [IL-436] Создание сервисов
							var itemName = item.get("Name") || item.get("ilayProduct.Name");
							if (itemName) {
								insert.setParameterValue("ilayName",
									itemName, Terrasoft.DataValueType.TEXT);
							}
							var itemId = item.get("ilayProduct") && item.get("ilayProduct").value || item.get("Id");
							if (itemId) {
								insert.setParameterValue("ilayService",
									itemId, Terrasoft.DataValueType.GUID);
							}
							var itemCode = item.get("Code") || item.get("ilayProduct.Code");
							if (itemCode) {
								insert.setParameterValue("ilayServiceCode",
									itemCode, Terrasoft.DataValueType.TEXT);
							}
							var itemPrice = item.get("Price") || item.get("ilayProduct.Price");
							if (itemPrice) {
								insert.setParameterValue("ilayBaseCost",
									itemPrice, Terrasoft.DataValueType.FLOAT);
							}
							var itemPackage = item.get("ilayPackage") && item.get("ilayPackage").value;
							if (itemPackage) {
								insert.setParameterValue("ilayPackage",
									itemPackage, Terrasoft.DataValueType.GUID);
							}
							if(this.get("DetailColumnName") == "ilayVisittoDoctor") {
								if(this.get("MasterEntity") && this.get("MasterEntity").get("ilayPatient")) {
									insert.setParameterValue("ilayPatient",
										this.get("MasterEntity").get("ilayPatient").value, Terrasoft.DataValueType.GUID);
								}
								/////////////////////////////////07.04.2016
								if(this.get("MasterEntity") && this.get("MasterEntity").get("ilayCourse")) {
									insert.setParameterValue("ilayCourse",
										this.get("MasterEntity").get("ilayCourse").value, Terrasoft.DataValueType.GUID);
								}
								if(this.get("MasterEntity") && this.get("MasterEntity").get("Owner")) {
									insert.setParameterValue("ilayDoctor",
										this.get("MasterEntity").get("Owner").value, Terrasoft.DataValueType.GUID);
								}
								if(this.get("MasterEntity") && this.get("MasterEntity").get("StartDate")) {
									insert.setParameterValue("ilayPlanDate",
										this.get("MasterEntity").get("StartDate"), Terrasoft.DataValueType.DATE);
								}
								insert.setParameterValue("ilayPerfomStatus",
									"766aff6d-eca4-4059-9553-a53e93f06015", Terrasoft.DataValueType.GUID);
								insert.setParameterValue("ilayPaymentStatus",
									"fdbd93d7-752e-494c-a258-f3c159de2148", Terrasoft.DataValueType.GUID);
								///////////////////////////////////////////
							}else if(this.get("DetailColumnName") == "ilayCourse") {
								if(this.get("MasterEntity") && this.get("MasterEntity").get("ilayPatientInCourse")) {
									insert.setParameterValue("ilayPatient",
										this.get("MasterEntity").get("ilayPatientInCourse").value, Terrasoft.DataValueType.GUID);
								}
								if(this.get("MasterEntity") && this.get("MasterEntity").get("ilayDoctor")) {
									insert.setParameterValue("ilayDoctor",
										this.get("MasterEntity").get("ilayDoctor").value, Terrasoft.DataValueType.GUID);
								}
								insert.setParameterValue("ilayPerfomStatus",
									"766aff6d-eca4-4059-9553-a53e93f06015", Terrasoft.DataValueType.GUID);
								insert.setParameterValue("ilayPaymentStatus",
									"fdbd93d7-752e-494c-a258-f3c159de2148", Terrasoft.DataValueType.GUID);
							} else if (this.get("DetailColumnName") == "ilayLead") {
								
								if(this.get("MasterEntity") && this.get("MasterEntity").get("QualifiedContact")) {
									insert.setParameterValue("ilayPatient",
										this.get("MasterEntity").get("QualifiedContact").value, Terrasoft.DataValueType.GUID);
								}
								if(this.get("MasterEntity") && this.get("MasterEntity").get("Id")) {
									insert.setParameterValue("ilayLead",
										this.get("MasterEntity").get("Id"), Terrasoft.DataValueType.GUID);
								}
								insert.setParameterValue("ilayPerfomStatus",
									"766aff6d-eca4-4059-9553-a53e93f06015", Terrasoft.DataValueType.GUID);
								insert.setParameterValue("ilayPaymentStatus",
									"fdbd93d7-752e-494c-a258-f3c159de2148", Terrasoft.DataValueType.GUID);
								//return "Lead";
							}
							batchQuery.add(insert);
							//Den< [IL-436] Создание сервисов
						}, this);
						//batchQuery.execute(this.afterSave(), this);
						batchQuery.execute(function(response) {
							if (response.success) {
								response.queryResults.QualifiedContact = this.get("MasterEntity") ? this.get("MasterEntity").get("QualifiedContact") : null;
								this.afterSave(response.queryResults);
							}else {
								this.afterSave();
							}
						}, this);
					},
					
					getPatient: function() {
						if (this.get("DetailColumnName") == "ilayVisittoDoctor") {
							if (this.get("MasterEntity") && this.get("MasterEntity").get("ilayPatient")) {
									return this.get("MasterEntity").get("ilayPatient").value;
							}
						}else if (this.get("DetailColumnName") == "ilayCourse") {
							if (this.get("MasterEntity") && this.get("MasterEntity").get("ilayPatientInCourse")) {
								return this.get("MasterEntity").get("ilayPatientInCourse").value;
							}
						} else {
							return this.get("MasterRecordId");
						}
					},
					
					/**
					 * Сохраняет выбранные продукты.
					 * @protected
					 */
					saveBasketData: function() {
						//Den>
						var basket = this.getBasketData();
						var bCollection = basket ? basket.collection : null;
						var PSCollection = [];
						if (bCollection) {
							bCollection.each(function(item) {
								var currCategory = item.get("Category");
								if (currCategory && currCategory.value === "cfd4842d-437b-42b1-8d32-13f6041f3767") { //пакет послуг
									PSCollection.push(item.get("Id"));
								}
							}, this);
							if (PSCollection.length !== 0) {
								this.getProductsFromPacket(PSCollection, function(PCollection) {
									PSCollection.forEach(function(item) {
										basket.removeByKey(item);
									}, this);
									PCollection.each(function(item) {
										for (var i = item.get("ilayProdNumber"); i > 0; i--) {
											basket.add(item.get("ilayProduct") + i, item);
										}
									}, this);
									
									this.saveSelectedProducts();
								});
							} else {
								this.saveSelectedProducts();
							}
						}
						//Den<
						//this.saveSelectedProducts();
					},
					
					//Den> [IL-436]
					/**
					 * @param {Array} packetIds - Id Пакетов выбраных в корзину
					 * @param {Function} callback метод обработки результирующей колекции
					 * @returns {Collection} Послуги входящие в пакеты.
					 */
					getProductsFromPacket: function(packetIds, callback) {
						var selectQuery = Ext.create("Terrasoft.EntitySchemaQuery", {
							rootSchemaName: "ilayProductsInPackage"
						});
						var scope = this;
						//Добавляем колонки в запрос.
						selectQuery.addColumn("ilayProduct.Code");
						selectQuery.addColumn("ilayProduct.Price");
						selectQuery.addColumn("ilayProduct.ilayDirection.Name");
						selectQuery.addColumn("ilayProduct.ilayProductsInPackage");
						selectQuery.addColumn("ilayProduct.Category");
						selectQuery.addColumn("ilayProduct.Name");
						selectQuery.addColumn("ilayProduct");
						selectQuery.addColumn("ilayPackage");
						selectQuery.addColumn("ilayProdNumber");
						//Добавляем фильтры.
						selectQuery.filters.addItem(Terrasoft.createColumnFilterWithParameter(
							Terrasoft.ComparisonType.EQUAL, "ilayIsArchive", false));
						selectQuery.filters.addItem(Terrasoft.createColumnFilterWithParameter(
							Terrasoft.ComparisonType.EQUAL, "ilayProduct.IsArchive", false));
						
						selectQuery.filters.addItem(Terrasoft.createColumnInFilterWithParameters("ilayPackage", packetIds, Terrasoft.DataValueType.GUID));
						
						selectQuery.execute(function(response) {
							if (response.success === true) {
								callback.call(scope, response.collection);
							}
						}, this);
					},
					//Den< [IL-436]
					
					
					
					/**
					 * Ищет выбранные продукты.
					 * @protected
					 * @returns {Collection} Возвращает коллекцию выбранных элементов.
					 */
					findSelectedProducts: function(arr) {
						return arr;
					},
// Button handlers

					/**
					 * Дополнительная обработка после сохранения.
					 * @protected
					 */
					afterSave: function(arr) {
						this.initDataViews(true);
						sandbox.publish("ProductSelectionSave", this.findSelectedProducts(arr), [sandbox.id]);
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
						sandbox.loadModule("QuickSearchModule", {
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
							this.set("QuickSearchFilterString", filtersValue);
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
