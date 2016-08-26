define("UsrQuestionsPageV2", [],
	function() {
		return {
			entitySchemaName: "UsrQuestions",
			messages: {},
			attributes: {},
			details: /**SCHEMA_DETAILS*/{}/**SCHEMA_DETAILS*/,
			
			mixins: {},
			methods: {},
			diff: /**SCHEMA_DIFF*/[
	{
		"operation": "insert",
		"name": "UsrQuestion",
		"values": {
			"layout": {
				"column": 0,
				"row": 0,
				"colSpan": 24,
				"rowSpan": 1
			},
			"bindTo": "UsrQuestion",
			"caption": {
				"bindTo": "Resources.Strings.UsrQuestionCaption"
			},
			"enabled": true,
			"textSize": "Default",
			"contentType": 0,
			"labelConfig": {
				"visible": true
			}
		},
		"parentName": "Header",
		"propertyName": "items",
		"index": 0
	},
		{
		"operation": "insert",
		"name": "UsrAnswer",
		"values": {
			"layout": {
				"column": 0,
				"row": 2,
				"colSpan": 24,
				"rowSpan": 1
			},
			"bindTo": "UsrAnswer",
			"caption": {
				"bindTo": "Resources.Strings.UsrAnswerCaption"
			},
			"enabled": true,
			"textSize": "Default",
			"contentType": 0,
			"labelConfig": {
				"visible": true
			}
		},
		"parentName": "Header",
		"propertyName": "items",
		"index": 0
	},
	{
		"operation": "remove",
		"name": "ESNTab"
	},
	{
		"operation": "remove",
		"name": "ESNFeedContainer"
	},
	{
		"operation": "remove",
		"name": "ESNFeed"
	}
]/**SCHEMA_DIFF*/
	};
});