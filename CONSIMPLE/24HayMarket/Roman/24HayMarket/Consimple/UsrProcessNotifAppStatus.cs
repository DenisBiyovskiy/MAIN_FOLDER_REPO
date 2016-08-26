var UserConnection = context.UserConnection;
string newTitle = "EIS Form Application status updated at " + "<a href=\"https://24haymarket-test.bpmonline.com/0/Nui/ViewModule.aspx#CardModuleV2/AccountPageV2/edit/" + Get<Guid>("AccountID") + "\">" + Get<string>("AccountName") + "</a>";
Set("MailBody", newTitle);

var ContactESQ = new EntitySchemaQuery(UserConnection.EntitySchemaManager, "UsrInvestment");
ContactESQ.AddAllSchemaColumns();
var emailColumn = ContactESQ.AddColumn("UsrInvestorName.Email").Name;
var AccountFilter = ContactESQ.CreateFilterWithParameters(FilterComparisonType.Equal, "UsrAccount", Get<Guid>("AccountID"));
ContactESQ.Filters.Add(AccountFilter);
var CommunicationEnteties = ContactESQ.GetEntityCollection(UserConnection);
foreach (Entity contact in CommunicationEnteties) {
	var clientEmail = contact.GetTypedColumnValue<string>(emailColumn);
	if (Get<string>("EmailsContacts") == null) {
		Set("EmailsContacts", clientEmail);
	} else {
		Set("EmailsContacts", Get<string>("EmailsContacts") + " , " + clientEmail);
	}
}
return true;