SQL in JS samples
OrderBy sample

var ilayPriority = entity.addColumn("ilayAccountType.ilayPriority");
  ilayPriority.orderDirection = this.Terrasoft.OrderDirection.ASC;
Select sample

initializeContactFieldsGroup: function() {
                    var esq = Ext.create("Terrasoft.EntitySchemaQuery", {
                        rootSchemaName: "Contact"
                    });
                    esq.addColumn("Id");
                    esq.addColumn("Name");
                    esq.addColumn("Gender");
                    esq.addColumn("Job");
                    esq.addColumn("Department");
                    esq.addColumn("JobTitle");
                    esq.addColumn("DecisionRole");
                    esq.filters.add("LeadFilter", esq.createColumnFilterWithParameter(
                            this.Terrasoft.ComparisonType.EQUAL, "Id", this.get("QualifiedContact").value));
                    esq.getEntityCollection(function(result) {
                        if(result.success){
                            for (var i = 0; i < result.collection.getCount(); i++) {
                                this.set("Contact", result.collection.getByIndex(i).get("Name"));
                                this.set("Gender", result.collection.getByIndex(i).get("Gender"));
                                this.set("Job", result.collection.getByIndex(i).get("Job"));
                                this.set("FullJobTitle", result.collection.getByIndex(i).get("JobTitle"));
                                this.set("Department", result.collection.getByIndex(i).get("Department"));
                                this.set("DecisionRole", result.collection.getByIndex(i).get("DecisionRole"));
                            }
                        }
                    }, this);
                }
Extended select(with JOIN) filter sample

        attributes: {
            "OurCompany": {//фильтрация поля "наша компания" по "объект недвижимости".
                dataValueType: Terrasoft.DataValueType.LOOKUP,
                lookupListConfig: {filter: function() {
                    if(this.get("Property")){
                        return Terrasoft.createColumnInFilterWithParameters("                                             [RightHolder:Account:Id].Property",
                         [this.get("Property").value]);
                    }
                    /*return Terrasoft.CreateColumnInFilterWithParameters(this.Terrasoft.ComparisonType.EQUAL,
                        "[RightHolder:Account:Id].Property", this.get("Property").value);*/}
                }
            }
        },

GroupFilter sample

attributes: {
            "OurCompany": {//фильтрация поля "наша компания" по "объект недвижимости".
                dataValueType: Terrasoft.DataValueType.LOOKUP,
                lookupListConfig: {
                    filter: function() {
                        var filterGroup = this.Terrasoft.createFilterGroup();
                        filterGroup.logicalOperation = Terrasoft.LogicalOperatorType.AND;
                        if(this.get("Property")){
                            filterGroup.add("AccountRightHolderFilter", Terrasoft.createColumnInFilterWithParameters("[RightHolder:Account:Id].Property", [this.get("Property").value]));
                            filterGroup.add("RightHolderRoleFilter", Terrasoft.createColumnInFilterWithParameters("[RightHolder:Account:Id].RoleRightHolder", ["51F37317-5261-4B86-9353-67CFBD039CD0".toLowerCase()]));
                        }
                        return filterGroup;
                    /*return Terrasoft.CreateColumnInFilterWithParameters(this.Terrasoft.ComparisonType.EQUAL,
                        "[RightHolder:Account:Id].Property", this.get("Property").value);*/}
                }
            }
        },
