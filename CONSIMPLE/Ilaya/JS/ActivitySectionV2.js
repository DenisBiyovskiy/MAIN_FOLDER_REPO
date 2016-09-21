define("ActivitySectionV2", ["ExchangeNUIConstants", "ConfigurationConstants",  "BaseFiltersGenerateModule", "LookupUtilities", "DateEdit", "jQuery", "ilayExtScheduleEdit", "ilayExtScheduleItem", "SyncSettingsMixin", "css!ilayScheduleCSS", "css!RecommendationModule"],
	function(ExchangeNUIConstants, ConfigurationConstants,  BaseFiltersGenerateModule, LookupUtilities, DateEdit) {
		return {
			entitySchemaName: "Activity",
			messages: {
				"CustomButtonClick": {
					mode: Terrasoft.MessageMode.PTP,
					direction: Terrasoft.MessageDirectionType.PUBLISH
				},
				"SectionChanged": {
					mode: Terrasoft.MessageMode.BROADCAST,
					direction: Terrasoft.MessageDirectionType.SUBSCRIBE
				}
			},
			attributes: {
				IlayScheduleRendered: {
					dataValueType: this.Terrasoft.DataValueType.BOOLEAN,
					value: false
				},
				
				Cabinets: {
					dataValueType: this.Terrasoft.DataValueType.COLLECTION
				},
				
				CurrentDate: {
					dataValueType: this.Terrasoft.DataValueType.DATE,
					value: new Date()
				},
				/**
				 * + vlad
				 * Название представления "Расписание Ilay".
				 * НЕ МЕНЯТЬ! - есть жесткие привязки в схемах ilayExtScheduleItem, ilayExtScheduleEdit
				 */
				"IlaySchedulerDataViewName": {
					dataValueType: this.Terrasoft.DataValueType.TEXT,
					value: "IlaySchedulerDataView"
				},
				// - vlad
			},
			methods: {
				afterIlayScheduleRender: function() {
					if(this.isIlaySchedulerDataView()){
						this.set("IlayScheduleRendered", true);
					}else{
						this.set("IlayScheduleRendered", false);
					}
				},
				/**
				 * + vlad
				 * Добавляет пункт перехода в Расписание ilaya в меню кнопки "Вид".
				 * @overridden
				 */
				addChangeDataViewOptions: function(viewOptions) {
					viewOptions.addItem(this.getButtonMenuItem({
						"Caption": {"bindTo": "Resources.Strings.ilaySchedulerDataViewCaption"},
						"Click": {"bindTo": "changeDataView"},
						"Tag": this.get("IlaySchedulerDataViewName")
					}));
					this.callParent(arguments);
				},
				
				getDefaultDataViews: function() {
					var baseDataViews = this.callParent();
					baseDataViews.IlaySchedulerDataView = {
						index: 4,
						name: "IlaySchedulerDataView",
						caption: this.get("Resources.Strings.ilaySchedulerDataView"),
						hint: this.get("Resources.Strings.ilaySchedulerDataView"),
						icon: this.get("Resources.Images.ilaySchedulerPlanningDataViewIcon")
					};
					return baseDataViews;
				},
				
				/**
				 * Загружает представление расписания ilaya.
				 * @protected
				 */
				
				loadIlaySchedulerDataView: function() {
					this.handleScrollStyle(true);
					this.normalizeContainerStyle(true);
					this.loadSchedulerDataView(true);
				},
				
				// + vlad [IL -374]
				openCard: function() {
					this.handleScrollStyle(false);
					this.callParent(arguments);
				},
				
				handleScrollStyle: function(setStyle){
					if(setStyle){
						$("body").css("overflow", "hidden");
					}else{
						$("body").removeAttr("style");
					}
				},
				
				
				changeDataView: function(viewConfig) {
					var isIlayaView = (viewConfig.tag === "IlaySchedulerDataView" ? true : false);
					this.handleScrollStyle(isIlayaView);
					this.normalizeContainerStyle(isIlayaView);
					this.callParent(arguments);
				},
				
				onDestroy: function() {
					this.handleScrollStyle(false);
					this.destroyed = true;
					this.fireEvent("destroyed");
					this.clearListeners();
				},
				// - vlad [IL -374]
				
				// + vlad [IL - 299]
				onCancelLeadButtonClick: function() {
					this.sandbox.publish("BackHistoryState");
				},
				// изза добавления подсказки нужно немного поравить стиль контейнера
				normalizeContainerStyle: function(isIlayaView) {
					if(isIlayaView && this.isSwitchFromLead()){
						$("#DataViewsContainer").css("padding-top", "12em");
					}else{
						$("#DataViewsContainer").removeAttr("style");
					}
				},
				getRecommendationLabel: function() {
					var cashedDataFromLead = sessionStorage.getItem("cashedDataFromLead");
					if(cashedDataFromLead !== null){
						var dataFormLead = JSON.parse(cashedDataFromLead);
						return "Очікується створення візиту для " + dataFormLead.patient.displayValue + " по ліду";
					}
				},
				
				isRecommendationContainerVisible: function(){
					return(this.isSwitchFromLead() && this.isIlaySchedulerDataView());
				},
				// - vlad [IL - 299]
				
				isSchedulerDataView: function() {
					return ((this.get("ActiveViewName") === "SchedulerDataView") ||
					(this.get("ActiveViewName") === "PlanningDataView") || 
					(this.get("ActiveViewName") === "IlaySchedulerDataView"));
				},
				
				isIlaySchedulerDataView: function(){
					return this.get("ActiveViewName") === "IlaySchedulerDataView";
				},

				getSchedulerCurrentDate: function() {
					var currentDate = this.get("CurrentDate") || new Date();
					var clearCurrentDate = this.Ext.Date.clearTime(currentDate);
					return clearCurrentDate;
				},
				getFilters: function() {
					var filters = this.callParent(arguments);
					
					var fixedFilter = this.Ext.get("fixedFilterContainer");
					if (this.isIlaySchedulerDataView()) {
						if(filters.contains("ShowInSchedulerFilter")) {
							filters.removeByKey("ShowInSchedulerFilter");
						}
						if(filters.contains("FixedFilters")) {
							filters.removeByKey("FixedFilters");
						}
						if(filters.contains("NotEmailFilter")) {
							filters.removeByKey("NotEmailFilter");
						}
						if(fixedFilter) {
							fixedFilter.setDisplayed(false);
							$('#CurrentDateContainer').appendTo('#quickFilterViewContainer_SectionModuleV2_ActivitySectionV2_QuickFilterModuleV2Container');
							var viewConfig = {
								tag: "IlaySchedulerDataView",
								moduleName: "ActivitySectionV2"
							}
							this.model.once("change:CurrentDate", function() {
								this.changeDataView(viewConfig);
							}, this);
							var currContainer = this.Ext.get("CurrentDateContainer");
							if(currContainer){
								currContainer.setDisplayed(true);
							}
							this.normalizeContainerStyle(true);
						}
						var periodFilter = this.Terrasoft.createFilterGroup();
						periodFilter.logicalOperation = Terrasoft.LogicalOperatorType.AND;
						periodFilter.add("DueDate", this.Terrasoft.createColumnFilterWithParameter(
							this.Terrasoft.ComparisonType.GREATER_OR_EQUAL, "DueDate",
							this.Terrasoft.startOfDay(this.get("CurrentDate"))));
						periodFilter.add("StartDate", this.Terrasoft.createColumnFilterWithParameter(
							this.Terrasoft.ComparisonType.LESS_OR_EQUAL, "StartDate",
							this.Terrasoft.endOfDay(this.get("CurrentDate"))));
						filters.add(periodFilter);
						
						filters.add("ShowInScheduler", this.Terrasoft.createColumnFilterWithParameter(
						this.Terrasoft.ComparisonType.EQUAL, "ShowInScheduler", true
						));
					}else {
						if(fixedFilter) {
							fixedFilter.setDisplayed(true);
							if(this.Ext.get("CurrentDateContainer")) {
								this.Ext.get("CurrentDateContainer").setDisplayed(false);
							}
						}
					}
					return filters;
				},
				
				getGridDataColumns: function() {
					var baseGridDataColumns = this.callParent(arguments);
					var gridDataColumns;
					gridDataColumns = {
						"ilayCabinet": {path: "ilayCabinet"},
						"ilayAssistant": {path: "ilayAssistant"},
						"ilayVisitStatus": {path: "ilayVisitStatus"},
						"ilayPatient": {path: "Contact"}
					};
					return Ext.apply(baseGridDataColumns, gridDataColumns);
				},
				init: function(callback, scope) {
					this.callParent([function() {
						this.initCabinets(function() {
							callback.call(scope);
						}.bind(this));
					}, this]);
					
				},
				
				initDataViews: function() {
					var defaultDataViews = this.getDefaultDataViews();
					var dataViews = this.Ext.create("Terrasoft.Collection");
					var savedActiveViewName = this.getActiveViewNameFromProfile();
					this.Terrasoft.each(defaultDataViews, function(dataView, dataViewName) {
						dataViews.add(dataViewName, dataView, dataView.index);
						if (savedActiveViewName !== "") {
							dataView.active = (dataViewName === savedActiveViewName);
						}
					}, this);
					this.set("DataViews", dataViews);
					this.set("IsGridLoading", false);
					this.sandbox.subscribe("ChangeDataView", this.changeDataView, this,
						["ViewModule_MainHeaderModule_" + this.name]);
					this.sandbox.publish("InitDataViews", {
						caption: this.getDefaultGridDataViewCaption(),
						dataViews: dataViews,
						moduleName: this.name,
						async: true
					});
					this.sandbox.subscribe("GetActiveViewName", function() {
						return this.getActiveViewName();
					}, this);
					// + vlad
					// обработка перехода в расписание из карточки Лида
					if(this.isSwitchFromLead()){
						this.normalizeContainerStyle(true);
						this.setActiveView("IlaySchedulerDataView", false);
					}else{
					// - vlad
						this.setActiveView(this.getActiveViewName(), false);
					}
					
				},
				
				isSwitchFromLead: function() {
					var hash = Terrasoft.Router.getHash();
					var params = hash.split("&");
					if (params.lenght === 1){
						return false;
					}
					params.splice(0, 1);
					if(params[0] === "isFromLead=true"){
						return true;
					}else{
						return false;
					}
				},
				
				
				initCabinets: function(callback) {
					var entity = Ext.create("Terrasoft.EntitySchemaQuery", {
						rootSchemaName: "ilayCabinets"
					});
					entity.addColumn("Id");
					var name = entity.addColumn("ilayName");
					name.orderDirection = Terrasoft.OrderDirection.ASC;
					entity.getEntityCollection(function(result) {
						if (result.success) {
							this.set("Cabinets", result.collection);
							if (callback) {
								callback.call();
							}
						}
					}, this);
				},
				isVisitToDoctor: function() {
					var activeRow = this.getActiveRow();
					if(activeRow) {
						if(activeRow.get("Type") && activeRow.get("Type").value == "5ee3b705-cf5c-4ac4-bb61-ffc7a4f485ba") {
							return true;
						}
					}
					return false;
				},
				isCancelVisitButtonVisibled: function() {
					if(this.get("ShowCancelVisitButton") && this.isVisitToDoctor()) {
						return true;
					} else {
						return false;
					}
				},
				isPacientInHospitalButtonVisibled: function() {
					if(this.get("ShowPacientInHospitalButton") && this.isVisitToDoctor()) {
						return true;
					} else {
						return false;
					}
				},
				getVisitToDoctorSandoxId: function() {
					return "SectionModuleV2_ActivitySectionV2_CardModuleV2";
				},
				onBaseClick: function() {
					var tag = arguments[0] || arguments[3];
					this.sandbox.publish("CustomButtonClick", tag, [this.getVisitToDoctorSandoxId()]);
				},
				isReceptionButtonVisibled: function() {
					if(this.get("ShowReceptionButton") && this.isVisitToDoctor()) {
						return true;
					} else {
						return false;
					}
				},
				isConfirmButtonVisibled: function() {
					if(this.get("ShowConfirmButton") && this.isVisitToDoctor()) {
						return true;
					} else {
						return false;
					}
				},
				callbackSelectedReason: function(args) {
					if (args && args.selectedRows && args.selectedRows.collection.getCount() > 0) {
						var reasonId = args.selectedRows.collection.keys[0];
						var currContact = Terrasoft.SysValue.CURRENT_USER_CONTACT.value;
						var currDate = new Date();
						this.set("ShowSaveButton", false);
						var update = Ext.create("Terrasoft.UpdateQuery", {
							rootSchemaName: "Activity"
						}); 
						update.setParameterValue("ilayReasonCancelVisit", reasonId, Terrasoft.DataValueType.GUID);
						update.setParameterValue("ilayContactCancelVisit", currContact, Terrasoft.DataValueType.GUID);
						update.setParameterValue("ilayDateCancelVisit", currDate, Terrasoft.DataValueType.DATE);
						update.setParameterValue("ShowInScheduler", false, Terrasoft.DataValueType.BOOLEAN);
						update.setParameterValue("ilayVisitStatus", "201cfba8-58e6-df11-971b-001d60e938c6", Terrasoft.DataValueType.GUID);
						var filter = update.createColumnFilterWithParameter(this.Terrasoft.ComparisonType.EQUAL, "Id", this.get("ActiveRow"));
						update.filters.add("Id", filter);
						update.execute(function(result) {
							if(result.success) {
								this.customCloseCard();
							}
						}, this);
					}
				},
				customCloseCard: function() {
					var tag = "onCloseClick";
					var cardModuleSandboxId = this.getCardModuleSandboxId();
					this.sandbox.publish("OnCardAction", tag, [cardModuleSandboxId]);
				}
			},
			diff: /**SCHEMA_DIFF*/[
				// + CustomRecommendations [IL - 299] vlad
				{
					"operation": "insert",
					"name": "x-close-button",
					"values": {
						"itemType": 5,
						"hint": {
							"bindTo": "Resources.Strings.x_close_btn"
						},
						"imageConfig": {
							"bindTo": "Resources.Images.x_close_btn_img"
						},
						"click": {
							"bindTo": "onCancelLeadButtonClick"
						},
						"classes": {
							"wrapperClass": "x-close-btn",
							"imageClass": "x-close-img",
							"pressedClass": "x-close-img-pressed"
						},
						"visible": {"bindTo": "isRecommendationContainerVisible"}
					},
					"parentName": "CustomRecommendationContainer",
					"propertyName": "items",
					"index": 1
				},
				{
					"operation": "insert",
					"name": "CustomRecommendationContainer",
					"parentName": "GridUtilsContainer",
					"propertyName": "items",
					"values": {
						"id": "CustomRecommendationContainer",
						"selectors": {"wrapEl": "#CustomRecommendationContainer"},
						"itemType": Terrasoft.ViewItemType.CONTAINER,
						"wrapClass": ["content-container-wrapClass", 
							"CustomRecommendationContainer"],
						"items": []
					}
				},
				{
					"operation": "insert",
					"name": "CustomRecommendationLabel",
					"parentName": "CustomRecommendationContainer",
					"propertyName": "items",
					"values": {
						"labelClass": ["information recommendation"],
						"itemType": Terrasoft.ViewItemType.LABEL,
						"caption": {
							"bindTo": "getRecommendationLabel"
						},
						"visible": {
							"bindTo": "isRecommendationContainerVisible" 
						}
					},
					"index": 0
				},
				
				// - CustomRecommendations [IL - 299] vlad
				{
					"operation": "merge",
					"name": "Schedule",
					"values": {
						"controlConfig": {
							"className": "ilayExtScheduleEdit"
						},
						"afterrender": { "bindTo": "afterIlayScheduleRender" },
						"afterrerender": { "bindTo": "afterIlayScheduleRender" },
						"cabinetsCollection": {"bindTo": "Cabinets"},
						"currentDate": {"bindTo": "getSchedulerCurrentDate"},
						"itemBindingConfig": {
							"itemId": {"bindTo": "Id"},
							"title": {"bindTo": "getScheduleItemTitle"},
							"changeTitle": {"bindTo": "onTitleChanged"},
							"startDate": {"bindTo": "StartDate"},
							"changeStartDate": {"bindTo": "onStartDateChanged"},
							"dueDate": {"bindTo": "DueDate"},
							"changeDueDate": {"bindTo": "onDueDateChanged"},
							"status": {"bindTo": "getScheduleItemStatus"},
							"changeStatus": {"bindTo": "onStatusChanged"},
							"background": {"bindTo": "Background"},
							"fontColor": {"bindTo": "FontColor"},
							"isBold": {"bindTo": "IsBold"},
							"isItalic": {"bindTo": "IsItalic"},
							"isUnderline": {"bindTo": "IsUnderline"},
							"markerValue": {"bindTo": "getScheduleItemHint"},
							"ilayCabinet": {"bindTo": "ilayCabinet"},
							"ilayAssistant": {"bindTo": "ilayAssistant"},
							"ilayVisitStatus": {"bindTo": "ilayVisitStatus"},
							"ilayPatient": {"bindTo": "ilayPatient"},
							"tips": [
								{
									"tip": {
										"content": {"bindTo": "getScheduleItemHint"},
										"displayMode": Terrasoft.controls.TipEnums.displayMode.WIDE,
										"markerValue": {"bindTo": "getScheduleItemHint"}
									},
									"settings": {"alignEl": "getTitleEl"}
								}
							]
						}
					}
				},
				{
					"operation": "insert",
					"name": "CurrentDateContainer",
					"parentName": "SectionWrapContainer",
					"propertyName": "items",
					"values": {
						"id": "CurrentDateContainer",
						"selectors": {"wrapEl": "#CurrentDateContainer"},
						"itemType": Terrasoft.ViewItemType.CONTAINER,
						"wrapClass": ["content-container-wrapClass", 
							"ActivitySectionV2CurrentDateContainer"],
						"items": []
					}
				},
				{
					"operation": "insert",
					"name": "CurrentDate",
					"values": {
						"id": "CurrentDate",
						"bindTo": "CurrentDate",
						"caption": {
							"bindTo": "Resources.Strings.CurrentDateCaption"
						},
						"enabled": true,
						"visible": {
							"bindTo": "isIlaySchedulerDataView"
						}
					},
					"parentName": "CurrentDateContainer",
					"propertyName": "items",
					"index": 3
				},
				{
					"operation": "insert",
					"parentName": "CombinedModeActionButtonsCardLeftContainer",
					"propertyName": "items",
					"name": "CancelVisitButton",
					"values": {
						"itemType": Terrasoft.ViewItemType.BUTTON,
						"caption": {"bindTo": "Resources.Strings.CancelVisitButtonCaption"},
						"style": Terrasoft.controls.ButtonEnums.style.RED,
						"classes": {
							"wrapperClass": "ActivitySectionV2CancelVisitButtonButton-textEl"
						},
						"visible": {"bindTo": "isCancelVisitButtonVisibled"},
						"click": {"bindTo": "onBaseClick"},
						"tag": "onCancelVisitButtonClick",
						"enabled": /*{"bindTo": "ShowCancelVisitButton"}*/true
					},
					"index": 13
				},
				{
					"operation": "insert",
					"parentName": "CombinedModeActionButtonsCardLeftContainer",
					"propertyName": "items",
					"name": "MoveVisitButton",
					"values": {
						"itemType": Terrasoft.ViewItemType.BUTTON,
						"caption": {"bindTo": "Resources.Strings.MoveVisitButtonCaption"},
						"style": Terrasoft.controls.ButtonEnums.style.BLUE,
						"classes": {
							"wrapperClass": "ActivitySectionV2MoveVisitButtonButton-textEl"
						},
						"visible": {"bindTo": "isCancelVisitButtonVisibled"},
						"click": {"bindTo": "onBaseClick"},
						"tag": "onMoveVisitButtonClick",
						"enabled": /*{"bindTo": "ShowCancelVisitButton"}*/true
					},
					"index": 12
				},
				{
					"operation": "insert",
					"parentName": "CombinedModeActionButtonsCardLeftContainer",
					"propertyName": "items",
					"name": "FinishVisitButton",
					"values": {
						"itemType": Terrasoft.ViewItemType.BUTTON,
						"caption": {"bindTo": "Resources.Strings.FinishVisitButtonCaption"},
						"style": Terrasoft.controls.ButtonEnums.style.GREEN,
						"classes": {
							"wrapperClass": "ActivitySectionV2MoveVisitButtonButton-textEl"
						},
						"visible": /*{"bindTo": "isCancelVisitButtonVisibled"}*/ false,
						"click": {"bindTo": "onBaseClick"},
						"tag": "onFinishVisitButtonClick",
						"enabled": /*{"bindTo": "ShowCancelVisitButton"}*/ true
					},
					"index": 11
				},
				{
					"operation": "insert",
					"parentName": "CombinedModeActionButtonsCardLeftContainer",
					"propertyName": "items",
					"name": "ConfirmButton",
					"values": {
						"itemType": Terrasoft.ViewItemType.BUTTON,
						"caption": {"bindTo": "Resources.Strings.ConfirmButtonCaption"},
						"style": Terrasoft.controls.ButtonEnums.style.BLUE,
						"classes": {
							"wrapperClass": "ActivitySectionV2ConfirmButtonButton-textEl"
						},
						"visible": {"bindTo": "isConfirmButtonVisibled"},
						"click": {"bindTo": "onBaseClick"},
						"tag": "onConfirmButtonClick",
						"enabled": /*{"bindTo": "ShowCancelVisitButton"}*/true
					},
					"index": 8
				},
				{
					"operation": "insert",
					"parentName": "CombinedModeActionButtonsCardLeftContainer",
					"propertyName": "items",
					"name": "PacientInHospitalButton",
					"values": {
						"itemType": Terrasoft.ViewItemType.BUTTON,
						"caption": {"bindTo": "Resources.Strings.PacientInHospitalButtonCaption"},
						"style": Terrasoft.controls.ButtonEnums.style.BLUE,
						"classes": {
							"wrapperClass": "ActivitySectionV2PacientInHospitalButtonButton-textEl"
						},
						"visible": {"bindTo": "isPacientInHospitalButtonVisibled"},
						"click": {"bindTo": "onBaseClick"},
						"tag": "onPacientInHospitalButtonClick",
						"enabled": /*{"bindTo": "ShowCancelVisitButton"}*/true
					},
					"index": 9
				},
				{
					"operation": "insert",
					"parentName": "CombinedModeActionButtonsCardLeftContainer",
					"propertyName": "items",
					"name": "ReceptionButton",
					"values": {
						"itemType": Terrasoft.ViewItemType.BUTTON,
						"caption": {"bindTo": "Resources.Strings.ReceptionButtonCaption"},
						"style": Terrasoft.controls.ButtonEnums.style.BLUE,
						"classes": {
							"wrapperClass": "ActivitySectionV2ReceptionButtonButton-textEl"
						},
						"visible": {"bindTo": "isReceptionButtonVisibled"},
						"click": {"bindTo": "onBaseClick"},
						"tag" : "onReceptionButtonClick",
						"enabled": /*{"bindTo": "ShowCancelVisitButton"}*/true
					},
					"index": 10
				}
			]/**SCHEMA_DIFF*/
		};
	}
);