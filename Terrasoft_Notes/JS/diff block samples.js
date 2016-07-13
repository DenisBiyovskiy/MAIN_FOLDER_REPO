diff block samples

     {
        "operation": "remove",
        "name": "group_gridLayout"
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
        "operation": "insert",
        "name": "UsrBank",
        "values": {
            "layout": {
                "column": 12,
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
        "parentName": "ContractConnectionsBlock",
        "propertyName": "items",
        "index": 3
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
