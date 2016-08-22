define("LeadSectionV2", ["terrasoft"],
	function(Terrasoft) {
		return {
			entitySchemaName: "Lead",
			columns: {},
			messages: {
				"DistributeButtonChange": {
					mode: Terrasoft.MessageMode.PTP,
					direction: Terrasoft.MessageDirectionType.SUBSCRIBE
				}
			},
			attributes: {
				"SeparateDistributeButtonMenuItems": {
					dataValueType: Terrasoft.DataValueType.COLLECTION
				},
				"CombinedDistributeButtonMenuItems": {
					dataValueType: Terrasoft.DataValueType.COLLECTION
				},
				"isCombinedDistributeButtonVisible": {
					dataValueType: Terrasoft.DataValueType.BOOLEAN
				},
				//Den>
				"IsAppointVisitButtonVisible": {
					dataValueType: Terrasoft.DataValueType.BOOLEAN
				},
				"IsCreateEMKButtonVisible": {
					dataValueType: Terrasoft.DataValueType.BOOLEAN
				}
				//Den<
			},
			methods: {
				subscribeDistributeButtonChange() {
					this.sandbox.subscribe("DistributeButtonChange", function() {
						this.set("isCombinedDistributeButtonVisible", arguments[0] || arguments[3]);
						this.CombinedDistributeButtonVisible();
					}, this, [this.getCardModuleSandboxId()]);
				},
				
				onActiveRowChange: function() {
					this.callParent(arguments);
					this.SeparateDistributeButtonVisible();
					this.isAppointVisitAndCreateEMKButtonVisible();
				},

				SeparateDistributeButtonVisible: function() {
					if (this.getActiveRow()){
						if (this.isAnySelected()){
							if (this.getActiveRow().get("LeadType") && this.getActiveRow().get("QualifyStatus")){
								if (this.getActiveRow().get("LeadType").value == 'e12c4c83-97d3-42c7-b785-17b14179e879' && this.getActiveRow().get("QualifyStatus").value == '48088d99-9af1-4122-bdde-4218ca1d7b60'){
									return true;
								}
							}
						}
					}
					return false;
				},
				
				CombinedDistributeButtonVisible: function() {
					return this.get("isCombinedDistributeButtonVisible");
				},

				getDistributeButtonMenuItems: function() {
					var SeparateDistributeButtonMenuItems = this.Ext.create("Terrasoft.BaseViewModelCollection");
					SeparateDistributeButtonMenuItems.addItem(this.getButtonMenuItem({
						Caption: {"bindTo": "DistributeButtonCaption"},
						Type: "Terrasoft.MenuSeparator",
						Visible: true
					}));
					SeparateDistributeButtonMenuItems.addItem(this.getButtonMenuItem({
						"Caption": {"bindTo": "Resources.Strings.AppointVisitCaption"},
						"Click": {"bindTo": "SeparateAppointVisitClick"},
						"Visible": {"bindTo": "IsAppointVisitButtonVisible"}//Den
					}));
					SeparateDistributeButtonMenuItems.addItem(this.getButtonMenuItem({
						"Caption": {"bindTo": "Resources.Strings.NoNeedCaption"},
						"Click": {"bindTo": "SeparateNoNeedClick"},
						"Visible": true
					}));
					//Den>
					SeparateDistributeButtonMenuItems.addItem(this.getButtonMenuItem({
						"Caption": {"bindTo": "Resources.Strings.CreateEMKCaption"},
						"Click": {"bindTo": "createEMKButtonClick"},
						"Visible": {"bindTo": "IsCreateEMKButtonVisible"}
					}));
					//Den<
					this.set("SeparateDistributeButtonMenuItems", SeparateDistributeButtonMenuItems);
					
					
					var CombinedDistributeButtonMenuItems = this.Ext.create("Terrasoft.BaseViewModelCollection");
					CombinedDistributeButtonMenuItems.addItem(this.getButtonMenuItem({
						Caption: {"bindTo": "DistributeButtonCaption"},
						Type: "Terrasoft.MenuSeparator",
						Visible: true
					}));
					CombinedDistributeButtonMenuItems.addItem(this.getButtonMenuItem({
						"Caption": {"bindTo": "Resources.Strings.AppointVisitCaption"},
						"Click": {"bindTo": "CombinedAppointVisitClick"},
						"Visible": {"bindTo": "IsAppointVisitButtonVisible"}//Den
					}));
					CombinedDistributeButtonMenuItems.addItem(this.getButtonMenuItem({
						"Caption": {"bindTo": "Resources.Strings.NoNeedCaption"},
						"Click": {"bindTo": "CombinedNoNeedClick"},
						"Visible": true
					}));
					//Den>
					CombinedDistributeButtonMenuItems.addItem(this.getButtonMenuItem({
						"Caption": {"bindTo": "Resources.Strings.CreateEMKCaption"},
						"Click": {"bindTo": "createEMKButtonClick"},
						"Visible": {"bindTo": "IsCreateEMKButtonVisible"}
					}));
					//Den<
					this.set("CombinedDistributeButtonMenuItems", CombinedDistributeButtonMenuItems);



					return CombinedDistributeButtonMenuItems;
				},
				//Den>
				isAppointVisitAndCreateEMKButtonVisible: function() {
					var activeRow = this.getActiveRow();
					if (this.get("IsSeparateMode") && activeRow && activeRow.get("QualifiedContact")) {
						this.set("IsAppointVisitButtonVisible", true);
						this.set("IsCreateEMKButtonVisible", false);
					} else {
						this.set("IsAppointVisitButtonVisible", false);
						this.set("IsCreateEMKButtonVisible", true);
					}
				},
				onCardAction: function() {
					this.callParent(arguments);
					isAppointVisitAndCreateEMKButtonVisible();
				},
				//Den<
				
				SeparateAppointVisitClick: function() {
					var id = this.getActiveRow().get("Id");
					Terrasoft.chain(
						function(next) {
							var update = Ext.create("Terrasoft.UpdateQuery", {
								rootSchemaName: "Lead"
							});
							update.setParameterValue("QualifyStatus", "2f82e402-1dba-48a0-b4cb-fbe828a1c554", Terrasoft.DataValueType.GUID); 
							var filter = update.createColumnFilterWithParameter(Terrasoft.ComparisonType.EQUAL, "Id" , id);
							update.filters.add("FilterId", filter);
							update.execute(function(result) {
								if (result.success) {}//this.updateSection();
								next();
							});
							
						},
						function(next) {
							this.updateSection();
							this.sandbox.publish("OnCardAction", "reloadEntity", [this.getCardModuleSandboxId()]);
							console.log("Resources.Strings.AppointVisitCaption");
							next();
						},
						this);
				},
				SeparateNoNeedClick: function() {
					var id = this.getActiveRow().get("Id");
					Terrasoft.chain(
						function(next) {
							var update = Ext.create("Terrasoft.UpdateQuery", {
								rootSchemaName: "Lead"
							});
							update.setParameterValue("QualifyStatus", "51adc3ec-3503-4b10-a00b-8be3b0e11f08", Terrasoft.DataValueType.GUID); 
							var filter = update.createColumnFilterWithParameter(Terrasoft.ComparisonType.EQUAL, "Id" , id);
							update.filters.add("FilterId", filter);
							update.execute(function(result) {
								if (result.success) {}// this.updateSection();
								next();
							});
							
						},
						function(next) {
							this.updateSection();
							this.sandbox.publish("OnCardAction", "reloadEntity", [this.getCardModuleSandboxId()]);
							console.log("Resources.Strings.NoNeedCaption");
							next();
						},
						this);
				},
				
				
				
				
				
				CombinedAppointVisitClick: function() {
					
					this.sandbox.publish("OnCardAction", "appointVisitClick", [this.getCardModuleSandboxId()]);
					

				},
				CombinedNoNeedClick: function() {
					
					this.sandbox.publish("OnCardAction", "noNeedClick", [this.getCardModuleSandboxId()]);
				
				
				},
				
				
				init: function(){
					this.callParent(arguments);
					this.getDistributeButtonMenuItems();
					this.subscribeDistributeButtonChange();
					var historyState = this.sandbox.publish("GetHistoryState");
					var hash = historyState.hash;
					this.set("ActiveRow", hash.recordId);
				}




			},
			diff: /**SCHEMA_DIFF*/[
				
				//				SeparateModeActionButtonsCardLeftContainer
				{
					"operation": "insert",
					"name": "SeparateDistributeButton",
					"parentName": "SeparateModeActionButtonsLeftContainer",
					"propertyName": "items",
					"values": {
						"itemType": Terrasoft.ViewItemType.BUTTON,
						"caption": {"bindTo": "Resources.Strings.DistributeButtonCaption"},
						"classes": {
							"textClass": ["actions-button-margin-right"],
							"wrapperClass": ["actions-button-margin-right"]
						},
						"menu": {"items": {"bindTo": "SeparateDistributeButtonMenuItems"}},
						"visible": {"bindTo": "SeparateDistributeButtonVisible"}
					}
				},
				
				
				
				//				CombinedModeActionButtonsCardLeftContainer
				{
					"operation": "insert",
					"name": "CombinedDistributeButton",
					"parentName": "CombinedModeActionButtonsCardLeftContainer",
					"propertyName": "items",
					"values": {
						"itemType": Terrasoft.ViewItemType.BUTTON,
						"caption": {"bindTo": "Resources.Strings.DistributeButtonCaption"},
						"classes": {
							"textClass": ["actions-button-margin-right"],
							"wrapperClass": ["actions-button-margin-right"]
						},
						"menu": {"items": {"bindTo": "CombinedDistributeButtonMenuItems"}},
						"visible": {"bindTo": "CombinedDistributeButtonVisible"}
					}
				}
				

			]/**SCHEMA_DIFF*/
		};
	});