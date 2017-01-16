define('ilayLeadTypeB2C', ['ilayLeadTypeB2CResources', 'GeneralDetails', 'LeadConfigurationConst', 'ConfigurationEnums'],
function(resources, GeneralDetails, LeadConfigurationConst, enums) {
	return {
		entitySchemaName: 'Lead',
		details: /**SCHEMA_DETAILS*/{}/**SCHEMA_DETAILS*/,
		diff: /**SCHEMA_DIFF*/[
	{
		"operation": "merge",
		"name": "QualifiedContact",
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
		"operation": "move",
		"name": "QualifiedContact",
		"parentName": "Header",
		"propertyName": "items",
		"index": 0
	},
	{
		"operation": "insert",
		"name": "Contact6a2172a40ce7",
		"values": {
			"layout": {
				"column": 12,
				"row": 0,
				"colSpan": 12,
				"rowSpan": 1
			},
			"bindTo": "Contact",
			"caption": {
				"bindTo": "Resources.Strings.ContactCaption"
			},
			"textSize": "Default",
			"contentType": 1,
			"labelConfig": {
				"visible": true
			},
			"enabled": true,
			"controlConfig": {
				"enabled": {
					"bindTo": "IsContactenabled"
				}
			}
		},
		"parentName": "Header",
		"propertyName": "items",
		"index": 1
	},
	{
		"operation": "insert",
		"name": "MobilePhonefe26fa1b0369",
		"values": {
			"layout": {
				"column": 0,
				"row": 2,
				"colSpan": 11,
				"rowSpan": 1
			},
			"bindTo": "MobilePhone",
			"caption": {
				"bindTo": "Resources.Strings.MobilePhoneCaption"
			},
			"textSize": "Default",
			"contentType": 1,
			"labelConfig": {
				"visible": true
			},
			"enabled": true,
			"controlConfig": {
				"enabled": {
					"bindTo": "IsMobilePhoneenabled"
				}
			}
		},
		"parentName": "Header",
		"propertyName": "items",
		"index": 2
	},
	{
		"operation": "merge",
		"name": "ilayLeadType8280cd624df2",
		"values": {
			"layout": {
				"column": 12,
				"row": 1,
				"colSpan": 12,
				"rowSpan": 1
			},
			"textSize": "Default",
			"contentType": 5,
			"labelConfig": {
				"visible": true
			}
		}
	},
	{
		"operation": "move",
		"name": "ilayLeadType8280cd624df2",
		"parentName": "Header",
		"propertyName": "items",
		"index": 3
	},
	{
		"operation": "merge",
		"name": "LeadType",
		"values": {
			"layout": {
				"column": 12,
				"row": 2,
				"colSpan": 12,
				"rowSpan": 1
			},
			"caption": {
				"bindTo": "Resources.Strings.LeadTypeCaption"
			},
			"textSize": "Default",
			"labelConfig": {
				"visible": true
			},
			"enabled": true
		}
	},
	{
		"operation": "merge",
		"name": "QualifyStatus",
		"values": {
			"layout": {
				"column": 0,
				"row": 1,
				"colSpan": 12,
				"rowSpan": 1
			},
			"caption": {
				"bindTo": "Resources.Strings.QualifyStatusCaption"
			},
			"textSize": "Default",
			"contentType": 5,
			"labelConfig": {
				"visible": true
			}
		}
	},
	{
		"operation": "move",
		"name": "QualifyStatus",
		"parentName": "Header",
		"propertyName": "items",
		"index": 5
	},
	{
		"operation": "merge",
		"name": "CreatedOn",
		"values": {
			"layout": {
				"column": 12,
				"row": 3,
				"colSpan": 12,
				"rowSpan": 1
			},
			"caption": {
				"bindTo": "Resources.Strings.CreatedOnCaption"
			},
			"textSize": "Default",
			"labelConfig": {
				"visible": true
			}
		}
	},
	{
		"operation": "insert",
		"name": "Email502bd742b1a6",
		"values": {
			"layout": {
				"column": 0,
				"row": 3,
				"colSpan": 12,
				"rowSpan": 1
			},
			"bindTo": "Email",
			"caption": {
				"bindTo": "Resources.Strings.EmailCaption"
			},
			"enabled": true,
			"controlConfig": {
				"enabled": {
					"bindTo": "IsEmailenabled"
				}
			},
			"textSize": "Default",
			"contentType": 1,
			"labelConfig": {
				"visible": true
			}
		},
		"parentName": "Header",
		"propertyName": "items",
		"index": 7
	},
	{
		"operation": "insert",
		"name": "ilayEvent",
		"values": {
			"layout": {
				"column": 12,
				"row": 4,
				"colSpan": 12,
				"rowSpan": 1
			},
			"bindTo": "ilayEvent",
			"caption": {
				"bindTo": "Resources.Strings.EventCaption"
			},
			"textSize": 0,
			"contentType": 5,
			"labelConfig": {
				"visible": true
			},
			"enabled": true
		},
		"parentName": "LeadPageSourceInfoBlock",
		"propertyName": "items",
		"index": 1
	},
	{
		"operation": "merge",
		"name": "LeadPageSourceInfo",
		"values": {
			"caption": {
				"bindTo": "Resources.Strings.LeadPageSourceInfoCaption"
			}
		}
	},
	{
		"operation": "merge",
		"name": "LeadMedium",
		"values": {
			"caption": {
				"bindTo": "Resources.Strings.LeadMediumCaption"
			},
			"textSize": "Default",
			"contentType": 5,
			"labelConfig": {
				"visible": true
			},
			"enabled": true
		}
	},
	{
		"operation": "merge",
		"name": "LeadSource",
		"values": {
			"caption": {
				"bindTo": "Resources.Strings.LeadSourceCaption"
			},
			"textSize": "Default",
			"contentType": 5,
			"labelConfig": {
				"visible": true
			},
			"enabled": true
		}
	},
	{
		"operation": "merge",
		"name": "RegisterMethod",
		"values": {
			"caption": {
				"bindTo": "Resources.Strings.RegisterMethodCaption"
			},
			"textSize": "Default",
			"labelConfig": {
				"visible": true
			},
			"enabled": true
		}
	},
	{
		"operation": "merge",
		"name": "BpmRef",
		"values": {
			"caption": {
				"bindTo": "Resources.Strings.BpmRefCaption"
			},
			"textSize": "Default",
			"contentType": 1,
			"labelConfig": {
				"visible": true
			}
		}
	},
	{
		"operation": "merge",
		"name": "Campaign",
		"values": {
			"caption": {
				"bindTo": "Resources.Strings.CampaignCaption"
			},
			"textSize": "Default",
			"contentType": 5,
			"labelConfig": {
				"visible": true
			},
			"enabled": true
		}
	},
	{
		"operation": "merge",
		"name": "BulkEmail",
		"values": {
			"caption": {
				"bindTo": "Resources.Strings.BulkEmailCaption"
			},
			"textSize": "Default",
			"contentType": 5,
			"labelConfig": {
				"visible": true
			},
			"enabled": true
		}
	},
	{
		"operation": "insert",
		"name": "groupe675cde4b85b",
		"values": {
			"itemType": 15,
			"caption": {
				"bindTo": "Resources.Strings.groupe675cde4b85bCaption"
			},
			"items": [],
			"controlConfig": {
				"collapsed": false
			}
		},
		"parentName": "HistoryTab",
		"propertyName": "items",
		"index": 1
	},
	{
		"operation": "insert",
		"name": "groupe675cde4b85b_gridLayout",
		"values": {
			"itemType": 0,
			"items": []
		},
		"parentName": "groupe675cde4b85b",
		"propertyName": "items",
		"index": 0
	},
	{
		"operation": "insert",
		"name": "SalesOwner09870d218dee",
		"values": {
			"layout": {
				"column": 13,
				"row": 0,
				"colSpan": 11,
				"rowSpan": 1
			},
			"bindTo": "SalesOwner",
			"caption": {
				"bindTo": "Resources.Strings.SalesOwnerCaption"
			},
			"textSize": "Default",
			"contentType": 5,
			"labelConfig": {
				"visible": true
			},
			"enabled": false
		},
		"parentName": "groupe675cde4b85b_gridLayout",
		"propertyName": "items",
		"index": 0
	},
	{
		"operation": "insert",
		"name": "LeadDisqualifyReason7efc863cfbe0",
		"values": {
			"layout": {
				"column": 13,
				"row": 1,
				"colSpan": 11,
				"rowSpan": 1
			},
			"bindTo": "LeadDisqualifyReason",
			"caption": {
				"bindTo": "Resources.Strings.LeadDisqualifyReasonCaption"
			},
			"textSize": "Default",
			"contentType": 3,
			"labelConfig": {
				"visible": true
			},
			"enabled": false
		},
		"parentName": "groupe675cde4b85b_gridLayout",
		"propertyName": "items",
		"index": 1
	},
	{
		"operation": "insert",
		"name": "DecisionDate5fb51ee6f0b1",
		"values": {
			"layout": {
				"column": 0,
				"row": 0,
				"colSpan": 13,
				"rowSpan": 1
			},
			"bindTo": "DecisionDate",
			"caption": {
				"bindTo": "Resources.Strings.DecisionDateCaption"
			},
			"textSize": "Default",
			"labelConfig": {
				"visible": true
			},
			"enabled": false
		},
		"parentName": "groupe675cde4b85b_gridLayout",
		"propertyName": "items",
		"index": 2
	},
	{
		"operation": "insert",
		"name": "Commentary4d0458684160",
		"values": {
			"layout": {
				"column": 0,
				"row": 1,
				"colSpan": 13,
				"rowSpan": 2
			},
			"bindTo": "Commentary",
			"caption": {
				"bindTo": "Resources.Strings.CommentaryCaption"
			},
			"textSize": "Default",
			"contentType": 0,
			"labelConfig": {
				"visible": true
			},
			"enabled": true,
			"controlConfig": {
				"enabled": {
					"bindTo": "IsCommentaryenabled"
				}
			}
		},
		"parentName": "groupe675cde4b85b_gridLayout",
		"propertyName": "items",
		"index": 3
	},
	{
		"operation": "insert",
		"parentName": "LeadTypeBlock",
		"propertyName": "items",
		"name": "ilayTotalServCost",
		"values": {
			"layout": {"column": 12, "row": 0, "colSpan": 12, "rowSpan": 1},
			"visible": true,
			"enabled": false
		}
	},
	{
		"operation": "insert",
		"name": "IlayInterestActualizationDate776e51e1512d",
		"values": {
			"layout": {
				"column": 13,
				"row": 2,
				"colSpan": 11,
				"rowSpan": 1
			},
			"bindTo": "IlayInterestActualizationDate",
			"caption": {
				"bindTo": "Resources.Strings.IlayInterestActualizationDateCaption"
			},
			"textSize": 0,
			"labelConfig": {
				"visible": true
			},
			"enabled": true
		},
		"parentName": "groupe675cde4b85b_gridLayout",
		"propertyName": "items",
		"index": 4
	},
	{
		"operation": "remove",
		"name": "SimilarContactsButton"
	},
	{
		"operation": "remove",
		"name": "SimilarContactsButtonTip"
	},
	{
		"operation": "remove",
		"name": "QualifiedAccount"
	},
	{
		"operation": "remove",
		"name": "SimilarAccountsButton"
	},
	{
		"operation": "remove",
		"name": "SimilarAccountsButtonTip"
	},
	{
		"operation": "remove",
		"name": "LeadDisqualifyReason"
	},
	{
		"operation": "remove",
		"name": "GeneralInfoTab"
	},
	{
		"operation": "remove",
		"name": "LeadPageGeneralTabContainer"
	},
	{
		"operation": "remove",
		"name": "LeadPageRegisterInfo"
	},
	{
		"operation": "remove",
		"name": "LeadPageRegisterInfoBlock"
	},
	{
		"operation": "remove",
		"name": "Contact"
	},
	{
		"operation": "remove",
		"name": "Account"
	},
	{
		"operation": "remove",
		"name": "Website"
	},
	{
		"operation": "remove",
		"name": "MobilePhone"
	},
	{
		"operation": "remove",
		"name": "Job"
	},
	{
		"operation": "remove",
		"name": "Email"
	},
	{
		"operation": "remove",
		"name": "Country"
	},
	{
		"operation": "remove",
		"name": "LeadsSimilarSearchResult"
	},
	{
		"operation": "remove",
		"name": "LeadPageNeedValidationContainer"
	},
	{
		"operation": "remove",
		"name": "LeadPageNeedValidationBlock"
	},
	{
		"operation": "remove",
		"name": "CountryStr"
	},
	{
		"operation": "remove",
		"name": "RegionStr"
	},
	{
		"operation": "remove",
		"name": "CityStr"
	},
	{
		"operation": "remove",
		"name": "LeadPageNeedValidationInfoToolTip"
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
		"name": "ilayCategory9ace1de09dcf"
	},
	{
		"operation": "remove",
		"name": "LeadTypeStatus"
	},
	{
		"operation": "remove",
		"name": "SpecificationInLead"
	},
	{
		"operation": "remove",
		"name": "SiteEvent"
	},
	{
		"operation": "remove",
		"name": "LeadPageDistributionInfo"
	},
	{
		"operation": "remove",
		"name": "LeadPageDistributionInfoBlock"
	},
	{
		"operation": "remove",
		"name": "Owner"
	},
	{
		"operation": "remove",
		"name": "OpportunityDepartment"
	},
	{
		"operation": "remove",
		"name": "LeadPageTransferToSaleInfo"
	},
	{
		"operation": "remove",
		"name": "LeadPageTransferToSaleInfoBlock"
	},
	{
		"operation": "remove",
		"name": "SalesOwner"
	},
	{
		"operation": "remove",
		"name": "MeetingDate"
	},
	{
		"operation": "remove",
		"name": "Budget"
	},
	{
		"operation": "remove",
		"name": "DecisionDate"
	},
	{
		"operation": "remove",
		"name": "Order"
	},
	{
		"operation": "remove",
		"name": "Opportunity"
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
		"name": "Activity02dbcb08146a"
	},
	{
		"operation": "remove",
		"name": "QualificationProcessButton"
	},
	{
		"operation": "merge",
		"name": "ilayMedDirection",
		"values": {
			"layout": {
				"column": 0,
				"row": 0,
				"colSpan": 12,
				"rowSpan": 1
			},
			"bindTo": "ilayMedDirection",
			"caption": {
				"bindTo": "Resources.Strings.ilayMedDirectionCaption"
			},
			"textSize": 0,
			"contentType": 3,
			"labelConfig": {
				"visible": true
			},
			"enabled": true,
			"isRequired": {"bindTo": "isMedDirectionRequired"}
		},
		"parentName": "LeadTypeBlock",
		"propertyName": "items",
		"index": 2
	},
	{
		"operation": "move",
		"parentName": "NeedInfoTabContainer",
		"name": "LeadPageSourceInfo",
		"propertyName": "items",
		"index": 2
	},
]/**SCHEMA_DIFF*/,
		attributes: {
			ilayMedDirectionValidationId: {
				dataValueType: this.Terrasoft.DataValueType.TEXT,
				value: "ilayLeadTypeB2CilayMedDirectionComboBoxEdit-validation",
				dependencies: [{
					columns: ["ilayMedDirection", "LeadType"],
					methodName: "setValidationUnderlineOnMedDirection"
				}]
			},
		},
		methods: {
			//Den> по нажатию на "отмена" не срабатывают бинды на атрибуты.
			//		этот метод асинхронный, пришлось заместить.
			onDiscardChangesClick: function() {
				if (this.isNew) {
					this.sandbox.publish("BackHistoryState");
					return;
				}
				this.set("IsEntityInitialized", false);
				this.loadEntity(this.getPrimaryColumnValue(), function() {
					this.updateButtonsVisibility(false, {
						force: true
					});
					this.initMultiLookup();
					this.set("IsEntityInitialized", true);
					this.discardDetailChange();
					this.setValidationUnderlineOnMedDirection();
					this.ilayMainPhoneChanged();
				}, this);
				if (this.get("ForceUpdate")) {
					this.set("ForceUpdate", false);
				}
			},
			//Den<
			isMedDirectionRequired: function() {
				var leadType = this.get("LeadType");
				if (leadType && leadType.value === "e12c4c83-97d3-42c7-b785-17b14179e879") {
					return true;
				}
				return false;
			},
			
			save: function() {
				if(!this.get("ilayMedDirection") && this.isMedDirectionRequired()) {
					Terrasoft.utils.showMessage({
						caption: this.get("Resources.Strings.ilayMedDirectionRequiredCaption"),
						buttons: ["cancel"],
						style: Terrasoft.MessageBoxStyles.BLUE
					});
				} else {
					this.callParent(arguments);
				}	
			},
			
			//Den> Так как бинд IsRequired на аттрибутах работает не корректно, добавлена своя проверка.
			setValidationUnderlineOnMedDirection: function() {
				var el = document.getElementById(this.get("ilayMedDirectionValidationId"));
				if (el.innerText === "") el.innerText = "Необхідно заповнити поле";
				if (!this.get("ilayMedDirection") && this.isMedDirectionRequired()) {
					el.setAttribute("style", "visibility: visible; display: block");
				} else {
					el.setAttribute("style", "visibility: hidden; display: block");
				}
			},
			/**
			 * Инициализирует значение по умолчанию для поля QualifyStatus.
			 * @protected
			 */
			initDefQualifyStatus: function() {
				var operation = this.get("Operation");
				if (operation === enums.CardStateV2.EDIT) {
					return;
				}
				this.setQualifyStatus(LeadConfigurationConst.LeadConst.QualifyStatus.New);
			},
			//Den> [IL-478]
			onEntityInitialized: function() {
				//this.set("LeadManagementButtonVisible", false);
				this.callParent(arguments);
				this.calculateTotalServCost();
				this.setValidationUnderlineOnMedDirection();
				this.sandbox.publish("LeadB2CCardOpened", null, [this.sandbox.id]);
			},
			calculateTotalServCost: function() {
				var leadId = this.getPrimaryColumnValue(),
					cost = 0;
				var esq = Ext.create("Terrasoft.EntitySchemaQuery", {
					rootSchemaName: "ilayServList"
				});
				esq.addColumn("Id");
				esq.addColumn("ilayCoast");
				esq.filters.add("LeadFilter", esq.createColumnFilterWithParameter(
					this.Terrasoft.ComparisonType.EQUAL, "ilayLead", leadId));
				esq.getEntityCollection(function(result) {
					if(result.success){
						for (var i = 0; i < result.collection.getCount(); i++) {
							cost += result.collection.getByIndex(i).get("ilayCoast");
						}
						if(cost && cost != this.get("ilayTotalServCost")) this.set("ilayTotalServCost", cost);
					}
				}, this);
			},
			subscribeSandboxEvents: function() {
				this.callParent(arguments);
				this.sandbox.subscribe("ServListsAdded", this.calculateTotalServCost, this, ["ServListsAdded"]);
			},
			//Den< [IL-478]
			//Den> [IL-496]
			/**
			 * При выборе значения "Создать ..." в LookupEdit - пытается создать новую запись или
			 * открывает карточку редактирования.
			 * @overriden from BasePageV2
			 */
			onLookupChange: function(newValue, columnName) {
				this.callParent(arguments);
				if (columnName === "QualifiedContact" && newValue && newValue.isNewValue) {
					this.set("IsCreateEMKButtonClicked", true);
					return;
				}
				if (columnName === "QualifiedContact" && newValue && newValue.value != Terrasoft.GUID_EMPTY
					&& this.get("IsCreateEMKButtonClicked")) {
					if (this.isNewMode() || this.isCopyMode()) {
						this.save();
					} else {
						this.set("IsCreateEMKButtonClicked", false);
						this.updateLeadAfterContactAdd(newValue);
					}
				}
			},
			////Den> [IL-513] Вместо save использовать update,чтобы не проводить валидацию полей
			updateLeadAfterContactAdd: function(contact) {
				var leadId = this.getPrimaryColumnValue();
				var updateQuery = this.Ext.create("Terrasoft.UpdateQuery", {
					rootSchemaName: "Lead"
				});
				updateQuery.filters.addItem(this.Terrasoft.createColumnFilterWithParameter(
					this.Terrasoft.ComparisonType.EQUAL, "Id", leadId));
				updateQuery.setParameterValue("QualifiedContact", contact.value, this.Terrasoft.DataValueType.GUID);
				updateQuery.setParameterValue("Contact", contact.displayValue, this.Terrasoft.DataValueType.TEXT);
				updateQuery.execute(function(response) {
					if (response.success) {
						this.runCreateEMKProcess();
					}
				}, this);
			}
			////Den< [IL-513]
			//Den< [IL-496]
		},
		rules: {},
		messages: {
			"ServListsAdded": {
				mode: Terrasoft.MessageMode.PTP,
				direction: Terrasoft.MessageDirectionType.SUBSCRIBE
			},
			"LeadB2CCardOpened": {
				mode: Terrasoft.MessageMode.PTP,
				direction: Terrasoft.MessageDirectionType.PUBLISH
			}
		}
	};
});
