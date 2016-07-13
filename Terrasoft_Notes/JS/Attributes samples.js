Attributes samples

attributes: {
    //Denis
    /*Поле Потенциал должно рассчитываться автоматически при изменении значения поля Вероятность или Сумма продажи.
      Расчет  путем умножения Суммы продажи на Вероятность*/
        "UsrPotential":{
            dependencies:[
                {
                    columns:["Probability", "Amount"],
                    methodName:"updateUsrPotential"
                }
            ]
        },
        "Probability":{
            dependencies:[
                {
                    columns: ["Probability"],
                    methodName: "UsrProbabilityValidator"
                },
                {
                    columns:["Stage"],
                    methodName:"onStageChange"
                }
            ]
        }
    //Denis/
    }

    ///////////////////////////////////////////in dzodzulia
    attributes: {
            "Specification": {//фильтрация поля "наша компания" по "объект недвижимости".
                dataValueType: Terrasoft.DataValueType.LOOKUP,
                lookupListConfig: {filter: function() {
                    if(this.get("Lead")){
                        return Terrasoft.createColumnInFilterWithParameters("UseInLead",
                         [1]);
                    }
                    if(this.get("Opportunity")){
                        return Terrasoft.createColumnInFilterWithParameters("UseInOpportunity",
                         [1]);
                    }
                    /*return Terrasoft.CreateColumnInFilterWithParameters(this.Terrasoft.ComparisonType.EQUAL,
                        "[RightHolder:Account:Id].Property", this.get("Property").value);*/}
                }
            }
        }
