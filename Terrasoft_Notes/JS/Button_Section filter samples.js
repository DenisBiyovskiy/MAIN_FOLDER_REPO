Button/Section filter samples

define("ContactSectionV2", ["GridUtilitiesV2", "GoogleIntegrationUtilities", "RightUtilities",
                "ConfigurationConstants", "GoogleIntegrationUtilitiesV2"],
        function(gridUtilitiesV2, GoogleUtilities, RightUtilities, ConfigurationConstants) {
                return {
                        entitySchemaName: "Contact",
                        attributes: {
                                "TestAttr": {
                                        dataValueType: Terrasoft.DataValueType.TEXT
                                },
                                "IsActiveTestAttr": {
                                        dataValueType: Terrasoft.DataValueType.TEXT
                                }
                        },
                        messages: {
                        },
                        mixins: {
                        },
                        methods: {
                                filterOn: function() {
                                        this.set("TestAttr", "Канев");
                                        this.set("IsActiveTestAttr", true);
                                        this.reloadGridData();
                                },
                                filterOff: function() {
                                        this.set("TestAttr", "");
                                        this.set("IsActiveTestAttr", false);
                                        this.reloadGridData();
                                },
                                initQueryFilters: function(esq) {//section filter
                                        this.callParent(arguments);

var testAttr = this.get("TestAttr");
var isActive = this.get("IsActiveTestAttr");

if (!isActive) {
   esq.filters.removeByKey("FilterContactCommunication");
} else {
   esq.filters.add("FilterContactCommunication", this.Terrasoft.createColumnFilterWithParameter(
   this.Terrasoft.ComparisonType.CONTAIN, "Name", testAttr));

                                        }
                                }
                        },
                        diff: /**SCHEMA_DIFF*/ [//button add sample
                                {
                                        "operation": "insert",
                                        "parentName": "SeparateModeActionButtonsLeftContainer",
                                        "propertyName": "items",
                                        "name": "FilterOn",
                                        "values": {
                                                "itemType": Terrasoft.ViewItemType.BUTTON,
                                                "caption": "filter on",
                                                "click": {
                                                        "bindTo": "filterOn"
                                                }
                                        }
                                },
                                {
                                        "operation": "insert",
                                        "parentName": "SeparateModeActionButtonsLeftContainer",
                                        "propertyName": "items",
                                        "name": "FilterOff",
                                        "values": {
                                                "itemType": Terrasoft.ViewItemType.BUTTON,
                                                "caption": "filter off",
                                                "click": {
                                                        "bindTo": "filterOff"
                                                }
                                        }
                                }
                        ] /**SCHEMA_DIFF*/
                };
        });
Section filter/ join sample

initQueryFilters: function(esq) {
this.callParent(arguments);
var isActive = this.get("IsOpportunityListing");
//var filterValue = "386BDD79-8A1A-4853-8550-A6AE4CA0A5AE".toLowerCase();
if (isActive == false) {
     esq.filters.removeByKey("ListingReservationFilter");
} else {
     esq.filters.add("ListingReservationFilter", this.Terrasoft.createColumnFilterWithParameter(
     //this.Terrasoft.ComparisonType.NOT_EQUAL, "[UsrReservation:UsrListing:Id].UsrReservationState", filterValue));
     this.Terrasoft.ComparisonType.EQUAL, "UsrHasActiveReserv", 0));
}
},

Add button in Section Actions Menu

getSectionActions: function() {
     var actionMenuItems = this.callParent(arguments);
     actionMenuItems.addItem(this.getActionsMenuItem({
          Type: "Terrasoft.MenuSeparator",
          Caption: ""
     }));
     actionMenuItems.addItem(this.getActionsMenuItem({
          Caption: "Запустить процесс управления лидом",
          Click: {bindTo: "startProcess"},
          Enabled: {bindTo: "UsrLeadManagmentEnabled"}
     }));
     return actionMenuItems;
}

CombinedMode - это кнопки которые отображаются при открытии карточки редактирования НЕПОСРЕДСТВЕННО с секции. Добавлять на секции.
SeparateMode - кнопки которые отображаются на секции(и только). -//-

При добавлении кнопок в LeftContainer с page - они отображаются только при открытии карточки с левых мест, по ссылке(НЕ из секции) и тд. Добавлять на карточке.

//Кнопка "Скасувати".
                {
                    "operation": "insert",
                    "name": "CombinedModeCancelServiceButton",
                    "parentName": "CombinedModeActionButtonsCardLeftContainer",
                    "propertyName": "items",
                    "values": {
                        "itemType": Terrasoft.ViewItemType.BUTTON,
                        "caption": {"bindTo": "Resources.Strings.ActionButtonsCardCaption"},
                        "click": {"bindTo": "onCancelServiceButtonClick"},
                        "classes": {
                            "textClass": ["actions-button-margin-right"],
                            "wrapperClass": ["actions-button-margin-right"]
                        },
                        "visible": {bindTo: "isCancelServiceButtonVisible"}
                    }
                }/*,
                //Кнопка "Скасувати". And this too. :)
                {
                    "operation": "insert",
                    "name": "SeparateModeCancelServiceButton",
                    "parentName": "SeparateModeActionButtonsLeftContainer",
                    "propertyName": "items",
                    "values": {
                        "itemType": Terrasoft.ViewItemType.BUTTON,
                        "caption": {"bindTo": "Resources.Strings.ActionButtonsCardCaption"},
                        "click": {bindTo: "onCancelServiceButtonClick"},
                        "classes": {
                            "textClass": ["actions-button-margin-right"],
                            "wrapperClass": ["actions-button-margin-right"]
                        },
                        "visible": false
                    }
                }*/
