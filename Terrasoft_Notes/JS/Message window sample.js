Message window sample

Terrasoft.utils.showMessage({
	 caption: this.get("Resources.Strings.InputProbabilityError"),
	 buttons: ["cancel"],
	 style: Terrasoft.MessageBoxStyles.BLUE
});

this.showConfirmationDialog(this.get("Resources.Strings.CurrencyRateDateQuestion"),
									function(returnCode) {
										if (returnCode === this.Terrasoft.MessageBoxButtons.YES.returnCode) {
											this.setCurrencyRate();
										}
									}, ["yes", "no"]);

this.Terrasoft.utils.showMessage({
	caption: this.get("Resources.Strings.LinkProductCaption"),
	buttons: [{
		className: "Terrasoft.Button",
		returnCode: "ButtonAll",
		style: "blue",
		caption: this.get("Resources.Strings.QuestionAllCaption"),
		markerValue: this.get("Resources.Strings.QuestionAllCaption")
	}, {
		className: "Terrasoft.Button",
		returnCode: "ButtonChoice",
		style: this.Terrasoft.controls.ButtonEnums.style.GREY,
		caption: this.get("Resources.Strings.QuestionChoiceCaption"),
		markerValue: this.get("Resources.Strings.QuestionChoiceCaption")
	}, "cancel"],
	defaultButton: 0,
	style: this.Terrasoft.MessageBoxStyles.BLUE,
	handler: function(buttonCode) {
		if (buttonCode === "ButtonAll") {
			 this.connectProducts(contractId);
		}
		if (buttonCode === "ButtonChoice") {
			 this.openProductLookupToLink(contractId);
		}
		if (buttonCode === "cancel") {
			 this.openContractPage(contractId);
		}
	},
	scope: this
});

var cfg = {
		style: Terrasoft.MessageBoxStyles.BLUE
	};
this.showConfirmationDialog(
	"Введите штрих-код",
	function getSelectedButton(returnCode) {
	if (returnCode === Terrasoft.MessageBoxButtons.YES.returnCode) {
							this.showInformationDialog("123");
	}
}, ['yes', 'no'], cfg);