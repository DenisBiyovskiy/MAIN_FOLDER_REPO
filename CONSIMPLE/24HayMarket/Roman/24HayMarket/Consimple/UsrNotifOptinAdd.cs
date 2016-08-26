var UserConnection = context.UserConnection;
string newTitle = "Investment Opt-in created at " + "<a href=\"https://24haymarket-test.bpmonline.com/0/Nui/ViewModule.aspx#CardModuleV2/AccountPageV2/edit/" + Get<Guid>("AccountID") + "\">" + Get<string>("AccountName") + "</a>";
Set("MailBody", newTitle);

var ContactESQ = new EntitySchemaQuery(UserConnection.EntitySchemaManager, "Contact");
ContactESQ.AddAllSchemaColumns();
var AccountFilter = ContactESQ.CreateFilterWithParameters(FilterComparisonType.Equal, "Type", new Guid("806732EE-F36B-1410-A883-16D83CAB0980"));
ContactESQ.Filters.Add(AccountFilter);
var CommunicationEnteties = ContactESQ.GetEntityCollection(UserConnection);
foreach (Entity contact in CommunicationEnteties) {
	var clientEmail = contact.GetTypedColumnValue<string>("Email");
	if (Get<string>("EmailsContacts") == null) {
		Set("EmailsContacts", clientEmail);
	} else {
		Set("EmailsContacts", Get<string>("EmailsContacts") + " , " + clientEmail);
	}
}
return true;