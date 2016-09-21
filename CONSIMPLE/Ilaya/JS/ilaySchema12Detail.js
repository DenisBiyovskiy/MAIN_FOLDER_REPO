define("ilaySchema12Detail", ["ilaySchema12DetailResources", "ConfigurationConstants", "ProcessModuleUtilities",
								"SegmentsStatusUtils", "MarketingEnums", "ConfigurationEnums"],
function(Resources, ConfigurationConstants, ProcessModuleUtilities, SegmentsStatusUtils, MarketingEnums, enums) {
	return {
		entitySchemaName: "ilayPriceForAccount",
		details: /**SCHEMA_DETAILS*/{}/**SCHEMA_DETAILS*/,
		diff: /**SCHEMA_DIFF*/[
			//Den>  [IL-397], [IL-398], [IL-399]
			{
				"operation": "merge",
				"name": "AddRecordButton",
				"parentName": "Detail",
				"propertyName": "tools",
				"values": {
					"itemType": Terrasoft.ViewItemType.BUTTON,
					"visible": false
				}
			},
			{
				"operation": "merge",
				"name": "AddTypedRecordButton",
				"parentName": "Detail",
				"propertyName": "tools",
				"values": {
					"itemType": Terrasoft.ViewItemType.BUTTON,
					"controlConfig": {
						"menu": {
							"items": {"bindTo": "addMenuItems"}
						},
						"visible": true
					},
					"visible": true,
					"enabled": true
				}
			}
			//Den<  [IL-397], [IL-398], [IL-399]
		]/**SCHEMA_DIFF*/,
		methods: {
			//Den>  [IL-397] Переименовать деталь "Тарифи в рахунках" на "Цільова аудиторія"
			//		[IL-398] Меню добавления счета на деталь целевая аудитория
			//		[IL-399] Добавление группы счетов на деталь цільова аудиторія
			
			/**
			 * Инициализирует деталь.
			 * @overridden
			 */
			init: function() {
				this.callParent(arguments);
				this.initAddMenuItems();
			},
			
			/**
			 * Формирует меню "Добавления".
			 * @protected
			 */
			initAddMenuItems: function() {
				var addMenuItems = Ext.create("Terrasoft.BaseViewModelCollection");
				addMenuItems.add("addContactItem", this.Ext.create("Terrasoft.BaseViewModel", {
					values: {
						//"Caption": {"bindTo": "Resources.Strings.AddContactCaption"},
						"Caption": {"bindTo": "Resources.Strings.ilayAddPatientAccCaption"},
						"Click": {"bindTo": "ilayAddRecord"},
						"Tag": "addPatientAcc"
					}
				}));
				addMenuItems.add("addPatientAccFolder", this.Ext.create("Terrasoft.BaseViewModel", {
					values: {
						"Caption": {"bindTo": "Resources.Strings.ilayAddPatientAccFolderCaption"},
						"Click": {"bindTo": "ilayAddRecord"},
						"Tag": "addPatientAccFolder"
					}
				}));
				this.set("addMenuItems", addMenuItems);
			},
			
			/**
			 * Вызывает соответствующий метод кнопки добавить.
			 * @param {String} method "Tag" name
			 */
			ilayAddRecord: function(methodName) {
				var addRecordMethod = this[methodName];
				addRecordMethod.call(this);
			},
			
			/**
			 *  Метод действия "Додати групу рахунків".
			 *  @protected
			 */
			addPatientAccFolder: function() {
				var config = {
					entitySchemaName: "ilayPatientAccFolder",
					multiSelect: true,
					columns: ["FolderType"]
				};
				var groupType = Terrasoft.createColumnInFilterWithParameters("FolderType",
					[ConfigurationConstants.Folder.Type.Search]);
				groupType.comparisonType = Terrasoft.ComparisonType.EQUAL;
				config.filters = groupType;
				this.openLookup(config, this.addPatientAccFolderCallback, this);
			},
			/**
			 *  Метод действия "Додати рахунок".
			 *  @protected
			 */
			addPatientAcc: function() {
				//this.addRecord();
				var config = {
					entitySchemaName: "ilayPatientAcc",
					multiSelect: true
					//columns: ["ilayName", "ilayPatient", "ilayPatAccStatus"]
				};
				this.openLookup(config, this.addPatientAccCallback, this);
			},
			
			/**
			 * Обратный вызов метода "Додати групу рахунків", вызываемый после выбора из справочника.
			 * @param {Object} config Информация о добавляемых элементах.
			 */
			addPatientAccFolderCallback: function(config) {
				var entityId = this.get("MasterRecordId");
				var contactFolders = config.selectedRows;
				var foldersCount = contactFolders.getCount();
				var segmentConfig = {
					EntityId: entityId,
					EntityName: "ilayPricePlan",
					SegmentName: "ilayPatientAcc",
					TargetSchemaName: "ilayPriceForAccount"
				}
				var contactWillBeAddedMessage = (foldersCount === 1)
					? this.get("Resources.Strings.PatientAccOfOneWillBeAdded")
					: this.get("Resources.Strings.PatientAccsWillBeAdded");
				this.showInformationDialog(this.Ext.String.format(contactWillBeAddedMessage, foldersCount));
				var bq = this.Ext.create("Terrasoft.BatchQuery");
				contactFolders.each(function(item) {
					bq.add(this.getPatientAccFolderInsert(segmentConfig, item.Id));
				}, this);
				bq.execute(function() {
					this.timeoutBeforeUpdate = SegmentsStatusUtils.timeoutBeforeUpdate;
					this.updateSegmentList(this ,segmentConfig);
				}, this);
			},
			/**
			 * Обратный вызов метода "Додати рахунок", вызываемый после выбора из справочника.
			 * @param {Object} config Информация о добавляемых элементах.
			 */
			addPatientAccCallback: function(config) {
				if (config && config.selectedRows) {
					Terrasoft.chain(
						function(next) {
							this.getExistingPatientAcc(next, config.selectedRows.collection.keys);
						},
						function(next, existingKeys) {
							this.insertPatientAccs(next, existingKeys);
						},
					this);
				}
			},
			/**
			 * Получает Id "Рахунків" уже добавленных в текущий тарифный план.
			 * @param {Function} next Callback function
			 * @param {Array} newKeys Id добавляемых "Рахунків"
			 */
			getExistingPatientAcc: function(next, newKeys) {
				var masterId = this.get("MasterRecordId");
				var selectQuery = Ext.create("Terrasoft.EntitySchemaQuery", {
					rootSchemaName: "ilayPriceForAccount"
				});
				selectQuery.addColumn("ilayPatientAcc");
				selectQuery.filters.addItem(selectQuery.createColumnFilterWithParameter(
					this.Terrasoft.ComparisonType.EQUAL, "ilayPricePlan", masterId));
				selectQuery.getEntityCollection(function(result) {
					if (result.success) {
						var coll = result.collection.collection;
						var existingKeys = []
						coll.items.forEach(function(item) {
							existingKeys.push(item.values.ilayPatientAcc.value);
						},this);
						if(existingKeys.length === 0) {
							typeof next === "function" && next(newKeys);
						} else {
							newKeys = newKeys.filter(function(key){
								return !existingKeys.includes(key);
							}, this);
							typeof next === "function" && next(newKeys);
						}
					}
				}, this);
			},
			/**
			 * Добавляет выбранные "Рахунки".
			 * @param {Function} next Callback function
			 * @param {Array} newKeys Id добавляемых "Рахунків"
			 */
			insertPatientAccs: function(next, newKeys) {
				var batch = Ext.create("Terrasoft.BatchQuery"),
					masterId = this.get("MasterRecordId");
				for (var i = newKeys.length - 1; i >= 0; i--) {
					batch.add(this.getPatientAccInset(newKeys[i], masterId));
				}
				batch.execute(function(response) {
					this.updateDetail({"reloadAll": true});
					typeof next === "function" && next();
				}, this);
			},
			
			/**
			 * Возвращает запрос на добавление данных в "ilayPriceForAccount"
 			 * @param {Function} next Callback function
			 * @param {Array} newKeys Id добавляемых "Рахунків"
			 */
			getPatientAccInset: function(itemId, masterId) {
				var insertQuery = this.Ext.create("Terrasoft.InsertQuery", {
					rootSchemaName: "ilayPriceForAccount"
				});
				insertQuery.setParameterValue("CreatedBy", Terrasoft.SysValue.CURRENT_USER_CONTACT.value, Terrasoft.DataValueType.GUID);
				insertQuery.setParameterValue("ModifiedBy", Terrasoft.SysValue.CURRENT_USER_CONTACT.value, Terrasoft.DataValueType.GUID);
				insertQuery.setParameterValue("ilayPricePlan", masterId, Terrasoft.DataValueType.GUID);
				insertQuery.setParameterValue("ilayPatientAcc", itemId, Terrasoft.DataValueType.GUID);
				insertQuery.setParameterValue("ilayPriceStatus", "0b57640a-9443-4c78-a739-0d9ab437b39e", Terrasoft.DataValueType.GUID);//Активний
				return insertQuery;
			},
			
			getPatientAccFolderInsert: function(config, contactFolderId) {
				var insertQuery = this.Ext.create("Terrasoft.InsertQuery", {
					rootSchemaName: "SegmentEntity"
				});
				insertQuery.setParameterValue("EntityId", config.EntityId, Terrasoft.DataValueType.GUID);
				insertQuery.setParameterValue("SegmentId", contactFolderId, Terrasoft.DataValueType.GUID);
				insertQuery.setParameterValue("State", MarketingEnums.SegmentsStatus.REQUIERESUPDATING, Terrasoft.DataValueType.GUID);
				insertQuery.setParameterValue("EntityName", config.EntityName, Terrasoft.DataValueType.TEXT);
				insertQuery.setParameterValue("SegmentName", config.SegmentName, Terrasoft.DataValueType.TEXT);
				return insertQuery;
			},
			refreshDetail: function() {
				var currentScope = this;
				setTimeout( function(){
					currentScope.sandbox.publish("DetailChanged", {}, [currentScope.sandbox.id]);
					//currentScope.reloadGridData();
					var config = {
						"reloadAll": true
					};
					currentScope.updateDetail(config);
				}, SegmentsStatusUtils.timeoutBeforeUpdate);
			},
			updateSegmentList: function(scope, config) {
				// var masterRecordId = scope.get("MasterRecordId");
				scope.callService({
					serviceName: "SegmentService",
					methodName: "FillDetailTarget",
					data: {
						entityName: config.EntityName,
						entityId: config.EntityId,
						segmentName: config.SegmentName,
						targetSchemaName: config.TargetSchemaName
					}
				}, function() {
					this.refreshDetail();
				}, scope);
			}
			//Den<  [IL-397], [IL-398], [IL-399]
		}
	};
});
