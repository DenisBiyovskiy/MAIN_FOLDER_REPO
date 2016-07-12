define("ActivitySectionV2", ["ConfigurationConstants"],
    function (ConfigurationConstants) {
        return {
            // Название схемы раздела.
            entitySchemaName: "Activity",
            // Коллекция методов модели представления раздела.
            methods: {
                // Метод определяет, будет ли доступен пункт меню. 
                isCustomActionEnabled: function () {
                    // Пробуем получить массив идентификаторов выбранных записей.
                    var selectedRows = this.get("SelectedRows");
                    // Если массив содержит элементы (то есть выбрана хоть одна запись в реестре),
                    // то возвращается true, иначе — false.
                    return selectedRows ? (selectedRows.length > 0) : false;
                },
                // Метод-обработчик действия, который вызывает открытие справочника [Контакты].
                setOwner: function () {
                    // Определение конфигурации открываемого справочника: схема [Contact], множественный
                    // выбор отключен, отображаемая колонка — [Name].
                    var config = {
                        entitySchemaName: "Contact",
                        multiSelect: false,
                        columns: ["Name"]
                    };
                    // Открытие справочника с определенной конфигурацией и callback-функцией, которая сработает
                    // после нажатия кнопки [Выбрать].
                    this.openLookup(config, this.lookupCallback, this);
                },
                // Метод, выполняющий установку выбранного в справочнике контакта в качестве ответственного
                // для выбранных в реестре записей.
                lookupCallback: function (args) {
                    var activeRowId;
                    var lookupSelectedRows = args.selectedRows.getItems();
                    if (lookupSelectedRows && lookupSelectedRows.length > 0) {
                        // Получение Id выбранной в справочнике записи.
                        activeRowId = lookupSelectedRows[0].Id;
                    }
                    // Получение массива значений первичных колонок выбранных записей.
                    var selectedRows = this.get("SelectedRows");
                    // Обработка запускается только в случае, если выбрана хотя бы одна запись в реестре и выбран ответственный
                    // в справочнике.
                    if ((selectedRows.length > 0) && activeRowId) {
                        // Создание экземпляра класса пакетных запросов.
                        var batchQuery = this.Ext.create("Terrasoft.BatchQuery");
                        // Обновление каждой из выбранных записей.
                        selectedRows.forEach(function(selectedRowId) {
                            // Создание экземпляра класса UpdateQuery с корневой схемой Activity.
                            var update = this.Ext.create("Terrasoft.UpdateQuery", {
                                rootSchemaName: "Activity"
                            });
                            // Применение фильтра для определения записи для обновления.
                            update.enablePrimaryColumnFilter(selectedRowId);
                            // Для колонки [Owner] устанавливаем значение, равное выбранному контакту из справочника.
                            update.setParameterValue("Owner", activeRowId, this.Terrasoft.DataValueType.GUID);
                            // Добавление запроса на обновление записи в пакетный запрос.
                            batchQuery.add(update);
                        }, this);
                        // Выполнение пакетного запроса к серверу.
                        batchQuery.execute(function() {
                            // Обновление реестра.
                            this.reloadGridData();
                        }, this);
                    }
                },
                // Перегрузка базового виртуального метода, возвращающего коллекцию действий раздела.
                getSectionActions: function () {
                    // Вызывается родительская реализация метода для получения
                    // коллекции проинициализированных действий базового раздела.
                    var actionMenuItems = this.callParent(arguments);
                    // Добавление линии-сепаратора для визуального отделения пользовательского действия от списка
                    // действий базового раздела.
                    actionMenuItems.addItem(this.getButtonMenuItem({
                        Type: "Terrasoft.MenuSeparator",
                        Caption: ""
                    }));
                    // Добавление пункта меню в список действий раздела.
                    actionMenuItems.addItem(this.getButtonMenuItem({
                        // Привязка заголовка пункта меню к локализуемой строке схемы.
                        "Caption": { bindTo: "Resources.Strings.SetOwnerCaption" },
                        // Привязка метода обработчика действия.
                        "Click": { bindTo: "setOwner" },
                        // Привязка свойства доступности пункта меню к значению, которое возвращает метод isCustomActionEnabled.
                        "Enabled": { bindTo: "isCustomActionEnabled" }
                    }));
                    return actionMenuItems;
                }
            }
        };
    });