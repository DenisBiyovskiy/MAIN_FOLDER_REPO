var UserConnection = context.UserConnection;
string newTitle = "New answer to question at " + "<a href=\"https://24haymarket-test.bpmonline.com/0/Nui/ViewModule.aspx#CardModuleV2/AccountPageV2/edit/" + Get<Guid>("AccountID") + "\">" + Get<string>("AccountName") + "</a>";
Set("MailBody", newTitle);

var ContactESQ = new EntitySchemaQuery(UserConnection.EntitySchemaManager, "Contact");
ContactESQ.AddAllSchemaColumns();
var AccountFilter = ContactESQ.CreateFilterWithParameters(FilterComparisonType.Equal, "Id", Get<Guid>("ContactID"));
ContactESQ.Filters.Add(AccountFilter);
var CommunicationEnteties = ContactESQ.GetEntityCollection(UserConnection);
var clientEmail = CommunicationEnteties[0].GetTypedColumnValue<string>("Email");
Set("EmailsContacts", clientEmail);
return true;