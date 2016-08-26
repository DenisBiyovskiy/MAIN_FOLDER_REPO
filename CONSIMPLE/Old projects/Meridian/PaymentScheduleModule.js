define("PaymentScheduleModule",
    ["BaseModule"],
    function() {
        Ext.define("PaymentSchedule", {
            extend: "Terrasoft.BaseModule",
            alternateClassName: "Terrasoft.PaymentScheduleModule",
            Ext: null,
            sandbox: null,
            Terrasoft: null,
            
            // Разметка страницы
            getView: function() {
                var markup = {
                    id: "PaymentScheduleGridLayout",
                    className: "Terrasoft.GridLayout",
                    items: [
                        // Заголовок
                        {
                            item: {
                                id: "HeaderLabel",
                                className: "Terrasoft.Label",
                                classes: {labelClass: ["header-label-class"]},
                                caption: {bindTo: "HeaderCaption"}
                            },
                            row: 0,
                            rowSpan: 1,
                            column: 0,
                            colSpan: 24
                        },
                        // График платежей
                        {
                            item: {
                                id: "ScheduleLabel",
                                className: "Terrasoft.Label",
                                caption: {bindTo: "ScheduleLabelCaption"}
                            },
                            row: 1,
                            rowSpan: 1,
                            column: 0,
                            colSpan: 12
                        },
                        {
                            item: {
                                id: "ScheduleListCombobox",
                                list: {bindTo: "ScheduleList"},
                                prepareList: {bindTo: "loadScheduleList"},
                                classes: {labelClass: ["row-item-class"]},
                                className: "Terrasoft.ComboBoxEdit",
                                value: {bindTo: "ScheduleValue"}
                            },
                            row: 1,
                            rowSpan: 1,
                            column: 12,
                            colSpan: 12
                        },
                        // Дата первой оплаты
                        {
                            item: {
                                id: "FirstPaymentDateLabel",
                                className: "Terrasoft.Label",
                                caption: {bindTo: "FirstPaymentDateLabelCaption"}
                            },
                            row: 2,
                            rowSpan: 1,
                            column: 0,
                            colSpan: 12
                        },
                        {
                            item: {
                                id: "FirstPaymentDateEdit",
                                className: "Terrasoft.DateEdit",
                                classes: {labelClass: ["row-item-class"]},
                                value: {bindTo: "FirstPaymentDateValue"}
                            },
                            row: 2,
                            rowSpan: 1,
                            column: 12,
                            colSpan: 12
                        },
                        
                        // Дата последней оплаты
                        {
                            item: {
                                id: "SecondPaymentDateLabel",
                                className: "Terrasoft.Label",
                                caption: {bindTo: "SecondPaymentDateLabelCaption"}
                            },
                            row: 3,
                            rowSpan: 1,
                            column: 0,
                            colSpan: 12
                        },
                        {
                            item: {
                                id: "SecondPaymentDateEdit",
                                className: "Terrasoft.DateEdit",
                                classes: {labelClass: ["row-item-class"]},
                                value: {bindTo: "SecondPaymentDateValue"}
                            },
                            row: 3,
                            rowSpan: 1,
                            column: 12,
                            colSpan: 12
                        },
                        
                        // Первоначальный взнос
                        {
                            item: {
                                id: "FirstPaymentLabel",
                                className: "Terrasoft.Label",
                                caption: {bindTo: "FirstPaymentLabelCaption"}
                            },
                            row: 4,
                            rowSpan: 1,
                            column: 0,
                            colSpan: 12
                        },
                        {
                            item: {
                                id: "FirstPaymentCheckBox",
                                className: "Terrasoft.CheckBoxEdit",
                                classes: {labelClass: ["row-item-class"]},
                                checked: {bindTo: "IsFirstPaymentChecked"}
                            },
                            row: 4,
                            rowSpan: 1,
                            column: 12,
                            colSpan: 12
                        },

                        // Сумма первоначального взноса
                        {
                            item: {
                                id: "FirstPaymentSumLabel",
                                className: "Terrasoft.Label",
                                caption: {bindTo: "FirstPaymentSumLabelCaption"}
                            },
                            row: 5,
                            rowSpan: 1,
                            column: 0,
                            colSpan: 12
                        },
                        {
                            item: {
                                id: "FirstPaymentSumEdit",
                                className: "Terrasoft.FloatEdit",
                                classes: {labelClass: ["row-item-class"]},
                                enabled: {bindTo: "IsFirstPaymentChecked"},
                                value: {bindTo: "FirstPaymentSumValue"}
                            },
                            row: 5,
                            rowSpan: 1,
                            column: 12,
                            colSpan: 12
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
                    methods: {
                        getElement: function(displayValue, value) {
                            return {
                                displayValue: displayValue,
                                value: value
                            }
                        },

                        onOkButtonClick: function() {
                            firstPaymentDateValue = this.get("FirstPaymentDateValue");
                            secondPaymentDateValue = this.get("SecondPaymentDateValue");
                            if (firstPaymentDateValue > secondPaymentDateValue){
                                this.showInformationDialog("Последняя дата оплаты меньше чем Первая дата оплаты");
                            }
                            else {
                                var args = [
                                    {
                                        name: "ScheduleValue",
                                        value: this.get("ScheduleValue").value
                                    },
                                    {
                                        name: "IsFirstPaymentChecked",
                                        value: this.get("IsFirstPaymentChecked")
                                    },
                                    {
                                        name: "FirstPaymentSumValue",
                                        value: this.get("FirstPaymentSumValue")
                                    },
                                    {
                                        name: "FirstPaymentDateValue",
                                        value: firstPaymentDateValue
                                    },
                                    {
                                        name: "SecondPaymentDateValue",
                                        value: secondPaymentDateValue
                                    }
                                ];
                                var sandbox = this.get("sandbox");
                                sandbox.publish("CloseModalBox", args);
                            }
                        },

                        onCancelButtonClick: function() {
                            var sandbox = this.get("sandbox");
                            sandbox.publish("CloseModalBox", null);
                        },

                        loadScheduleList: function() {
                            var list = this.get("ScheduleList");
                            var collection = {};

                            collection[0] = this.getElement("Помесячно", 0);
                            collection[1] = this.getElement("Поквартально", 1);
                            list.loadAll(collection);
                        }
                    },

                    // Значения модели представления
                    values: {
                        FirstPaymentSumValue: 0,
                        ScheduleList: new Terrasoft.Collection(),
                        ScheduleValue: {value: 0, displayValue: "Помесячно"},
                        IsFirstPaymentChecked: false,
                        FirstPaymentDateValue: new Date,
                        SecondPaymentDateValue: new Date,
                        
                        OkButtonCaption: "Применить",
                        CancelButtonCaption: "Отмена",

                        HeaderCaption: "Параметры графика оплат",
                        ScheduleLabelCaption: "График платежей",
                        FirstPaymentDateLabelCaption: "Дата первой оплаты",
                        SecondPaymentDateLabelCaption: "Дата последней оплаты",
                        FirstPaymentLabelCaption: "Первоначальный взнос",
                        FirstPaymentSumLabelCaption: "Сумма первоначального взноса",

                        // список ID-ов которые нужно изменить
//                        IDs: [],
                        // ссылка на sandbox, так как своего нет
                        sandbox: null
                    }
                });
            },

            // получаем ссылку на модель представления
            // и устанавливаем свои параметры
            initParameters: function(viewModel) {
//                var parameters = this.parameters;

//                viewModel.set("IDs", parameters.IDs);
                viewModel.set("sandbox", this.sandbox);
            },

            render: function(renderTo) {
                var view = this.getView();
                var viewModel = this.getViewModel();
                this.initParameters(viewModel);
                view.bind(viewModel);
                view.render(renderTo);
                
                var comboboxContainer = Ext.get("ScheduleListCombobox-wrap");
                comboboxContainer.addCls("row-item-class");
                comboboxContainer = Ext.get("FirstPaymentDateEdit-wrap");
                comboboxContainer.addCls("row-item-class");
                comboboxContainer = Ext.get("SecondPaymentDateEdit-wrap");
                comboboxContainer.addCls("row-item-class");
                comboboxContainer = Ext.get("FirstPaymentCheckBox-el");
                comboboxContainer.addCls("row-item-class");
                comboboxContainer = Ext.get("FirstPaymentSumEdit-wrap");
                comboboxContainer.addCls("row-item-class");
            }
        });
        return Terrasoft.PaymentScheduleModule;
    }
);
//less
/*.row-item-class{
    margin-bottom: 7px
}*/