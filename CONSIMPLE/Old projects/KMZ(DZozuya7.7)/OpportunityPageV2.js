define('OpportunityPageV2', ['OpportunityPageV2Resources', 'GeneralDetails'],
function(resources, GeneralDetails) {
	return {
		entitySchemaName: 'Opportunity',
		details: /**SCHEMA_DETAILS*/{
	"Activities": {
		"schemaName": "ActivityDetailV2",
		"filter": {
			"masterColumn": "Id",
			"detailColumn": "Opportunity"
		},
		"defaultValues": {
			"Account": {
				"masterColumn": "Account"
			},
			"Contact": {
				"masterColumn": "Contact"
			}
		}
	},
	"StageInOpportunity": {
		"schemaName": "StageInOpportunityDetailV2",
		"filter": {
			"masterColumn": "Id",
			"detailColumn": "Opportunity"
		}
	},
	"OpportunityProduct": {
		"schemaName": "OpportunityProductDetailV2",
		"filter": {
			"masterColumn": "Id",
			"detailColumn": "Opportunity"
		}
	},
	"OpportunityCompetitor": {
		"schemaName": "OpportunityCompetitorDetailV2",
		"filter": {
			"masterColumn": "Id",
			"detailColumn": "Opportunity"
		}
	},
	"Files": {
		"schemaName": "FileDetailV2",
		"entitySchemaName": "OpportunityFile",
		"filter": {
			"masterColumn": "Id",
			"detailColumn": "Opportunity"
		}
	},
	"ContactsAccount": {
		"schemaName": "AccountContactsDetailV2",
		"defaultValues": {
			"Account": {
				"masterColumn": "Account"
			}
		},
		"filterMethod": "contactAccountFilter"
	},
	"OpportunityAccount": {
		"schemaName": "OpportunityDetailV2",
		"filter": {
			"masterColumn": "Account",
			"detailColumn": "Account"
		},
		"filterMethod": "opportunityAccountFilter",
		"captionName": "AccountOpportunitiesCaption"
	},
	"OpportunityContact": {
		"schemaName": "OpportunityContactDetailV2",
		"filter": {
			"masterColumn": "Id",
			"detailColumn": "Opportunity"
		}
	},
	"OpportunityTacticHistory": {
		"schemaName": "OpportunityTacticHistoryDetailV2",
		"filter": {
			"masterColumn": "Id",
			"detailColumn": "Opportunity"
		}
	},
	"ActivitiesAccount": {
		"schemaName": "ActivityDetailV2",
		"filter": {
			"masterColumn": "Account",
			"detailColumn": "Account"
		},
		"captionName": "AccountActivitiesCaption",
		"filterMethod": "contactAccountFilter"
	},
	"FilesAccount": {
		"schemaName": "FileDetailV2",
		"entitySchemaName": "AccountFile",
		"filter": {
			"masterColumn": "Account",
			"detailColumn": "Account"
		},
		"captionName": "AccountFilesCaption",
		"filterMethod": "contactAccountFilter"
	},
	"UsrEquipInOpportunity": {
		"schemaName": "Schema2Detail",
		"entitySchemaName": "UsrEquipInOpportunity",
		"filter": {
			"detailColumn": "UsrOpportunity",
			"masterColumn": "Id"
		}
	},
	"SpecificationInLeadca28f6a77cfd": {
		"schemaName": "LeadSpecificationDetailV2",
		"entitySchemaName": "SpecificationInLead",
		"filter": {
			"detailColumn": "Id",
			"masterColumn": "Id"
		}
	}
}/**SCHEMA_DETAILS*/,
		diff: /**SCHEMA_DIFF*/[
	{
		"operation": "merge",
		"name": "LeadType",
		"values": {
			"contentType": 5,
			"enabled": true
		}
	},
	{
		"operation": "insert",
		"name": "UsrEquipInOpportunity",
		"values": {
			"itemType": 2
		},
		"parentName": "GeneralInfoTab",
		"propertyName": "items",
		"index": 2
	},
	{
		"operation": "insert",
		"name": "SpecificationInLeadca28f6a77cfd",
		"values": {
			"itemType": 2
		},
		"parentName": "GeneralInfoTab",
		"propertyName": "items",
		"index": 4
	},
	{
		"operation": "remove",
		"name": "group3"
	},
	{
		"operation": "remove",
		"name": "group3_gridLayout"
	},
	{
		"operation": "remove",
		"name": "Burner"
	},
	{
		"operation": "remove",
		"name": "UsrStorage"
	},
	{
		"operation": "remove",
		"name": "UsrHeatSource"
	},
	{
		"operation": "remove",
		"name": "SteamCons"
	},
	{
		"operation": "remove",
		"name": "UsrDrying"
	},
	{
		"operation": "remove",
		"name": "HeatExchanger"
	}
]/**SCHEMA_DIFF*/,
		attributes: {},
		methods: {},
		rules: {},
		userCode: {}
	};
});
