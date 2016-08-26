MBA Schemas
on Order Entity inserting code

Guid curId = Entity.GetTypedColumnValue<Guid>("Id");
var currentSelect = new Select(UserConnection)
  .Column("t1", "Id")
  .Column("t1", "UsrIsNew")
    .From("Order").As("t1")
  .Join(JoinType.Inner, "OrderProduct").As("t2").On("t1", "Id").IsEqual("t2", "OrderId")
  .Where("t1", "ContactId").IsEqual(Column.Parameter(Entity.GetTypedColumnValue<Guid>("ContactId"))
      .And().OpenBlock("t1", "StatusId" ).IsEqual(Column.Parameter("40de86ee-274d-4098-9b92-9ebdcf83d4fc"))
        .Or("t1", "StatusId").IsEqual(Column.Parameter("c8742634-ea8b-46d9-ba71-1989b951772d"))
    .CloseBlock()
  as Select;

using (var dbExecutor = UserConnection.EnsureDBConnection())
{
    using (var dataReader = currentSelect.ExecuteReader(dbExecutor))
    {
        if(dataReader.Read())
        {
           if(UserConnection.DBTypeConverter.DBValueToGuid(dataReader["Id"]) != Guid.Empty)
           {
            var update = new Update(UserConnection, "Order")
                .Set("UsrIsNew", Column.Parameter(true))
            .Where("Id").IsEqual(Column.Parameter(curId)) as Update;
            update.Execute(dbExecutor);
           }
        }
    }
}
return true;
----------------------------------------------------------------------------------------------------------------
SQL "refresh product numbers"

DECLARE @ColGuid uniqueidentifier
DECLARE @NUM int
set @NUM = 1
--------------------------------------------------------
DECLARE @MyCursor CURSOR SET @MyCursor = CURSOR FAST_FORWARD
FOR
    SELECT P.Id
    FROM  Product as P order by CreatedOn
OPEN @MyCursor
 FETCH NEXT FROM @MyCursor INTO @ColGuid
 WHILE @@FETCH_STATUS = 0
    BEGIN
        update Product as P
        set Notes = @NUM where P.Id = @ColGuid
         SET @NUM = @NUM + 1
        FETCH NEXT FROM @MyCursor INTO @ColGuid
    END
CLOSE @MyCursor
DEALLOCATE @MyCursor


OrderPageV2

define("OrderPageV2", ["OrderPageV2Resources", "GeneralDetails", "ProcessModuleUtilities", "BusinessRuleModule"],
function(resources, GeneralDetails, ProcessModuleUtilities, BusinessRuleModule) {
    return {
        entitySchemaName: "Order",
        details: /**SCHEMA_DETAILS*/{}/**SCHEMA_DETAILS*/,
        diff: /**SCHEMA_DIFF*/[
            {
                "operation": "insert",
                "name": "UsrIsRepeated",
                "values": {
                    "layout": {
                        "column": 12,
                        "row": 3,
                        "colSpan": 12,
                        "rowSpan": 1
                    },
                    "bindTo": "UsrIsRepeated",
                    "enabled": true
                },
                "parentName": "Header",
                "propertyName": "items"
            },
            {
                "operation": "insert",
                "name": "UsrProductsInOrder",
                "values": {
                    "layout": {
                        "column": 1,
                        "row": 4,
                        "colSpan": 24,
                        "rowSpan": 1
                    },
                    "bindTo": "UsrProductsInOrder",
                    "enabled": false
                },
                "parentName": "Header",
                "propertyName": "items"
            }
        ]/**SCHEMA_DIFF*/,
        attributes: {},
        methods: {
            save: function(saveFlag) {
                if (saveFlag) {
                    this.callParent(arguments);
                } else {
                    this.updateProductsField();
                }
            },
            updateProductsField: function() {
                var esq = Ext.create("Terrasoft.EntitySchemaQuery", {
                    rootSchemaName: "OrderProduct"
                });
                esq.addColumn("Order");
                esq.addColumn("Product.Name");
                var UsrProductNumber = esq.addColumn("Product.UsrProductNumber");
                UsrProductNumber.orderDirection = this.Terrasoft.OrderDirection.ASC;
                esq.filters.add("OrderProductFilter", esq.createColumnFilterWithParameter(
                        this.Terrasoft.ComparisonType.EQUAL, "Order", this.get("Id")));
                esq.getEntityCollection(function(result) {
                    if (result.success) {
                        this.set("UsrProductsInOrder", result.collection.getByIndex(0).get("Product.Name"));
                        var count = result.collection.getCount();
                        for (var i = 1; i < count; i++) {
                            this.set("UsrProductsInOrder", this.get("UsrProductsInOrder") + ", " + result.collection.getByIndex(i).get("Product.Name"));
                            if (i >= count - 1) {
                                this.save(true);
                            }
                        }
                    }
                }, this);
            }
        },
        rules: {},
        userCode: {}
    };
});

LeadPageV2

define("LeadPageV2", ["LeadPageV2Resources", "GeneralDetails"],
function(resources, GeneralDetails) {
    return {
        entitySchemaName: "Lead",
        details: /**SCHEMA_DETAILS*/{}/**SCHEMA_DETAILS*/,
        diff: /**SCHEMA_DIFF*/[
            {
                "operation": "merge",
                "name": "LeadMedium",
                "values": {
                    "isRequired": { "bindTo": "isLeadAddedManually"}
                }
            },
            {
                "operation": "merge",
                "name": "LeadSource",
                "values": {
                    "isRequired": { "bindTo": "isLeadAddedManually"}
                }
            }
        ]/**SCHEMA_DIFF*/,
        attributes: {
            /*"LeadMedium": {
                //"isRequired": { "bindTo": "isLeadAddedManually"},
                dependencies: [
                    {
                        columns: ["RegisterMethod"],
                        methodName: "isLeadAddedManually"
                    }
                ]
            },
            "LeadSource": {
                //"isRequired": { "bindTo": "isLeadAddedManually"}
                dependencies: [
                    {
                        columns: ["RegisterMethod"],
                        methodName: "isLeadAddedManually"
                    }
                ]
            }*/
        },
        methods: {
            isLeadAddedManually: function() {
                if (this.get("RegisterMethod")) {
                    if (this.get("RegisterMethod").value === "240ab9c6-4d7c-4688-b380-af44dd147d7a") {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            },
            save: function() {
                if (!this.isLeadAddedManually()) {
                    this.callParent(arguments);
                } else {
                    Terrasoft.utils.showMessage({
                        caption: this.get("Resources.Strings.LeadSourceIsRequiredCaption"),
                        buttons: ["cancel"],
                        style: Terrasoft.MessageBoxStyles.BLUE
                    });
                }
            }
        },
        rules: {},
        userCode: {}
    };
});

ProductPageV2

define("ProductPageV2", ["ProductPageV2Resources", "GeneralDetails", "ConfigurationEnums", "BusinessRuleModule"],
function(resources, GeneralDetails, ConfigurationEnums, BusinessRuleModule) {
    return {
        entitySchemaName: "Product",
        details: /**SCHEMA_DETAILS*/{}/**SCHEMA_DETAILS*/,
        diff: /**SCHEMA_DIFF*/[
            {
                "operation": "insert",
                "name": "UsrProductNumber",
                "values": {
                    "layout": {
                        "column": 13,
                        "row": 3,
                        "colSpan": 10,
                        "rowSpan": 1
                    },
                    "bindTo": "UsrProductNumber",
                    "caption": {
                        "bindTo": "Resources.Strings.UsrProductNumberCaption"
                    },
                    "enabled": true
                },
                "parentName": "Header",
                "propertyName": "items",
                "index": 8
            }
        ]/**SCHEMA_DIFF*/,
        attributes: {},
        methods: {
            onEntityInitialized: function() {
                if (this.isAddMode() || this.isCopyMode()) {
                    this.getIncrementCode(function(responce) {
                        this.set("UsrProductNumber", responce);
                    });
                }
                this.callParent(arguments);
            }
        },
        rules: {},
        userCode: {}
    };
});


