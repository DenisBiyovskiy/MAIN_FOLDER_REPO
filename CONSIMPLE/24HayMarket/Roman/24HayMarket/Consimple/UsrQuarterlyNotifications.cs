var UserConnection = context.UserConnection;

var AccountESQ = new EntitySchemaQuery(UserConnection.EntitySchemaManager, "Account");
AccountESQ.AddAllSchemaColumns();
var AccountEntities = AccountESQ.GetEntityCollection(UserConnection);
foreach (Entity account in AccountEntities) {
	if (account.GetTypedColumnValue<string>("UsrEmailAdress") != "") {
		string emailBody = "Quarterly notifications at " + "<a href=\"https://24haymarket-test.bpmonline.com/0/Nui/ViewModule.aspx#CardModuleV2/AccountPageV2/edit/" + account.GetTypedColumnValue<Guid>("Id") + "\">" + account.GetTypedColumnValue<string>("Name") + "</a>";
		List<string> contactsEmail = new List<string>();
		contactsEmail.Add(account.GetTypedColumnValue<string>("UsrEmailAdress"));
		string[] contactsEmailArray = contactsEmail.ToArray();

		var smtpClient = new Terrasoft.Mail.SmtpClient(UserConnection);

		MailCredentials credentials = new MailCredentials();

		credentials.Host = (string)SysSettings.GetValue(UserConnection, "SmtpHost");
		credentials.Port = int.Parse(SysSettings.GetValue(UserConnection, "SmtpPort").ToString());
		credentials.UseSsl = (bool)SysSettings.GetValue(UserConnection, "SmtpEnableSsl");
		credentials.UserName = (string)SysSettings.GetValue(UserConnection, "SmtpUserName");
		credentials.UserPassword = (string)SysSettings.GetValue(UserConnection, "SmtpUserPassword");
		credentials.Timeout = 30000;

		if (credentials.Host != null && credentials.Port != null && credentials.UserName != null && credentials.UserPassword != null) {
			MailMessage message = smtpClient.CreateMessage(emailBody, "Quarterly notifications", contactsEmailArray, credentials.UserName,
			true, new Dictionary<Guid, Tuple<byte[], string>>(0));
			smtpClient.SendMessage(message, credentials);
			contactsEmail.Clear();
		}
	}
}
return true;
// MailBee.Mime
// Terrasoft.Mail