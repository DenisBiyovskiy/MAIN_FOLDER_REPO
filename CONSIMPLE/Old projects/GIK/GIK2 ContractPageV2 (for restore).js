GIK2 ContractPageV2 (for restore)

define('ContractPageV2', ['ContractPageV2Resources', 'GeneralDetails', 'ModalBox', 'UsrPaymentScheduleModule'],
function(resources, GeneralDetails, ModalBox, UsrPaymentScheduleModule) {
    return {
        entitySchemaName: 'Contract',
        messages: {
            "CloseModalBox": {
                mode: Terrasoft.MessageMode.BROADCAST,
                direction: Terrasoft.MessageDirectionType.SUBSCRIBE
            }
        },
        details: /**SCHEMA_DETAILS*/{
            "UsrPaymentsMethodsEntity": {
                "schemaName": "UsrSchemaDetailUsrPaymentsMethods",
                "entitySchemaName": "UsrPaymentsMethodsEntity",
                "filter": {
                    "detailColumn": "UsrContract",
                    "masterColumn": "Id"
                }
            },
            "Invoice1": {
                "schemaName": "InvoiceDetailV2",
                "entitySchemaName": "Invoice",
                "filter": {
                    "detailColumn": "Contract",
                    "masterColumn": "Id"
                }
            }
        }/**SCHEMA_DETAILS*/,
        diff: /**SCHEMA_DIFF*/[
    {
        "operation": "insert",
        "name": "UsrPaymentsMethodsEntity",
        "values": {
            "itemType": 2
        },
        "parentName": "GeneralInfoTab",
        "propertyName": "items",
        "index": 7
    },
    {
        "operation": "insert",
        "name": "Invoice1",
        "values": {
            "itemType": 2
        },
        "parentName": "GeneralInfoTab",
        "propertyName": "items",
        "index": 6
    },
    {
        "operation": "insert",
        "name": "UsrBank",
        "values": {
            "layout": {
                "column": 0,
                "row": 1,
                "colSpan": 12,
                "rowSpan": 1
            },
            "bindTo": "UsrBank",
            "caption": {
                "bindTo": "Resources.Strings.UsrBankCaption"
            },
            "enabled": true
        },
        "parentName": "ContractSumBlock",
        "propertyName": "items",
        "index": 3
    },
    {
        "operation": "insert",
        "name": "UsrMortgageManager",
        "values": {
            "layout": {
                "column": 12,
                "row": 0,
                "colSpan": 12,
                "rowSpan": 1
            },
            "bindTo": "UsrMortgageManager",
            "caption": {
                "bindTo": "Resources.Strings.UsrMortgageManagerCaption"
            },
            "enabled": true
        },
        "parentName": "ContractSumBlock",
        "propertyName": "items",
        "index": 1
    },
    {
        "operation": "insert",
        "name": "UsrExecutor",
        "values": {
            "layout": {
                "column": 12,
                "row": 1,
                "colSpan": 12,
                "rowSpan": 1
            },
            "bindTo": "UsrExecutor",
            "caption": {
                "bindTo": "Resources.Strings.UsrExecutorCaption"
            },
            "enabled": true
        },
        "parentName": "ContractSumBlock",
        "propertyName": "items",
        "index": 1
    },
    {
        "operation": "merge",
        "name": "ContractSumGroup",
        "values": {
            "caption": {
                "bindTo": "Resources.Strings.ContractSumGroupCaption"
            }
        }
    },
    {
        "operation": "move",
        "parentName": "Header",
        "propertyName": "items",
        "name": "Contact",
        "index": 6,
        "values": {
            "layout": {
                "column": 0,
                "row": 3,
                "colSpan": 12,
                "rowSpan": 1
            }
        }
    },
    {
        "operation": "move",
        "parentName": "Header",
        "propertyName": "items",
        "name": "OurCompany",
        "index": 7,
        "values": {
            "layout": {
                "column": 12,
                "row": 3,
                "colSpan": 12,
                "rowSpan": 1
            }
        }
    },
    {
        "operation": "remove",
        "name": "group_gridLayout"
    },

]/**SCHEMA_DIFF*/,
        attributes: {
            /**
             * Коллекция пунктов меню кнопки печатных форм.
             */
            //CardPrintMenuItems: {
            //    dataValueType: Terrasoft.DataValueType.COLLECTION
            //}
        },
        methods: {
            isPaymentScheduleActionEnabled: function() {
                var temp = "1F703F42-F7E8-4E3F-9B54-2B85F62EA507".toLowerCase();
                if(this.get("State"))  return !(temp == this.get("State").value);
                return true;
            },
            chekPaymentMethodsSum: function(callback, scope) {//проверяет равняется общаяя сумма всех способов оплаты договора, общей сумме договора
                if(this.isPaymentScheduleActionEnabled()){
                    var esq = Ext.create("Terrasoft.EntitySchemaQuery", {rootSchemaName: "UsrPaymentsMethodsEntity"});
                        esq.addColumn("UsrSum");
                        esq.filters.add("ContractFilter", esq.createColumnFilterWithParameter(
                            this.Terrasoft.ComparisonType.EQUAL, "UsrContract", this.get("Id")));
                    esq.getEntityCollection(function(result) {
                        if(result.success && result.collection.getCount() > 0){
                            var totalSum = 0;
                            for(var i = 0; i< result.collection.getCount(); i++){
                                totalSum += result.collection.getByIndex(i).get("UsrSum");
                            }
                            if(totalSum == this.get("Amount")){
                                callback(true, this);
                            }
                            else{
                                Terrasoft.utils.showMessage({
                                    caption: "Общая сумма способов оплаты не совпадает с полем Сумма",
                                    buttons: ["ok"],
                                    defaultButton: 0
                                });
                                callback(false, this);
                            }
                        }
                    }, this);
                }
                else {
                    Terrasoft.utils.showMessage({
                        caption: "Договор уже подписан!",
                        buttons: ["ok"],
                        defaultButton: 0
                    });
                    callback(false, this);
                }
            },
            //Получить ответ от окна Графика оплат
            subscribeSandboxEvents: function() {
                this.callParent(arguments);
                this.sandbox.subscribe("CloseModalBox", function(args) {
                    console.log(args);
                    if (args){
                        this.showConfirmationDialog("Необходимо сохранить договор. Продолжить?",
                            function(result) {
                                if (result === this.Terrasoft.MessageBoxButtons.YES.returnCode) {
                                    this.save();
                                    this.createPaymentSchedule(args);
                                }
                            }, [this.Terrasoft.MessageBoxButtons.YES.returnCode,
                                this.Terrasoft.MessageBoxButtons.NO.returnCode], null);
                    }
                    ModalBox.close();
                }, this, null);
            },
            //Вызов окна Графика оплат
            setPaymentSchedule: function() {
                this.chekPaymentMethodsSum(function(result, scope) {
                    if(result){
                        var esq = Ext.create("Terrasoft.EntitySchemaQuery", {rootSchemaName: "Invoice"});
                        esq.addColumn("Contract");
                        esq.filters.add("ContractFilter", esq.createColumnFilterWithParameter(
                            scope.Terrasoft.ComparisonType.EQUAL, "Contract", scope.get("Id")));
                        esq.getEntityCollection(function(result) {
                            if(result.success && result.collection.getCount() > 0){
                                scope.showConfirmationDialog("Вы действительно хотите создать новый график платежей?",
                                function(result) {
                                    if (result == scope.Terrasoft.MessageBoxButtons.YES.returnCode) {
                                        var deleteQuery = Ext.create("Terrasoft.DeleteQuery", {rootSchemaName: "Invoice"});
                                        deleteQuery.filters.add("InvoiceDeleteFilter", deleteQuery.createColumnFilterWithParameter(Terrasoft.ComparisonType.EQUAL, "Contract", scope.get("Id")));
                                        deleteQuery.execute(function(response) {});
                                        var container = ModalBox.show({widthPixels: 500, heightPixels: 300});
                                        container.applyStyles("display: block");
                                        container.applyStyles("padding: 0px 7px");
                                        scope.sandbox.loadModule("UsrPaymentScheduleModule", {
                                            renderTo: container
                                        });
                                    }
                                    else
                                    {
                                        return;
                                    }
                                }, [scope.Terrasoft.MessageBoxButtons.YES.returnCode,
                                    scope.Terrasoft.MessageBoxButtons.NO.returnCode], null);
                                ///////////////////////////////////////////
                            }
                            else
                            {
                                var container = ModalBox.show({widthPixels: 500, heightPixels: 300});
                                container.applyStyles("display: block");
                                container.applyStyles("padding: 0px 7px");
                                scope.sandbox.loadModule("UsrPaymentScheduleModule", {
                                    renderTo: container
                                });
                            }
                        }, this);
                    }
                }, this)
            },
            getActions: function() {
                var actionMenuItems = this.callParent(arguments);
                actionMenuItems.addItem(this.getActionsMenuItem({
                        Type: "Terrasoft.MenuSeparator",
                        Caption: ""
                }));
                actionMenuItems.addItem(this.getButtonMenuItem({
                    "Caption": "Создать график платежей",//{"bindTo": "Resources.Strings.PaymentScheduleActionCaption"},
                    "Tag": "setPaymentSchedule"
                }));
                return actionMenuItems;
            },
            insertInvoice: function(date, sum, id, invoiceNumber, ourCompany, account, contact, opportunity, UsrPaymentsMethods) {
                console.log(date + ' ' + sum + ' ' + id + ' ' + invoiceNumber + ' ' + ourCompany +
                    ' ' + account + ' ' + contact + ' ' + opportunity + ' ' + UsrPaymentsMethods);

                var insert = this.Ext.create("Terrasoft.InsertQuery", {
                    rootSchemaName: "Invoice"
                });
                insert.setParameterValue("StartDate", date, this.Terrasoft.DataValueType.DATE);
                insert.setParameterValue("Amount", sum, this.Terrasoft.DataValueType.FLOAT);
                insert.setParameterValue("Contract", id, this.Terrasoft.DataValueType.GUID);
                insert.setParameterValue("Number", invoiceNumber, this.Terrasoft.DataValueType.TEXT);
                //insert.setParameterValue("UsrOurCompany", ourCompany, this.Terrasoft.DataValueType.GUID);
                insert.setParameterValue("Account", account, this.Terrasoft.DataValueType.GUID);
                insert.setParameterValue("Contact", contact, this.Terrasoft.DataValueType.GUID);
                //insert.setParameterValue("UsrOpportunity", opportunity, this.Terrasoft.DataValueType.GUID);
                insert.setParameterValue("PaymentStatus", "36319D13-98E6-DF11-971B-001D60E938C6", this.Terrasoft.DataValueType.GUID);
                insert.setParameterValue("UsrPaymentsMethods", UsrPaymentsMethods, this.Terrasoft.DataValueType.GUID);
                insert.execute(function(response) {
                    if (response && response.success) {
                        console.log("Win");
                    }
                }, this);

            },
            getPaymentMethodType: function(callback, scope) {
                var esq = Ext.create("Terrasoft.EntitySchemaQuery", {rootSchemaName: "UsrPaymentsMethodsEntity"});
                        esq.addColumn("Id");
                        esq.addColumn("UsrSum");
                        esq.addColumn("UsrPaymentsMethods");
                        esq.filters.add("ContractFilter", esq.createColumnFilterWithParameter(
                            this.Terrasoft.ComparisonType.EQUAL, "UsrContract", this.get("Id")));
                    esq.getEntityCollection(function(result) {
                        var result2 = new Array(result.collection.getCount());
                        if(result.success && result.collection.getCount() > 0){
                            for(var i = 0; i < result.collection.getCount(); i++){
                                result2[i] = result.collection.getByIndex(i);
                                if(i + 1 >= result.collection.getCount()) callback(result2, scope);
                            }
                        }
                    }, this);
            },
            //Создать график оплат ///////BDR 09.12.2015
            createPaymentSchedule: function(args) {
                this.getPaymentMethodType(function(result, scope) {
                    var OwnFoundsGuid = "02923BE2-F003-409A-A41B-0AB85572C21A".toLowerCase(); //Собственные средства
                    var firstDate = args[3].value;
                    var lastDate = args[4].value;
                    var OwnFoundsResults = new Array(2);//scope.get("UsrTotalSum");
                    var totalSum = 0;
                    var id = scope.get("Id");
                    var period = (args[0].value === 0) ? 1 : 3;
                    var invoiceNumber = 1;
                    var ourCompany = scope.get("OurCompany").value;
                    var account = scope.get("Account").value;
                    var contact = scope.get("Contact").value;
                    var opportunity = scope.get("Opportunity").value;
                    var monthValue = Math.ceil(lastDate.getMonth() - firstDate.getMonth() +
                        (12 * (lastDate.getFullYear() - firstDate.getFullYear())));
                    if (period === 1)
                        monthValue++;
                    else {
                        monthValue = (monthValue % 3 > 0) ? monthValue / period : monthValue / period + 1;
                    }
                    Terrasoft.chain(
                        function(next) {
                            for(var i = 0; i < result.length; i++) {
                                if(result[i].get("UsrPaymentsMethods").value == OwnFoundsGuid) {
                                    OwnFoundsResults = [result[i].get("UsrSum"), result[i].get("UsrPaymentsMethods").value];
                                } else {
                                    var temp = invoiceNumber;
                                    scope.insertInvoice(firstDate, result[i].get("UsrSum"), id, temp, ourCompany,
                                    account, contact, opportunity, result[i].get("UsrPaymentsMethods").value);
                                    invoiceNumber++;
                                }
                                if(i + 1 >= result.length) next();
                            }
                        },
                        function(next) {
                            console.log(OwnFoundsResults[0] + ' ' + monthValue);
                            if (args[1].value) {
                                OwnFoundsResults[0] -= args[2].value;
                                /*var prePaymentDate = new Date();
                                prePaymentDate.setDate(firstDate.getDate());*/
                                var temp = invoiceNumber;
                                scope.insertInvoice(firstDate, args[2].value, id, temp, ourCompany,
                                    account, contact, opportunity, OwnFoundsResults[1]);
                                firstDate.setMonth(firstDate.getMonth() + period);
                                monthValue--;
                                invoiceNumber++;
                                next();
                            } else {
                                next();
                            }
                        },
                        function(next) {
                            totalSum = Math.round(OwnFoundsResults[0] / monthValue);
                            var tempSum = 0;
                            for (var i = 0; i < monthValue; i++) {
                                var temp = invoiceNumber;
                                if (i+1 == monthValue)
                                {
                                    scope.insertInvoice(firstDate, OwnFoundsResults[0] - tempSum, id, temp, ourCompany,
                                        account, contact, opportunity, OwnFoundsResults[1]);
                                }
                                else
                                {
                                    scope.insertInvoice(firstDate, totalSum, id, temp, ourCompany,
                                        account, contact, opportunity, OwnFoundsResults[1]);
                                }
                                firstDate.setMonth(firstDate.getMonth() + period);
                                if (firstDate > lastDate)
                                    firstDate = lastDate;

                                tempSum += totalSum;
                                invoiceNumber++;
                                if(i + 1 >= monthValue) {
                                    next();
                                    scope.updateDetail({detail: "Invoice1"});
                                }
                            }
                        },
                    scope);
                }, this);
            },
            onSaved: function(response, config) {
                this.callParent(arguments);
                this.initCardPrintForms();
                /*
                var items = this.get(this.moduleCardPrintFormsCollectionName);
                for (var i = 0; i < items.getCount(); i++) {
                    items.getByIndex(i).set("Enabled", false);
                    items.getByIndex(i).set("Caption", "xxx");
                    //items.getByIndex(i).set("visible", false);
                }*/
                //this.set("CardPrintMenuItems", items);
            },/*
            init: function(callback, scope) {
                this.callParent([function() {
                    //this.setPrintItem();
                    callback.call(scope);
                },
                this]);
            },*/
            initCardPrintForms: function(callback, scope) {
                var reportsEsq = this.getModulePrintFormsESQ();
                reportsEsq.filters.addItem(Terrasoft.createColumnFilterWithParameter(Terrasoft.ComparisonType.EQUAL,
                    "ShowInCard", true));
                reportsEsq.getEntityCollection(function(result) {
                    if (this.destroyed) {
                        return;
                    }
                    if (result.success && !result.collection.isEmpty()) {
                        var printFormsMenuCollection = result.collection;
                        this.preparePrintFormsMenuCollection(printFormsMenuCollection);
                        printFormsMenuCollection.each(function(item) {
                            item.set("Click", {bindTo: "generateCardPrintForm"});

                                ////////////////////////////////////////////******
                                var rowId = this.get("PrimaryColumnValue");
                                ///////////////////////////////////
                                // rowId contractId***********************

                                var contractType = this.get("Type").value;//contractTypeId***********************
                                var contractInfo = Ext.create("Terrasoft.EntitySchemaQuery", {
                                    rootSchemaName: "Contract"
                                });
                                contractInfo.addColumn("Id");
                                contractInfo.addColumn("UsrBank");
                                contractInfo.addColumn("Opportunity");
                                contractInfo.addColumn("Property");
                                contractInfo.filters.add("ByContract", this.Terrasoft.createColumnInFilterWithParameters("Id", [rowId]));
                                contractInfo.getEntityCollection(function(result) {
                                    if (result.success){
                                        var bankId = result.collection.getByIndex(0).get("UsrBank").value;//bankId****************************
                                        var opportunityId = result.collection.getByIndex(0).get("Opportunity").value;
                                        var propertyId = result.collection.getByIndex(0).get("Property").value;//propetry*********************************
                                        var opportunitiInfo = Ext.create("Terrasoft.EntitySchemaQuery", {
                                            rootSchemaName: "Opportunity"
                                        });
                                        opportunitiInfo.addColumn("Id");
                                        opportunitiInfo.addColumn("UsrPayForm");
                                        opportunitiInfo.filters.add("ByOpportunity", this.Terrasoft.createColumnInFilterWithParameters("Id", [opportunityId]));
                                        opportunitiInfo.getEntityCollection(function(result1) {
                                            if (result1.success){
                                                var payFormId = result1.collection.getByIndex(0).get("UsrPayForm").value;//payFormId******************************************
                                                //
                                                var propetryInfo = Ext.create("Terrasoft.EntitySchemaQuery", {
                                                    rootSchemaName: "Property"
                                                });
                                                propetryInfo.addColumn("Id");
                                                propetryInfo.addColumn("PropertyType");
                                                propetryInfo.filters.add("ByProperty", this.Terrasoft.createColumnInFilterWithParameters("Id", [propertyId]));
                                                propetryInfo.getEntityCollection(function(result2) {
                                                    if (result2.success) {
                                                        var propertyType = result2.collection.getByIndex(0).get("PropertyType").value;//propertyType*******************
                                                        // filtration of collection***********************
                                                        var repsDic = Ext.create("Terrasoft.EntitySchemaQuery", {
                                                            rootSchemaName: "UsrContractReports"
                                                        });
                                                        repsDic.addColumn("Id");
                                                        repsDic.addColumn("UsrReport");
                                                        repsDic.addColumn("UsrPropertyType");
                                                        repsDic.addColumn("UsrContractType");
                                                        repsDic.addColumn("UsrPayForm");
                                                        repsDic.addColumn("UsrBank");
                                                        repsDic.filters.add("ByContractTypeFilter", this.Terrasoft.createColumnInFilterWithParameters("UsrContractType", [contractType]));
                                                        repsDic.filters.add("ByPropertyTypeFilter", this.Terrasoft.createColumnInFilterWithParameters("UsrPropertyType", [propertyType]));
                                                        repsDic.filters.add("ByPayFormFilter", this.Terrasoft.createColumnInFilterWithParameters("UsrPayForm", [payFormId]));
                                                        repsDic.filters.add("ByBankFilter", this.Terrasoft.createColumnInFilterWithParameters("UsrBank", [bankId]));

                                                        repsDic.getEntityCollection(function(result3) {
                                                            if (result3.success) {
                                                                //...
                                                                for (var j = 0; j < result3.collection.getCount(); j++) {
                                                                    var repId = result3.collection.getByIndex(j).get("UsrReport").value;
                                                                    var printRepId = item.get("Id");
                                                                    if (printRepId === repId){
                                                                        item.set("Enabled", true);
                                                                        return true;
                                                                    }
                                                                    else {
                                                                        item.set("Enabled", false);
                                                                        return false;
                                                                    }
                                                                }
                                                            }
                                                        }, this);
                                                        //end of filtration*******************************
                                                    }
                                                }, this);
                                            }
                                        }, this);

                                        //

                                    }
                                },this);                               






                            ///////////////////////////////////
                                /*
                                var printRepId = item.get("Id");
                                item.set("Enabled", false);
                                if (rowId === "ee0fe15e-4ecc-40d5-86af-09b38eb333ad" && printRepId === "3932538a-9942-45c9-89a2-17aa4c5baf4d") {
                                    item.set("Enabled", true);
                                }
                                if (rowId === "b0b646ae-63f1-4df2-afe1-a360df686244" && printRepId === "1f32f584-9673-4532-ae58-10d77602bec9") {
                                    item.set("Enabled", true);
                                }
*/
                            ////////////////////////////////////////////******
                            //item.set("Enabled", {bindTo: "isPrintMenuItemVisible"});
                        }, this);
                        var printMenuItems = this.preparePrintButtonCollection(this.moduleCardPrintFormsCollectionName);
                        printMenuItems.loadAll(printFormsMenuCollection);

                        this.set(this.moduleCardPrintFormsCollectionName, printMenuItems);
                        this.getCardPrintButtonVisible();
                    }
                    if (callback) {
                        callback.call(scope || this);
                    }
                }, this);
            },
            isPrintMenuItemVisible: function() {
                return false;
            }

            /*
            initCardPrintForms: function(callback, scope) {
                this.callParent([function() {
                    var items = this.get(this.moduleCardPrintFormsCollectionName);
                    for (var i = 0; i < items.getCount(); i++) {
                        items.getByIndex(i).set("Enabled", false);
                        items.getByIndex(i).set("Caption", "xxx");
                        items.getByIndex(i).set("Visible", false);
                    }
                    //this.set("CardPrintMenuItems", items);
                    if (callback) {
                        callback.call(scope || this);
                    }
                },
                this]);

            }*/

        },
        rules: {},
        userCode: {}
    };
});
