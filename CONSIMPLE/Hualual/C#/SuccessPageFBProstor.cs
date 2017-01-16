MessagePanel messagePanel = ControlUtilities.FindControl(
    Page.AspPage.Controls[0], "BaseMessagePanel", true) as MessagePanel;
if (messagePanel != null) {
	string successMessageId = "successAuth";
	messagePanel.Remove(successMessageId);
	string message = "Авторизация выполнена успешно!";
	string MessageTitle = "";
	messagePanel.AddMessage(successMessageId, MessageTitle, message, MessageType.Information);
}

string uri = HttpContext.Current.Request.Url.AbsoluteUri;
if(uri.Contains("&code")){
	string code = uri.Substring(uri.IndexOf("&code") + 6);
	string facebookAppID = Terrasoft.Core.Configuration.SysSettings.GetValue(UserConnection, "FacebookAppID").ToString();
	string facebookAppSecret = Terrasoft.Core.Configuration.SysSettings.GetValue(UserConnection, "FacebookAppSecret").ToString();
	string facebookAppRedirectUri = Terrasoft.Core.Configuration.SysSettings.GetValue(UserConnection, "FacebookRedirectUri").ToString();
	Terrasoft.Configuration.Facebook.FacebookHelper facebook = new Terrasoft.Configuration.Facebook.FacebookHelper(facebookAppID, facebookAppSecret, facebookAppRedirectUri);
	string accessToken = facebook.GetAccessToken(code);
	if(accessToken != null){
		Terrasoft.Core.Configuration.SysSettings.SetValue(UserConnection, UserConnection.RootAdminUnitGroupId,
        	"FacebookAccessToken", accessToken);
		var response = facebook.RequestResponse("https://graph.facebook.com/oauth/access_token?client_id=" + facebookAppID + "&client_secret=" + facebookAppSecret + "&grant_type=fb_exchange_token&fb_exchange_token=" + accessToken);
		if (response.Contains("access_token="))
        {
            string newAccessToken = response.Substring(response.IndexOf("access_token") + 13);
            newAccessToken = newAccessToken.Substring(0, newAccessToken.IndexOf("&expires"));
			Terrasoft.Core.Configuration.SysSettings.SetValue(UserConnection, UserConnection.RootAdminUnitGroupId,
        		"FacebookAccessToken", newAccessToken);
        }
	}
}
return true;