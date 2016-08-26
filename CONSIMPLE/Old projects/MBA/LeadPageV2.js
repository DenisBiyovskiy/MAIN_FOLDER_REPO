define("LeadPageV2", ["LeadPageV2Resources", "GeneralDetails"],
function(resources, GeneralDetails) {
	return {
		entitySchemaName: "Lead",
		details: /**SCHEMA_DETAILS*/{}/**SCHEMA_DETAILS*/,
		diff: /**SCHEMA_DIFF*/[
			{
				"operation": "merge",
				"name": "LeadMedium",
				"values": {
					"isRequired": { "bindTo": "isLeadAddedManually"}
				}
			},
			{
				"operation": "merge",
				"name": "LeadSource",
				"values": {
					"isRequired": { "bindTo": "isLeadAddedManually"}
				}
			}
		]/**SCHEMA_DIFF*/,
		attributes: {
			/*"LeadMedium": {
				//"isRequired": { "bindTo": "isLeadAddedManually"},
				dependencies: [
					{
						columns: ["RegisterMethod"],
						methodName: "isLeadAddedManually"
					}
				]
			},
			"LeadSource": {
				//"isRequired": { "bindTo": "isLeadAddedManually"}
				dependencies: [
					{
						columns: ["RegisterMethod"],
						methodName: "isLeadAddedManually"
					}
				]
			}*/
		},
		methods: {
			isLeadAddedManually: function() {
				if (this.get("RegisterMethod")) {
					var value = this.get("RegisterMethod").value;
					if (value === "240ab9c6-4d7c-4688-b380-af44dd147d7a" || // зар. вручную
						value === "d08186b2-b670-4fdf-9596-7654017f9255" || //входящий звонок
						value === "85275068-7b5b-424b-ac4d-f7050aee1eef" ||	//обращение
						value === "510a18f6-a031-420c-b5e5-76d9f2b964cc") { // рекоммендация
						return true;
					} else {
						return false;
					}
				} else {
					return false;
				}
			},
			save: function() {
				if (!this.isLeadAddedManually()) {
					this.callParent(arguments);
				} else {
					Terrasoft.utils.showMessage({
						caption: this.get("Resources.Strings.LeadSourceIsRequiredCaption"),
						buttons: ["cancel"],
						style: Terrasoft.MessageBoxStyles.BLUE
					});
				}
			}
		},
		rules: {},
		userCode: {}
	};
});
