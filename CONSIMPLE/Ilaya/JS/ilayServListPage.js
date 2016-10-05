define('ilayServListPage', ['ilayServListPageResources', 'GeneralDetails'],
function(resources, GeneralDetails) {
	return {
		entitySchemaName: 'ilayServList',
		details: /**SCHEMA_DETAILS*/{
			"Document8b150a9243e7": {
				"schemaName": "ilayDocumentInServListDetailV2",
				"entitySchemaName": "Document",
				"filter": {
					"detailColumn": "ilayPatientService",
					"masterColumn": "Id"
				},
				"filterMethod": "medicalDocumentType"
			},
			"ilayDocService6bae0fca4424": {
				"schemaName": "ilaySchema18Detail",
				"entitySchemaName": "ilayDocService",
				"filter": {
					"detailColumn": "ilayService",
					"masterColumn": "Id"
				}
			},
			"ilayPatientAcctInServba9e1aea9468": {
				"schemaName": "ilaySchema20Detail",
				"entitySchemaName": "ilayPatientAcctInServ",
				"filter": {
					"detailColumn": "ilayService",
					"masterColumn": "Id"
				}
			},
			"ilayPaymentDetail": {
				"schemaName": "ilayPaymentDetail",
				"entitySchemaName": "ilayPayment",
				"filter": {
					"detailColumn": "ilayService",
					"masterColumn": "Id"
				}
			}
		}/**SCHEMA_DETAILS*/,
		messages: {
			"GetPatientIdOnCardOpen": {
				mode: this.Terrasoft.MessageMode.PTP,
				direction: this.Terrasoft.MessageDirectionType.SUBSCRIBE
			},
			"SetPatientIdOnCardOpen": {
				mode: this.Terrasoft.MessageMode.PTP,
				direction: this.Terrasoft.MessageDirectionType.PUBLISH
			}
		},
		diff: /**SCHEMA_DIFF*/[
			{
				"operation": "insert",
				"name": "AddDocumentButton",
				"values": {
					"itemType": 5,
					"caption": {
						"bindTo": "Resources.Strings.AddDocumentCaption"
					},
					"style": "green",
					"visible": true,
					"click": {
						"bindTo": "onAddDocumentButtonClick"
					},
					"enabled": {
						"bindTo": "isAddDocumentButtonEnabled"
					}
				},
				"parentName": "LeftContainer",
				"propertyName": "items",
				"index": 9
			},
			{
				"operation": "insert",
				"name": "ilayBaseCost",
				"values": {
					"layout": {
						"column": 18,
						"row": 1,
						"colSpan": 6,
						"rowSpan": 1
					}
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "ilayDoctor8dd1a67b75da",
				"values": {
					"layout": {
						"column": 12,
						"row": 3,
						"colSpan": 12,
						"rowSpan": 1
					},
					"bindTo": "ilayDoctor",
					"caption": {
						"bindTo": "Resources.Strings.ilayDoctorCaption"
					},
					"textSize": 0,
					"contentType": 5,
					"labelConfig": {
						"visible": true
					},
					"enabled": true
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 1
			},
			{
				"operation": "insert",
				"name": "ilayPatient",
				"values": {
					"layout": {
						"column": 12,
						"row": 2,
						"colSpan": 12,
						"rowSpan": 1
					},
					"bindTo": "ilayPatient",
					"caption": {
						"bindTo": "Resources.Strings.ilayPatientCaption"
					},
					"textSize": 0,
					"contentType": 5,
					"labelConfig": {
						"visible": true
					},
					"enabled": true
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 2
			},
			{
				"operation": "insert",
				"name": "ilayPerfomStatus26c698dca883",
				"values": {
					"layout": {
						"column": 0,
						"row": 5,
						"colSpan": 12,
						"rowSpan": 1
					},
					"bindTo": "ilayPerfomStatus",
					"caption": {
						"bindTo": "Resources.Strings.ilayPerfomStatusCaption"
					},
					"textSize": 0,
					"contentType": 3,
					"labelConfig": {
						"visible": true
					},
					"enabled": true
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 3
			},
			{
				"operation": "insert",
				"name": "ilayFactDate2bbc42962309",
				"values": {
					"layout": {
						"column": 0,
						"row": 4,
						"colSpan": 12,
						"rowSpan": 1
					},
					"bindTo": "ilayFactDate",
					"caption": {
						"bindTo": "Resources.Strings.ilayFactDateCaption"
					},
					"textSize": 0,
					"labelConfig": {
						"visible": true
					},
					"enabled": true
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 4
			},
			{
				"operation": "insert",
				"name": "ilayPlanDate0b7e63f9e69d",
				"values": {
					"layout": {
						"column": 0,
						"row": 3,
						"colSpan": 12,
						"rowSpan": 1
					},
					"bindTo": "ilayPlanDate",
					"caption": {
						"bindTo": "Resources.Strings.ilayPlanDateCaption"
					},
					"textSize": 0,
					"labelConfig": {
						"visible": true
					},
					"enabled": true
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 5
			},
			{
				"operation": "insert",
				"name": "ilayService9edacab34160",
				"values": {
					"layout": {
						"column": 0,
						"row": 1,
						"colSpan": 12,
						"rowSpan": 1
					},
					"bindTo": "ilayService",
					"caption": {
						"bindTo": "Resources.Strings.ilayServiceCaption"
					},
					"textSize": 0,
					"contentType": 5,
					"labelConfig": {
						"visible": true
					},
					"enabled": true
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 6
			},
			{
				"operation": "insert",
				"name": "ilayPackage",
				"values": {
					"layout": {
						"column": 0,
						"row": 2,
						"colSpan": 12,
						"rowSpan": 1
					},
					"bindTo": "ilayPackage",
					"textSize": 0,
					"contentType": 5,
					"labelConfig": {
						"visible": true
					},
					"enabled": true
				},
				"parentName": "Header",
				"propertyName": "items"
			},
			{
				"operation": "insert",
				"name": "ilayServiceCode68a7af5e53e4",
				"values": {
					"layout": {
						"column": 12,
						"row": 1,
						"colSpan": 6,
						"rowSpan": 1
					},
					"bindTo": "ilayServiceCode",
					"caption": {
						"bindTo": "Resources.Strings.ilayServiceCodeCaption"
					},
					"textSize": 0,
					"contentType": 1,
					"labelConfig": {
						"visible": true
					},
					"enabled": true
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 7
			},
			{
				"operation": "insert",
				"name": "ilayPackageServ8c8ff743639f",
				"values": {
					"layout": {
						"column": 12,
						"row": 4,
						"colSpan": 12,
						"rowSpan": 1
					},
					"bindTo": "ilayPackageServ",
					"caption": {
						"bindTo": "Resources.Strings.ilayPackageServCaption"
					},
					"textSize": 0,
					"labelConfig": {
						"visible": true
					},
					"enabled": true
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 8
			},
			{
				"operation": "insert",
				"name": "ilayName",
				"values": {
					"layout": {
						"column": 0,
						"row": 0,
						"colSpan": 24,
						"rowSpan": 1
					}
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 9
			},
			{
				"operation": "insert",
				"name": "ilayPerformfd11d3c0c7a4",
				"values": {
					"layout": {
						"column": 0,
						"row": 6,
						"colSpan": 12,
						"rowSpan": 1
					},
					"bindTo": "ilayPerform",
					"caption": {
						"bindTo": "Resources.Strings.ilayPerformCaption"
					},
					"enabled": true
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 10
			},
			{
				"operation": "insert",
				"name": "GeneralInfoTab",
				"values": {
					"caption": {
						"bindTo": "Resources.Strings.GeneralInfoTabCaption"
					},
					"items": []
				},
				"parentName": "Tabs",
				"propertyName": "tabs",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "group1bed8d317e67",
				"values": {
					"itemType": 15,
					"caption": {
						"bindTo": "Resources.Strings.group1bed8d317e67Caption"
					},
					"items": [],
					"controlConfig": {
						"collapsed": false
					}
				},
				"parentName": "GeneralInfoTab",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "group1bed8d317e67_gridLayout",
				"values": {
					"itemType": 0,
					"items": []
				},
				"parentName": "group1bed8d317e67",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "ilayDiscount44bb0284fbe6",
				"values": {
					"layout": {
						"column": 12,
						"row": 0,
						"colSpan": 12,
						"rowSpan": 1
					},
					"bindTo": "ilayDiscount",
					"caption": {
						"bindTo": "Resources.Strings.ilayDiscountCaption"
					},
					"textSize": 0,
					"labelConfig": {
						"visible": true
					},
					"enabled": true
				},
				"parentName": "group1bed8d317e67_gridLayout",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "ilayPDV68dec7005309",
				"values": {
					"layout": {
						"column": 0,
						"row": 1,
						"colSpan": 12,
						"rowSpan": 1
					},
					"bindTo": "ilayPDV",
					"caption": {
						"bindTo": "Resources.Strings.ilayPDVCaption"
					},
					"textSize": 0,
					"labelConfig": {
						"visible": true
					},
					"enabled": true
				},
				"parentName": "group1bed8d317e67_gridLayout",
				"propertyName": "items",
				"index": 1
			},
			{
				"operation": "insert",
				"name": "ilayPatientPaysaa1d2b17bd1b",
				"values": {
					"layout": {
						"column": 0,
						"row": 0,
						"colSpan": 12,
						"rowSpan": 1
					},
					"bindTo": "ilayPatientPays",
					"caption": {
						"bindTo": "Resources.Strings.ilayPatientPaysCaption"
					},
					"textSize": 0,
					"labelConfig": {
						"visible": true
					},
					"enabled": true
				},
				"parentName": "group1bed8d317e67_gridLayout",
				"propertyName": "items",
				"index": 2
			},
			/*
			{
				"operation": "insert",
				"name": "ilayPatientAcctInServba9e1aea9468",
				"values": {
					"itemType": 2
				},
				"parentName": "GeneralInfoTab",
				"propertyName": "items",
				"index": 1
			},
			*/
			{
				"operation": "insert",
				"name": "group20df9565b1e6",
				"values": {
					"itemType": 15,
					"caption": {
						"bindTo": "Resources.Strings.group20df9565b1e6Caption"
					},
					"items": [],
					"controlConfig": {
						"collapsed": false
					}
				},
				"parentName": "GeneralInfoTab",
				"propertyName": "items",
				"index": 1
			},
			
			{
				"operation": "insert",
				"name": "ilayPaymentDetail",
				"values": {
					"itemType": 2
				},
				"parentName": "GeneralInfoTab",
				"propertyName": "items",
				"index": 2
			},
			
			{
				"operation": "insert",
				"name": "group20df9565b1e6_gridLayout",
				"values": {
					"itemType": 0,
					"items": []
				},
				"parentName": "group20df9565b1e6",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "ilayPatientAccountd3bc0974207c",
				"values": {
					"layout": {
						"column": 0,
						"row": 0,
						"colSpan": 8,
						"rowSpan": 1
					},
					"bindTo": "ilayPatientAccount",
					"caption": {
						"bindTo": "Resources.Strings.ilayPatientAccountCaption"
					},
					"textSize": 0,
					"contentType": 5,
					"labelConfig": {
						"visible": true
					},
					"enabled": true
				},
				"parentName": "group20df9565b1e6_gridLayout",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "ilayPrice2b91291c4174",
				"values": {
					"layout": {
						"column": 8,
						"row": 0,
						"colSpan": 8,
						"rowSpan": 1
					},
					"bindTo": "ilayPrice",
					"caption": {
						"bindTo": "Resources.Strings.ilayPriceCaption"
					},
					"textSize": 0,
					"contentType": 5,
					"labelConfig": {
						"visible": true
					},
					"enabled": true
				},
				"parentName": "group20df9565b1e6_gridLayout",
				"propertyName": "items",
				"index": 1
			},
			{
				"operation": "insert",
				"name": "ilayCoastc09626ba014f",
				"values": {
					"layout": {
						"column": 16,
						"row": 0,
						"colSpan": 8,
						"rowSpan": 1
					},
					"bindTo": "ilayCoast",
					"caption": {
						"bindTo": "Resources.Strings.ilayCoastCaption"
					},
					"textSize": 0,
					"labelConfig": {
						"visible": true
					},
					"enabled": false
				},
				"parentName": "group20df9565b1e6_gridLayout",
				"propertyName": "items",
				"index": 2
			},
			{
				"operation": "insert",
				"name": "ilayTurnIndependentPayment",
				"values": {
					"layout": {
						"column": 0,
						"row": 4,
						"colSpan": 12,
						"rowSpan": 1
					},
					"bindTo": "ilayTurnIndependentPayment",
					"enabled": true,
					"visible": {
						"bindTo": "isPatientAccountInsuranceSelected"
					}
				},
				"parentName": "group20df9565b1e6_gridLayout",
				"propertyName": "items",
				"index": 3
			},
			{
				"operation": "insert",
				"name": "ilaySpecialPrice56b2f185d848",
				"values": {
					"layout": {
						"column": 8,
						"row": 1,
						"colSpan": 8,
						"rowSpan": 1
					},
					"bindTo": "ilaySpecialPrice",
					"caption": {
						"bindTo": "Resources.Strings.ilaySpecialPriceCaption"
					},
					"textSize": 0,
					"contentType": 5,
					"labelConfig": {
						"visible": true
					},
					"enabled": {
						"bindTo": "isilaySpecialPriceEnabled"
					},
					"visible": {
						"bindTo": "isPatientAccountInsurance"
					}
				},
				"parentName": "group20df9565b1e6_gridLayout",
				"propertyName": "items",
				"index": 4
			},
			{
				"operation": "insert",
				"name": "ilaySpecialCost8a75eb300508",
				"values": {
					"layout": {
						"column": 16,
						"row": 1,
						"colSpan": 8,
						"rowSpan": 1
					},
					"bindTo": "ilaySpecialCost",
					"caption": {
						"bindTo": "Resources.Strings.ilaySpecialCostCaption"
					},
					"textSize": 0,
					"labelConfig": {
						"visible": true
					},
					"enabled": true,
					"visible": {
						"bindTo": "isPatientAccountInsurance"
					}
				},
				"parentName": "group20df9565b1e6_gridLayout",
				"propertyName": "items",
				"index": 5
			},
			{
				"operation": "insert",
				"name": "ilaySumPaidInsurance",
				"values": {
					"layout": {
						"column": 12,
						"row": 2,
						"colSpan": 12,
						"rowSpan": 1
					},
					"bindTo": "ilaySumPaidInsurance",
					"enabled": true,
					"visible": {
						"bindTo": "isPatientAccountInsuranceSelected"
					}
				},
				"parentName": "group20df9565b1e6_gridLayout",
				"propertyName": "items",
				"index": 6
			},
			{
				"operation": "insert",
				"name": "ilayGuarantee",
				"values": {
					"layout": {
						"column": 0,
						"row": 2,
						"colSpan": 12,
						"rowSpan": 1
					},
					"bindTo": "ilayGuarantee",
					"enabled": true,
					"visible": {
						"bindTo": "isPatientAccountInsuranceSelected"
					}
				},
				"parentName": "group20df9565b1e6_gridLayout",
				"propertyName": "items",
				"index": 7
			},
			{
				"operation": "insert",
				"name": "ilayGuarantee100",
				"values": {
					"layout": {
						"column": 0,
						"row": 3,
						"colSpan": 12,
						"rowSpan": 1
					},
					"bindTo": "ilayGuarantee100",
					"enabled": true,
					"visible": {
						"bindTo": "isPatientAccountInsuranceSelected"
					}
				},
				"parentName": "group20df9565b1e6_gridLayout",
				"propertyName": "items",
				"index": 8
			},
			{
				"operation": "insert",
				"name": "ilaySumPaidPacient",
				"values": {
					"layout": {
						"column": 12,
						"row": 3,
						"colSpan": 12,
						"rowSpan": 1
					},
					"bindTo": "ilaySumPaidPacient",
					"enabled": false,
					"visible": {
						"bindTo": "isPatientAccountInsuranceSelected"
					}
				},
				"parentName": "group20df9565b1e6_gridLayout",
				"propertyName": "items",
				"index": 9
			},
			{
				"operation": "insert",
				"name": "ilayAgent6f1fcf3a1774",
				"values": {
					"layout": {
						"column": 0,
						"row": 1,
						"colSpan": 8,
						"rowSpan": 1
					},
					"bindTo": "ilayAgent",
					"caption": {
						"bindTo": "Resources.Strings.ilayAgentCaption"
					},
					"textSize": 0,
					"contentType": 5,
					"labelConfig": {
						"visible": true
					},
					"enabled": true,
					"visible": {
						"bindTo": "isPatientAccountInsurance"
					}
				},
				"parentName": "group20df9565b1e6_gridLayout",
				"propertyName": "items",
				"index": 10
			},
			{
				"operation": "insert",
				"name": "group9fabfe1468d3",
				"values": {
					"itemType": 15,
					"caption": {
						"bindTo": "Resources.Strings.group9fabfe1468d3Caption"
					},
					"items": [],
					"controlConfig": {
						"collapsed": false
					}
				},
				"parentName": "GeneralInfoTab",
				"propertyName": "items",
				"index": 3
			},
			{
				"operation": "insert",
				"name": "group9fabfe1468d3_gridLayout",
				"values": {
					"itemType": 0,
					"items": []
				},
				"parentName": "group9fabfe1468d3",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "ilayPaymentStatus37e03ee5b549",
				"values": {
					"layout": {
						"column": 0,
						"row": 0,
						"colSpan": 12,
						"rowSpan": 1
					},
					"bindTo": "ilayPaymentStatus",
					"caption": {
						"bindTo": "Resources.Strings.ilayPaymentStatusCaption"
					},
					"contentType": 3,
					"enabled": true
				},
				"parentName": "group9fabfe1468d3_gridLayout",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "ilayPaymentOwner35b0fa06f3a6",
				"values": {
					"layout": {
						"column": 12,
						"row": 0,
						"colSpan": 12,
						"rowSpan": 1
					},
					"bindTo": "ilayPaymentOwner",
					"caption": {
						"bindTo": "Resources.Strings.ilayPaymentOwnerCaption"
					},
					"enabled": true
				},
				"parentName": "group9fabfe1468d3_gridLayout",
				"propertyName": "items",
				"index": 1
			},
			{
				"operation": "insert",
				"name": "ilayPaymentSumm56dfdb0d2044",
				"values": {
					"layout": {
						"column": 0,
						"row": 1,
						"colSpan": 12,
						"rowSpan": 1
					},
					"bindTo": "ilayPaymentSumm",
					"caption": {
						"bindTo": "Resources.Strings.ilayPaymentSummCaption"
					},
					"enabled": true
				},
				"parentName": "group9fabfe1468d3_gridLayout",
				"propertyName": "items",
				"index": 2
			},
			{
				"operation": "insert",
				"name": "ilayPaymentDate654cc94358c9",
				"values": {
					"layout": {
						"column": 12,
						"row": 1,
						"colSpan": 12,
						"rowSpan": 1
					},
					"bindTo": "ilayPaymentDate",
					"caption": {
						"bindTo": "Resources.Strings.ilayPaymentDateCaption"
					},
					"enabled": true
				},
				"parentName": "group9fabfe1468d3_gridLayout",
				"propertyName": "items",
				"index": 3
			},
			{
				"operation": "insert",
				"name": "group9a35ba3ee7c7",
				"values": {
					"itemType": 15,
					"caption": {
						"bindTo": "Resources.Strings.group9a35ba3ee7c7Caption"
					},
					"items": [],
					"controlConfig": {
						"collapsed": false
					}
				},
				"parentName": "GeneralInfoTab",
				"propertyName": "items",
				"index": 4
			},
			{
				"operation": "insert",
				"name": "group9a35ba3ee7c7_gridLayout",
				"values": {
					"itemType": 0,
					"items": []
				},
				"parentName": "group9a35ba3ee7c7",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "ilayCourse06818afd73e2",
				"values": {
					"layout": {
						"column": 0,
						"row": 0,
						"colSpan": 12,
						"rowSpan": 1
					},
					"bindTo": "ilayCourse",
					"caption": {
						"bindTo": "Resources.Strings.ilayCourseCaption"
					},
					"textSize": 0,
					"contentType": 5,
					"labelConfig": {
						"visible": true
					},
					"enabled": true
				},
				"parentName": "group9a35ba3ee7c7_gridLayout",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "ilayVisittoDoctorab45febf657b",
				"values": {
					"layout": {
						"column": 12,
						"row": 0,
						"colSpan": 12,
						"rowSpan": 1
					},
					"bindTo": "ilayVisittoDoctor",
					"caption": {
						"bindTo": "Resources.Strings.ilayVisittoDoctorCaption"
					},
					"textSize": 0,
					"contentType": 5,
					"labelConfig": {
						"visible": true
					},
					"enabled": true
				},
				"parentName": "group9a35ba3ee7c7_gridLayout",
				"propertyName": "items",
				"index": 1
			},
			{
				"operation": "insert",
				"name": "ilayaLead",
				"values": {
					"layout": {
						"column": 12,
						"row": 1,
						"colSpan": 12,
						"rowSpan": 1
					},
					"bindTo": "ilayLead",
					"caption": {
						"bindTo": "Resources.Strings.ilayLeadCaption"
					},
					"textSize": 0,
					"contentType": 5,
					"labelConfig": {
						"visible": true
					},
					"enabled": true
				},
				"parentName": "group9a35ba3ee7c7_gridLayout",
				"propertyName": "items",
				"index": 2
			},
			{
				"operation": "insert",
				"name": "ilayaContract0165cc53face",
				"values": {
					"layout": {
						"column": 0,
						"row": 1,
						"colSpan": 12,
						"rowSpan": 1
					},
					"bindTo": "ilayaContract",
					"caption": {
						"bindTo": "Resources.Strings.ilayaContractCaption"
					},
					"textSize": 0,
					"contentType": 5,
					"labelConfig": {
						"visible": true
					},
					"enabled": true
				},
				"parentName": "group9a35ba3ee7c7_gridLayout",
				"propertyName": "items",
				"index": 3
			},
			{
				"operation": "insert",
				"name": "ilayServListPage3Tab",
				"values": {
					"items": [],
					"caption": {
						"bindTo": "Resources.Strings.ilayServListPage3TabCaption"
					}
				},
				"parentName": "Tabs",
				"propertyName": "tabs",
				"index": 1
			},
			{
				"operation": "insert",
				"name": "Document8b150a9243e7",
				"values": {
					"itemType": 2
				},
				"parentName": "ilayServListPage3Tab",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "ilayDocService6bae0fca4424",
				"values": {
					"itemType": 2
				},
				"parentName": "ilayServListPage3Tab",
				"propertyName": "items",
				"index": 1
			}
		]/**SCHEMA_DIFF*/,
		attributes: {
			"ilayPrice": {
				dependencies: [
					{
						//Den>[IL-440] 
						//columns: ["ilayPrice"],
						//methodName: "ilayPriceChanged
						columns: ["ilayPrice", "ilayPackage"],
						methodName: "ilayPriceOrPackageChanged"
						//Den<[IL-440] 
					}
				],
				lookupListConfig: {
					columns: ["ilayPriceType"]
				}
			},
			"ilayService": {
				dependencies: [
					{
						columns: ["ilayService"],
						methodName: "ilayServiceChanged"
					}
				],
				lookupListConfig: {
					columns: ["Code", "Price"]
				}
			},
			"ilayCourse": {
				dataValueType: Terrasoft.DataValueType.LOOKUP,
					lookupListConfig: {filter: function() {
						return Terrasoft.createColumnInFilterWithParameters("ilayPatientInCourse",
						[Ext.isEmpty(this.get("ilayPatient")) ? null : this.get("ilayPatient").value]);
					}
				}
			},
			"ilayPatientAccount": {
				dataValueType: Terrasoft.DataValueType.LOOKUP,
					lookupListConfig: {filter: function() {
						return Terrasoft.createColumnInFilterWithParameters("ilayPatient",
						[Ext.isEmpty(this.get("ilayPatient")) ? null : this.get("ilayPatient").value]);
					},
					columns: ["ilayAccountType"]
				}
			},
			"ilaySpecialPrice": {
				dataValueType: Terrasoft.DataValueType.LOOKUP,
				lookupListConfig: {
					filter: function() {
						var filterGroupPriceType = Ext.create("Terrasoft.FilterGroup");
						filterGroupPriceType.logicalOperation = this.Terrasoft.LogicalOperatorType.OR;
						filterGroupPriceType.add("ilayPriceType1", Terrasoft.createColumnFilterWithParameter(
							Terrasoft.ComparisonType.EQUAL, "ilayPriceType",
							"2e00b180-4c35-4363-9615-367da557732d"));
						filterGroupPriceType.add("ilayPriceType2", Terrasoft.createColumnFilterWithParameter(
							Terrasoft.ComparisonType.EQUAL, "ilayPriceType",
							"1cc992cb-2f17-49fa-b974-7d4679bf4828"));
							
						var filterGroup = Ext.create("Terrasoft.FilterGroup");
						filterGroup.logicalOperation = this.Terrasoft.LogicalOperatorType.AND;
						filterGroup.add("ilayService", Terrasoft.createColumnFilterWithParameter(
							Terrasoft.ComparisonType.EQUAL, "[ilayPriceForService:ilayPrice:Id].ilayService",
							this.get("ilayService").value));
						filterGroup.add("ilayPriceStatus", Terrasoft.createColumnFilterWithParameter(
							Terrasoft.ComparisonType.EQUAL, "ilayPriceStatus",
							"0b57640a-9443-4c78-a739-0d9ab437b39e"));
						filterGroup.addItem(filterGroupPriceType);
						return filterGroup;
					}
				}
			},
			"ilaySumPaidPacient": {
				dependencies: [
					{
						columns: ["ilayCoast", "ilaySumPaidInsurance"],
						methodName: "recalcIlaySumPaidPacient"
					}
				]
			}
		},
		methods: {
			//Den> [IL-440] 8.Поменять функцию расчета стоимости сервиса.
			onPriceOrPackageChanged: function() {
				var ilayPriceId = this.get("ilayPrice") ? this.get("ilayPrice").value : null,
					ilayPackageId = this.get("ilayPackage") ? this.get("ilayPackage").value : null,
					ilayServiceId = this.get("ilayService") ? this.get("ilayService").value : null;
				var esq = this.Ext.create("Terrasoft.EntitySchemaQuery", {
					rootSchemaName: "ilayPriceForService"
				});
				esq.addColumn("Id");
				esq.addColumn("Gender");
				esq.addColumn("ilayCardNumber");
				esq.addColumn("BirthDate");
				esq.addColumn("ilayWork");
				esq.getEntity(this.get("ilayPatient").value, function(response) {
					if (response.success) {
						next(response.entity);
					}
				}, this);
			},
			//Den<[IL-440] 
			onRender: function() {
				this.callParent(arguments);
				this.updateDetail(
				{
					detail: "Document8b150a9243e7",
					reloadAll: true
				});
			},
			isAddDocumentButtonEnabled: function() {
				return !this.get("ShowSaveButton");
			},
			getPatient: function(next) {
				if (this.get("ilayPatient")) {
					var esq = this.Ext.create("Terrasoft.EntitySchemaQuery", {
						rootSchemaName: "Contact"
					});
					esq.addColumn("Id");
					esq.addColumn("Gender");
					esq.addColumn("ilayCardNumber");
					esq.addColumn("BirthDate");
					esq.addColumn("ilayWork");
					esq.getEntity(this.get("ilayPatient").value, function(response) {
						if (response.success) {
							next(response.entity);
						}
					}, this);
				} else {
					next(null);
				}
			},
			onAddDocumentButtonClick: function() {
				Terrasoft.chain(
					function(next) {
						this.getPatient(next);
					},
					function(next, patient) {
						this.openMedDocPage(patient);
					},
				this);
			},
			openMedDocPage: function(patient) {
				var doctor = this.get("ilayDoctor") ? this.get("ilayDoctor").value : "";
				var state = "1fcd639a-e581-4e2e-815b-7a7ee341bac1";
				var visit = this.get("ilayVisittoDoctor") ? this.get("ilayVisittoDoctor").value : "";
				var course = this.get("ilayCourse") ? this.get("ilayCourse").value : "";
				var type = "2F3F339E-7A37-4772-8C87-C4DFF260B341".toLowerCase();
				
				var patientId = "";
				var gender = "";
				var carNumber = "";
				var birthDate = "";
				var work = "";
				
				if (patient) {
					patientId = patient.get("Id");
					gender = patient.get("Gender") ? patient.get("Gender").value : "";
					carNumber = patient.get("ilayCardNumber").toString();
					birthDate = patient.get("BirthDate") ? patient.get("BirthDate") : "";
					work = patient.get("ilayWork");
				}
				
				if (birthDate) {
					this.openCardInChain({
						schemaName: "ilayDocumentType2Page",
						operation: "add",
						primaryColumnValue: null,
						moduleId: this.sandbox.id + "_AddMedDoc",
						defaultValues: [
							{
								name: ["Type", "ilayPatientService", "Owner", "State", "ilayVisit", "ilayCourse",
									"ilayPatient", "ilaySex", "ilayCardNumber", "ilayBirthDate", "ilayWork"],
								value: [type, this.get("Id"), doctor, state, visit, course, patientId, gender, carNumber,
									birthDate, work] 
							}
						]
					});
				} else {
					this.openCardInChain({
						schemaName: "ilayDocumentType2Page",
						operation: "add",
						primaryColumnValue: null,
						moduleId: this.sandbox.id + "_AddMedDoc",
						defaultValues: [
							{
								name: ["Type", "ilayPatientService", "Owner", "State", "ilayVisit", "ilayCourse",
									"ilayPatient", "ilaySex", "ilayCardNumber", "ilayWork"],
								value: [type, this.get("Id"), doctor, state, visit, course, patientId, gender, carNumber,
									work] 
							}
						]
					});
				}
			},
			ilayServiceChanged: function() {
				if (!Ext.isEmpty(this.get("ilayService"))) {
					this.set("ilayServiceCode", this.get("ilayService").Code);
					//var prefix = Ext.isEmpty(this.get("ilayName")) ? "" : this.get("ilayName");
					//this.set("ilayName", this.get("ilayService").displayValue + ": " + prefix);
					this.set("ilayName", this.get("ilayService").displayValue);
					this.set("ilayBaseCost", this.get("ilayService").Price);
					
					if (!Ext.isEmpty(this.get("ilayPatient"))) {
						//this.setPatientAccount();
						Terrasoft.chain(
							function(next) {
								this.getPatientAccs(next);
							},
							function(next, patientAccs) {
								this.getActivePriceForAccount(next, patientAccs);
							},
							/*function(next, priceForAccount) {
								this.setSpecialTariff(next, priceForAccount);
							},
							function(next, priceForAccount) {
								this.setCoast(next, priceForAccount);
							},*/
						this);
					}
				} else {
					this.set("ilayName", "");
					this.set("ilayServiceCode", "");
					this.set("ilayBaseCost", 0.0);
					
					this.set("ilayPatientAccount", null);
					this.set("ilayPrice", null);
					this.set("ilayCoast", 0.0);
					
					this.set("ilaySpecialPrice", null);
					this.set("ilaySpecialCost", 0.0);
				}
			},
			setCoast: function(next/*, priceForAccount*/) {
				var entityPriceForService = Ext.create("Terrasoft.EntitySchemaQuery", {
						rootSchemaName: "ilayPriceForService"
					});
					entityPriceForService.addColumn("Id");
					entityPriceForService.addColumn("ilayPriceStatus");
					entityPriceForService.addColumn("ilayService");
					entityPriceForService.addColumn("ilayPrice");
					entityPriceForService.addColumn("ilayPriceValue");
					entityPriceForService.filters.addItem(Terrasoft.createColumnFilterWithParameter(
						Terrasoft.ComparisonType.EQUAL, "ilayPriceStatus", "0b57640a-9443-4c78-a739-0d9ab437b39e"));
					entityPriceForService.filters.addItem(Terrasoft.createColumnFilterWithParameter(
						Terrasoft.ComparisonType.EQUAL, "ilayService", this.get("ilayService").value));
					entityPriceForService.filters.addItem(Terrasoft.createColumnFilterWithParameter(
						Terrasoft.ComparisonType.EQUAL, "ilayPrice", /*priceForAccount.ilayPrice*/this.get("ilayPrice").value));
					entityPriceForService.getEntityCollection(function(resultPriceForService) {
						if (resultPriceForService.success) {
							if (resultPriceForService.collection.getCount() > 0) {
								this.set("ilayCoast", resultPriceForService.collection.getByIndex(0).get("ilayPriceValue"));
							} else {
								this.set("ilayCoast", 0.0);
							}
						}
				}, this);
			},
			setSpecialTariff: function(next/*, priceForAccount*/) {
				//if (priceForAccount.ilayPriceType == "d7c71086-bb98-48ef-88d3-b025487ed787") { // если базовый
				if (this.get("ilayPrice") && this.get("ilayPrice").ilayPriceType.value == "d7c71086-bb98-48ef-88d3-b025487ed787") {//Базовий
					var entityPriceForService = Ext.create("Terrasoft.EntitySchemaQuery", {
						rootSchemaName: "ilayPriceForService"
					});
					entityPriceForService.addColumn("Id");
					entityPriceForService.addColumn("ilayPriceStatus");
					entityPriceForService.addColumn("ilayService");
					entityPriceForService.addColumn("ilayPrice");
					entityPriceForService.addColumn("ilayPrice.ilayPriceType");
					
					var ilayPriceValue = entityPriceForService.addColumn("ilayPriceValue");
					ilayPriceValue.orderDirection = this.Terrasoft.OrderDirection.ASC;
					
					var filterGroup = new this.Terrasoft.createFilterGroup();
					filterGroup.logicalOperation = this.Terrasoft.LogicalOperatorType.OR;
					filterGroup.add("ilayPriceType", this.Terrasoft.createColumnFilterWithParameter(
						this.Terrasoft.ComparisonType.EQUAL, "ilayPrice.ilayPriceType", "2e00b180-4c35-4363-9615-367da557732d"));//Умовний
					filterGroup.add("ilayPriceType2", this.Terrasoft.createColumnFilterWithParameter(
						this.Terrasoft.ComparisonType.EQUAL, "ilayPrice.ilayPriceType", "1cc992cb-2f17-49fa-b974-7d4679bf4828"));//Акційний
					entityPriceForService.filters.addItem(filterGroup);
					
					entityPriceForService.filters.addItem(Terrasoft.createColumnFilterWithParameter(
						Terrasoft.ComparisonType.EQUAL, "ilayPriceStatus", "0b57640a-9443-4c78-a739-0d9ab437b39e"));//Активний
					entityPriceForService.filters.addItem(Terrasoft.createColumnFilterWithParameter(
						Terrasoft.ComparisonType.EQUAL, "ilayService", this.get("ilayService").value));
					//Den> [IL-440]
					var ilayPackageId = this.get("ilayPackage") ? this.get("ilayPackage").value : null
					if (ilayPackageId) entityPriceForService.filters.addItem(Terrasoft.createColumnFilterWithParameter(
						Terrasoft.ComparisonType.EQUAL, "ilayPackage", ilayPackageId));
					//Den< [IL-440]
					entityPriceForService.getEntityCollection(function(resultPriceForService) {
						if (resultPriceForService.success) {
							if (resultPriceForService.collection.getCount() > 0) {
								this.loadLookupDisplayValue("ilaySpecialPrice", resultPriceForService.collection.getByIndex(0).get("ilayPrice").value);
								this.set("ilaySpecialCost", resultPriceForService.collection.getByIndex(0).get("ilayPriceValue"));
								//next(priceForAccount);
								next();
							}
						}
					}, this);
				} else {
					this.set("ilaySpecialPrice", null);
					this.set("ilaySpecialCost", 0.0);
					//next(priceForAccount);
					next();
				}
			},
			getPatientAccs: function(next) {
				var patientAccs = [];
				var entity = Ext.create("Terrasoft.EntitySchemaQuery", {
						rootSchemaName: "ilayPatientAcc"
					});
					entity.addColumn("Id");
					entity.addColumn("ilayPatAccStatus");
					entity.addColumn("ilayAccountType");
					/*var ilayPriority = entity.addColumn("ilayAccountType.ilayPriority");
					ilayPriority.orderDirection = this.Terrasoft.OrderDirection.DESC;*/
					entity.filters.addItem(Terrasoft.createColumnFilterWithParameter(
						Terrasoft.ComparisonType.EQUAL, "ilayPatAccStatus", "c0ad5502-f232-4075-b9ea-3815ae4dc299"));
					entity.filters.addItem(Terrasoft.createColumnFilterWithParameter(
						Terrasoft.ComparisonType.EQUAL, "ilayPatient", this.get("ilayPatient").value));
					entity.getEntityCollection(function(result) {
						if (result.success) {
							for(var i = 0; i < result.collection.getCount(); i++) {
								patientAccs.push(result.collection.getByIndex(i).get("Id"));
							}
							next(patientAccs);
						}
				}, this);
			},
			getActivePriceForAccount: function(next, patientAccs) {
				this.set("ilayPrice", null);
				//Если при изменении поля "Послуга" тариф совпал с предыдущим значением, то пересчета не будет, по этому зануляется.
				var entityPriceForAccount = Ext.create("Terrasoft.EntitySchemaQuery", {
						rootSchemaName: "ilayPriceForAccount"
					});
					entityPriceForAccount.addColumn("Id");
					entityPriceForAccount.addColumn("ilayPriceStatus");
					entityPriceForAccount.addColumn("ilayPatientAcc");
					entityPriceForAccount.addColumn("ilayPricePlan");
					entityPriceForAccount.addColumn("ilayPricePlan.ilayPriceType");
					var ilayPriority = entityPriceForAccount.addColumn("ilayPatientAcc.ilayAccountType.ilayPriority");
					ilayPriority.orderDirection = this.Terrasoft.OrderDirection.DESC;
					entityPriceForAccount.filters.addItem(Terrasoft.createColumnFilterWithParameter(
						Terrasoft.ComparisonType.EQUAL, "ilayPriceStatus", "0b57640a-9443-4c78-a739-0d9ab437b39e"));
					var filterGroup = new this.Terrasoft.createFilterGroup();
					filterGroup.logicalOperation = this.Terrasoft.LogicalOperatorType.OR;
					filterGroup.add("ilayPatientAccFilters", this.Terrasoft.createColumnInFilterWithParameters(
						"ilayPatientAcc", patientAccs));
					entityPriceForAccount.filters.addItem(filterGroup);
					entityPriceForAccount.getEntityCollection(function(resultPriceForAccount) {
						if (resultPriceForAccount.success) {
							//var obj = {};
							for(var i = 0; i < resultPriceForAccount.collection.getCount(); i++) {
								/*obj = {
									ilayPrice: resultPriceForAccount.collection.getByIndex(i).get("ilayPrice").value,
									ilayPriceType: resultPriceForAccount.collection.getByIndex(i).get("ilayPrice.ilayPriceType").value
								};*/
								this.loadLookupDisplayValue("ilayPatientAccount",resultPriceForAccount.collection.getByIndex(i).get("ilayPatientAcc").value);
								this.loadLookupDisplayValue("ilayPrice", resultPriceForAccount.collection.getByIndex(i).get("ilayPricePlan").value);
								break;
							}
							//next(obj);
							next();
						}
				}, this);
			},
			isilaySpecialPriceEnabled: function() {
				if (!Ext.isEmpty(this.get("ilayPrice"))) {
					if (this.get("ilayPrice").ilayPriceType.value == "d7c71086-bb98-48ef-88d3-b025487ed787") {
						return true;
					} else {
						return false;
					}
				} else {
					return false;
				}
			},
			//Den> [IL-440]
			ilayPriceOrPackageChanged: function() {
			//Den< [IL-440]
				if (this.get("ilayService") && this.get("ilayPrice")) {
					Terrasoft.chain(
						function(next) {
							this.setSpecialTariff(next);
						},
						function(next) {
							this.setCoast(next);
						},
					this);
				}
			},
			isPatientAccountInsurance: function() {
				if (!Ext.isEmpty(this.get("ilayPatientAccount"))) {
					// Если счет с типом страховой
					if (this.get("ilayPatientAccount").ilayAccountType.value == "436982da-322d-42d1-a43d-6da6db82d2bc") {
						return false;
					} else {
						return true;
					}
				} else {
					return true;
				}
			},
			isPatientAccountInsuranceSelected: function() {
				if (!Ext.isEmpty(this.get("ilayPatientAccount"))) {
					// Если счет с типом страховой
					if (this.get("ilayPatientAccount").ilayAccountType.value == "436982da-322d-42d1-a43d-6da6db82d2bc") {
						return true;
					} else {
						return false;
					}
				} else {
					return true;
				}
			},
			//Den> [IL-390] Фильтр на поле Рахунок в Рахунках в сервісі.
			//Подписка на сообщение "GetPatientIdOnCardOpen" (публикуется на ilayilayPatientAcctInServ1Page).
			subscribeSandboxEvents: function() {
				this.callParent(arguments);
				this.sandbox.subscribe("GetPatientIdOnCardOpen", this.setPatientId, this, ["GetPatientIdOnCardOpen"]);
			},
			//Публикует сообщение "SetPatientIdOnCardOpen" (подписка на ilayilayPatientAcctInServ1Page), запрашивая у карточки ID пациента.
			setPatientId: function() {
				var patient = this.get("ilayPatient");
				if(!Ext.isEmpty(patient)) this.sandbox.publish("SetPatientIdOnCardOpen", patient.value, ["SetPatientIdOnCardOpen"]);
			},
			//Den< [IL-390]
			medicalDocumentType: function() {
				var servList =  this.get("Id");
				var filterGroup = new this.Terrasoft.createFilterGroup();
				filterGroup.logicalOperation = this.Terrasoft.LogicalOperatorType.AND;
				filterGroup.add("Id", this.Terrasoft.createColumnFilterWithParameter(
				this.Terrasoft.ComparisonType.EQUAL, "ilayPatientService", servList));
				filterGroup.add("MedicalType", this.Terrasoft.createColumnFilterWithParameter(
				this.Terrasoft.ComparisonType.EQUAL, "Type", "2F3F339E-7A37-4772-8C87-C4DFF260B341".toLowerCase()));
				return filterGroup;
			},
			//Andrew> [IL-424]
			recalcIlaySumPaidPacient: function() {
				//"ilayCoast", "ilaySumPaidInsurance"
				var coast = this.get("ilayCoast");
				var sumPaidIns = this.get("ilaySumPaidInsurance");
				this.set("ilaySumPaidPacient", coast - sumPaidIns);
			},
			onEntityInitialized: function() {
				this.callParent(arguments);
				this.recalcIlaySumPaidPacient();
			}
			//Andrew< [IL-424]
		},
		rules: {},
		userCode: {}
	};
});
