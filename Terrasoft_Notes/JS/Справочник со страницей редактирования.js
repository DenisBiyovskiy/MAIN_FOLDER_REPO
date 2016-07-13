Справочник со страницей редактирования:
Можно создать мастером скрытый раздел, после чего удалитm все лишнее(кроме пейджи и секции с объектом.)
Для корректной работы секции указываем в ней код:
В депенденсис в меню справа добаляем "объект" (тут ilayDocReports) и ConfigurationEnums.
Код секции.
define("ilayDocReportsSection", ["ConfigurationEnums", "GridUtilitiesV2"],
function(ConfigurationEnums) {
    return {
        entitySchemaName: "ilayDocReports",
        contextHelpId: "1001",
        diff: /**SCHEMA_DIFF*/[
            {
                "operation": "insert",
                "name": "SeparateModeBackButton",
                "parentName": "SeparateModeActionButtonsLeftContainer",
                "propertyName": "items",
                "index": 2,
                "values": {
                    "itemType": this.Terrasoft.ViewItemType.BUTTON,
                    "caption": {"bindTo": "Resources.Strings.BackButtonCaption"},
                    "click": {"bindTo": "closeSection"},
                    "classes": {
                        "textClass": ["actions-button-margin-right"],
                        "wrapperClass": ["actions-button-margin-right"]
                    },
                    "visible": {"bindTo": "SeparateModeActionsButtonVisible"}
                }
            }
        ]/**SCHEMA_DIFF*/,
        messages: {},
        methods: {
            /**
             * @inheritdoc Terrasoft.BaseSectionV2#getProfileKey
             * @overridden
             */
            getProfileKey: function() {
                var currentTabName = this.getActiveViewName();
                var schemaName = this.name;
                return schemaName + this.entitySchemaName + "GridSettings" + currentTabName;
            },
            /**
             * @inheritdoc Terrasoft.BaseSectionV2#addCardHistoryState
             * @overridden
             */
            addCardHistoryState: function(schemaName, operation, primaryColumnValue) {
                if (!schemaName) {
                    return;
                }
                var cardOperationConfig = {
                    schemaName: schemaName,
                    operation: operation,
                    primaryColumnValue: primaryColumnValue
                };
                var historyState = this.getHistoryStateInfo();
                var stateConfig = this.getCardHistoryStateConfig(cardOperationConfig);
                var eventName = (historyState.workAreaMode === ConfigurationEnums.WorkAreaMode.COMBINED)
                    ? "ReplaceHistoryState"
                    : "PushHistoryState";
                this.sandbox.publish(eventName, stateConfig);
            },
            /**
             * @inheritdoc Terrasoft.BaseSectionV2#removeCardHistoryState
             * @overridden
             */
            removeCardHistoryState: function() {
                var module = "LookupSectionModule";
                var schema = this.name;
                var historyState = this.sandbox.publish("GetHistoryState");
                var currentState = historyState.state;
                var newState = {
                    moduleId: currentState.moduleId
                };
                var hash = [module, schema].join("/");
                this.sandbox.publish("PushHistoryState", {
                    hash: hash,
                    stateObj: newState,
                    silent: true
                });
            },
            /**
             * @inheritdoc Terrasoft.BaseSectionV2#isMultiSelectVisible
             * @overridden
             */
            isMultiSelectVisible: function() {
                return false;
            },

            /**
             * @inheritdoc Terrasoft.BaseSectionV2#isSingleSelectVisible
             * @overridden
             */
            isSingleSelectVisible: function() {
                return false;
            },

            /**
             * @inheritdoc Terrasoft.BaseSectionV2#isUnSelectVisible
             * @overridden
             */
            isUnSelectVisible: function() {
                return false;
            },
            /**
             * Откатывает цепочку до предыдущего состояния.
             * @protected
             * @virtual
             */
            closeSection: function() {
                var module = "LookupSection";
                this.sandbox.publish("PushHistoryState", {
                    hash: this.Terrasoft.combinePath("SectionModuleV2", module)
                });
            }
        }
    };
});
