define("UsrInvestmentPageV2", ["css!UsrCommitedMessageCSS"],
	function() {
		return {
			entitySchemaName: "UsrInvestment",
			messages: {},
			attributes: {
				"isVisibleMinAndMax": {
					"dataValueType": Terrasoft.DataValueType.BOOLEAN,
					"value":  false
				},
				"isEnabled": {
					"dataValueType": Terrasoft.DataValueType.BOOLEAN,
					"value":  true
				},
				"isEnabledConfirm": {
					"dataValueType": Terrasoft.DataValueType.BOOLEAN,
					"value":  true
				},
				"mustShowMessage": {
					"dataValueType": Terrasoft.DataValueType.BOOLEAN,
					"value":  false
				},
				"UsrOptIn": {
					dependencies: [
						{
							columns: ["UsrOptIn"],
							methodName: "setOptOut"
						}
					]
				},
				"UsrOptOut": {
					dependencies: [
						{
							columns: ["UsrOptOut"],
							methodName: "setOptIn"
						}
					]
				},
				"UsrConfirmed": {
					dependencies: [
						{
							columns: ["UsrConfirmed"],
							methodName: "setEnabled"
						}
					]
				},
				"UsrInvestorName": {
					dataValueType: Terrasoft.DataValueType.LOOKUP,
					lookupListConfig: {
						filter: function(){
							return Terrasoft.createColumnInFilterWithParameters("Type", 
							["00783ef6-f36b-1410-a883-16d83cab0980",
							"60733efc-f36b-1410-a883-16d83cab0980"]);
						}
					}
				},
				"IsPortalUser": {
					"dataValueType": Terrasoft.DataValueType.BOOLEAN,
					"value":  false
				}
			},
			details: /**SCHEMA_DETAILS*/{}/**SCHEMA_DETAILS*/,
			
			mixins: {},
			methods: {
				setValidationConfig: function () {
					this.callParent(arguments);
					this.addColumnValidator("UsrMax", this.validateMinMaxFormat);
					this.addColumnValidator("UsrMin", this.validateMinMaxFormat);
				},
				validateMinMaxFormat: function () {
					var invalidMessage = "";
					var min = this.get("UsrMin");
					var max = this.get("UsrMax");
					if (max < min) {
						invalidMessage = "Value of field 'Max' can't be less then 'Min'";
					}
					return {
						fullInvalidMessage: invalidMessage,
						invalidMessage: invalidMessage
					};
				},
				setOptIn: function () {
					if (this.get("UsrOptOut")) {
						this.set("UsrOptIn", !this.get("UsrOptOut"));
						this.set("isVisibleMinAndMax", !this.get("UsrOptOut"));
						this.set("UsrMin", 0);
						this.set("UsrMax", 0);
						this.set("UsrComittedAmount", 0);
					} else {
						this.set("isVisibleMinAndMax", this.get("UsrOptOut"));
					}
				},
				setOptOut: function () {
					if (this.get("UsrOptIn")) {
						this.set("UsrOptOut", !this.get("UsrOptIn"));
						this.set("isVisibleMinAndMax", this.get("UsrOptIn"));
					} else {
						this.set("isVisibleMinAndMax", this.get("UsrOptIn"));
						this.set("UsrMin", 0);
						this.set("UsrMax", 0);
						this.set("UsrComittedAmount", 0);
					}
				},
				setEnabled: function () {
					this.set("isEnabled", !this.get("UsrConfirmed"));
					this.set("mustShowMessage", this.get("UsrConfirmed"));
					if (this.get("IsPortalUser")) 
						this.set("isEnabledConfirm", this.get("isEnabled"));
				},
				onEntityInitialized: function() {
					this.callParent(arguments);
					this.set("isEnabled", !this.get("UsrConfirmed"));
					this.set("isVisibleMinAndMax", this.get("UsrOptIn"));
					var esq = Ext.create("Terrasoft.EntitySchemaQuery", {
						"rootSchemaName": "SysAdminUnit"
					});
					esq.addColumn("Id");
					esq.filters.addItem(Terrasoft.createColumnFilterWithParameter(
						Terrasoft.ComparisonType.EQUAL, "Id", Terrasoft.SysValue.CURRENT_USER.value));
					esq.filters.addItem(Terrasoft.createColumnFilterWithParameter(
						Terrasoft.ComparisonType.EQUAL, "[SysAdminUnitInRole:SysAdminUnit:Id].SysAdminUnitRoleId",
						"720B771C-E7A7-4F31-9CFB-52CD21C3739F"));
					esq.getEntityCollection(function(result) {
						var isAdmin = result.success && (result.collection.getCount() === 1);
						this.set("IsPortalUser", isAdmin);
						if (isAdmin) {
							if (this.get("UsrConfirmed")) {
								this.set("isEnabledConfirm", false);
							}
						} 
					}, this);
				},
				save: function () {
					if (this.get("IsPortalUser")) {
						if (this.isNewMode()) {
							if (this.get("UsrConfirmed")) {
								this.showConfirmationDialog("I hereby:\n1. irrevocably instruct 24 Haymarket Limited (\"24Haymarket\"), acting by itself or through any of its directors from time to time in accordance with a power of attorney granted by me in their favour, to invest an amount up to the sum set out below, on my behalf, in (\"" + this.get("UsrAccount").displayValue + "\");\n2. undertake to transfer those funds within a period of 5 business days to the account details as provided by 24Haymarket; and\n3. irrevocably undertake that the transfer of the funds by me shall constitute a direct instruction to 24Haymarket or in the alternate the law firm collecting the funds to execute the transaction by transferring the funds to the investee company upon 24Haymarket confirming the conditions to completion have been satisfied or waived.\n\nIn the event that due to the requirement to round any share entitlements a sum not greater than £20.00 is left in the account, I authorise 24Haymarket to instruct a transfer of that sum to a registered charity of their choice.\n\nCommitment Amount: £" + this.get("UsrComittedAmount") + "\nI accept the above conditions",
									function(returnCode) {
										if (returnCode === "yes") {
											var insert = Ext.create("Terrasoft.InsertQuery", {
												rootSchemaName: "UsrInvestment"
											});
											insert.setParameterValue("CreatedBy", Terrasoft.SysValue.CURRENT_USER_CONTACT.value, Terrasoft.DataValueType.GUID);
											insert.setParameterValue("UsrInvestorName", this.get("UsrInvestorName") ? this.get("UsrInvestorName").value : null, Terrasoft.DataValueType.GUID);
											insert.setParameterValue("UsrOptIn", this.get("UsrOptIn"), Terrasoft.DataValueType.BOOLEAN);
											insert.setParameterValue("UsrOptOut", this.get("UsrOptOut"), Terrasoft.DataValueType.BOOLEAN);
											insert.setParameterValue("UsrConfirmed", this.get("UsrConfirmed"), Terrasoft.DataValueType.BOOLEAN);
											insert.setParameterValue("UsrCertificateByPost", this.get("UsrCertificateByPost"), Terrasoft.DataValueType.BOOLEAN);
											insert.setParameterValue("UsrAccount", this.get("UsrAccount").value, Terrasoft.DataValueType.GUID);
											insert.setParameterValue("UsrComments", this.get("UsrComments"), Terrasoft.DataValueType.TEXT);
											insert.setParameterValue("UsrMin", this.get("UsrMin"), Terrasoft.DataValueType.INTEGER);
											insert.setParameterValue("UsrMax", this.get("UsrMax"), Terrasoft.DataValueType.INTEGER);
											insert.setParameterValue("UsrComittedAmount", this.get("UsrComittedAmount"), Terrasoft.DataValueType.INTEGER);
											insert.execute(function (result) {	
												if (result.success) {
													this.onCloseCardButtonClick();
												}							
											}, this);
										} else {
											return;
										}
									},
									[{
										className: "Terrasoft.Button",
										returnCode: "yes",
										style: "blue",
										caption: "ACCEPT",
										markerValue: "ACCEPT"
									}, {
										className: "Terrasoft.Button",
										returnCode: "no",
										style: Terrasoft.controls.ButtonEnums.style.GREY,
										caption: "I DO NOT ACCEPT",
										markerValue: "I DO NOT ACCEPT"
									}], null);
								return;
							} else {
								var insert = Ext.create("Terrasoft.InsertQuery", {
									rootSchemaName: "UsrInvestment"
								});
								insert.setParameterValue("CreatedBy", Terrasoft.SysValue.CURRENT_USER_CONTACT.value, Terrasoft.DataValueType.GUID);
								insert.setParameterValue("UsrInvestorName", this.get("UsrInvestorName") ? this.get("UsrInvestorName").value : null, Terrasoft.DataValueType.GUID);
								insert.setParameterValue("UsrOptIn", this.get("UsrOptIn"), Terrasoft.DataValueType.BOOLEAN);
								insert.setParameterValue("UsrOptOut", this.get("UsrOptOut"), Terrasoft.DataValueType.BOOLEAN);
								insert.setParameterValue("UsrConfirmed", this.get("UsrConfirmed"), Terrasoft.DataValueType.BOOLEAN);
								insert.setParameterValue("UsrCertificateByPost", this.get("UsrCertificateByPost"), Terrasoft.DataValueType.BOOLEAN);
								insert.setParameterValue("UsrAccount", this.get("UsrAccount").value, Terrasoft.DataValueType.GUID);
								insert.setParameterValue("UsrComments", this.get("UsrComments"), Terrasoft.DataValueType.TEXT);
								insert.setParameterValue("UsrMin", this.get("UsrMin"), Terrasoft.DataValueType.INTEGER);
								insert.setParameterValue("UsrMax", this.get("UsrMax"), Terrasoft.DataValueType.INTEGER);
								insert.setParameterValue("UsrComittedAmount", this.get("UsrComittedAmount"), Terrasoft.DataValueType.INTEGER);
								insert.execute(function (result) {	
									if (result.success) {
										this.onCloseCardButtonClick();
									}							
								}, this);
							}
						} else if (this.isEditMode()) {
							if (this.get("mustShowMessage")) {
								this.showConfirmationDialog("I hereby:\n1. irrevocably instruct 24 Haymarket Limited (\"24Haymarket\"), acting by itself or through any of its directors from time to time in accordance with a power of attorney granted by me in their favour, to invest an amount up to the sum set out below, on my behalf, in (\"" + this.get("UsrAccount").displayValue + "\");\n2. undertake to transfer those funds within a period of 5 business days to the account details as provided by 24Haymarket; and\n3. irrevocably undertake that the transfer of the funds by me shall constitute a direct instruction to 24Haymarket or in the alternate the law firm collecting the funds to execute the transaction by transferring the funds to the investee company upon 24Haymarket confirming the conditions to completion have been satisfied or waived.\n\nIn the event that due to the requirement to round any share entitlements a sum not greater than £20.00 is left in the account, I authorise 24Haymarket to instruct a transfer of that sum to a registered charity of their choice.\n\nCommitment Amount: £" + this.get("UsrComittedAmount") + "\nI accept the above conditions",
									function(returnCode) {
										if (returnCode === "no") {
											return;
										} else {
											var update = Ext.create("Terrasoft.UpdateQuery", {
												rootSchemaName: "UsrInvestment"
											});
											update.setParameterValue("UsrInvestorName", this.get("UsrInvestorName") ? this.get("UsrInvestorName").value : null, Terrasoft.DataValueType.GUID);
											update.setParameterValue("UsrOptIn", this.get("UsrOptIn"), Terrasoft.DataValueType.BOOLEAN);
											update.setParameterValue("UsrOptOut", this.get("UsrOptOut"), Terrasoft.DataValueType.BOOLEAN);
											update.setParameterValue("UsrConfirmed", this.get("UsrConfirmed"), Terrasoft.DataValueType.BOOLEAN);
											update.setParameterValue("UsrCertificateByPost", this.get("UsrCertificateByPost"), Terrasoft.DataValueType.BOOLEAN);
											update.setParameterValue("UsrAccount", this.get("UsrAccount").value, Terrasoft.DataValueType.GUID);
											update.setParameterValue("UsrComments", this.get("UsrComments"), Terrasoft.DataValueType.TEXT);
											update.setParameterValue("UsrMin", this.get("UsrMin"), Terrasoft.DataValueType.INTEGER);
											update.setParameterValue("UsrMax", this.get("UsrMax"), Terrasoft.DataValueType.INTEGER);
											update.setParameterValue("UsrComittedAmount", this.get("UsrComittedAmount"), Terrasoft.DataValueType.INTEGER);
											var filter = update.createColumnFilterWithParameter(Terrasoft.ComparisonType.EQUAL, "Id" , this.get("Id"));
											update.filters.add("FilterId", filter);
											update.execute(function(result) {
												if (result.success) {
													this.onCloseCardButtonClick();
												}
											}, this);
										}
									},
									[{
										className: "Terrasoft.Button",
										returnCode: "yes",
										style: "blue",
										caption: "ACCEPT",
										markerValue: "ACCEPT"
									}, {
										className: "Terrasoft.Button",
										returnCode: "no",
										style: Terrasoft.controls.ButtonEnums.style.GREY,
										caption: "I DO NOT ACCEPT",
										markerValue: "I DO NOT ACCEPT"
									}], null);
								return;
							} else {
								var update = Ext.create("Terrasoft.UpdateQuery", {
									rootSchemaName: "UsrInvestment"
								});
								update.setParameterValue("UsrInvestorName", this.get("UsrInvestorName") ? this.get("UsrInvestorName").value : null, Terrasoft.DataValueType.GUID);
								update.setParameterValue("UsrOptIn", this.get("UsrOptIn"), Terrasoft.DataValueType.BOOLEAN);
								update.setParameterValue("UsrOptOut", this.get("UsrOptOut"), Terrasoft.DataValueType.BOOLEAN);
								update.setParameterValue("UsrConfirmed", this.get("UsrConfirmed"), Terrasoft.DataValueType.BOOLEAN);
								update.setParameterValue("UsrCertificateByPost", this.get("UsrCertificateByPost"), Terrasoft.DataValueType.BOOLEAN);
								update.setParameterValue("UsrAccount", this.get("UsrAccount").value, Terrasoft.DataValueType.GUID);
								update.setParameterValue("UsrComments", this.get("UsrComments"), Terrasoft.DataValueType.TEXT);
								update.setParameterValue("UsrMin", this.get("UsrMin"), Terrasoft.DataValueType.INTEGER);
								update.setParameterValue("UsrMax", this.get("UsrMax"), Terrasoft.DataValueType.INTEGER);
								update.setParameterValue("UsrComittedAmount", this.get("UsrComittedAmount"), Terrasoft.DataValueType.INTEGER);
								var filter = update.createColumnFilterWithParameter(Terrasoft.ComparisonType.EQUAL, "Id" , this.get("Id"));
								update.filters.add("FilterId", filter);
								update.execute(function(result) {
									if (result.success) {
										this.onCloseCardButtonClick();
									}
								}, this);
							}
						}
					}
					this.callParent(arguments);
				}
			},
			diff: /**SCHEMA_DIFF*/[
	{
		"operation": "insert",
		"name": "UsrInvestorName",
		"values": {
			"layout": {
				"colSpan": 24,
				"rowSpan": 1,
				"column": 0,
				"row": 0,
				"layoutName": "Header"
			},
			"bindTo": "UsrInvestorName",
			"enabled": {
				"bindTo": "isEnabled"
			}, //false,
			"caption": {
				"bindTo": "Resources.Strings.UsrInvestorNameCaption"
			}
		},
		"parentName": "Header",
		"propertyName": "items",
		"index": 0
	},
	{
		"operation": "insert",
		"name": "UsrOptIn",
		"values": {
			"layout": {
				"colSpan": 12,
				"rowSpan": 1,
				"column": 0,
				"row": 1,
				"layoutName": "Header"
			},
			"bindTo": "UsrOptIn",
			"enabled": {
				"bindTo": "isEnabled"
			}
		},
		"parentName": "Header",
		"propertyName": "items",
		"index": 1
	},
	{
		"operation": "insert",
		"name": "UsrOptOut",
		"values": {
			"layout": {
				"colSpan": 12,
				"rowSpan": 1,
				"column": 0,
				"row": 2,
				"layoutName": "Header"
			},
			"bindTo": "UsrOptOut",
			"enabled": {
				"bindTo": "isEnabled"
			}
		},
		"parentName": "Header",
		"propertyName": "items",
		"index": 2
	},
	{
		"operation": "insert",
		"name": "UsrMin",
		"values": {
			"layout": {
				"colSpan": 12,
				"rowSpan": 1,
				"column": 12,
				"row": 1,
				"layoutName": "Header"
			},
			"bindTo": "UsrMin",
			"visible": {
				"bindTo": "isVisibleMinAndMax"
			},
			"enabled": {
				"bindTo": "isEnabled"
			}
		},
		"parentName": "Header",
		"propertyName": "items",
		"index": 3
	},
	{
		"operation": "insert",
		"name": "UsrMax",
		"values": {
			"layout": {
				"colSpan": 12,
				"rowSpan": 1,
				"column": 12,
				"row": 2,
				"layoutName": "Header"
			},
			"bindTo": "UsrMax",
			"visible": {
				"bindTo": "isVisibleMinAndMax"
			},
			"enabled": {
				"bindTo": "isEnabled"
			}
		},
		"parentName": "Header",
		"propertyName": "items",
		"index": 4
	},
	{
		"operation": "insert",
		"name": "UsrCertificateByPost",
		"values": {
			"layout": {
				"colSpan": 12,
				"rowSpan": 1,
				"column": 0,
				"row": 3,
				"layoutName": "Header"
			},
			"bindTo": "UsrCertificateByPost",
			"enabled": {
				"bindTo": "isEnabled"
			}
		},
		"parentName": "Header",
		"propertyName": "items",
		"index": 5
	},
	{
		"operation": "insert",
		"name": "UsrConfirmed",
		"values": {
			"layout": {
				"colSpan": 12,
				"rowSpan": 1,
				"column": 0,
				"row": 5,
				"layoutName": "Header"
			},
			"bindTo": "UsrConfirmed",
			"enabled": {"bindTo": "isEnabledConfirm"}
		},
		"parentName": "Header",
		"propertyName": "items",
		"index": 6
	},
	{
		"operation": "insert",
		"name": "UsrComments",
		"values": {
			"layout": {
				"colSpan": 24,
				"rowSpan": 1,
				"column": 0,
				"row": 4,
				"layoutName": "Header"
			},
			"bindTo": "UsrComments",
			"labelConfig": {},
			"enabled": true, /* {
				"bindTo":  {
				"bindTo": "isEnabled"
			},*/ 
			"contentType": 0
		},
		"parentName": "Header",
		"propertyName": "items",
		"index": 7
	},
	{
		"operation": "insert",
		"name": "UsrComittedAmount",
		"values": {
			"layout": {
				"colSpan": 12,
				"rowSpan": 1,
				"column": 12,
				"row": 3,
				"layoutName": "Header"
			},
			"bindTo": "UsrComittedAmount",
			"visible": {
				"bindTo": "isVisibleMinAndMax"
			},
			"enabled": {
				"bindTo": "isEnabled"
			}
		},
		"parentName": "Header",
		"propertyName": "items",
		"index": 8
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