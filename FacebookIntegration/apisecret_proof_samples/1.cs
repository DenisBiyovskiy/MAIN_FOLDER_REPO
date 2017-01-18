            #region Facebook

            // https://developers.facebook.com/apps
            // https://developers.facebook.com/docs/facebook-login/permissions/v2.4
            // https://developers.facebook.com/docs/graph-api/reference/v2.4/post
            // https://developers.facebook.com/docs/apps/changelog#v2_4
            // https://developers.facebook.com/docs/graph-api/reference/user

            var facebookAuthOptions = new FacebookAuthenticationOptions();

            facebookAuthOptions.AppId = facebookAuthAppId;
            facebookAuthOptions.AppSecret = facebookAuthAppSecret;
            facebookAuthOptions.SendAppSecretProof = true;

            // public_profile (Default) includes: id,name,first_name,last_name,age_range,link,gender,locale,timezone,updated_time,verified
            facebookAuthOptions.Scope.Add("public_profile");
            facebookAuthOptions.Scope.Add("email");
            facebookAuthOptions.Scope.Add("user_birthday");
            facebookAuthOptions.Scope.Add("user_location"); // current city through the location field on the User object

            facebookAuthOptions.Provider = new FacebookAuthenticationProvider()
            {
                OnAuthenticated = (context) =>
                {
                    // http://stackoverflow.com/questions/7999934/facebook-c-sharp-sdk-problems-getting-user-email/8013211#8013211
                    // http://blogs.msdn.com/b/webdev/archive/2013/10/16/get-more-information-from-social-providers-used-in-the-vs-2013-project-templates.aspx
                    // Get the access token from FB and store it in the database and use FacebookC# SDK to get more information about the user
                    context.Identity.AddClaim(new System.Security.Claims.Claim("FacebookAccessToken", context.AccessToken));

                    var expiryDuration = context.ExpiresIn ?? new TimeSpan();
                    context.Identity.AddClaim(new Claim("facebook:expires_in", DateTime.UtcNow.Add(expiryDuration).ToString(CultureInfo.InvariantCulture)));

                    // Add all other available claims
                    foreach (var claim in context.User)
                    {
                        var claimType = string.Format("facebook:{0}", claim.Key);
                        var claimValue = claim.Value.ToString();
                        if (!context.Identity.HasClaim(claimType, claimValue))
                            context.Identity.AddClaim(new System.Security.Claims.Claim(claimType, claimValue, "XmlSchemaString", "Facebook"));
                    }

                    return Task.FromResult(0);
                }
            };
            app.UseFacebookAuthentication(facebookAuthOptions);

            #endregion Facebook