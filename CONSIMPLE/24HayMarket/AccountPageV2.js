define("AccountPageV2", ["AccountPageV2Resources", "BaseFiltersGenerateModule", "ConfigurationEnums", "ConfigurationConstants",
			"DuplicatesSearchUtilitiesV2"],
		function(resources, BaseFiltersGenerateModule, Enums, ConfigurationConstants) {
			return {
				entitySchemaName: "Account",
				messages: {},
				attributes: {
					"Owner": {
						dataValueType: Terrasoft.DataValueType.LOOKUP,
						lookupListConfig: {
							filter: function(){
								return Terrasoft.createColumnInFilterWithParameters("Type", 
								["00783ef6-f36b-1410-a883-16d83cab0980",
								"806732ee-f36b-1410-a883-16d83cab0980"]);
							}
						}
					}
				},
				details: /**SCHEMA_DETAILS*/{
	"UsrInvestment": {
		"schemaName": "UsrInvestmentDetailV2",
		"entitySchemaName": "UsrInvestment",
		"filter": {
			"detailColumn": "UsrAccount",
			"masterColumn": "Id"
		},
		"filterMethod": "portalUserFilterInvest",
		subscriber: function() {
			this.updateAmount();
		}
	},
	"AccountDocuments": {
		"schemaName": "UsrAccountDocumentDetailV2",
		"entitySchemaName": "UsrAccountDocument",
		"filter": {
			"detailColumn": "UsrAccount",
			"masterColumn": "Id"
		}
	},
	"UsrInvestorDocuments": {
		"schemaName": "UsrInvestorDocumentsDetailV2",
		"entitySchemaName": "UsrInvestorDocuments",
		"filter": {
			"detailColumn": "UsrAccount",
			"masterColumn": "Id"
		},
		"filterMethod": "portalUserFilterInvestDocs"
	},
	"UsrQuestions": {
		"schemaName": "UsrQuestionsDetailV2",
		"entitySchemaName": "UsrQuestions",
		"filter": {
			"detailColumn": "UsrAccount",
			"masterColumn": "Id"
		}
	},
	"UsrReporting": {
		"schemaName": "UsrReportingDetailV2",
		"entitySchemaName": "UsrReporting",
		"filter": {
			"detailColumn": "UsrAccount",
			"masterColumn": "Id"
		},
		"filterMethod": "portalUserFilterReport"
	},
	"UsrAccountVsContact": {
		"schemaName": "UsrAccountVsContactDetailV2",
		"entitySchemaName": "UsrAccountVsContact",
		"filter": {
			"detailColumn": "UsrAccount",
			"masterColumn": "Id"
		}
	}
}/**SCHEMA_DETAILS*/,
				
				mixins: {},
				methods: {
					portalUserFilterReport: function () {
						var filterGroup = new this.Terrasoft.createFilterGroup();
						filterGroup.add("accountFilter", this.Terrasoft.createColumnFilterWithParameter(
							this.Terrasoft.ComparisonType.EQUAL, "UsrAccount", this.get("Id")));
						return filterGroup;
					},
					portalUserFilterInvestDocs: function () {
						var filterGroup = new this.Terrasoft.createFilterGroup();
						filterGroup.add("accountFilter", this.Terrasoft.createColumnFilterWithParameter(
							this.Terrasoft.ComparisonType.EQUAL, "UsrAccount", this.get("Id")));
						return filterGroup;
					},
					portalUserFilterInvest: function () {
						var filterGroup = new this.Terrasoft.createFilterGroup();
						filterGroup.add("accountFilter", this.Terrasoft.createColumnFilterWithParameter(
							this.Terrasoft.ComparisonType.EQUAL, "UsrAccount", this.get("Id")));
						return filterGroup;
					},
					validateEmailFormat: function () {
						var invalidMessage = "";
						var isValid = true;
						var number = this.get("UsrEmailAdress");
						isValid = (Ext.isEmpty(number) || new RegExp("^[0-9a-z_.]+@[0-9a-z_]+\\.[a-z]+").test(number));
						if (!isValid) {
							invalidMessage = "Please enter correct E-mail";
						}
						return {
							fullInvalidMessage: invalidMessage,
							invalidMessage: invalidMessage
						};
					},
					setValidationConfig: function () {
						this.callParent(arguments);
						this.addColumnValidator("UsrEmailAdress", this.validateEmailFormat);
					},
					getAccountImage: function () {
						var imageColumnValue = this.get("UsrLogo");
						if (imageColumnValue) {
							return this.getSchemaImageUrl(imageColumnValue);
						}
						return this.getAccountDefaultImage();
					},
					getAccountDefaultImage: function () {
						return this.Terrasoft.ImageUrlBuilder.getUrl(this.get("Resources.Images.DefaultLogo"));
					},
					onPhotoChange: function (photo) {
						if (!photo) {
							this.set("UsrLogo", null);
							return;
						}
						this.Terrasoft.ImageApi.upload({
							file: photo,
							onComplete: this.onPhotoUploaded,
							onError: this.Terrasoft.emptyFn,
							scope: this
						});
					},
					onPhotoUploaded: function (imageId) {
						var imageData = {
							value: imageId,
							displayValue: "Image"
						};
						this.set("UsrLogo", imageData);
					},
					onSaved: function () {
						this.callParent(arguments);
						if (this.isAddMode() || this.isCopyMode()) {
							this.getIncrementCode(function(response) {
								this.set("Code", response);
							}, this);
						}
					},
					subscribeDetailEvents: function(detailConfig, detailName) {
					    this.callParent(arguments);
					    var detailId = this.getDetailId(detailName);
					    var detail = this.Terrasoft.deepClone(detailConfig);
					    var sandbox = this.sandbox;
					    sandbox.subscribe("DetailChanged", function(args) {
					        return this.onDetailChanged(detail, args);
					    }, this, [detailId]);
					},
					onDetailChanged: function(detail, args) {
					    var subscriber = detail.subscriber;
					    if (this.Ext.isFunction(subscriber)) {
					        subscriber.call(this, args);
					    } else if (this.Ext.isObject(subscriber)) {
					        var methodName = subscriber.methodName;
					        if (this.Ext.isFunction(this[methodName])) {
					            this[methodName](args);
					        }
					    }
					},
					updateAmount: function () {
						var entity = Ext.create("Terrasoft.EntitySchemaQuery", {
							rootSchemaName: "UsrInvestment"
						});
						entity.addColumn("Id");
						entity.addColumn("UsrConfirmed");
						entity.addColumn("UsrMin");
						entity.addColumn("UsrMax");
						entity.addColumn("UsrComittedAmount");
						entity.filters.addItem(entity.createColumnFilterWithParameter(
							this.Terrasoft.ComparisonType.EQUAL, "UsrAccount", this.get("Id")));
						entity.getEntityCollection(function(result) {
							if (result.success) {
								var amountIndicated = 0;
								var amountCommitted = 0;
								for (var i = 0; i < result.collection.getCount(); i++) {
									if (result.collection.getByIndex(i).get("UsrConfirmed")) {
										var usrComitted = result.collection.getByIndex(i).get("UsrComittedAmount");
										amountCommitted = amountCommitted + usrComitted;
									} else {
										var usrMin = result.collection.getByIndex(i).get("UsrMin");
										amountIndicated = amountIndicated + usrMin;
									}
								}
								this.set("UsrAmountCommitted", amountCommitted);
								this.set("UsrAmountIndicated", amountIndicated);
							}
						}, this);
					},
					init: function(){
						this.callParent(arguments);
						Terrasoft.configuration.EntityStructure.UsrInvestment = {entitySchemaName: "UsrInvestment", entitySchemaUId: "EBE54B74-62F9-47EA-AA09-4617FB874728", pages: [{Uid: "A00FCE2C-5A69-4520-8CD7-CCD5C33B5677", caption: "", captionLcz: "", cardSchema: "UsrInvestmentPageV2",typeColumnName: ""}]};
					},
					onSaved: function(response, config) {
						if ((config && config.isSilent) || this.get("PrimaryContactAdded") ||
								(!this.isAddMode() && Ext.isEmpty(this.get("PrimaryContact"))) ||
								(config && config.callParent === true)) {
							this.callParent(arguments);
							if (!this.get("IsInChain")) {
								this.updateDetail({detail: "Relationships"});
							} else {
								this.sandbox.publish("UpdateRelationshipDiagram", null, [this.sandbox.id]);
							}
						} else if (this.isAddMode() && Ext.isEmpty(this.get("PrimaryContact"))) {
							config = config || {};
							config.callParent = true;
							this.onSaved(response, config);
						} else {
							this.onUpdateContactAccount(function() {
								config = config || {};
								config.callParent = true;
								this.onSaved(response, config);
							}, this);
						}
					}
				},
				diff: /**SCHEMA_DIFF*/[
	{
		"operation": "insert",
		"name": "UsrAccountVsContact",
		"values": {
			"itemType": 2
		},
		"parentName": "AccountVsContactTab",
		"propertyName": "items",
		"index": 0
	},
	{
		"operation": "insert",
		"name": "AccountVsContactTab",
		"values": {
			"items": [],
			"caption": {
				"bindTo": "Resources.Strings.AccountVsContactTabCaption"
			}
		},
		"parentName": "Tabs",
		"propertyName": "tabs",
		"index": 3
	},
					{
						"operation": "move",
						"name": "Header",
						"parentName": "HeaderContainer",
						"propertyName": "items",
						index: 1
					},
					{
						"operation": "merge",
						"name": "HeaderContainer",
						"values": {
							"wrapClass": ["header-container-margin-bottom"]
						}
					},
	{
		"operation": "merge",
		"name": "Type",
		"values": {
			"layout": {
				"column": 0,
				"row": 1,
				"colSpan": 2,
				"rowSpan": 1
			}
		},
		"parentName": "HeaderContainer"
	},
	{
		"operation": "insert",
		"name": "UsrInvestmentBudget",
		"values": {
			"layout": {
				"column": 0,
				"row": 4,
				"colSpan": 2,
				"rowSpan": 1
			},
			"bindTo": "UsrInvestmentBudget",
			"caption": {
				"bindTo": "Resources.Strings.UsrInvestmentBudgetCaption"
			},
			"enabled": true
		},
		"parentName": "Header",
		"propertyName": "items",
		"index": 2
	},
	{
		"operation": "insert",
		"name": "UsrAmountIndicated",
		"values": {
			"layout": {
				"column": 4,
				"row": 4,
				"colSpan": 2,
				"rowSpan": 1
			},
			"bindTo": "UsrAmountIndicated",
			"caption": {
				"bindTo": "Resources.Strings.UsrAmountIndicatedCaption"
			},
			"enabled": false
		},
		"parentName": "Header",
		"propertyName": "items",
		"index": 3
	},
	{
		"operation": "insert",
		"name": "UsrAmountCommitted",
		"values": {
			"layout": {
				"column": 16,
				"row": 4,
				"colSpan": 8,
				"rowSpan": 1
			},
			"bindTo": "UsrAmountCommitted",
			"caption": {
				"bindTo": "Resources.Strings.UsrAmountCommittedCaption"
			},
			"enabled": false
		},
		"parentName": "Header",
		"propertyName": "items",
		"index": 4
	},
	{
		"operation": "insert",
		"name": "UsrKeySummary",
		"values": {
			"layout": {
				"column": 0,
				"row": 5,
				"colSpan": 24,
				"rowSpan": 1
			},
			"bindTo": "UsrKeySummary",
			"caption": {
				"bindTo": "Resources.Strings.UsrKeySummaryCaption"
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
		"index": 5
	},
	{
		"operation": "insert",
		"name": "PhotoContainer",
		"values": {
			"itemType": 7,
			"wrapClass": [
				"image-edit-container"
			],
			"layout": {
				"column": 0,
				"row": 0,
				"rowSpan": 4,
				"colSpan": 4
			},
			"items": []
		},
		"parentName": "Header",
		"propertyName": "items",
		"index": 6
	},
	{
		"operation": "insert",
		"name": "UsrLogo",
		"values": {
			"getSrcMethod": "getAccountImage",
			"onPhotoChange": "onPhotoChange",
			"readonly": false,
			"defaultImage": "https://24haymarket-test.bpmonline.com/0/img/source-code/4b177430ad9dfd06fb56c61bfd4f9b60/AccountPageV2/DefaultLogo",
			"generator": "ImageCustomGeneratorV2.generateCustomImageControl"
		},
		"parentName": "PhotoContainer",
		"propertyName": "items",
		"index": 0
	},
	{
		"operation": "insert",
		"name": "UsrStage",
		"values": {
			"layout": {
				"column": 14,
				"row": 1,
				"colSpan": 10,
				"rowSpan": 1
			},
			"bindTo": "UsrStage",
			"caption": {
				"bindTo": "Resources.Strings.UsrStageCaption"
			},
			"enabled": true,
			"textSize": "Default",
			"contentType": 3,
			"labelConfig": {
				"visible": true
			}
		},
		"parentName": "Header",
		"propertyName": "items",
		"index": 7
	},
	{
		"operation": "merge",
		"name": "Industry",
		"values": {
			"layout": {
				"column": 4,
				"row": 3,
				"colSpan": 10,
				"rowSpan": 1
			},
			"contentType": 3,
			"caption": {
				"bindTo": "Resources.Strings.IndustryCaption"
			},
			"enabled": true
		}
	},
	{
		"operation": "move",
		"name": "Industry",
		"parentName": "Header",
		"propertyName": "items",
		"index": 8
	},
	{
		"operation": "insert",
		"name": "UsrApplicationStatus",
		"values": {
			"layout": {
				"column": 14,
				"row": 2,
				"colSpan": 10,
				"rowSpan": 1
			},
			"bindTo": "UsrApplicationStatus",
			"caption": {
				"bindTo": "Resources.Strings.UsrApplicationStatusCaption"
			},
			"enabled": true,
			"textSize": "Default",
			"contentType": 3,
			"labelConfig": {
				"visible": true
			}
		},
		"parentName": "Header",
		"propertyName": "items",
		"index": 9
	},
	{
		"operation": "merge",
		"name": "AnnualRevenue",
		"values": {
			"layout": {
				"column": 14,
				"row": 3,
				"colSpan": 10,
				"rowSpan": 1
			},
			"contentType": 3,
			"caption": {
				"bindTo": "Resources.Strings.AnnualRevenueCaption"
			},
			"enabled": true
		}
	},
	{
		"operation": "move",
		"name": "AnnualRevenue",
		"parentName": "Header",
		"propertyName": "items",
		"index": 10
	},
	{
		"operation": "remove",
		"name": "AnnualRevenue",
		"properties": [
			"contentType"
		]
	},
	{
		"operation": "merge",
		"name": "Owner",
		"values": {
			"layout": {
				"column": 15,
				"row": 0,
				"colSpan": 9,
				"rowSpan": 1
			}
		}
	},
	{
		"operation": "merge",
		"name": "Name",
		"values": {
			"layout": {
				"column": 5,
				"row": 0,
				"colSpan": 9,
				"rowSpan": 1
			}
		}
	},
	{
		"operation": "move",
		"name": "Name",
		"parentName": "Header",
		"propertyName": "items",
		"index": 12
	},
	{
		"operation": "merge",
		"name": "AccountPageGeneralTabContainer",
		"values": {
			"caption": {
				"bindTo": "Resources.Strings.AccountPageGeneralTabContainerCaption"
			}
		}
	},
	{
		"operation": "move",
		"name": "AccountPageGeneralTabContainer",
		"parentName": "Tabs",
		"propertyName": "tabs",
		"index": 0
	},
	{
		"operation": "merge",
		"name": "Code",
		"values": {
			"visible": false
		}
	},
	{
		"operation": "insert",
		"name": "MainContactGroup",
		"values": {
			"itemType": 15,
			"caption": {
				"bindTo": "Resources.Strings.UsrMainContactGroupCaption"
			},
			"items": [],
			"controlConfig": {
				"collapsed": false
			}
		},
		"parentName": "AccountPageGeneralTabContainer",
		"propertyName": "items",
		"index": 1
	},
	{
		"operation": "insert",
		"name": "MainContactGroup_gridLayout",
		"values": {
			"itemType": 0,
			"items": []
		},
		"parentName": "MainContactGroup",
		"propertyName": "items",
		"index": 0
	},
	{
		"operation": "insert",
		"name": "UsrFullName",
		"values": {
			"layout": {
				"column": 0,
				"row": 0,
				"colSpan": 12,
				"rowSpan": 1
			},
			"bindTo": "UsrFullName",
			"caption": {
				"bindTo": "Resources.Strings.UsrFullNameCaption"
			},
			"textSize": "Default",
			"contentType": 1,
			"labelConfig": {
				"visible": true
			},
			"enabled": true
		},
		"parentName": "MainContactGroup_gridLayout",
		"propertyName": "items",
		"index": 0
	},
	{
		"operation": "insert",
		"name": "UsrWorkPhone",
		"values": {
			"layout": {
				"column": 0,
				"row": 1,
				"colSpan": 12,
				"rowSpan": 1
			},
			"bindTo": "UsrWorkPhone",
			"caption": {
				"bindTo": "Resources.Strings.UsrWorkPhoneCaption"
			},
			"textSize": "Default",
			"contentType": 1,
			"labelConfig": {
				"visible": true
			},
			"enabled": true
		},
		"parentName": "MainContactGroup_gridLayout",
		"propertyName": "items",
		"index": 1
	},
	{
		"operation": "insert",
		"name": "UsrMobile",
		"values": {
			"layout": {
				"column": 12,
				"row": 1,
				"colSpan": 12,
				"rowSpan": 1
			},
			"bindTo": "UsrMobile",
			"caption": {
				"bindTo": "Resources.Strings.UsrMobileCaption"
			},
			"textSize": "Default",
			"contentType": 1,
			"labelConfig": {
				"visible": true
			},
			"enabled": true
		},
		"parentName": "MainContactGroup_gridLayout",
		"propertyName": "items",
		"index": 2
	},
	{
		"operation": "insert",
		"name": "UsrEmailAdress",
		"values": {
			"layout": {
				"column": 12,
				"row": 0,
				"colSpan": 12,
				"rowSpan": 1
			},
			"bindTo": "UsrEmailAdress",
			"caption": {
				"bindTo": "Resources.Strings.UsrEmailAdressCaption"
			},
			"textSize": "Default",
			"contentType": 1,
			"labelConfig": {
				"visible": true
			},
			"enabled": true
		},
		"parentName": "MainContactGroup_gridLayout",
		"propertyName": "items",
		"index": 3
	},
	{
		"operation": "insert",
		"name": "InvestmentTab",
		"values": {
			"items": [],
			"caption": {
				"bindTo": "Resources.Strings.InvestmentTabCaption"
			}
		},
		"parentName": "Tabs",
		"propertyName": "tabs",
		"index": 1
	},
	{
		"operation": "insert",
		"name": "UsrInvestment",
		"values": {
			"itemType": 2
		},
		"parentName": "InvestmentTab",
		"propertyName": "items",
		"index": 0
	},
	{
		"operation": "insert",
		"name": "DocumentTab",
		"values": {
			"items": [],
			"caption": {
				"bindTo": "Resources.Strings.DocumentTabCaption"
			}
		},
		"parentName": "Tabs",
		"propertyName": "tabs",
		"index": 2
	},
	{
		"operation": "insert",
		"name": "AccountDocuments",
		"values": {
			"itemType": 2
		},
		"parentName": "DocumentTab",
		"propertyName": "items",
		"index": 0
	},
	{
		"operation": "insert",
		"name": "ReportingTab",
		"values": {
			"items": [],
			"caption": {
				"bindTo": "Resources.Strings.ReportingTabCaption"
			}
		},
		"parentName": "Tabs",
		"propertyName": "tabs",
		"index": 4
	},
	{
		"operation": "insert",
		"name": "UsrReporting",
		"values": {
			"itemType": 2
		},
		"parentName": "ReportingTab",
		"propertyName": "items",
		"index": 0
	},
	{
		"operation": "insert",
		"name": "InvestorDocumentsTab",
		"values": {
			"items": [],
			"caption": {
				"bindTo": "Resources.Strings.InvestorDocumentsTabCaption"
			}
		},
		"parentName": "Tabs",
		"propertyName": "tabs",
		"index": 5
	},
	{
		"operation": "insert",
		"name": "UsrInvestorDocuments",
		"values": {
			"itemType": 2
		},
		"parentName": "InvestorDocumentsTab",
		"propertyName": "items",
		"index": 0
	},
	{
		"operation": "insert",
		"name": "QuestionsTab",
		"values": {
			"items": [],
			"caption": {
				"bindTo": "Resources.Strings.ESNTabCaption"
			}
		},
		"parentName": "Tabs",
		"propertyName": "tabs",
		"index": 3
	},
	{
		"operation": "insert",
		"name": "UsrQuestions",
		"values": {
			"itemType": 2
		},
		"parentName": "QuestionsTab",
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
	},
	{
		"operation": "remove",
		"name": "PrimaryContact"
	},
	{
		"operation": "remove",
		"name": "CategoriesControlGroup"
	},
	{
		"operation": "remove",
		"name": "CategoriesControlGroupContainer"
	},
	{
		"operation": "remove",
		"name": "AccountCategory"
	},
	{
		"operation": "remove",
		"name": "EmployeesNumber"
	},
	{
		"operation": "remove",
		"name": "Ownership"
	},
	{
		"operation": "remove",
		"name": "AccountBillingInfo"
	},
	{
		"operation": "remove",
		"name": "AccountAnniversary"
	},
	{
		"operation": "remove",
		"name": "ContactsAndStructureTabContainer"
	},
	{
		"operation": "remove",
		"name": "AccountOrganizationChart"
	},
	{
		"operation": "remove",
		"name": "AccountContacts"
	},
	{
		"operation": "remove",
		"name": "RelationshipTabContainer"
	},
	{
		"operation": "remove",
		"name": "Relationships"
	},
	{
		"operation": "remove",
		"name": "HistoryTabContainer"
	},
	{
		"operation": "remove",
		"name": "Cases"
	},
	{
		"operation": "remove",
		"name": "Activities"
	},
	{
		"operation": "remove",
		"name": "Contract"
	},
	{
		"operation": "remove",
		"name": "Calls"
	},
	{
		"operation": "remove",
		"name": "EmailDetailV2"
	},
	{
		"operation": "remove",
		"name": "Leads"
	},
	{
		"operation": "remove",
		"name": "Invoice"
	},
	{
		"operation": "remove",
		"name": "Order"
	},
	{
		"operation": "remove",
		"name": "Documents"
	},
	{
		"operation": "remove",
		"name": "Project"
	},
	{
		"operation": "remove",
		"name": "Opportunities"
	},
	{
		"operation": "remove",
		"name": "NotesTabContainer"
	},
	{
		"operation": "remove",
		"name": "Files"
	},
	{
		"operation": "remove",
		"name": "NotesControlGroup"
	},
	{
		"operation": "remove",
		"name": "Notes"
	},
	{
		"operation": "move",
		"name": "CompletenessContainer",
		"parentName": "Header",
		"propertyName": "items",
		"index": 0
	}
]/**SCHEMA_DIFF*/
		};
	});