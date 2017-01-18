// Use Facebook SDK for .NET to get more specific data (https://github.com/facebook-csharp-sdk/facebook-csharp-sdk)

var identity = AuthenticationManager.GetExternalIdentity(DefaultAuthenticationTypes.ExternalCookie);
var facebookAccessToken = identity.FindFirstValue("FacebookAccessToken");
var fb = new FacebookClient(facebookAccessToken);

var facebookAuthAppSecret = "Use_Your_Own_Facebook_AppSecret_Here";
var facebookAppSecretProof = FacebookHelper.GenerateFacebookSecretProof(facebookAccessToken, facebookAuthAppSecret);

dynamic facebookInfo = fb.Get(string.Format("/me?appsecret_proof={0}&fields=email,birthday,gender", facebookAppSecretProof));
signInInfo.Email = facebookInfo.email;