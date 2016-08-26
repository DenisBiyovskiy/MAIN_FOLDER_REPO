var UserConnection = context.UserConnection;
string newTitle = "Account type updated to ‘Portfolio’ at <a href=\"https://24haymarket-test.bpmonline.com/0/Nui/ViewModule.aspx#CardModuleV2/AccountPageV2/edit/" + Get<Guid>("AccountID") + "\">" + Get<string>("AccountName") + "</a>";
Set("TitleTask", newTitle);
return true;
var ContactESQ = new EntitySchemaQuery(UserConnection.EntitySchemaManager, "UsrInvestment");
ContactESQ.AddAllSchemaColumns();
var clientColumn = ContactESQ.AddColumn("UsrInvestorName.Email").Name;
var AccountFilter = ContactESQ.CreateFilterWithParameters(FilterComparisonType.Equal, "UsrAccount", Get<Guid>("AccountID"));
ContactESQ.Filters.Add(AccountFilter);
var CommunicationEnteties = ContactESQ.GetEntityCollection(UserConnection);
foreach (Entity contact in CommunicationEnteties) {
	var client = contact.GetTypedColumnValue<string>(clientColumn);
	if (Get<string>("EmailsContacts") == null) {
		Set("EmailsContacts", client);
	} else {
		Set("EmailsContacts", Get<string>("EmailsContacts") + " , " + client);
	}
}
return true;