Detail samples

Detail schema whith checkboxes

define("UsrSchemaDetailUsrPaymentsMethods", ["ConfigurationGrid", "ConfigurationGridGenerator", "ConfigurationGridUtilities", "ConfigurationEnums"],
function(ConfigurationGrid, ConfigurationGridGenerator, ConfigurationGridUtilities, configurationEnums) {
    return {
        entitySchemaName: "UsrPaymentsMethods",
        details: /**SCHEMA_DETAILS*/{}/**SCHEMA_DETAILS*/,
        diff: /**SCHEMA_DIFF*/[
            {
                "operation": "merge",
                "name": "DataGrid",
                "values": {
                    "className": "Terrasoft.ConfigurationGrid",
                    "generator": "ConfigurationGridGenerator.generatePartial",
                    "type": "listed",
                    "generateControlsConfig": {"bindTo": "generateActiveRowControlsConfig"},
                    "changeRow": {"bindTo": "changeRow"},
                    "unSelectRow": {"bindTo": "unSelectRow"},
                    "onGridClick": {"bindTo": "onGridClick"},
                    "listedZebra": true,
                    "initActiveRowKeyMap": {"bindTo": "initActiveRowKeyMap"},
                    "activeRowAction": {"bindTo": "onActiveRowAction"}
                }
            }
        ]/**SCHEMA_DIFF*/,
        methods: {
            onActiveRowAction: function() {
                this.mixins.ConfigurationGridUtilities.onActiveRowAction.apply(this, arguments);
                this.callParent(arguments);
            },
            isArrayContainsValue: function(arr, UsrPaymentsMethods){
                if(arr.length != 0){
                    for(var i = 0; i < arr.length; i++){
                        if(arr[i].UsrPaymentsMethods == UsrPaymentsMethods){
                            return arr[i];
                        }
                    }
                }else{
                    return null;
                }
            },
            //Denis
            openEquipmentLookup: function() {
                var mySet = new Set();
                var arr = [];
                for(var i = 0; i < this.getGridData().collection.items.length; i++){
                    mySet.add(this.getGridData().collection.items[i].get("UsrPaymentsMethods").value);
                }
                var setIter = mySet.values();
                for(var i = 0; i < mySet.size; i++){
                    arr[i] = setIter.next().value;
                }
                var config = {
                    entitySchemaName: "UsrPaymentsMethods",
                    multiSelect: true,
                    selectedValues: arr
                };
                this.openLookup(config, this.addEquipType, this);
            },//Denis
            //Denis saving new Lead for adding Equipment record
            addRecord: function(editPageUId) {
                var masterCardState = this.sandbox.publish("GetCardState", null, [this.sandbox.id]);
                var isNewRecord = (masterCardState.state === configurationEnums.CardStateV2.ADD ||
                masterCardState.state === configurationEnums.CardStateV2.COPY);
                if (isNewRecord === true) {
                    var args = {
                        isSilent: true,
                        messageTags: [this.sandbox.id]
                    };
                    this.sandbox.publish("SaveRecord", args, [this.sandbox.id]);
                    return;
                }
                this.openEquipmentLookup();
            },//Denis
            //Denis
            onCardSaved: function() {
                this.openEquipmentLookup();
            },//Denis
            addEquipType: function(args) {
            var selectedItems = args.selectedRows.getItems();

            var arr = [];
            for(var i = 0; i < this.getGridData().collection.items.length; i++){
                arr[i] = new Object({UsrPaymentsMethods: this.getGridData().collection.items[i].get("UsrPaymentsMethods").value,
                                    UsrSum: this.getGridData().collection.items[i].get("UsrSum")});
            }

            var deleteQuery = Ext.create('Terrasoft.DeleteQuery', {rootSchemaName: 'UsrPaymentsMethodsEntity'});
            deleteQuery.filters.add('IdFilter', deleteQuery.createColumnFilterWithParameter(Terrasoft.ComparisonType.EQUAL, 'UsrContract', this.get("MasterRecordId")));
            deleteQuery.execute(function (result) {
                if (result.success) {
                    this.reloadGridData();
                    for(var j = 0; j < selectedItems.length; j++){
                        var entity = Ext.create("Terrasoft.EntitySchemaQuery", {
                            rootSchemaName: "UsrPaymentsMethods"
                        });
                        entity.addColumn("Id");
                        entity.filters.addItem(entity.createColumnFilterWithParameter(
                        this.Terrasoft.ComparisonType.EQUAL, "Id", selectedItems[j].value));
                        entity.getEntityCollection(function(result) {
                            if (result.success) {
                                for (i = 0; i < result.collection.getCount(); i++) {
                                    var value = this.isArrayContainsValue(arr, result.collection.getByIndex(i).get("Id"));
                                    if(value != null || value != undefined){
                                        var insert = Ext.create("Terrasoft.InsertQuery", {
                                            rootSchemaName: "UsrPaymentsMethodsEntity"
                                        });
                                        insert.setParameterValue("UsrContract", this.get("MasterRecordId"), Terrasoft.DataValueType.GUID);
                                        insert.setParameterValue("UsrPaymentsMethods", result.collection.getByIndex(i).get("Id"), Terrasoft.DataValueType.GUID);
                                        insert.setParameterValue("UsrSum", value.UsrSum, Terrasoft.DataValueType.FLOAT);
                                        insert.execute(function(result) {
                                            if (result.success) {
                                                this.reloadGridData();
                                            }
                                        }, this);
                                    } else {
                                        var insert = Ext.create("Terrasoft.InsertQuery", {
                                            rootSchemaName: "UsrPaymentsMethodsEntity"
                                        });
                                        insert.setParameterValue("UsrContract", this.get("MasterRecordId"), Terrasoft.DataValueType.GUID);
                                        insert.setParameterValue("UsrPaymentsMethods", result.collection.getByIndex(i).get("Id"), Terrasoft.DataValueType.GUID);
                                        insert.execute(function(result) {
                                            if (result.success) {
                                                this.reloadGridData();
                                            }
                                        }, this);
                                    }
                                }
                            }
                        }, this);
                    }
                }
            }, this);
          }
        },
        attributes: {
            IsEditable: {
                dataValueType: this.Terrasoft.DataValueType.BOOLEAN,
                type: this.Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN,
                value: true
            }
        },
        mixins: {
            ConfigurationGridUtilites: "Terrasoft.ConfigurationGridUtilities"
        }
    };
});

