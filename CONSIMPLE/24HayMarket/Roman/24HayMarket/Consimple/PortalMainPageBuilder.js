define("PortalMainPageBuilder", ["ServiceHelper", "ext-base", "PortalMainPageBuilderResources",
	"DashboardManager", "DashboardManagerItem", "DashboardBuilder", "css!UsrInfoMessageCSS"],
function(serviceHelper, Ext, resources) {
	var isFirst = true;

	Ext.define("Terrasoft.configuration.PortalMainPageViewConfig", {
		extend: "Terrasoft.DashboardsViewConfig",
		alternateClassName: "Terrasoft.PortalMainPageViewConfig",

		generate: function() {
			var viewConfig = this.callParent(arguments);
			var viewConfigElementsNames = viewConfig.map(function(element) {
				return element.name;
			});
			var tabsElementIndex = viewConfigElementsNames.indexOf("Tabs");
			if (tabsElementIndex !== -1) {
				var tabElement = viewConfig[tabsElementIndex];
				tabElement.visible = {
					"bindTo": "isTabsHeadersVisible"
				};

				var tabElementControlConfig = tabElement.controlConfig;
				var tabElementItems = tabElementControlConfig.items;
				var tabElementItemsMarkerValues = tabElementItems.map(function(element) {
					return element.markerValue;
				});
				var settingsButtonIndex = tabElementItemsMarkerValues.indexOf("SettingsButton");
				if (settingsButtonIndex !== -1) {
					tabElementItems[settingsButtonIndex].visible = {
						"bindTo": "IsNotSSP"
					};
				}
			}
			return viewConfig;
		}
	});

	
	Ext.define("Terrasoft.configuration.BasePortalMainPageViewModel", {
		extend: "Terrasoft.BaseDashboardsViewModel",
		alternateClassName: "Terrasoft.BasePortalMainPageViewModel",

		Ext: null,
		sandbox: null,
		Terrasoft: null,

		attributes: {
			
			"IsNotSSP": {
				"dataValueType": Terrasoft.DataValueType.BOOLEAN
			},
			"IsFirstTimeIn": {
				"dataValueType": Terrasoft.DataValueType.BOOLEAN
			},
		},

		
		isTabsHeadersVisible: function() {
			var tabCollection = this.get("TabsCollection");
			return this.get("IsNotSSP") || tabCollection.getCount() > 1;
		},


		init: function() {
			this.set("IsNotSSP", Terrasoft.CurrentUser.userType !== Terrasoft.UserType.SSP);
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
				var isPortalUser = result.success && (result.collection.getCount() === 1);
				if (isPortalUser) {
					if (sessionStorage.getItem("sessionID")) {
						if (sessionStorage.getItem("sessionID") == Terrasoft.SysValue.CURRENT_USER.value) {
							this.set("IsFirstTimeIn", false);
						} else {
							sessionStorage.setItem("sessionID", Terrasoft.SysValue.CURRENT_USER.value);
							this.set("IsFirstTimeIn", true);
						}
					} else {
						sessionStorage.setItem("sessionID", Terrasoft.SysValue.CURRENT_USER.value);
						this.set("IsFirstTimeIn", true);
					}
					if (this.get("IsFirstTimeIn")) {
						this.showInfoMessage();
						isFirst = false;
						this.set("IsFirstTimeIn", false);
					}
				}
			}, this);
			this.callParent(arguments);
		},

		showInfoMessage: function() {
			var text = "The content of this promotion has not been approved by an authorised person within the meaning of the Financial Services and Markets Act 2000. Reliance on this promotion for the purpose of engaging in any investment activity may expose an individual to a significant risk of losing all of the property or other assets invested.\n\nIMPORTANT INFORMATION\n\nThe 24Haymarket Investor Portal and its materials do not constitute a public offer or prospectus or invitation to the public. Its purpose is to provide information on potential investee companies (the “Company”) to individuals who have expressed an interest in order to assist them in assessing whether they wish to make investigations of their own and to invest in a Company. \n\nThe 24Haymarket Investor Portal and its materials are a financial promotion within the meaning of section 21 of the Financial Services and Markets Act 2000 (“FSMA”) and has not been approved by an authorised person. The 24Haymarket Investor Portal and its materials are exempt from the general restriction (in section 21 of FSMA) on the communication of invitations or inducements to engage in investment activity on the ground that it is only being made and provided to relevant persons (as defined below) with sufficient experience and understanding of the risks involved.\nThe 24Haymarket Investor Portal and its materials are being made available on the basis that each person to whom it is being made available is reasonably believed to be such a person as is described in Article 19 (investment professionals), Article 48 (certified high net worth individuals), Article 49 (high net worth companies, unincorporated associations etc), Article 50 (sophisticated investors), Article 50A (self certified sophisticated investors) or Article 51 (associations of high net worth or sophisticated investors) or other relevant Articles of the Financial Services and Markets Act 2000 (Financial Promotions) Order 2005 (FPO), or is a person to whom this system and its materials may otherwise lawfully be made available (relevant persons).  Neither the 24Haymarket Investor Portal and its materials nor any of its contents may be acted on or relied on by persons who are not relevant persons, the investments to which they relate are available only to relevant persons and no investment or investment activity will be accepted by the Company with any person who is not a relevant person. Any person in doubt about the investment to which the 24Haymarket Investor Portal and its materials relate should consult an authorised person specialising in advising on investments of the kind in question.  Reliance on any document contained herein for the purposes of engaging in any investment activity may expose the individual to a significant risk of losing all of the property invested.  \n\nAn investment professional is a person who has professional experience in matters relating to investments and who falls within those categories of persons set out in Article 19(5) of the FPO being (a) an authorised person, (b) an exempt person where the communication relates to a controlled activity which is a regulated activity in relation to which the person is exempt, (c) any other person (i) whose ordinary activities involve him in carrying on the controlled activity to which the communication relates for the purposes of a business carried on by him; or (ii) who it is reasonable to expect will carry on such activity for the purposes of a business carried on by him, (d) a government, local authority or an international organisation or (e) to certain restricted persons who are directors, officers or employees of a person falling within categories (a) to (d).\n\nA certified high net worth individual is any individual who has signed, within the period of 12 months ending on the date on which this communication is made, a statement, complying with Part I of Schedule 5 of the FPO, that he is a high net worth individual.  A high net worth individual is a person who (1) had, during the financial year immediately preceding the date on which the certificate is signed, an annual income of not less than £100,000; or (2) held, throughout the financial year immediately preceding the date on which the certificate is signed, net assets to the value of not less than £250,000. In determining the net assets of an individual, no account shall be taken of: (a) the main residence of the individual; (b) the value of any life insurance policy of the individual; or (c) the pension benefits of the individual. \n\nHigh net worth companies, unincorporated associations etc falling within Article 49 are: (a) any body corporate which has, or which is a member of the same group as an undertaking which has, a called-up share capital or net assets of not less than (i) if the body corporate has more than 20 members or is a subsidiary undertaking of an undertaking which has more than 20 members, £500,000; or (ii) otherwise £5 million, (b) any unincorporated association or partnership which has net assets of not less than £5 million, (c) the trustee of a high value trust (as defined in the FPO), (d) any person (“A”) whilst acting in the capacity of director, officer or employee of a person (“B”) falling within any of subparagraphs (a) to (c) where A’s responsibilities, when acting in that capacity, involve him in B’s engaging in investment activity, (e) any person to whom the communication may otherwise lawfully be made.   \n\nA sophisticated investor is any individual who has a current certificate signed by an authorised person to the effect that he or she is sufficiently knowledgeable to understand the risks associated with that type of investment and who has himself or herself, within the period of 12 months ending with the date on which the communication is made, signed a statement complying with Article 50(1)(b) of the FPO.\n\nA self-certified sophisticated investor is any individual who has signed, within the period of 12 months ending with the day on which the communication is made, a statement complying with Part II of Schedule 5 of the FPO.  In that statement, the individual must confirm, inter alia, that he or she is (a) a member of a network or syndicate of business angels and has been so for at least the last six months, or (b) has made more than one investment in an unlisted company in the two years prior to the date of signature, or (c) is working or has worked in the two years prior to the date of signature in a professional capacity in the private equity sector or in the provision of finance for small and medium enterprises; or (d) is currently or has been in the two years prior to the date of signature a director of a company with an annual turnover of at least £1 million.\n\nAssociations of high net worth or sophisticated investors means an association or a member of an association comprising wholly or predominantly of persons falling within Articles 48, 49, 50 or 50A.\n\n24Haymarket intends to identify certain companies for potential investment and may pass information on certain of these companies (“Investee Companies”) to you. Where 24Haymarket forwards information from Investee Companies to you, such information has been received from the relevant Investee Company in good faith.  24Haymarket acts solely as an information provider and will not take independent steps to verify the information provided.  24Haymarket takes no responsibility for the accuracy, truthfulness or otherwise of the information provided.  Where 24Haymarket reproduces information or provides you with a summary of information on an Investee Company then such information and/or summaries will be compiled in good faith but no responsibility is taken by 24Haymarket for the contents of such information and/or summaries.  Where 24Haymarket does undertake any due diligence then such due diligence shall be limited in scope and so may not identify all or any material factors which may influence your decision to invest, or any associated aspect.\n\nInvestments in unquoted securities are highly speculative, carrying high risk as well as the potential for high rewards.  You should only consider investing if you understand the risks associated with such investments and are able to suffer any losses that may be incurred.   There is no ready market for the realisation of that investment, or its valuation, or the risks to which an investment is exposed.  The figures stated within this document are purely illustrative and do not constitute a forecast.\n\nThe typical Investee Company that 24Haymarket may provide you with information on are typically smaller, early-stage companies, usually with no or a limited trading record and so generally are at a stage where they are not yet profitable or have any revenue stream. \n\nInvestee Companies are likely to carry substantially higher risks than would an investment in larger or longer-established businesses.  Given the early stage nature of the Investee Companies, and the fact that many are in high-risk sectors or developing potentially untested or unproved business ideas or intellectual property may mean they may fail.  Investee Companies will often have limited product lines, markets or financial resources and may be dependent for their management on a smaller number of key individuals.\n\nInvestee Companies are likely to require multiple investment rounds, possibly at higher or lower valuations, and should you not commit further funds to such future investment rounds you may find your shareholding is diluted.  Investee Companies may also be more difficult to accurately value than more established businesses.\n\nWhile 24Haymarket may look for certain rights in respect of Investee Companies, it will not control the companies or their boards of directors and may not always be in a position to fully protect its interests and its influence over the Investee Company may be restricted.  Where 24Haymarket appoints an investor director then such investor director will not owe any duty to you.\n\nThe market for shares in Investee Companies is likely to be less liquid than that for shares in larger companies, bringing with it potential difficulties in acquiring, valuing and disposing of such shares.  Shares in Investee Companies may also be subject to restrictions on the transfer and/or disposal of shares which may limit your ability to dispose of them for valuable consideration.\n\nThis document and any information provided on Investee Companies does not constitute an offer, invitation, recommendation or solicitation in respect of securities or any other investment and contains information designed only to provide a broad overview for discussion purposes and will not form the basis of any contract. As such, all information provided herein and on Investee Companies is subject to change.  Any information provided on 24Haymarket or an Investee Companies does not purport to provide a complete description of that company or its future prospects or performance. No representation or warranty, express or implied, is made as to, and no reliance should be placed on, the fairness, accuracy, completeness or correctness of the information or opinions or projections contained therein. All expressions of opinion are subject to change without notice and do not constitute advice and should not be relied upon. To the fullest extent permitted by law, neither 24Haymarket nor any of their directors, shareholders, partners, employees, consultants, advisers or representatives shall have any responsibility or liability whatsoever (for negligence or otherwise) for any loss howsoever arising from any use of this document or its contents or otherwise arising in connection with this document. The information set out herein may be subject to material updating, completion, revision and amendment.\n\nProspective investors should not construe the contents of this document or any information on an Investee Company as legal, tax, investment or other advice, or as a recommendation to invest.  Each prospective investor should make his or her own enquiries and consult his or her professional advisers as to the fundraising and the legal, tax, financial and other relevant matters concerning an investment in an Investee Company and the suitability of the investment for such an investor.  The recipients of this document acknowledge that they will be solely responsible for carrying out their own investigations, including the costs and expenses thereby incurred, and forming their own view as to the condition and prospects of an Investee Company and the accuracy and completeness of the statements contained within this document.  Before investing in an Investee Company, recipients are strongly advised to seek advice from a person authorised under FSMA.\n\nCertain assumptions may have been made in the calculations and analysis and projections in this document and in any information provided on an Investee Company. No representation is made that the projections, estimates or description of prospects detailed will be achieved in the future.  This document and any information provided on an Investee Company is based upon information which 24Haymarket considers reliable, but no representation is made that it is accurate or complete and nor should it be relied upon as such. Certain economic and market information contained may have been obtained from sources prepared by other parties. While such sources are believed to be reliable, neither 24Haymarket nor any of its advisers assumes any responsibility for the accuracy or completeness of such information. Nothing in this disclaimer shall exclude any liability for, or remedy in respect of, fraudulent misrepresentation. \n\n24Haymarket and its shareholders reserve the right at any time and at their full discretion to terminate or modify the present procedure or discussions or to negotiate with any other party, without disclosing the reasons for such decision, and the recipients shall have no claim whatsoever against 24Haymarket, its shareholders, or any of their directors, partners, employees, advisers or representatives.  None of 24Haymarket, its shareholders, or any of its directors or agents undertake to accept the highest, or any, offer to invest and reserve the right to accept or reject any such offer.\n\nRecipients of this document in jurisdictions outside the UK should inform themselves about and observe all applicable legal requirements in their jurisdictions. In particular, the distribution of this document in certain jurisdictions may be restricted by law.  No investment arrangements or activity will be entered into with any person outside the UK unless the directors of 24Haymarket are satisfied that such arrangements or activity is lawful in all applicable jurisdictions.\n\nNo part of this document may be reproduced, stored in a retrieval system, divulged to a third party or transmitted in any way or by any means, (including photocopying, recording or storing it in any medium by electronic means), without the prior written permission of the Company.\n\n\nAll enquiries should be addressed to:\n\nPaul Tselentis\n\nEmail: paul@24haymarket.com\n\n\n";
			Terrasoft.utils.showMessage({
				caption: text,
				buttons: [{
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
				}],
				defaultButton: 0,
				style: Terrasoft.MessageBoxStyles.BLUE,
				handler: function(buttonCode) {
					if (buttonCode === "no") {
						serviceHelper.callService("MainMenuService", "Logout", function() {
							window.logout = true;
							window.location.replace(Terrasoft.loaderBaseUrl + "?simpleLogin");
						}, {}, this);
					}
				}
			});
			var parent = document.getElementById("t-comp0-wrap");
			var child = document.getElementById("t-comp0-cover");
			parent.removeChild(child);
		},

		initResourcesValues: function() {
			var resourcesSuffix = "Resources";
			Terrasoft.each(resources, function(resourceGroup, resourceGroupName) {
				resourceGroupName = resourceGroupName.replace("localizable", "");
				Terrasoft.each(resourceGroup, function(resourceValue, resourceName) {
					var viewModelResourceName = [resourcesSuffix, resourceGroupName, resourceName].join(".");
					this.set(viewModelResourceName, resourceValue);
				}, this);
			}, this);
		}

	});

	
	var portalMainPageBuilder = Ext.define("Terrasoft.configuration.PortalMainPageBuilder", {
		extend: "Terrasoft.DashboardBuilder",
		alternateClassName: "Terrasoft.PortalMainPageBuilder",

		
		viewModelClass: "Terrasoft.BasePortalMainPageViewModel",

		
		viewConfigClass: "Terrasoft.PortalMainPageViewConfig"

	});

	return portalMainPageBuilder;

});