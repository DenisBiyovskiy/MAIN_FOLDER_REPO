define("ListingSection", ["ProcessModuleUtilities"],
	function(ProcessModuleUtilities) {
	return {
		entitySchemaName: "Listing",
		attributes: {
			"IsUsrAgent": {
				"dataValueType": this.Terrasoft.DataValueType.BOOLEAN,
				"value": false
			},
			"IsUsrOperator": {
				"dataValueType": this.Terrasoft.DataValueType.BOOLEAN,
				"value": false
			}
		},
		methods: {
			getSectionActions: function() {
				var actionMenuItems = this.callParent(arguments);
				actionMenuItems.addItem(this.getActionsMenuItem({
					Type: "Terrasoft.MenuSeparator",
					Caption: ""
				}));
				actionMenuItems.addItem(this.getActionsMenuItem({
					Caption: "Опубликовать объявление на Avito.ru",
					Click: {bindTo: "exportAtAvito"},
					Enabled: {"bindTo": "getCanExportAvito"}
				}));
				actionMenuItems.addItem(this.getActionsMenuItem({
					Caption: "Снять объявление с Avito.ru",
					Click: {bindTo: "stopAtAvito"},
					Enabled: {"bindTo": "getCanExportAvito"}
				}));
				actionMenuItems.addItem(this.getActionsMenuItem({
					Type: "Terrasoft.MenuSeparator",
					Caption: ""
				}));
				actionMenuItems.addItem(this.getActionsMenuItem({
					Caption: "Test",
					Click: {bindTo: "testik"},
					Enabled: true
				}));
				return actionMenuItems;
			},
			testik: function () {
				var processArgs = {
					sysProcessName: 'UsrProcessTest',
					parameters: {						
					}
				};
				ProcessModuleUtilities.runProcess(processArgs.sysProcessName, processArgs.parameters, function() { }, this);
				this.hideBodyMask();
			},
			onDeleted: function () {
				AssisHelper.deleteListings.call(this);
				this.callParent(arguments);
			},
			stopAtAvito: function () {
				var selectedItems = this.changedValues.SelectedRows;
				var selectedItem = this.changedValues.ActiveRow;
				var selected = "";
				var count = 0;
				if (this.changedValues.SelectedRows.length == 0) {
					selected += selectedItem + ",";
					count++;
					var processArgs = {
						sysProcessName: 'UsrProcessExportAtAvito',
						parameters: {						
							"SelectedListings": selected,
							"AddOrDelete": false
						}
					};
					ProcessModuleUtilities.runProcess(processArgs.sysProcessName, processArgs.parameters, function() { this.callBack("Снято", count, 0); }, this);
					this.hideBodyMask();
				} else {
					var entity = Ext.create("Terrasoft.EntitySchemaQuery", {
						rootSchemaName: "Listing" 
					});
					entity.addColumn("Id");
					entity.filters.addItem(entity.createColumnFilterWithParameter(
						this.Terrasoft.ComparisonType.EQUAL, "UsrExportedOnAvito", true));
					var filterGroup = new this.Terrasoft.createFilterGroup();
					filterGroup.logicalOperation = this.Terrasoft.LogicalOperatorType.OR;
					for (var i = 0; i < selectedItems.length; i++) {
						filterGroup.add("ListingId" + i, this.Terrasoft.createColumnFilterWithParameter(
							this.Terrasoft.ComparisonType.EQUAL, "Id", selectedItems[i]));
					}
					entity.filters.addItem(filterGroup);
					entity.getEntityCollection(function(result) {
						if (result.collection.getCount() == 0) {
							countDown = selectedItems.length - count;
							this.callBack("Снято", count, 0);
						} else {
							for (var i = 0; i < result.collection.getCount(); i++) {
								selected += result.collection.getByIndex(i).get("Id") + ",";
								count++;
							}
							var processArgs = {
								sysProcessName: 'UsrProcessExportAtAvito',
								parameters: {						
									"SelectedListings": selected,
									"AddOrDelete": false
								}
							};
							ProcessModuleUtilities.runProcess(processArgs.sysProcessName, processArgs.parameters, function() { this.callBack("Снятие", count, 0); }, this);
							this.hideBodyMask();
						}
					}, this);
				}
			},
			exportAtAvito: function() {
				var selectedItems = this.changedValues.SelectedRows;
				var selectedItem = this.changedValues.ActiveRow;
				var selected = "";
				var count = 0;
				var countDown = 0;
				if (this.get("IsUsrOperator")) {
					if (this.changedValues.SelectedRows.length == 0) {
						selected += selectedItem + ",";
						count++;
						var processArgs = {
							sysProcessName: 'UsrProcessExportAtAvito',
							parameters: {						
								"SelectedListings": selected,
								"AddOrDelete": true
							}
						};
						ProcessModuleUtilities.runProcess(processArgs.sysProcessName, processArgs.parameters, function() { this.callBack("Публикация", count, countDown); }, this);
						this.hideBodyMask();
					} else {
						var entity = Ext.create("Terrasoft.EntitySchemaQuery", {
							rootSchemaName: "Listing" 
						});
						entity.addColumn("Id");
						entity.filters.addItem(entity.createColumnFilterWithParameter(
							this.Terrasoft.ComparisonType.EQUAL, "UsrExportedOnAvito", false));
						var filterGroup = new this.Terrasoft.createFilterGroup();
						filterGroup.logicalOperation = this.Terrasoft.LogicalOperatorType.OR;
						for (var i = 0; i < selectedItems.length; i++) {
							filterGroup.add("ListingId" + i, this.Terrasoft.createColumnFilterWithParameter(
								this.Terrasoft.ComparisonType.EQUAL, "Id", selectedItems[i]));
						}
						entity.filters.addItem(filterGroup);
						entity.getEntityCollection(function(result) {
							if (result.collection.getCount() == 0) {
								countDown = selectedItems.length - count;
								this.callBack("Публикация", count, countDown);
							} else {
								for (var i = 0; i < result.collection.getCount(); i++) {
									selected += result.collection.getByIndex(i).get("Id") + ",";
									count++;
								}
								countDown = selectedItems.length - count;
								var processArgs = {
									sysProcessName: 'UsrProcessExportAtAvito',
									parameters: {						
										"SelectedListings": selected,
										"AddOrDelete": true
									}
								};
								ProcessModuleUtilities.runProcess(processArgs.sysProcessName, processArgs.parameters, function() { this.callBack("Публикация", count, countDown); }, this);
								this.hideBodyMask();
							}
						}, this);
					}
				} else if (this.get("IsUsrAgent")) {
					var delayListingExport = 0;
					this.Terrasoft.SysSettings.querySysSettingsItem("Delay4ListingExport",
						function(value) {
							delayListingExport = value;
							if (this.changedValues.SelectedRows.length == 0) {
								var entity = Ext.create("Terrasoft.EntitySchemaQuery", {
									rootSchemaName: "Listing" 
								});
								entity.addColumn("Id");
								entity.addColumn("UsrLastExportRgr51");
								entity.filters.addItem(entity.createColumnFilterWithParameter(
									this.Terrasoft.ComparisonType.EQUAL, "UsrExportedOnAvito", false));
								entity.filters.addItem(entity.createColumnFilterWithParameter(
									this.Terrasoft.ComparisonType.EQUAL, "Id", selectedItem));
								entity.getEntityCollection(function(result) {
									var lastExportRgr = result.collection.getByIndex(0).get("UsrLastExportRgr51");
									if (!Ext.isEmpty(lastExportRgr)) {
										lastExportRgr.setDate(lastExportRgr.getDate() + delayListingExport);
										var today = new Date();
										if (today >= lastExportRgr) {
											selected += result.collection.getByIndex(0).get("Id") + ",";
											count++;
										}
									} else {
										selected += result.collection.getByIndex(0).get("Id") + ",";
										count++;
									}
									countDown = selectedItems.length - count;
									var processArgs = {
										sysProcessName: 'UsrProcessExportAtAvito',
										parameters: {						
											"SelectedListings": selected,
											"AddOrDelete": true
										}
									};
									ProcessModuleUtilities.runProcess(processArgs.sysProcessName, processArgs.parameters, function() { this.callBack("Публикация", count, countDown); }, this);
									this.hideBodyMask();
								}, this);
							} else {
								var entity = Ext.create("Terrasoft.EntitySchemaQuery", {
									rootSchemaName: "Listing" 
								});
								entity.addColumn("Id");
								entity.addColumn("UsrLastExportRgr51");
								entity.filters.addItem(entity.createColumnFilterWithParameter(
									this.Terrasoft.ComparisonType.EQUAL, "UsrExportedOnAvito", false));
								var filterGroup = new this.Terrasoft.createFilterGroup();
								filterGroup.logicalOperation = this.Terrasoft.LogicalOperatorType.OR;
								for (var i = 0; i < selectedItems.length; i++) {
									filterGroup.add("ListingId" + i, this.Terrasoft.createColumnFilterWithParameter(
										this.Terrasoft.ComparisonType.EQUAL, "Id", selectedItems[i]));
								}
								entity.filters.addItem(filterGroup);
								entity.getEntityCollection(function(result) {
									if (result.collection.getCount() == 0) {
										countDown = selectedItems.length - count;
										this.callBack("Публикация", count, countDown);
									} else {
										for (var i = 0; i < result.collection.getCount(); i++) {
											var lastExportRgr = result.collection.getByIndex(i).get("UsrLastExportRgr51");
											if (!Ext.isEmpty(lastExportRgr)) {
												lastExportRgr.setDate(lastExportRgr.getDate() + delayListingExport);
												var today = new Date();
												if (today >= lastExportRgr) {
													selected += result.collection.getByIndex(i).get("Id") + ",";
													count++;
												}
											} else {
												selected += result.collection.getByIndex(i).get("Id") + ",";
												count++;
											}
										}
										countDown = selectedItems.length - count;
										var processArgs = {
											sysProcessName: 'UsrProcessExportAtAvito',
											parameters: {						
												"SelectedListings": selected,
												"AddOrDelete": true
											}
										};
										ProcessModuleUtilities.runProcess(processArgs.sysProcessName, processArgs.parameters, function() { this.callBack("Публикация", count, countDown); }, this);
										this.hideBodyMask();
									}
								}, this);
							}
						}, this);
					
				} else {
					this.showInformationDialog("Вы не являетесь ни агентом, ни оператором. Публикация невозможна.");
					this.unSetMultiSelect();
				}
			},
			callBack: function (action, countUp, countDown) {
				var message = action + " на Avito " + countUp;
				if (countUp == 1) message += "-го листинга, успешно завершена.";
				else message += " листингов, успешно завершена.";
				if (countDown > 0 && (action != "Снятие" || action != "Снято")) {
					message += "\nНе опубликованно " + countDown + " листинга."
				}
				this.showInformationDialog(message);
				this.unSetMultiSelect();
			},
			init: function () {
				this.callParent(arguments);
				var esq = Ext.create("Terrasoft.EntitySchemaQuery", {
					"rootSchemaName": "SysAdminUnit"
				});
				esq.addColumn("Id");
				esq.filters.addItem(Terrasoft.createColumnFilterWithParameter(
					Terrasoft.ComparisonType.EQUAL, "Id", Terrasoft.SysValue.CURRENT_USER.value));
				esq.filters.addItem(Terrasoft.createColumnFilterWithParameter(
					Terrasoft.ComparisonType.EQUAL, "[SysAdminUnitInRole:SysAdminUnit:Id].SysAdminUnitRoleId",
					"471A060B-6F03-4D17-B91A-9272A7A2B33E"));
				esq.getEntityCollection(function(result) {
					var isAdmin = result.success && (result.collection.getCount() === 1);
					this.set("IsUsrAgent", isAdmin);
					if (this.get("IsUsrAgent")) {
						this.set ("CanListingPublishing", false);
					}
				}, this);
				
				var esq2 = Ext.create("Terrasoft.EntitySchemaQuery", {
					"rootSchemaName": "SysAdminUnit"
				});
				esq2.addColumn("Id");
				esq2.filters.addItem(Terrasoft.createColumnFilterWithParameter(
					Terrasoft.ComparisonType.EQUAL, "Id", Terrasoft.SysValue.CURRENT_USER.value));
				esq2.filters.addItem(Terrasoft.createColumnFilterWithParameter(
					Terrasoft.ComparisonType.EQUAL, "[SysAdminUnitInRole:SysAdminUnit:Id].SysAdminUnitRoleId",
					"97CF2755-8161-4040-B57C-AB28680A25BC"));
				esq2.getEntityCollection(function(result) {
					var isAdmin = result.success && (result.collection.getCount() === 1);
					this.set("IsUsrOperator", isAdmin);
				}, this);
			},
			getCanExportAvito: function() {
				return this.isAnySelected();
			},
		},
		diff: /**SCHEMA_DIFF*/[]/**SCHEMA_DIFF*/
	};
});
