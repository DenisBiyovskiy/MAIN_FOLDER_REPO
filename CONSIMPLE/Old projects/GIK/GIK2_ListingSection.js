define("ListingSection", ["AmenityHelper", "NetworkUtilities", "ConfigurationEnums", "MapsUtilities",
			"ConfigurationConstants", "AddressHelper", "StorageUtilities", "MaskHelper", "MatchRequestsHelper",
			"ListingReportHelper", "ModalBox", "PriceChangerModule", "ActionModule", "css!ListingSectionCss"],
		function(AmenityHelper, NetworkUtilities, ConfigurationEnums, MapsUtilities, ConfigurationConstants,
			AddressHelper, StorageUtilities, MaskHelper, MatchRequestsHelper, ListingReportHelper, ModalBox, PriceChangerModule, ActionModule) {
			return {
				entitySchemaName: "Listing",
				messages: {
					"CloseModalBox": {
						mode: Terrasoft.MessageMode.BROADCAST,
						direction: Terrasoft.MessageDirectionType.SUBSCRIBE
					}
				},
				attributes: {
					"CloseModalBox": {
						mode: Terrasoft.MessageMode.BROADCAST,
						direction: Terrasoft.MessageDirectionType.SUBSCRIBE
					}
				},
				methods: {
					getSectionActions: function() {
						var actionMenuItems = this.callParent(arguments);
						actionMenuItems.addItem(this.getButtonMenuItem({
							"Caption": {"bindTo": "Resources.Strings.PacketPriceChangeCaption"},
							"Click": {"bindTo": "packetPriceChange"},
							"Tag": "packetPriceChange"
						}));
						actionMenuItems.addItem(this.getButtonMenuItem({
							"Caption": {"bindTo": "Resources.Strings.ActionPriceChangeCaption"},
							"Click": {"bindTo": "actionPriceChange"},
							"Tag": "actionPriceChange"
						}));
						return actionMenuItems;
					},

					packetPriceChange: function() {
//						var container = ModalBox.show({minWidth: 25, maxWidth: 90, minHeight: 40, maxHeight: 90});
						var container = ModalBox.show({widthPixels: 350, heightPixels: 275});
	//						console.log(ModalBox.close);
						container.applyStyles("display: block");
						container.applyStyles("padding: 0px 7px");
						this.sandbox.loadModule("PriceChangerModule", {
							renderTo: container,
							parameters: {
								// тяни Id-ки сюда
								IDs: ['1', '2', '3']
							}
						});
					},
					actionPriceChange: function() {
						//Акционные изменения цен
						var container = ModalBox.show({widthPixels: 350, heightPixels: 340});
	//						console.log(ModalBox.close);
						container.applyStyles("display: block");
						container.applyStyles("padding: 0px 7px");
						this.sandbox.loadModule("ActionModule", {
							renderTo: container,
							parameters: {
								// тяни Id-ки сюда
								IDs: ['1', '2', '3']
							}
						});
					},
					subscribeSandboxEvents: function() {
						this.callParent(arguments);
						this.sandbox.subscribe("CloseModalBox", function(args) {
							console.log(args);
							var erorreMsg = "";
							var index = 1;
							if ((args)){
								if (args[0].value > 0) {
									this.packetPriceUpdate(args);
									ModalBox.close();
								} else {
									if (args[0].value === "ActionModule") { 
										Terrasoft.chain(
											function(next) {
												if (args[4].value && args[3].value > args[4].value) {
													erorreMsg += "" + index + ". Дата начала не может быть позже даты окончания акции.\n";
													index++;
													next();
												} else {
													next();
												}
											},
											function(next) {
												var date = new Date().toDateString();
												if (args[3].value && args[3].value < new Date(date)) { 
													erorreMsg += "" + index + ". Дата начала не может быть раньше текущей даты.\n";
													index++;
													next();
												} else {
													next();
												}
											},
											function(next) {
												if (!args[3].value || !args[4].value) { 
													erorreMsg += "" + index + ". Необходимо указать даты начала и конца акции.\n";
													index++;
													next();
												} else {
													next();
												}
											},
											function(next) {
												if (args[1].value == 0) { 
													erorreMsg += "" + index + ". Необходимо заполнить поле \"Сумма\".\n";
													index++;
													next();
												} else {
													next();
												}
											},
											function(next) {
												if (args[2].value == 0 && args[1].value > 100) { 
													erorreMsg += "" + index + ". Скидка не может превышать 100%.\n";
													index++;
													next();
												} else {
													next();
												}
											},
											function(next) {
												if (args[5].value === null) { 
													erorreMsg += "" + index + ". Поле \"Название\" не может быть пустым.\n";
													index++;
													next();
												} else {
													next();
												}
											},
											function(next) {
												if (erorreMsg === "") {
													this.packetPriceUpdate(args);
													ModalBox.close();
													next();
												} else {
													this.showMsg(erorreMsg);
													next();
												}
											},
										this);	
									}
								}
							} else {
								ModalBox.close();
							}
						}, this, null);
					},
					showMsg: function(text) { 
						Terrasoft.utils.showMessage({
						caption: text,
						buttons: ["ok"],
						defaultButton: 0
						});
					},

					packetPriceUpdate: function(args) {
						var filters = this.getFilters();
						// делаем выборку
						var select = this.Ext.create("Terrasoft.EntitySchemaQuery", {
							rootSchemaName: 'Listing'
						});
						// выбрали ID и Price + загрузили в запрос фильтры
						select.addColumn("Price");
						select.addColumn("UsrBasePrice");
						select.filters.add(filters);
						// выполняем запрос
						select.getEntityCollection(function(result) {
							// берем результаты выборки и проводим обновление листинга
							if (!result.success) return;
							var collection = result.collection;
							if (!collection.getCount()) return;
							if(args[0].value === "ActionModule") {
								this.actionUpdateListings(collection, args);
							} else {
								this.updateListings(collection, args);
							}
							this.reloadGridData();
						}, this);
					},
					
					actionUpdateListings: function(collection, args) {
						var price;
						var id;
						var updateParameter;
						var basePrice;
						var isToday = (new Date(args[3].value.toDateString()) - new Date(new Date().toDateString())) === 0;
						// для каждого объекта коллекции выбираем цену и ID
						collection.each(function(item) {
							if (item.get("UsrBasePrice") === 0) {
								basePrice = item.get("Price");
							} else {
								basePrice = item.get("UsrBasePrice");
							}
							price = item.get("Price");
							id = item.get("Id");
							// обновляем стоимость в зависимости от параметров выборки
							updateParameter = -args[1].value;
							console.log(price + ' ' + updateParameter + ' ' + id);
							price += ((args[2].value === 0) ? (price * updateParameter)/100 : updateParameter * 1);

							price = Math.round(price);
							console.log(price);
							// проводим обновление хранилища изменения цен //Den
							var insertQuery = Ext.create("Terrasoft.InsertQuery", {
								rootSchemaName: "PriceChangeStorage"
							});
							
							insertQuery.setParameterValue("Id", Terrasoft.generateGUID(), Terrasoft.DataValueType.GUID);
							insertQuery.setParameterValue("ImpactType", "Акция", Terrasoft.DataValueType.TEXT);
							insertQuery.setParameterValue("StartDate", args[3].value, Terrasoft.DataValueType.DATE_TIME);
							insertQuery.setParameterValue("EndDate", args[4].value, Terrasoft.DataValueType.DATE_TIME);
							insertQuery.setParameterValue("ImpactValue", updateParameter, Terrasoft.DataValueType.INTEGER);
							insertQuery.setParameterValue("ImpactValueType", args[2].value === 0 ? "Проценты" : "Сумма", Terrasoft.DataValueType.TEXT);
							insertQuery.setParameterValue("Owner", Terrasoft.SysValue.CURRENT_USER_CONTACT.value, Terrasoft.DataValueType.GUID);
							insertQuery.setParameterValue("Listing", id, Terrasoft.DataValueType.GUID);
							insertQuery.setParameterValue("Name", args[5].value, Terrasoft.DataValueType.TEXT);
							insertQuery.execute(function(response) {
								if (response && response.success) {
									console.log("Обновило1");
								}
							}, this);
							
							// Добавление акции
							var insertQuery1 = Ext.create("Terrasoft.InsertQuery", {
								rootSchemaName: "Action"
							});
							
							insertQuery1.setParameterValue("Id", Terrasoft.generateGUID(), Terrasoft.DataValueType.GUID);
							insertQuery1.setParameterValue("Name", args[5].value, Terrasoft.DataValueType.TEXT);
							insertQuery1.execute(function(response) {
								if (response && response.success) {
									console.log("Обновило2");
								}
							}, this);
							
							// проводим обновление листингов //if StartDay is TODAY only!
							if (isToday) {
								var updateQuery = Ext.create("Terrasoft.UpdateQuery", {
									rootSchemaName: "Listing"
								});
								if (basePrice === price) {
									basePrice = 0;
								}
								updateQuery.setParameterValue("Price", price, Terrasoft.DataValueType.INTEGER);
								updateQuery.setParameterValue("UsrBasePrice", basePrice, Terrasoft.DataValueType.INTEGER);
								updateQuery.filters.add("IdFilter",
									updateQuery.createColumnFilterWithParameter(
										Terrasoft.ComparisonType.EQUAL, "Id", id));
								updateQuery.execute(function(response) {
									if (response && response.success) {
										console.log("Обновило");
									}
								}, this);
							}
						});
					},
					
					updateListings: function(collection, args) {
						var price;
						var id;
						var updateParameter;
						var basePrice;
						// для каждого объекта коллекции выбираем цену и ID
						collection.each(function(item) {
							if (item.get("UsrBasePrice") === 0) {
								basePrice = item.get("Price");
							} else {
								basePrice = item.get("UsrBasePrice");
							}
							price = item.get("Price");
							id = item.get("Id");
							// обновляем стоимость в зависимости от параметров выборки
							updateParameter = args[0].value * ((args[1].value === 0) ? 1 : -1);
							console.log(price + ' ' + updateParameter + ' ' + id);
							price += ((args[2].value === 0) ? (price * updateParameter)/100 : updateParameter);

							price = Math.round(price);
							console.log(price);
							var date = new Date();
							// проводим обновление хранилища изменения цен //Den
							var insertQuery = Ext.create("Terrasoft.InsertQuery", {
								rootSchemaName: "PriceChangeStorage"
							});
							
							insertQuery.setParameterValue("Id", Terrasoft.generateGUID(), Terrasoft.DataValueType.GUID);
							insertQuery.setParameterValue("ImpactType", "Пакетное изменение цен", Terrasoft.DataValueType.TEXT);
							insertQuery.setParameterValue("StartDate", date, Terrasoft.DataValueType.DATE_TIME);
							insertQuery.setParameterValue("EndDate", date, Terrasoft.DataValueType.DATE_TIME);
							insertQuery.setParameterValue("ImpactValue", updateParameter, Terrasoft.DataValueType.INTEGER);
							insertQuery.setParameterValue("ImpactValueType", args[2].value === 0 ? "Проценты" : "Сумма", Terrasoft.DataValueType.TEXT);
							insertQuery.setParameterValue("Owner", Terrasoft.SysValue.CURRENT_USER_CONTACT.value, Terrasoft.DataValueType.GUID);
							insertQuery.setParameterValue("Listing", id, Terrasoft.DataValueType.GUID);
							insertQuery.setParameterValue("Name", "Пакетное изменение цен", Terrasoft.DataValueType.TEXT);
							insertQuery.execute(function(response) {
								if (response && response.success) {
									console.log("Обновило1");
								}
							}, this);
							// проводим обновление листингов
							var updateQuery = Ext.create("Terrasoft.UpdateQuery", {
								rootSchemaName: "Listing"
							});
							if (basePrice === price) {
								basePrice = 0;
							}
							updateQuery.setParameterValue("Price", price, Terrasoft.DataValueType.INTEGER);
							updateQuery.setParameterValue("UsrBasePrice", basePrice, Terrasoft.DataValueType.INTEGER);
							updateQuery.filters.add("IdFilter",
								updateQuery.createColumnFilterWithParameter(
									Terrasoft.ComparisonType.EQUAL, "Id", id));
							updateQuery.execute(function(response) {
								if (response && response.success) {
									console.log("Обновило");
								}
							}, this);
						});
					}
				},
				diff: /**SCHEMA_DIFF*/[]/**SCHEMA_DIFF*/
			};
		});