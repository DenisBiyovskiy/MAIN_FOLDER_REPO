define("UsrReportingDetailV2", ["XRMConstants","ConfigurationGrid", "ConfigurationGridGenerator", "ProcessModuleUtilities", "ConfigurationGridUtilities", "ConfigurationEnums"], 
	function(XRMConstants, ProcessModuleUtilities, ConfigurationGridUtilities, enums) {
	return {
		entitySchemaName: "UsrReporting",
		messages: {
			"CardModuleEntityInfo": {
				"mode": Terrasoft.MessageMode.PTP,
				"direction": Terrasoft.MessageDirectionType.SUBSCRIBE
			}
		},
		attributes: {
			"isPortal": {
				"dataValueType": Terrasoft.DataValueType.BOOLEAN,
				"value":  false
			},
			"isPortalEnabled": {
				"dataValueType": Terrasoft.DataValueType.BOOLEAN,
				"value":  true
			},
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
			}
		},
		mixins: {
			ConfigurationGridUtilites: "Terrasoft.ConfigurationGridUtilities"
		},
		methods: {
			checkRights: function() {
				if (this.getDetailInfo().cardPageName === "UsrPortfolioPageV2" || this.getDetailInfo().cardPageName === "UsrInvestmentOppPageV2") {
					this.set("isPortal", true);
					this.set("isPortalEnabled", false);
				}
			},
			disableGridSorting: Ext.emptyFn,
			sortColumn: Ext.emptyFn,
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
					columnPath: "[UsrReporting:UsrParent].Id"
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
			initQuerySorting: function(esq) {
				var sortedColumn = esq.columns.get("UsrPosition");
				sortedColumn.orderPosition = 0;
				sortedColumn.orderDirection = Terrasoft.OrderDirection.ASC;
			},
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
				workPage.set("Caption", "Add Report");
				workPage.set("Enabled", {"bindTo": "isPortalEnabled"});
				workPage.set("Visible", true);
				var childItemId = editPages.collection.items[0].instanceId;
				var config = {
					"Id": childItemId,
					"Caption": "Add Report child",
					"Click": {"bindTo": "addToChildRecord"},
					"Enabled": {"bindTo": "isPortalEnabled"},
					"Tag": childItemId,
					"SchemaName": "UsrReportingPageV2"
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
				storage["newChildReport"] = {
					value: true,
					displayValue: "UsrFileName"
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
				this.callParent(arguments);
				//this.reloadGridData();//Den
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
			openReport: function () {
				var editPageUId = "edd71432-886d-476b-adb9-a3c2916dbceb";
				var config = this.getSelectedItems();
				var id = config[0];
				this.openCard(enums.CardStateV2.EDIT, editPageUId, id);
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
					var selectedItems = this.getSelectedItems();//Den
					return selectedItems && (selectedItems.length === 1);
				}
			},
			getEditRecordButtonEnabled: function() {
				if (this.getDetailInfo().cardPageName === "UsrPortfolioPageV2" || this.getDetailInfo().cardPageName === "UsrInvestmentOppPageV2") {
					return false;
				} else {
					var selectedItems = this.getSelectedItems();//Den
					return selectedItems && (selectedItems.length === 1);
				}
			},
			getDeleteRecordButtonEnabled: function() {
				if (this.getDetailInfo().cardPageName === "UsrPortfolioPageV2" || this.getDetailInfo().cardPageName === "UsrInvestmentOppPageV2") {
					return false;
				} else {
					var activeRow = this.getActiveRow();
					if (activeRow) {
						return this.isAnySelected() && activeRow.values.HasNesting != 1;
					} else {
						return false;
					}
				}
			}
		},
		diff: /**SCHEMA_DIFF*/[
			{
				"operation": "merge",
				"name": "DataGrid",
				"values": {
					"type": "listed",
					"hierarchical": true,
					"sortColumnDirection": {"bindTo": "disableGridSorting"},
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
				"operation": "insert",
				"name": "OpenReportButton",
				"parentName": "Detail",
				"propertyName": "tools",
				"values": {
					"itemType": Terrasoft.ViewItemType.BUTTON,
					"click": {"bindTo": "openReport"},
					"visible": {"bindTo": "isPortal"},
					"enabled": {"bindTo": "isPortal"},
					"caption": "Open"
				},
				"index": 0
			},
			{
				"operation": "merge",
				"name": "AddRecordButton",
				"values": {
					"visible": {"bindTo": "isCRM"}
				}
			}
		]/**SCHEMA_DIFF*/
	};
});
