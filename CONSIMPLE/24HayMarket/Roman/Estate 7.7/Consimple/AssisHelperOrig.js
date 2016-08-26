define("AssisHelper", ["AssisHelperResources", "ServiceHelper", "ModalBox", "RightUtilities", "RealtyConstants",
		"ConfigurationConstants", "AssisConstants", "css!AssisHelper"],
	function(resources, ServiceHelper, ModalBox, RightUtilities, RealtyConstants, ConfigurationConstants, AssisConstants) {
		var assisServiceName = "AssisIntegrationService";
		var timeout = 20 * 60 * 1000;
		/**
		 * Возвращает идентификаторы выбранных листингов.
		 * @returns {String[]} Массив идентификаторов листингов.
		 */
		var getListingsIds = function() {
			return this.get("Id") ? [this.get("Id")] : this.getSelectedItems();
		};

		/**
		 * Check listing publishing operation grantee.
		 * @param {Function} callback Callback function.
		 */
		var checkListingPublishingAccess = function(callback) {
			RightUtilities.checkCanExecuteOperation({operation: "CanListingPublishing"}, function(result) {
				this.set("CanListingPublishing", result);
				if (callback && this.Ext.isFunction(callback)) {
					callback.call(this);
				}
			}, this);
		};

		/**
		 * Проверяет наличие Рабочего телефона у ответственного
		 * @param {Function} callback Функция обратного вызова.
		 * @param {Object} scope Контекст.
		 */
		var checkOwnerWorkPhone = function(callback, scope) {
			var requestsListings = getListingsIds.call(scope);
			var select = scope.Ext.create("Terrasoft.EntitySchemaQuery", {
				rootSchemaName: "Listing"
			});
			select.addColumn("Id");
			select.addColumn("Owner.Phone", "OwnerPhone");
			select.filters.addItem(scope.Terrasoft.createColumnInFilterWithParameters("Id", requestsListings));
			select.filters.addItem(scope.Terrasoft.createColumnIsNotNullFilter("Owner.Phone"));
			select.getEntityCollection(function(response) {
				if (response && response.success && response.collection) {
					if (response.collection.getCount() === requestsListings.length) {
						callback.call(scope);
					} else {
						scope.showInformationDialog(resources.localizableStrings.WorkPhoneValidationError);
						scope.hideBodyMask();
					}
				} else {
					scope.showInformationDialog(resources.localizableStrings.PublishErrorMessage);
					scope.hideBodyMask();
				}
			}, scope);
		};
		/**
		 * Получает пакет выгрузки на Zipal.ru по умолчанию.
		 * @param {Function} next Функция обратного вызова по цепочке.
		 */
		var getDefaultPackage = function(next) {
			var select = this.Ext.create("Terrasoft.EntitySchemaQuery", {
				rootSchemaName: "IntegrationSettings"
			});
			select.addColumn("DefaultPublicationPackageId");
			select.filters.addItem(this.Terrasoft.createColumnFilterWithParameter(
					this.Terrasoft.ComparisonType.EQUAL, "Id", AssisConstants.AssisIntegrationSettingsId));
			select.getEntityCollection(function(response) {
				if (response && response.success && response.collection && response.collection.getCount() > 0) {
					var item = response.collection.getItems()[0];
					next.call(this, item.get("DefaultPublicationPackageId"));
				}
			}, this);
		};
		/**
		 * Проверяет выгружен ли листинг на Zipal.ru.
		 * @param {Function} next Функция обратного вызова по цепочке.
		 */
		var isListingUploaded = function(next) {
			var listingIds = getListingsIds.call(this);
			if (listingIds && listingIds.length === 1) {
				var select = this.Ext.create("Terrasoft.EntitySchemaQuery", {
					rootSchemaName: "IntegrationListingBind"
				});
				select.addColumn("Id");
				select.filters.addItem(select.createColumnFilterWithParameter(Terrasoft.ComparisonType.EQUAL,
					"Listing", listingIds[0]));
				select.getEntityCollection(function(response) {
					if (response && response.success && response.collection.getItems().length > 0) {
						next.call(this, true);
					} else {
						next.call(this, false);
					}
				}, this);
			} else {
				next.call(this, false);
			}
		};
		/**
		 * Проверяет есть ли доступ на выбор пакетов публикации на Zipal.ru.
		 * @param {Function} next Функция обратного вызова по цепочке.
		 */
		var hasAccessToPackagePublish = function(next) {
			RightUtilities.checkCanExecuteOperation({operation: "HasZipalPackagePublication"}, function(result) {
					next.call(this, result);
				},
				this
			);
		};
		/**
		 * Проверяет есть ли доступ на выбор пакетов публикации на Zipal.ru.
		 * @param {Function} callback Функция обратного вызова.
		 * @param {Object} config Конфиг запроса
		 * @param {Boolean} config.hasAccess признак наличия прав доступа на операцию у текущего пользователя.
		 * @param {Boolean} config.isUploaded указывает выгружен ли листинг на Zipal.ru.
		 * @param {String} config.packageId название пакета по умолчанию.
		 */
		var getPackageInfoRequest = function(callback, config) {
			var serviceConfig = {
				serviceName: assisServiceName,
				methodName: "GetPackageInfo",
				callback: function(response) {
					this.hideBodyMask();
					var result = response ? response.GetPackageInfoResult : [];
					var showCheckPackageView = config.hasAccess && !config.isUploaded;
					if (result && Ext.isArray(result) && result.length > 1 && showCheckPackageView) {
						var view = createCheckPackageView();
						var viewModel = createCheckPackageViewModel(this, callback, result);
						var modalBoxConfig = {};
						modalBoxConfig.container = ModalBox.show({
							widthPixels: 410,
							heightPixels: 180
						});
						view.bind(viewModel);
						view.render(modalBoxConfig.container);
					} else {
						unloadListings.call(this, callback, (config.packageId && !config.isUploaded) ?
							config.packageId : null);
					}
				},
				timeout: timeout,
				scope: this
			};
			ServiceHelper.callService(serviceConfig);
		};
		/**
		 * Вызывает сервис получения пакетов публикации.
		 * @param {Function} callback Функция обратного вызова.
		 */
		var getPackageInfo = function(callback) {
			this.showBodyMask();
			var config = {};
			Terrasoft.chain(
				function(next) {
					getDefaultPackage.call(this, next);
				},
				function(next, defaultPackage) {
					config.packageId = defaultPackage;
					isListingUploaded.call(this, next);
				},
				function(next, isUploaded) {
					config.isUploaded = isUploaded;
					hasAccessToPackagePublish.call(this, next);
				},
				function(next, hasAccess) {
					config.hasAccess = hasAccess;
					getPackageInfoRequest.call(this, callback, config);
				},
				this
			);
		};
		/**
		 * Создает ViewModel для модального окна выбора пакетов.
		 * @param {Object} scope Контекст.
		 * @param {Function} callback Функция обратного вызова.
		 * @param {Object} result Список пакетов полученных с Zipal.ru.
		 */
		var createCheckPackageViewModel = function(scope, callback, result) {
			var config = {
				values: {
					selectedPackage: null,
					packageArray: result,
					packageList: new Terrasoft.Collection()
				},
				methods: {
					/**
					 * Функция заполнения списка пакетов.
					 * @param {Object} filter Фильтр.
					 * @param {Terrasoft.Collection} list Коллекция пакетов.
					 */
					getPackageList: function(filter, list) {
						var packageArray = this.get("packageArray");
						if (list === null && packageArray) {
							return;
						}
						list.clear();
						var elements = {};
						Terrasoft.each(packageArray, function(item) {
							var name = item.Name;
							var id = item.Id;
							var element = {
								displayValue: name,
								value: id
							};
							if (!list.contains(id)) {
								elements[id] = element;
							}
						}, this);
						list.loadAll(elements);
					},
					/**
					 * Обработчик события нажатия на кнопку "Опубликовать".
					 */
					onOkButtonClick: function() {
						var selectedItem = this.get("selectedPackage");
						if (selectedItem && selectedItem.value) {
							unloadListings.call(scope, callback, selectedItem.value);
						}
						ModalBox.close();
					},
					/**
					 * Обработчик события нажатия на кнопку "Отменить".
					 */
					onCancelClick: function() {
						ModalBox.close();
					}
				}
			};
			return Ext.create("Terrasoft.BaseViewModel", config);
		};
		/**
		 * Создает View для модального окна выбора пакетов.
		 */
		var createCheckPackageView = function() {
			var config = {
				className: "Terrasoft.Container",
				id: "checkPackageContainer",
				selectors: {
					el: "#checkPackageContainer",
					wrapEl: "#checkPackageContainer"
				},
				classes: {
					wrapClassName: ["checkPackageContainer"]
				},
				items: [
					{
						className: "Terrasoft.Container",
						id: "contentContainer",
						selectors: {
							wrapEl: "#contentContainer"
						},
						classes: {
							wrapClassName: ["contentContainer"]
						},
						items: [
							{
								className: "Terrasoft.Label",
								id: "CheckPackageControlLabel",
								caption: resources.localizableStrings.CheckPackageControlCaption
							},
							{
								className: "Terrasoft.ComboBoxEdit",
								id: "CheckPackageControl",
								list: {
									bindTo: "packageList"
								},
								prepareList: {
									bindTo: "getPackageList"
								},
								value: {
									bindTo: "selectedPackage"
								},
								markerValue: "packageName"
							}
						]
					},
					{
						className: "Terrasoft.Container",
						id: "bottomContainer",
						selectors: {
							wrapEl: "#bottomContainer"
						},
						classes: {
							wrapClassName: ["bottomContainer"]
						},
						items: [
							{
								id: "okButton",
								className: "Terrasoft.Button",
								caption: resources.localizableStrings.OkButtonCaption,
								style: this.Terrasoft.controls.ButtonEnums.style.GREEN,
								tag: "okButton",
								markerValue: "okButton",
								selectors: {wrapEl: "#okButton"},
								click: {bindTo: "onOkButtonClick"}
							},
							{
								className: "Terrasoft.Button",
								id: "cancelButton",
								markerValue: "cancelButton",
								selectors: {wrapEl: "#cancelButton"},
								caption: resources.localizableStrings.CancelButtonCaption,
								style: this.Terrasoft.controls.ButtonEnums.style.GRAY,
								tag: "cancelButton",
								click: {bindTo: "onCancelClick"}
							}
						]
					}
				]
			};
			return Ext.create("Terrasoft.Container", config);
		};
		/**
		 * Вызывает сервис выгрузки/обновления листингов на рекламных площадках.
		 */
		var unloadListings = function(callback, packageId) {
			this.showBodyMask();
			checkOwnerWorkPhone(function() {
				var serviceConfig = {
					serviceName: assisServiceName,
					methodName: "PublishListings",
					data: {
						listingsIds: getListingsIds.call(this),
						packageInfo: packageId
					},
					callback: function(response) {
						this.hideBodyMask();
						var result = response.PublishListingsResult;
						if (result.isValid) {
							this.showInformationDialog(resources.localizableStrings.PublishConfirmation);
							if (callback && this.Ext.isFunction(callback)) {
								callback.call(this);
							}
						} else {
							if (!this.Ext.isEmpty(result.errorMessage)) {
								this.showInformationDialog(result.errorMessage);
							}
						}
					},
					timeout: timeout,
					scope: this
				};
				ServiceHelper.callService(serviceConfig);
			}, this);
		};
		/**
		 * Удаляет листинги с рекламных площадок.
		 */
		var deleteListings = function(silent, callback) {
			if (!silent) {
				this.showBodyMask();
			}
			var serviceConfig = {
				serviceName: assisServiceName,
				methodName: "DeleteListings",
				data: {
					listingsIds: getListingsIds.call(this)
				},
				callback: function(response) {
					if (silent) {
						return;
					}
					this.hideBodyMask();
					var result = response.DeleteListingsResult;
					if (this.Ext.isString(result)) {
						if (this.Ext.isEmpty(result)) {
							this.showInformationDialog(resources.localizableStrings.DeleteConfirmation);
							if (callback && this.Ext.isFunction(callback)) {
								callback.call(this);
							}
						} else {
							this.showInformationDialog(result);
						}
					} else {
						this.showInformationDialog(response.DeleteErrorMessage);
					}
				},
				timeout: timeout,
				scope: this
			};
			ServiceHelper.callService(serviceConfig);
		};
		/**
		 * Возвращает тип данных по номеру из объекта Terrasoft.DataValueType.
		 * @param {Number} typeNumber Номер типа данных.
		 * @returns {Object} Объект типа данных параметра.
		 */
		var getDataValueType = function(typeNumber) {
			var type = null;
			var dataValueType = this.Terrasoft.DataValueType;
			var dataTypes = _.map(RealtyConstants.DataTypes,
				function(item) {
					return {
						type: item.displayValue,
						value: item.value,
						caption: item.caption
					};
				}
			);
			dataTypes.forEach(function(item) {
				if (dataValueType[item.type] === typeNumber) {
					type = {
						value: item.value,
						displayValue: item.caption
					};
				}
			});
			return type;
		};
		/**
		 * Проверяет типы параметров.
		 * @returns {boolean} Возвращает истину если параметры не справочного типа.
		 */
		var getIsSimple = function() {
			var dataTypes = RealtyConstants.DataTypes;
			var selectedAmenityDataType = this.get("Amenity.DataType") || this.get("SelectedParameterType");
			selectedAmenityDataType = _.isNumber(selectedAmenityDataType) ?
				this.getDataValueType(selectedAmenityDataType) : selectedAmenityDataType;
			var type = dataTypes[selectedAmenityDataType.value].type;
			var amenityType = this.get("AmenityType");
			return amenityType !== "enum" && type !== "Lookup";
		};
		/**
		 * Проверяет соответствие типов параметров.
		 * @returns {boolean}
		 */
		var getIsParametersCompatible = function() {
			if (!this.get("SelectedParameter")) {
				return {
					"isCompatible": false,
					"needValidate": false
				};
			}
			var dataTypes = RealtyConstants.DataTypes;
			var selectedAmenityDataType = this.get("Amenity.DataType") || this.get("SelectedParameterType");
			selectedAmenityDataType = _.isNumber(selectedAmenityDataType) ?
				getDataValueType(selectedAmenityDataType) : selectedAmenityDataType;
			var type = dataTypes[selectedAmenityDataType.value].type;
			var amenityType = this.get("AmenityType");
			var isCompatible = false;
			var isSimple = false;
			switch (amenityType) {
				case "int16":
				case "int32":
				case "int64":
				case "double":
				case "string":
					isCompatible = type === "Int" || type === "Float" || type === "String";
					break;
				case "boolean":
					isCompatible = type === "Boolean";
					break;
				case "enum":
					if (this.get("ParameterName") === "feature") {
						if (type === "Boolean") {
							isCompatible = true;
							isSimple = true;
						}
						if (type === "Lookup") {
							isCompatible = false;
						}
					} else {
						isCompatible = type === "Lookup";
					}
					break;
			}
			isSimple = isSimple ? isSimple : getIsSimple.call(this);
			return {
				"isSimple": isSimple,
				"isCompatible": isCompatible,
				"needValidate": true
			};
		};
		return {
			getPackageInfo: getPackageInfo,
			unloadListings: unloadListings,
			deleteListings: deleteListings,
			checkListingPublishingAccess: checkListingPublishingAccess,
			getIsParametersCompatible: getIsParametersCompatible
		};
	});
