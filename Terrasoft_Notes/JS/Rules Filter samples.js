Rules Filter samples

rules: {
        "UsrTransportModel": {
                "FiltrationModelByTradeMark": {
                    ruleType: BusinessRuleModule.enums.RuleType.FILTRATION,
                    autocomplete: true,
                    autoClean: true,
                    baseAttributePatch: "UsrTransportTradeMark", // поле в оъекте
                    comparisonType: Terrasoft.ComparisonType.EQUAL,
                    type: BusinessRuleModule.enums.ValueType.ATTRIBUTE,
                    attribute: "UsrTransportTradeMark" // поле на карточке
                }
            },
            "UsrTransportCategory": {
                "FiltrationCategoryByType": {
                    ruleType: BusinessRuleModule.enums.RuleType.FILTRATION,
                    autocomplete: true,
                    autoClean: true,
                    baseAttributePatch: "UsrTransportType", // поле в оъекте
                    comparisonType: Terrasoft.ComparisonType.EQUAL,
                    type: BusinessRuleModule.enums.ValueType.ATTRIBUTE,
                    attribute: "UsrTransportType" // поле на карточке
                }
            }
        },

////////////////////////////////КОСТЫЛЬ удаление базовой фильтрации поля "наша компания" по меридиану.
  rules: {
   "OurCompany": {
    "FiltrationByType": {
     "ruleType": BusinessRuleModule.enums.RuleType.FILTRATION,
     "autocomplete": false,
     "baseAttributePatch": "Type",
     "comparisonType": this.Terrasoft.ComparisonType.IS_NOT_NULL
     //"type": BusinessRuleModule.enums.ValueType.CONSTANT,
     //"value": ConfigurationConstants.AccountType.OurCompany
    }
   }
  },
