define('LeadPageV2', ['LeadPageV2Resources', 'GeneralDetails'],
function(resources, GeneralDetails) {
	return {
		entitySchemaName: 'Lead',
		details: /**SCHEMA_DETAILS*/{
	"UsrEquipInOpportunity": {
		"schemaName": "Schema3Detail",
		"entitySchemaName": "UsrEquipInOpportunity",
		"filter": {
			"detailColumn": "UsrLead",
			"masterColumn": "Id"
		}
	}
}/**SCHEMA_DETAILS*/,
		diff: /**SCHEMA_DIFF*/[
	{
		"operation": "merge",
		"name": "LeadType",
		"values": {
			"layout": {
				"column": 0,
				"row": 0,
				"colSpan": 12,
				"rowSpan": 1
			}
		}
	},
	{
		"operation": "merge",
		"name": "CreatedOn",
		"values": {
			"layout": {
				"column": 0,
				"row": 2,
				"colSpan": 12,
				"rowSpan": 1
			}
		}
	},
	{
		"operation": "merge",
		"name": "QualifiedContact",
		"values": {
			"layout": {
				"column": 12,
				"row": 0,
				"colSpan": 10,
				"rowSpan": 1
			}
		}
	},
	{
		"operation": "merge",
		"name": "SimilarContactsButton",
		"values": {
			"layout": {
				"column": 22,
				"row": 0,
				"colSpan": 2,
				"rowSpan": 1
			}
		}
	},
	{
		"operation": "merge",
		"name": "QualifiedAccount",
		"values": {
			"layout": {
				"column": 12,
				"row": 1,
				"colSpan": 10,
				"rowSpan": 1
			}
		}
	},
	{
		"operation": "merge",
		"name": "SimilarAccountsButton",
		"values": {
			"layout": {
				"column": 22,
				"row": 1,
				"colSpan": 2,
				"rowSpan": 1
			}
		}
	},
	{
		"operation": "merge",
		"name": "QualifyStatus",
		"values": {
			"layout": {
				"column": 0,
				"row": 1,
				"colSpan": 12,
				"rowSpan": 1
			}
		}
	},
	{
		"operation": "merge",
		"name": "LeadDisqualifyReason",
		"values": {
			"layout": {
				"column": 12,
				"row": 2,
				"colSpan": 12,
				"rowSpan": 1
			}
		}
	},
	{
		"operation": "insert",
		"name": "LeadType5f8f01c41155",
		"values": {
			"layout": {
				"column": 0,
				"row": 3,
				"colSpan": 12,
				"rowSpan": 1
			},
			"bindTo": "LeadType",
			"caption": {
				"bindTo": "Resources.Strings.LeadTypeCaption"
			},
			"textSize": "Default",
			"contentType": 5,
			"labelConfig": {
				"visible": true
			},
			"enabled": true
		},
		"parentName": "Header",
		"propertyName": "items",
		"index": 9
	},
	{
		"operation": "insert",
		"name": "Ownere6524c58afbb",
		"values": {
			"layout": {
				"column": 12,
				"row": 3,
				"colSpan": 12,
				"rowSpan": 1
			},
			"bindTo": "Owner",
			"caption": {
				"bindTo": "Resources.Strings.OwnerCaption"
			},
			"enabled": true
		},
		"parentName": "Header",
		"propertyName": "items",
		"index": 10
	},
	{
		"operation": "insert",
		"name": "UsrEquipInOpportunity",
		"values": {
			"itemType": 2
		},
		"parentName": "GeneralInfoTab",
		"propertyName": "items",
		"index": 1
	}
]/**SCHEMA_DIFF*/,
		attributes: {},
		methods: {},
		rules: {},
		userCode: {}
	};
});
