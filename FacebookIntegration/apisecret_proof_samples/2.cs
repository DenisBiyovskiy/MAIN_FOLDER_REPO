namespace YouProjectNamespace.Helpers 
{
    using System.Security.Cryptography;
    using System.Text;

    /// <summary>
    /// Facebook Helper
    /// </summary>
    public static class FacebookHelper
    {
        /// <summary>
        /// Generate a facebook secret proof (works with facebook APIs v2.4)
        /// <seealso cref="http://stackoverflow.com/questions/20572523/c-sharp-help-required-to-create-facebook-appsecret-proof-hmacsha256"/>
        /// </summary>
        /// <param name="facebookAccessToken"></param>
        /// <param name="facebookAuthAppSecret"></param>
        /// <returns></returns>
        public static string GenerateFacebookSecretProof(string facebookAccessToken, string facebookAuthAppSecret)
        {
            byte[] keyBytes = Encoding.UTF8.GetBytes(facebookAuthAppSecret);
            byte[] messageBytes = Encoding.UTF8.GetBytes(facebookAccessToken);
            HMACSHA256 hmacsha256 = new HMACSHA256(keyBytes);
            byte[] hash = hmacsha256.ComputeHash(messageBytes);
            StringBuilder sbHash = new StringBuilder();
            
            for (int i = 0; i < hash.Length; i++)
            {
                sbHash.Append(hash[i].ToString("x2"));
            }

            return sbHash.ToString();
        }
    }
}