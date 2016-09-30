// D9 Team
define("ilayQuickSearchModuleForTariffSelection", ["ilayQuickSearchModuleForTariffSelectionResources", "QuickSearchModule", "BaseModule"],
	function(resources) {
		/**
		 * @class Terrasoft.configuration.QuickSearchModule
		 * Класс QuickSearchModule предназначен для быстрой фильтрации в окне подбора продуктов
		 */
		Ext.define("Terrasoft.configuration.ilayQuickSearchModuleForTariffSelection", {
			alternateClassName: "Terrasoft.ilayQuickSearchModuleForTariffSelection",
			extend: "Terrasoft.QuickSearchModule",
			/**
			 * Выполняет инициализацию компонент модуля - представления и модели представления
			 * @protected
			 * @virtual
			 */
			initializeModule: function() {
				var viewConfig = this.getView();
				var view = Ext.create(viewConfig.className || "Terrasoft.Container", viewConfig);
				if (!this.viewModel) {
					var viewModelConfig = this.getViewModel(this.sandbox, this.Terrasoft, this.Ext, this.config);
					this.viewModel = this.Ext.create("Terrasoft.BaseViewModel", viewModelConfig);
					this.viewModel.init(this.config);
				}
				view.bind(this.viewModel);
				view.render(this.container);
			},
			
			/**
			 * Содержит список сообщений модуля
			 * @protected
			 * @type {Object}
			 */
			messages: {

				/**
				 * @message UpdateQuickSearchFilter
				 * Сообщает о изменении фильтра
				 * @param {Object} Информация о новом фильтре
				 */
				"UpdateQuickSearchFilter": {
					mode: Terrasoft.MessageMode.BROADCAST,
					direction: Terrasoft.MessageDirectionType.PUBLISH
				},

				/**
				 * @message UpdateQuickSearchFilterString
				 * Обновление строки поиска из вне
				 * @param {String} Новая строка поиска
				 * @param {Bool} применять новую строку поиска
				 */
				"UpdateQuickSearchFilterString": {
					mode: Terrasoft.MessageMode.PTP,
					direction: Terrasoft.MessageDirectionType.SUBSCRIBE
				},
				/**
				 * @message QuickSearchFilterInfo
				 * Получение конфигурации модуля
				 * @return {Object} Конфигурация для инициализации модуля
				 */
				"QuickSearchFilterInfo": {
					mode: Terrasoft.MessageMode.PTP,
					direction: Terrasoft.MessageDirectionType.PUBLISH
				},
				"UpdateQuickSearchFilterString1": {
					mode: Terrasoft.MessageMode.PTP,
					direction: Terrasoft.MessageDirectionType.SUBSCRIBE
				}
			},
			
			/**
			 * Генерирует конфигурацию представления модуля
			 * @returns {Object} Возвращает конфигурацию для инициализаций представления.
			 */
			getView: function()
			{
				return {
					className: "Terrasoft.Container",
					id: "quickSearchModule-container",
					selectors: {wrapEl: "#quickSearchModule-container"},
					classes: {
						wrapClassName: ["quickSearchModule-container"]
					},
					items: [
						{
							className: "Terrasoft.Container",
							id: "quickSearchModuleSearchTextEdit-container",
							selectors: {wrapEl: "#quickSearchModuleSearchTextEdit-container"},
							classes: {
								wrapClassName: ["quickSearchModuleSearchTextEdit-container"]
							},
							items: [
								{
									className: "Terrasoft.TextEdit",
									id: "QuickSearchTextEdit",
									selectors: {wrapEl: "#QuickSearchTextEdit"},
									value: {bindTo: "SearchString"},
									placeholder: {bindTo: "SearchStringPlaceHolder"},
									enterkeypressed: {bindTo: "onApplyQuickSearchFilterButtonClick"},
									hasClearIcon: false,
									hint: resources.localizableStrings.SearchLineHint,
									markerValue: "QuickSearchTextEdit"
								}
							]
						},
						
						{
							className: "Terrasoft.Container",
							id: "quickSearchModuleSearchTextEdit-container1",
							selectors: {wrapEl: "#quickSearchModuleSearchTextEdit-container1"},
							classes: {
								wrapClassName: ["quickSearchModuleSearchTextEdit-container"]
							},
							items: [
								{
									className: "Terrasoft.TextEdit",
									id: "QuickSearchTextEdit1",
									selectors: {wrapEl: "#QuickSearchTextEdit"},
									value: {bindTo: "SearchString1"},
									placeholder: {bindTo: "SearchStringPlaceHolder1"},
									enterkeypressed: {bindTo: "onApplyQuickSearchFilterButtonClick"},
									hasClearIcon: false,
									hint: resources.localizableStrings.SearchLineHint1,
									markerValue: "QuickSearchTextEdit1"
								}
							]
						},
						{
							className: "Terrasoft.Container",
							id: "quickSearchModuleButtons-container",
							selectors: {wrapEl: "#quickSearchModuleButtons-container"},
							classes: {
								wrapClassName: ["quickSearchModuleButtons-container"]
							},
							items: [
								{
									className: "Terrasoft.Container",
									id: "quickSearchModuleApplyFilterButton-container",
									selectors: {wrapEl: "#quickSearchModuleApplyFilterButton-container"},
									classes: {
										wrapClassName: ["quickSearchModuleApplyFilterButton-container"]
									},
									items: [
										{
											className: "Terrasoft.Button",
											imageConfig: resources.localizableImages.ApplyButtonImage,
											id: "ApplyQuickSearchFilterButton",
											selectors: {wrapEl: "#ApplyQuickSearchFilterButton"},
											tag: "ApplyQuickSearchFilterButton",
											hint: resources.localizableStrings.ApplyFilterButtonHint,
											style: Terrasoft.controls.ButtonEnums.style.BLUE,
											visible: true,
											click: {bindTo: "onApplyQuickSearchFilterButtonClick"}
										}
									]
								},
								{
									className: "Terrasoft.Container",
									id: "quickSearchModuleClearFilterButton-container",
									selectors: {wrapEl: "#quickSearchModuleClearFilterButton-container"},
									classes: {
										wrapClassName: ["quickSearchModuleClearFilterButton-container"]
									},
									items: [
										{
											className: "Terrasoft.Button",
											imageConfig: resources.localizableImages.CancelButtonImage,
											id: "ClearQuickSearchFilterButton",
											selectors: {wrapEl: "#ClearQuickSearchFilterButton"},
											tag: "ClearQuickSearchFilterButton",
											hint: resources.localizableStrings.ResetFilterButtonHint,
											style: Terrasoft.controls.ButtonEnums.style.GREY,
											visible: true,
											click: {bindTo: "onClearQuickSearchFilterButtonClick"}
										}
									]
								}
							]
						}
					]
				};
			},
			
			/**
			 * Генерирует конфигурацию модели представления модуля.
			 * @returns {Object} Возвращает конфигурацию для инициализаций модели представления.
			 */
			getViewModel: function(sandbox, Terrasoft, Ext, config)
			{
				return {
					values: {//Den>

						/**
						 * Значение строки поиска
						 * @type {String}
						 */
						SearchString: "",
						
						/**
						 * Значение 2й строки поиска
						 * @type {String}
						 */
						SearchString1: "",

						/**
						 * Строка, которая отображается при пустой строке поиска
						 * @type {String}
						 */
						SearchStringPlaceHolder: "",

						/**
						 * Строка, которая отображается при пустой 2й строке поиска
						 * @type {String}
						 */
						SearchStringPlaceHolder1: "",
						
						/**
						 * Колонки, на основе которых формируется фильтр
						 * @type {Array}
						 */
						FilterColumns: null,
						
						/**
						 * Колонки, на основе которых формируется фильтр для 2й
						 * @type {Array}
						 */
						FilterColumns1: null,

						/**
						 * Параметры инициализации
						 * @private
						 * @type {Array}
						 */
						config: config || null
					},
					methods: {

						/**
						 * Инициализация модели представления.
						 * @param {Object} config Начальная конфигурация модели представления.
						 */
						 //Den
						init: function(config) {
							var filterColumns = config.FilterColumns || [
								{
									Column: "Name",
									ComparisonType: Terrasoft.ComparisonType.START_WITH
								}
							];
							var filterColumns1 = [
								{
									Column: "[ilayPriceForService:ilayService:Id].ilayPackage.Name",
									ComparisonType: Terrasoft.ComparisonType.START_WITH
								}
							];
							this.set("FilterColumns", filterColumns);
							this.set("FilterColumns1", filterColumns1);
							this.set("SearchStringPlaceHolder", resources.localizableStrings.SearchStringPlaceHolder);
							this.set("SearchStringPlaceHolder1", resources.localizableStrings.SearchStringPlaceHolder1);
							this.set("SearchString", config.InitSearchString || "");
							this.set("SearchString1", config.InitSearchString1 || "");
							if (!Ext.isEmpty(config.InitSearchString)) {
								this.createAndPublishFilterGroup();
							}

							this.subscribeForUpdateQuickSearchFilterString();
						},

						/**
						 * Осуществляется подписка на событие UpdateQuickSearchFilterString
						 */
						 //Den
						subscribeForUpdateQuickSearchFilterString: function() {
							sandbox.subscribe("UpdateQuickSearchFilterString", function(args) {
								args = args || {};
								this.set("SearchString", args.newSearchStringValue || "");
								this.set("SearchString1", args.newSearchStringValue1 || "");
								if (args.autoApply) {
									this.createAndPublishFilterGroup();
								}
							}, this);
						},

						/**
						 * Обработчик нажатия на кнопку очистки строки фильтрации
						 * @protected
						 */
						onClearQuickSearchFilterButtonClick: function() {
							this.clearAndApplyFilter();
						},

						/**
						 * Обработчик нажатия на кнопку применения фильтрации
						 * @protected
						 */
						onApplyQuickSearchFilterButtonClick: function() {
							this.createAndPublishFilterGroup();
						},

						/**
						 * создает фильтр на основе введеного значения в строку поиска
						 * @returns {Terrasoft.data.filters.FilterGroup}
						 * @protected
						 * @virtual
						 */
						 //Den
						createFilterGroup: function() {
							var searchString = this.get("SearchString");
							var filterColumns = this.get("FilterColumns");
							var searchString1 = this.get("SearchString1");
							var filterColumns1 = this.get("FilterColumns1");
							var filterGroup = Terrasoft.createFilterGroup();
							var filterGroup1 = Terrasoft.createFilterGroup();
							var filterGroupForReturn = Terrasoft.createFilterGroup();
							if (!Ext.isEmpty(searchString) &&
								filterColumns &&
								filterColumns.length > 0) {
								Terrasoft.each(filterColumns, function(column) {
									filterGroup.addItem(
										Terrasoft.createColumnFilterWithParameter(
											column.ComparisonType, column.Column, searchString)
									);
								}, this);
								filterGroup.logicalOperation = Terrasoft.LogicalOperatorType.OR;
							}
							if (!Ext.isEmpty(searchString1) &&
								filterColumns1 &&
								filterColumns1.length > 0) {
								Terrasoft.each(filterColumns1, function(column) {
									filterGroup1.addItem(
										Terrasoft.createColumnFilterWithParameter(
											column.ComparisonType, column.Column, searchString1)
									);
									filterGroup1.addItem(Terrasoft.createColumnIsNotNullFilter("[ilayPriceForService:ilayService:Id].ilayPackage"));
								}, this);
								filterGroup1.logicalOperation = Terrasoft.LogicalOperatorType.AND;
							}
							filterGroupForReturn.addItem(filterGroup);
							filterGroupForReturn.addItem(filterGroup1);
							return filterGroupForReturn;
						},

						/**
						 * Получает и публикует событие UpdateQuickSearchFilter с новым фильтром
						 * @protected
						 * @virtual
						 */
						 //Den
						createAndPublishFilterGroup: function() {
							var filterGroup = this.createFilterGroup();
							var s = this.get("SearchString"),
								s1 = this.get("SearchString1");
							var filterItem = {
								key: "QuickSearchFilterItem",
								filters: filterGroup,
								filtersValue: (s ? s : "") + "_;_" + (s1 ? s1 : "")
							};
							sandbox.publish("UpdateQuickSearchFilter", filterItem);
						},

						/**
						 * Очистка строки поиска и применение пустого фильтра
						 * @protected
						 */
						 //Den
						clearAndApplyFilter: function() {
							this.set("SearchString", "");
							this.set("SearchString1", "");
							this.createAndPublishFilterGroup();
						}
					}
				};
			}
		});

		return Terrasoft.ilayQuickSearchModuleForTariffSelection;
	});
