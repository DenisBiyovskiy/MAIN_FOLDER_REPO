define("AmenityDetail", ["ViewUtilities", "AmenityDetailResources", "LookupUtilities", "RealtyConstants",
		"ConfigurationEnums", "AmenityHelper", "AmenityInObject", "AmenityInRequest", "AmenityViewModel",
		"css!AmenityViewModel", "BaseDetailV2"],
	function(ViewUtilities, resources, LookupUtilities, RealtyConstants, enums, AmenityHelper, AmenityInObject,
	AmenityInRequest) {
		return {
			entitySchemaName: "AmenityInObject",
			attributes: {},
			messages: {
				/**
				 *
				 * @message AmenityChanged
				 */
				"AmenityChangedAvito": {
					mode: this.Terrasoft.MessageMode.PTP,
					direction: this.Terrasoft.MessageDirectionType.PUBLISH
				}
			},
			methods: {
				/**
				 * Обработчик изменения коллекции детали.
				 * @param {Terrasoft.BaseViewModel} item Измененный элемент.
				 * @param {Object} config Свойства операции изменения элемента.
				 */
				onItemChanged: function() {
					this.setChangeCard(true);
					this.sandbox.publish("AmenityChanged", null, [this.sandbox.id]);
					this.sandbox.publish("AmenityChangedAvito", null, [this.sandbox.id]);
				}
			},
			diff: /**SCHEMA_DIFF*/[]/**SCHEMA_DIFF*/
		};
	}
);
