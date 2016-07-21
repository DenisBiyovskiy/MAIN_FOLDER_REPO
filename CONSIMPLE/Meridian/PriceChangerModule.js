/**
 * Created by Ivan on 18.05.2015.
 */

// Добавь широковещательное сообщение CloseModalBox
//



define("PriceChangerModule", 
    ["BaseModule"],
    function() {
        Ext.define("PriceChanger", {
            extend: "Terrasoft.BaseModule",
            alternateClassName: "Terrasoft.PriceChangerModule",
            Ext: null,
            sandbox: null,
            Terrasoft: null,

            // пользовательский метод генерурующий разметку вьюхи
            // на основе которой создается GridLayout с заполненными элементами
            getView: function() {
                var markup = {
                    id: "PacetPriceChangerGridLayout",
                    className: "Terrasoft.GridLayout",
                    items: [
                        // заголовок
                        {
                            item: {
                                id: "Header_label",
                                className: "Terrasoft.Label",
                                classes: {labelClass: ["header-label-class"]},
                                caption: {bindTo: "HeaderCaption"}
                            },
                            row: 0,
                            rowSpan: 1,
                            column: 0,
                            colSpan: 24
                        },

                        {
                            item: {
                                id: "First-group_label",
                                className: "Terrasoft.Label",
                                caption: {bindTo: "ParametersGroupCaption"}
                            },
                            row: 1,
                            rowSpan: 1,
                            column: 0,
                            colSpan: 24
                        },
                        // параметры 1
                        {
                            item: {
                                id: "first-combobox",
                                className: "Terrasoft.ComboBoxEdit",
                                list: {bindTo: "FirstList"},
                                prepareList: {bindTo: "loadFirstList"},
                                value: {bindTo: "FirstValue"}
                            },
                            row: 2,
                            rowSpan: 1,
                            column: 0,
                            colSpan: 24
                        },

                        // параметры 2
                        {
                            item: {
                                id: "Second-combobox",
                                className: "Terrasoft.ComboBoxEdit",
                                list: {bindTo: "SecondList"},
                                prepareList: {bindTo: "loadSecondList"},
                                value: {bindTo: "SecondValue"}
                            },
                            row: 3,
                            rowSpan: 1,
                            column: 0,
                            colSpan: 24
                        },

                        // заголовок "Числовое значение"
                        {
                            item: {
                                id: "Value_label",
                                className: "Terrasoft.Label",
                                caption: {bindTo: "ValueCaption"}
                            },
                            row: 4,
                            rowSpan: 1,
                            column: 0,
                            colSpan: 24
                        },


                        // значение
                        {
                            item: {
                                id: "EDIT",
                                className: "Terrasoft.TextEdit",
                                value: {
                                    bindTo: "value"
                                }
                            },
                            row: 5,
                            rowSpan: 1,
                            column: 0,
                            colSpan: 24
                        },

                        // кнопки
                        {
                            item: {
                                id: "OK_BUTTON",
                                className: "Terrasoft.Button",
                                caption: {
                                    bindTo: "OkButtonCaption"
                                },
                                click: {
                                    bindTo: "onOkButtonClick"
                                },
                                styles: {
                                    textStyle: {
                                        width: "calc(100% - 7px)",
                                        margin: "7px 7px 0px 0px"
                                    }
                                },
                                style: Terrasoft.controls.ButtonEnums.style.GREEN
                            },
                            row: 6,
                            rowSpan: 1,
                            column: 0,
                            colSpan: 12
                        },
                        {
                            item: {
                                id: "CANCEL_BUTTON",
                                className: "Terrasoft.Button",
                                caption: {
                                    bindTo: "CancelButtonCaption"
                                },
                                styles: {
                                    textStyle: {
                                        width: '100%',
                                        margin: "7px 0px 0px 0px"
                                    }
                                },
                                click: {
                                    bindTo: "onCancelButtonClick"
                                }
                            },
                            row: 6,
                            rowSpan: 1,
                            column: 12,
                            colSpan: 12
                        }

                    ]
                };

                return Ext.create("Terrasoft.GridLayout", markup);
            },

            getViewModel: function() {
                return Ext.create("Terrasoft.BaseViewModel", {
                    // методы
                    methods: {
                        getElement: function(displayValue, value) {
                            return {
                                displayValue: displayValue,
                                value: value
                            }
                        },

                        onOkButtonClick: function() {
                            console.log(this.get("value"));
                            console.log(this.get("FirstValue"));
                            console.log(this.get("SecondValue"));

                            console.log(this.sandbox);
                            console.log(sandbox);

                            var args = [
                                {
                                    name: "Value",
                                    value: this.get("value")
                                },
                                {
                                    name: "UpDown",
                                    value: this.get("FirstValue").value
                                },
                                {
                                    name: "SumPercent",
                                    value: this.get("SecondValue").value
                                }
                            ];

                            // метод обработки

                            // закрытие карточки
                            // можно всунуть в call back запроса
                            var sandbox = this.get("sandbox");
                            sandbox.publish("CloseModalBox", args);
                        },

                        onCancelButtonClick: function() {
                            // публикуем сообщение на закрытие карточки
                            var sandbox = this.get("sandbox");
                            sandbox.publish("CloseModalBox", null);
                        },

                        loadFirstList: function() {
                            var list = this.get("FirstList");
                            var collection = {};

                            collection[0] = this.getElement("Увеличение", 0);
                            collection[1] = this.getElement("Уменьшение", 1);
                            list.loadAll(collection);
                        },

                        loadSecondList: function() {
                            var list = this.get("SecondList");
                            var collection = {};

                            collection[0] = this.getElement("Проценты", 0);
                            collection[1] = this.getElement("Сумма", 1);
                            list.loadAll(collection);
                        }
                    },

                    // Значения модели представления
                    values: {
                        FirstList: new Terrasoft.Collection(),
                        FirstValue: {value: 0, displayValue: "Увеличение"},

                        SecondList: new Terrasoft.Collection(),
                        SecondValue: {value: 0, displayValue: "Проценты"},

                        OkButtonCaption: "Применить",
                        CancelButtonCaption: "Отмена",

                        HeaderCaption: "Пакетное изменение цен",
                        ParametersGroupCaption: "Параметры",
                        ValueCaption: "Числовое значение",

                        // список ID-ов которые нужно изменить
                        IDs: [],
                        // ссылка на sandbox, так как своего нет
                        sandbox: null,

                        value: 0
                    }
                });
            },

            // получаем ссылку на модель представления
            // и устанавливаем свои параметры
            initParameters: function(viewModel) {
                var parameters = this.parameters;

                viewModel.set("IDs", parameters.IDs);
                viewModel.set("sandbox", this.sandbox);
            },

            render: function(renderTo) {
                var view = this.getView();
                var viewModel = this.getViewModel();

                // обновляем некоторые поля модели представления
                this.initParameters(viewModel);
                view.bind(viewModel);
                view.render(renderTo);

                var comboboxContainer = Ext.get("first-combobox-wrap");
                comboboxContainer.addCls("items-combobox-class");
                comboboxContainer = Ext.get("Second-combobox-wrap");
                comboboxContainer.addCls("items-combobox-class");
            }
        });
        return Terrasoft.PriceChangerModule;
    }
);
//less
/*.header-label-class {
    color: #444167;
    font-size: 22px;
    font-family: "Segoe UI Light";
    font-weight: bold;
}
.items-combobox-class {
    margin-bottom: 7px;
}*/