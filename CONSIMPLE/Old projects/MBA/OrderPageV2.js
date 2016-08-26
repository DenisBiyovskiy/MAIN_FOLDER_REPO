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
			onEntityInitialized: function() {
				this.updateProductsField(function(){}, this);
				this.callParent(arguments);
			},
			updateOrderProductSummary: function() {
				this.callParent(arguments);
				this.updateProductsField(function(){}, this);  
			},
			/*save: function(flag) {
					if(this.isAddMode() || this.isCopyMode() || flag) {
						this.callParent(arguments);
					} else {
						this.updateProductsField(function(scope) {
							scope.save(true);
						}, this);
					}
			},*/
			updateProductsField: function(callback, scope) {
				var esq = Ext.create("Terrasoft.EntitySchemaQuery", {
	                rootSchemaName: "OrderProduct"
	            });
	            esq.addColumn("Order");
	            esq.addColumn("Product.Name");
	            var UsrProductNumber = esq.addColumn("Product.UsrProductNumber");
	            UsrProductNumber.orderDirection = this.Terrasoft.OrderDirection.ASC;
	            esq.filters.add("OrderProductFilter", esq.createColumnFilterWithParameter(
	                    scope.Terrasoft.ComparisonType.EQUAL, "Order", scope.get("Id")));
	            esq.getEntityCollection(function(result) {
	            	var count = result.collection.getCount();
	            	var tempString = "";
	                if (result.success && count > 0) {
	            		tempString = result.collection.getByIndex(0).get("Product.Name");
	                
	                    for (var i = 1; i < count; i++) {
	                         tempString += ", " + result.collection.getByIndex(i).get("Product.Name");
	                        if (i >= count - 1) {
	                        	if (this.get("UsrProductsInOrder") != tempString) {
	                        		this.set("UsrProductsInOrder", tempString);
	                        	}
	                        	callback(scope);
	                        }
	                    }
	                    if (this.get("UsrProductsInOrder") != tempString) {
	                    	this.set("UsrProductsInOrder", tempString);
	                    }
	                } else {
	                	this.set("UsrProductsInOrder", "");
	                }
	            }, scope);
            }
		},
		rules: {},
		userCode: {}
	};
});
