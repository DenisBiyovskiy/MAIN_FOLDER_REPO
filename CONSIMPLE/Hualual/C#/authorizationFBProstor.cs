var socialNetworkName = Get("SocialNetwork");
if (string.IsNullOrEmpty(socialNetworkName)) {
		(Page.AspPage as Terrasoft.UI.Core.Page).Close();
		return false;
}

var accessToken = string.Empty;
var accessSecretToken = string.Empty;
var socialId = string.Empty;
string errorMessage;
var	auth = SocialCommutator.CompleteAuthentication(UserConnection, socialNetworkName, 
			out accessToken, out accessSecretToken, out socialId, out errorMessage);
if (auth == AuthResult.Failed) {
	if (string.IsNullOrEmpty(errorMessage)){
		var user = new UserToken(Get("userid"), true);
		try {
			SocialCommutator.StartAuthentication(UserConnection, socialNetworkName, user);
		} catch (SocialNetworkException e){
			Page.ConsumerKeyEdit.Hidden = true;
			Page.ConsumerSecretKeyEdit.Hidden = true;
			Page.OKButton.Hidden = true;
			Page.CancelButton.Caption = Page.OKButton.Caption;
			Page.BaseMessagePanel.Clear();
			Page.BaseMessagePanel.AddMessage(title: Warning, text: e.Message,
				messageType: MessageType.Warning, closable: false, showIcon: true);
		}
	} else {
		HideControls(true);
		Page.BaseMessagePanel.Clear();
		Page.BaseMessagePanel.AddMessage(title: Warning, text: errorMessage,
			messageType: MessageType.Warning, closable: false, showIcon: true);
	}
	return true;
}

var returnValueKey = "SocialAccountAuth_" + Guid.NewGuid();
var openerId = Get("OpenerPageId");
var successEvent = Get("SuccessEventName");
var failedMessage = Get("FailedEventName");

if (string.IsNullOrEmpty(returnValueKey) || 
		string.IsNullOrEmpty(openerId) || 
		string.IsNullOrEmpty(successEvent) || 
		string.IsNullOrEmpty(failedMessage)) {
	(Page.AspPage as Terrasoft.UI.Core.Page).Close();
	return false;
}
if (auth == AuthResult.Success) {
	UserConnection.SessionData[returnValueKey] = @"
	{
		""Token"": """ + accessToken + @""",
		""Secret"":  """ + accessSecretToken + @""",
		""SocialId"": """ + socialId + @"""
	}";
}
	var sbCallback = new StringBuilder();
	//@"window.opener.Terrasoft.AjaxMethods.ThrowClientEvent('" + openerId + "','" + successEvent + "')";
	sbCallback.Append("\nvar windowKey = '"+ openerId +"';");
	sbCallback.Append("\nExt.EventManager.on(window, 'beforeunload', function() {\n\t");
	sbCallback.Append("if (window.opener.Terrasoft.AjaxMethods.ThrowClientEvent)");
	sbCallback.Append("\n\t\t{\n\nwindow.opener.Terrasoft.AjaxMethods.ThrowClientEvent(");
	sbCallback.Append("windowKey,'");
	if (auth == AuthResult.Success) {
		sbCallback.Append(successEvent);
	} else {
		sbCallback.Append(failedMessage);
	}
	sbCallback.Append("','" + returnValueKey.ToString() + "');}");
	sbCallback.Append("\n});");	

ScriptManager scriptManager = ((Terrasoft.UI.Core.Page)System.Web.HttpContext.Current.CurrentHandler).FindControl("ScriptManager") as ScriptManager;
scriptManager.AddScript(sbCallback.ToString());

(Page.AspPage as Terrasoft.UI.Core.Page).Close();
return true;