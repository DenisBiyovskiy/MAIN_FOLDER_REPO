define('ilayLeadTypeB2B', ['ilayLeadTypeB2BResources', 'GeneralDetails'],
function(resources, GeneralDetails) {
	return {
		entitySchemaName: 'Lead',
		details: /**SCHEMA_DETAILS*/{}/**SCHEMA_DETAILS*/,
		diff: /**SCHEMA_DIFF*/[
	{
		"operation": "merge",
		"name": "ilayLeadType8280cd624df2",
		"values": {
			"textSize": "Default",
			"contentType": 5,
			"labelConfig": {
				"visible": true
			}
		}
	},
	{
		"operation": "merge",
		"name": "LeadTypeStatus",
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
		"operation": "remove",
		"name": "ilayLeadState469850e2f1b0"
	},
	{
		"operation": "remove",
		"name": "ilayProblem1c040cbca972"
	},
	{
		"operation": "remove",
		"name": "ilayMedDirectionb1d46a3f81e0"
	},
	{
		"operation": "remove",
		"name": "ilayCategory9ace1de09dcf"
	},
	{
		"operation": "remove",
		"name": "ilayServListInLead"
	},
	{
		"operation": "remove",
		"name": "ilayInsurenceba159c5a06e0"
	},
	{
		"operation": "remove",
		"name": "ilayCourseba3ec690103e"
	},
	{
		"operation": "remove",
		"name": "group383589a5f0bd"
	},
	{
		"operation": "remove",
		"name": "group383589a5f0bd_gridLayout"
	},
	{
		"operation": "remove",
		"name": "ilayVisita28f32b12583"
	},
	{
		"operation": "remove",
		"name": "ilayDoctorf00b88b485a7"
	},
	{
		"operation": "remove",
		"name": "LeadPageV26Tab"
	},
	{
		"operation": "remove",
		"name": "group4e365091ed5d"
	},
	{
		"operation": "remove",
		"name": "group4e365091ed5d_gridLayout"
	},
	{
		"operation": "remove",
		"name": "ilayScript1a1a62343940"
	},
	{
		"operation": "remove",
		"name": "Activity02dbcb08146a"
	}
]/**SCHEMA_DIFF*/,
		attributes: {},
		methods: {},
		rules: {},
		userCode: {}
	};
});
