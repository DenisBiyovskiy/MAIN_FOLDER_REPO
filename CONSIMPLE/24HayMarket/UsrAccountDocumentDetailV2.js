define("UsrAccountDocumentDetailV2", ["UsrAccountDocumentDetailV2Resources", "XRMConstants", "ProcessModuleUtilities", "ConfigurationGridUtilities", "ConfigurationEnums", "ConfigurationGrid", "ConfigurationGridGenerator"], 
	function(Resources, XRMConstants, ProcessModuleUtilities, ConfigurationGridUtilities, enums) {
	return {
		entitySchemaName: "UsrAccountDocument",
		messages: {
			"CardModuleEntityInfo": {
				"mode": Terrasoft.MessageMode.PTP,
				"direction": Terrasoft.MessageDirectionType.SUBSCRIBE
			}
		},
		attributes: {
			/**
			 * Отвечает за загруженные уровни иерархии
			 */
			"expandedElements": {
				dataValueType: Terrasoft.DataValueType.CUSTOM_OBJECT,
				type: Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN
			},
			/**
			 * Отвечает за список развернутых элементов,
			 * хранит массив уникальных идетификаторов записей
			 */
			"expandHierarchyLevels": {
				dataValueType: Terrasoft.DataValueType.CUSTOM_OBJECT,
				type: Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN
			},
			/**
			 * Отвечает за хранение разворачиваемого элемента иерархии
			 */
			"ExpandItemId": {
				dataValueType: Terrasoft.DataValueType.GUID,
				type: Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN
			},
			"isPortal": {
				"dataValueType": Terrasoft.DataValueType.BOOLEAN,
				"value":  true
			},
			"isPortalUser": {
				"dataValueType": Terrasoft.DataValueType.BOOLEAN,
				"value":  false
			},
		},
		mixins: {
			ConfigurationGridUtilites: "Terrasoft.ConfigurationGridUtilities"
		},
		methods: {
			openDocument: function() {
				var editPageUId = "A4AD2B31-F88D-48C2-92DC-41771E902107";
				var config = this.getSelectedItems();
				var id = config[0];
				this.openCard("edit", editPageUId, id);
			},
			checkRights: function() {
				if (this.getDetailInfo().cardPageName === "UsrPortfolioPageV2" || this.getDetailInfo().cardPageName === "UsrInvestmentOppPageV2") {
					this.set("isPortal", false);
					this.set("isPortalUser", true);
				}
			},
			//disableGridSorting: Ext.emptyFn,//Den
			//sortColumn: Ext.emptyFn,//Den
			/**
			 * Установка настроек колонок детали по умолчанию, если отсутствует пользовательская настройка
			 */
			initProfile: function() {
				var profile = this.getProfile();
				var dataGridName = this.getDataGridName();
				if (!profile[dataGridName]) {
					profile[dataGridName] = {};
					this.set("Profile", this.Terrasoft.deepClone(profile));
				}
				var currentProfile = this.get("Profile");
				if (currentProfile && currentProfile.DataGrid
					&& ((currentProfile.DataGrid.listedConfig == '{"items":[]}' && currentProfile.DataGrid.type == 'listed')
					|| (currentProfile.DataGrid.tiledConfig == '{"grid":{"rows":0,"columns":24},"items":[]}' && currentProfile.DataGrid.type == 'tiled')
					|| (!currentProfile.DataGrid.listedConfig && !currentProfile.DataGrid.tiledConfig))
				) {
					var newProfile = JSON.parse(Resources.localizableStrings.DefaultColumnsProfileConfig);
					this.set("Profile", newProfile);
				}
			},
			init: function() {
				this.callParent(arguments);
				this.checkRights();
			},
			initData: function() {
				this.callParent(arguments);
				this.set("expandedElements", {});
				this.set("expandHierarchyLevels", []);
			},
			onDeleted: function(result) {
				this.callParent(arguments);
				if (result.Success) {
					this.reloadGridData();
				}
			},
			clearExpandHierarchyLevels: function() {
				this.set("expandedElements", {});
				this.set("expandHierarchyLevels", []);
				var grid = Ext.getCmp("ProjectDetailV2DataGridGrid");
				if (grid) {
					grid.expandHierarchyLevels = [];
				}
			},
			removeExpandHierarchyLevel: function(itemId) {
				var expandHierarchyLevels = this.get("expandHierarchyLevels");
				this.set("expandHierarchyLevels", Terrasoft.without(expandHierarchyLevels, itemId));
				var grid = Ext.getCmp("ProjectDetailV2DataGridGrid");
				if (grid) {
					grid.expandHierarchyLevels = Terrasoft.without(grid.expandHierarchyLevels, itemId);
				}
			},
			addGridDataColumns: function(esq) {
				this.callParent(arguments);
				this.putParentColumn(esq);
				this.putNestingColumn(esq);
				this.putPositionColumn(esq);
			},
			putParentColumn: function(esq) {
				var parentItem = this.get("ExpandItemId");
				if (parentItem && !esq.columns.contains("ParentId")) {
				esq.addColumn("UsrParent.Id", "ParentId");
				}
			},
			putPositionColumn: function(esq) {
				if (!esq.columns.contains("UsrPosition")) {
					esq.addColumn("UsrPosition");
				}
			},
			putNestingColumn: function(esq) {
				var aggregationColumn = this.Ext.create("Terrasoft.AggregationQueryColumn", {
				aggregationType: Terrasoft.AggregationType.COUNT,
					columnPath: "[UsrAccountDocument:UsrParent].Id"
				});
				if (!esq.columns.contains("HasNesting")) {
					esq.addColumn(aggregationColumn, "HasNesting");
				}
			},
			getParents: function(primaryValues) {
				var parentPrimaryValues = [];
				var gridData = this.getGridData();
				if (Ext.isEmpty(primaryValues)) {
					return parentPrimaryValues;
				}
				primaryValues.forEach(function(primaryColumnValue) {
					var project = gridData.get(primaryColumnValue);
					var parentPrimaryColumnValue = project.get("ParentId");
					if (parentPrimaryColumnValue) {
						parentPrimaryValues.push(parentPrimaryColumnValue);
					}
				});
				return parentPrimaryValues;
			},
			removeGridRecords: function(primaryColumnValues) {
				var updateNestingCollection = this.getParents(primaryColumnValues);
				this.callParent(arguments);
				var gridData = this.getGridData();
				Terrasoft.each(updateNestingCollection, function(projectId) {
				var count = gridData.filterByFn(function(item) {
				return item.get("ParentId") === projectId;
				}, this).getCount();
				if (gridData.contains(projectId)) {
				this.removeExpandHierarchyLevel(projectId);
				var parent = gridData.get(projectId);
				parent.set("HasNesting", count);
				}
				}, this);
			},
			getExpandedItems: function() {
				return this.get("expandedElements");
			},
			setExpandedItem: function(primaryColumnValue) {
				(this.getExpandedItems()[primaryColumnValue]) = {"page": 0};
			},
			isItemExpanded: function(primaryColumnValue) {
				return Boolean(this.getExpandedItems()[primaryColumnValue]);
			},
			addItemsToGridData: function(dataCollection, options) {
				if (dataCollection.isEmpty()) {
					return;
				}
				var firstItem = dataCollection.getByIndex(0);
				var parentId = firstItem.get("ParentId");
				if (parentId) {
					options = {
						mode: "child",
						target: parentId
					};
					var gridData = this.getGridData();
					//TODO исправить костыль.
					//Den> Костыль для заполнения gridData.collection.keys - 
					//		в них посвюду через раз ключами является undefined.
					//		и еще Map пустая.
					for(var i = 0; i < gridData.collection.items.length; i++) {
						var curId = gridData.collection.items[i].values.Id;
						gridData.collection.keys[i] = curId;
						gridData.collection.map[curId] = gridData.collection.items[i];
					}
					//Den<
					var parentObj = gridData.contains(parentId) ? gridData.get(parentId) : undefined;
					if (parentObj) {
						parentObj.set("HasNesting", 1);
					}
					if (!this.isItemExpanded(parentId)) {
						return;
					}
				} else {
					this.set("LastRecord", dataCollection.getByIndex(dataCollection.getCount() - 1));
				}
				this.callParent([dataCollection, options]);
				if (options && (options.mode === "child" || options.mode === "top")) {
					var gridDataChild = this.getGridData();
					var tempCollection = this.Ext.create("Terrasoft.Collection");
					tempCollection.loadAll(gridDataChild);
					this.sortCollection(tempCollection);
					gridDataChild.clear();
					gridDataChild.loadAll(tempCollection);
				}
				this.set("ExpandItemId", null);
			},
			onExpandHierarchyLevels: function(primaryColumnValue, isExpanded) {
				if (!isExpanded || this.isItemExpanded(primaryColumnValue)) {
					return;
				}
				this.setExpandedItem(primaryColumnValue);
				this.set("ExpandItemId", primaryColumnValue);
				this.loadGridData();
			},
			initQueryOptions: function() {
				var parentItem = this.get("ExpandItemId");
				if (!parentItem) {
					var isClearGridData = this.get("IsClearGridData");
					if (isClearGridData) {
						this.clearExpandHierarchyLevels();
					}
					this.callParent(arguments);
				}
			},
			initCanLoadMoreData: function() {
				var parentItem = this.get("ExpandItemId");
				if (!parentItem) {
					this.callParent(arguments);
				}
			},
			changeSorting: function() {
				this.clearExpandHierarchyLevels();
				this.callParent(arguments);
			},
			/*initQuerySorting: function(esq) {
				var sortedColumn = esq.columns.get("UsrPosition");
				sortedColumn.orderPosition = 0;
				sortedColumn.orderDirection = Terrasoft.OrderDirection.ASC;
			},*/
			getFilters: function() {
				var parentItem = this.get("ExpandItemId");
				if (parentItem) {
					var parentProjectFilterGroup = this.Terrasoft.createFilterGroup();
					parentProjectFilterGroup.addItem(this.Terrasoft.createColumnFilterWithParameter(
						this.Terrasoft.ComparisonType.EQUAL, "UsrParent", parentItem, Terrasoft.DataValueType.GUID));
					return parentProjectFilterGroup;
				} else {
					var filters = this.callParent(arguments);
					if (this.get("DetailColumnName") !== "UsrParent") {
						var group = this.Terrasoft.createFilterGroup();
						group.addItem(filters);
						group.addItem(Terrasoft.createColumnIsNullFilter(this.entitySchema.hierarchicalColumnName));
						filters = group;
					}
					return filters;
				}
			},
			isProjectsInRoot: function() {
				return (this.get("DetailColumnName") !== "UsrParent");
			},
			isWorkInRoot: function() {
				return !this.isProjectsInRoot();
			},
			initEditPages: function() {
				this.callParent(arguments);
				var editPages = this.get("EditPages");
				var workPage = editPages.collection.items[0];
				workPage.set("Click", {"bindTo": "addToRootRecord"});
				workPage.set("Caption", "Add Document");
				workPage.set("Visible", true);
				workPage.set("Enabled", {"bindTo": "isPortal"});
				var childItemId = editPages.collection.items[0].instanceId;
				var config = {
					"Id": childItemId,
					"Caption": "Add Document child",
					"Click": {"bindTo": "addToChildRecord"},
					"Enabled": {"bindTo": "isPortal"},
					"Visible":  true,
					"Tag": childItemId,
					"SchemaName": "UsrAccountDocumentPageV2"
				};
				var addToChildMenuItem = this.getActionsMenuItem(config);
				editPages.add(childItemId, addToChildMenuItem);
			},
			replaceDefaultValue: function(key, value) {
				var defaultValues = this.get("DefaultValues");
				var oldValue = defaultValues.filter(function(item) {
					return item.name === key;
				});
				if (Ext.isEmpty(oldValue)) {
					defaultValues.push({
						name: key,
						value: value
					});
				} else {
					Terrasoft.each(oldValue, function(item) {
						item.value = value;
					});
				}
			},
			getDetailInfo: function() {
				var detailInfo = this.sandbox.publish("GetDetailInfo", null, [this.sandbox.id]) || {};
				var defaultValues = this.get("DefaultValues");
				detailInfo.defaultValues = defaultValues;
				return detailInfo;
			},
			addToRootRecord: function(typeUId) {
				var masterRecordId = this.get("MasterRecordId");
				this.replaceDefaultValue("UsrAccount", masterRecordId);
				this.replaceDefaultValue("UsrParent", Terrasoft.GUID_EMPTY);//Den
				this.addRecord(typeUId);
			},
			addToChildRecord: function(typeUId) {
				var selectedItems = this.getSelectedItems();
				this.set("ExpandItemId", selectedItems[0]);
				this.replaceDefaultValue("UsrParent", selectedItems[0]);
				var storage = Terrasoft.configuration.Storage;
				storage["newChildDoc"] = {
					value: "true",
					displayValue: "UsrName"
				}
				this.addRecord(typeUId);
			},
			canChangeSelectedItemPosition: function() {
				var selectedItems = this.getSelectedItems();
				return (!Ext.isEmpty(selectedItems) && (selectedItems.length <= 1));
			},
			changePosition: function() {
				var shift = arguments[3];
				var activeRow = this.getActiveRow();
				var projectId = activeRow.get("Id");
				this.updateProjectPosition(projectId, shift, this.onPositionChanged, this);
			},
			onRender: function() {
				//this.reloadGridData(); //Den<
				this.callParent(arguments);
			},
			onPositionChanged: function(result) {
				if (!result) {
					return;
				}
				var activeRow = this.getActiveRow();
				var parentId = activeRow.get("ParentId");
				if (!parentId) {
					parentId = this.get("MasterRecordId");
				}
				var esq = Ext.create("Terrasoft.EntitySchemaQuery", {rootSchema: this.entitySchema});
				esq.addColumn("UsrPosition");
				var filter = Terrasoft.createColumnFilterWithParameter(
					Terrasoft.ComparisonType.EQUAL, "UsrParent", parentId, Terrasoft.DataValueType.GUID);
				esq.filters.add("filter", filter);
				esq.getEntityCollection(function(response) {
					if (!response || !response.success) {
						return;
					}
					var gridData = this.getGridData();
					var result = response.collection;
					result.each(function(resultItem) {
						var resultItemId = resultItem.get("Id");
						var newPosition = resultItem.get("UsrPosition");
						var gridRecord = gridData.get(resultItemId);
							gridRecord.set("UsrPosition", newPosition);
						});
						var tempCollection = this.Ext.create("Terrasoft.Collection");
						tempCollection.loadAll(gridData);
						this.sortCollection(tempCollection);
						gridData.clear();
						gridData.loadAll(tempCollection);
				}, this);
			},
			sortCollection: function(collection) {
				collection.sortByFn(function(a, b) {
					var positionA = a.get("UsrPosition");
					var positionB = b.get("UsrPosition");
					var q = positionA - positionB;
					return q === 0 ? 0 : (q) / Math.abs(q);
				});
			},
			//Замещено ввиду проблемы описанной в методе в комментах.
			getActiveRow: function() {
				var gridData = this.getGridData();
				//TODO исправить костыль.
				//Den> Костыль для заполнения gridData.collection.keys - 
				//		в них посвюду через раз ключами является undefined.
				//		и еще Map пустая.
				for(var i = 0; i < gridData.collection.items.length; i++) {
					var curId = gridData.collection.items[i].values.Id;
					gridData.collection.keys[i] = curId;
					gridData.collection.map[curId] = gridData.collection.items[i];
				}
				//Den<
				var isEditable = this.get("IsEditable");
				var primaryColumnValue;
				if (!isEditable) {
					var selectedItems = this.getSelectedItems();
					if (this.Ext.isEmpty(selectedItems)) {
						return null;
					}
					primaryColumnValue = selectedItems[0];
				} else {
					primaryColumnValue = this.get("ActiveRow");
				}
				if (primaryColumnValue) {
					return gridData.get(primaryColumnValue);
				}
			},
			getDeleteRecordMenuItem: function() {
				return this.getButtonMenuItem({
					Caption: {"bindTo": "Resources.Strings.DeleteMenuCaption"},
					Click: {"bindTo": "deleteRecords"},
					Enabled: {bindTo: "getDeleteRecordButtonEnabled"}
				});
			},
			getCopyRecordMenuEnabled: function() {
				if (this.getDetailInfo().cardPageName === "UsrPortfolioPageV2" || this.getDetailInfo().cardPageName === "UsrInvestmentOppPageV2") {
					return false;
				} else {
					var selectedItems = this.getSelectedItems();
					return selectedItems && (selectedItems.length === 1);
				}
			},
			getEditRecordButtonEnabled: function() {
				if (this.getDetailInfo().cardPageName === "UsrPortfolioPageV2" || this.getDetailInfo().cardPageName === "UsrInvestmentOppPageV2") {
					return false;
				} else {
					var selectedItems = this.getSelectedItems();
					return selectedItems && (selectedItems.length === 1);
				}
			},
			getDeleteRecordButtonEnabled: function() {
				if (this.getDetailInfo().cardPageName === "UsrPortfolioPageV2" || this.getDetailInfo().cardPageName === "UsrInvestmentOppPageV2") {
					return false;
				} else {
					var activeRow = this.getActiveRow();
					if (activeRow) {
						return this.isAnySelected() && activeRow.get("HasNesting") != 1;
					} else {
						return false;
					}
				}
			},
			getAddTypedRecordButtonVisible: function() {
				var editPages = this.getEditPages();
				return (this.getToolsVisible() && (editPages.getCount() > 1) && !this.get("isPortalUser"));
			}
		},
		diff: /**SCHEMA_DIFF*/[
			{
				"operation": "merge",
				"name": "DataGrid",
				"values": {
					"type": "listed",
					"hierarchical": true,
					//"sortColumnDirection": {"bindTo": "disableGridSorting"},
					"hierarchicalColumnName": "ParentId",
					"updateExpandHierarchyLevels": {
						"bindTo": "onExpandHierarchyLevels"
					},
					expandHierarchyLevels: {
						"bindTo": "expandHierarchyLevels"
					}
				}
			},
			{
				"operation": "remove",
				"name": "AddRecordButton"
			},
			{
				"operation": "insert",
				"name": "OpenDocumentButton",
				"parentName": "Detail",
				"propertyName": "tools",
				"values": {
					"itemType": Terrasoft.ViewItemType.BUTTON,
					"click": {"bindTo": "openDocument"},
					"visible": {"bindTo": "isPortalUser"},
					"enabled": {"bindTo": "isPortalUser"},
					"caption": "Open"
				},
				"index": 0
			}
		]/**SCHEMA_DIFF*/
	};
});