define("UsrProfilePageV2", ["BaseFiltersGenerateModule", "BusinessRuleModule", "ContactPageV2Resources",
			"ConfigurationConstants", "ContactCareer", "DuplicatesSearchUtilitiesV2"],
	function(BaseFiltersGenerateModule, BusinessRuleModule, resources, ConfigurationConstants, ContactCareer) {
		return {
			entitySchemaName: "Contact",
			messages: {},
			attributes: {},
			rules: {},
			details: /**SCHEMA_DETAILS*/{}/**SCHEMA_DETAILS*/,
			methods: {},
			diff: /**SCHEMA_DIFF*/[
				{
					"operation": "remove",
					"name": "AccountProfile"
				},
				{
					"operation": "remove",
					"name": "CommunicationChannelsTab"
				},
				{
					"operation": "remove",
					"name": "AccountVsContactTab"
				},
				{
					"operation": "remove",
					"name": "ActionsDashboardModule",
				},
				{
					"operation": "remove",
					"name": "GeneralInfoTab"
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
				},
				{
					"operation": "remove",
					"name": "DirectorshipTab"
				},
				{
					"operation": "remove",
					"name": "Job"
				},
				{
					"operation": "remove",
					"name": "CompletenessContainer"
				},
				/*{
					"operation": "remove",
					"name": "ContactAddress"
				},*/
				{
					"operation": "remove",
					"name": "SalutationType"
				},
				{
					"operation": "remove",
					"name": "Gender"
				},
				{
					"operation": "remove",
					"name": "Type"
				},
				{
					"operation": "remove",
					"name": "Owner"
				},
				{
					"operation": "remove",
					"name": "GivenName"
				},
				{
					"operation": "remove",
					"name": "JobProfile"
				},
				{
					"operation": "remove",
					"name": "Surname"
				},
				{
					"operation": "remove",
					"name": "Dear"
				},
				//Den>
				{
					"operation": "remove",
					"name": "GeneralInfoTab"
				},
				{
					"operation": "remove",
					"name": "CommunicationChannelsTab"
				},
				{
					"operation": "remove",
					"name": "AccountVsContactTab"
				},
				{
					"operation": "remove",
					"name": "AccountProfile"
				}
				//Den<
			]/**SCHEMA_DIFF*/
		};
	});