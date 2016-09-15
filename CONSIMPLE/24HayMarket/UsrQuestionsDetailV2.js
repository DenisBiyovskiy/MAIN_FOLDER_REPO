define("UsrQuestionsDetailV2", [], function() {
	return {
		entitySchemaName: "UsrQuestions",
		attributes: {
			"isPortalUser": {
				"dataValueType": Terrasoft.DataValueType.BOOLEAN,
				"value":  false
			}
		},
		methods: {
			getEditRecordButtonEnabled: function() {
				if (this.getDetailInfo().cardPageName === "UsrPortfolioPageV2" || this.getDetailInfo().cardPageName === "UsrInvestmentOppPageV2") {
					this.set("isPortalUser", true);
					return false;
				}
				var selectedItems = this.getSelectedItems();
				return selectedItems && (selectedItems.length === 1);
			},

			openDocument: function() {
				var editPageUId = "6b7dc5b1-c7f7-4d64-b99b-a37a59bb21cd";
				var config = this.getSelectedItems();
				var id = config[0];
				this.openCard("edit", editPageUId, id);
			},
			getCopyRecordMenuEnabled: function() {
				if (this.getDetailInfo().cardPageName === "UsrPortfolioPageV2" || this.getDetailInfo().cardPageName === "UsrInvestmentOppPageV2") {
					return false;
				}
				var selectedItems = this.getSelectedItems();
				return selectedItems && (selectedItems.length === 1);
			}
		},
		diff: /**SCHEMA_DIFF*/[
			{
				"operation": "merge",
				"name": "AddRecordButton",
				"values": {"visible": true}
			},
			{
				"operation": "insert",
				"name": "OpenDocumentButton",
				"parentName": "Detail",
				"propertyName": "tools",
				"values": {
					"itemType": Terrasoft.ViewItemType.BUTTON,
					"click": {"bindTo": "openDocument"},
					"visible": {"bindTo": "isPortalUser"},
					"enabled": {"bindTo": "isPortalUser"},
					"caption": "Open"
				},
				"index": 0
			}
		]/**SCHEMA_DIFF*/
	};
});
