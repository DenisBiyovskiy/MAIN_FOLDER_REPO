define("AccountSectionV2", ["RightUtilities", "ConfigurationConstants"],
	function(RightUtilities, ConfigurationConstants) {
	return {
		entitySchemaName: "Account",
		attributes: {},
		contextHelpId: "1001",
		messages: {},
		methods: {
			getFilters: function() {
				var filters = this.callParent(arguments);
				filters.add("InvestmentPrincipalFilter", this.Terrasoft.createColumnFilterWithParameter(
					this.Terrasoft.ComparisonType.NOT_EQUAL, "UsrStage", "C9013283-40A6-4C88-8D07-5F229FCEE0DD"));
			return filters;
		},
		diff: /**SCHEMA_DIFF*/[]/**SCHEMA_DIFF*/
	};
});
