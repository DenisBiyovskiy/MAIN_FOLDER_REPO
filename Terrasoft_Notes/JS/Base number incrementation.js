Base number incrementation

                 /**
                 * @inheritDoc Terrasoft.BasePageV2#onEntityInitialized
                 * @overridden
                 */
                onEntityInitialized: function() {
                    if (this.isAddMode() || this.isCopyMode()) {
                        this.getIncrementCode(function(responce) {
                            this.set("Number", responce);
                        });
                    }
                    this.callParent(arguments);
                    this.setAmountEnabled();
                },
//also needs to add 2 sysSettings CodeMask, and LastCode.
