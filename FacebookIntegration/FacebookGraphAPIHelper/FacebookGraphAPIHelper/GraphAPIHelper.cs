using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.Collections.Specialized;
using System.Security.Cryptography;
using FacebookGraphAPIHelper.Objects;

namespace FacebookGraphAPIHelper
{
    public class GraphAPIHelper
    {
        private const string DEFAULT_GRAPH_API_VERSION = "v2.8";
        private const string DEFAULT_POSTS_FILEDS = "reactions.limit(1000),message,created_time,link,sharedposts,shares,permalink_url";
        private string _appSecretProof;
        private string _graphAPIVersion;
        private string appID;
        private string appSecret;
        private string _accessToken;
        private const string ERROR_MSG = "Unknown error. Request URL: ";
        private const string graphBaseURL = "https://graph.facebook.com/";
        private string graphURLAndVersion;


        private string AppSecretProof
        {
            get
            {
                if (!string.IsNullOrEmpty(_appSecretProof))
                    return _appSecretProof;

                if (string.IsNullOrEmpty(_accessToken))
                    throw new Exception("accessToken");
                if (string.IsNullOrEmpty(appSecret))
                    throw new Exception("appSecret");

                AppSecretProof = GenerateFacebookSecretProof(_accessToken, appSecret);
                if (string.IsNullOrEmpty(_appSecretProof))
                    throw new Exception("appSecretProff");
                return _appSecretProof;
            }
            set
            {
                _appSecretProof = value;
            }
        }
         /// <summary>
         /// Updates base url on API version change.
         /// </summary>
         private string onGraphVersionChange(string value)
        {
            graphURLAndVersion = graphBaseURL + value + "/";
            return value;
        }

         /// <summary>
         /// GraphAPI version in format "vX.X" (v2.8 by default)
         /// </summary>
        public string GraphAPIVersion
        {
            get { return _graphAPIVersion; }
            set { _graphAPIVersion = onGraphVersionChange(value); }
        }
        
        /// <summary>
        /// Initializes a new instance of class GraphAPIHelper
        /// </summary>
        /// <param name="appID"></param>
        /// <param name="appSecret"></param>
        /// <param name="APIversion"></param>
        public GraphAPIHelper(string appID, string appSecret, string access_token = null, string APIversion = DEFAULT_GRAPH_API_VERSION)
        {
            this.appID = appID;
            this.appSecret = appSecret;
            this.GraphAPIVersion = APIversion;
            this._accessToken = access_token;
            graphURLAndVersion = graphBaseURL + GraphAPIVersion + "/";
        }

        /// <summary>
        /// Generate a facebook secret proof
        /// <seealso cref="http://stackoverflow.com/questions/20572523/c-sharp-help-required-to-create-facebook-appsecret-proof-hmacsha256"/>
        /// </summary>
        /// <param name="facebookAccessToken"></param>
        /// <param name="facebookAuthAppSecret"></param>
        /// <returns></returns>
        private static string GenerateFacebookSecretProof(string facebookAccessToken, string facebookAuthAppSecret)
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

        public BaseResponse GetLongLivedAccessToken (string userExchangeToken, out string accessToken)
        {
            string pUrl = graphURLAndVersion +
                            "oauth/access_token" + "?grant_type=fb_exchange_token" +
							"&client_id=" + appID + 
							"&client_secret=" + appSecret +
							"&fb_exchange_token=" + userExchangeToken;
            BaseResponse br = ExecuteGetRequest(pUrl);
            accessToken = null;
            if (br.success)
            {
                accessToken = JsonConvert.DeserializeObject<AccessTokenResponse>(br.responseData).access_token;
                this._accessToken = accessToken;
                this.AppSecretProof = null;
            }
            return br;
        }

        public BaseResponse GetUserAccounts(out FBPages accounts)
        {
            string pUrl = graphURLAndVersion + "me/accounts?access_token=" + _accessToken +
                            "&appsecret_proof=" + AppSecretProof;
            BaseResponse br = ExecuteGetRequest(pUrl);
            accounts = null;
            if (br.success)
            {
                accounts = JsonConvert.DeserializeObject<FBPages>(br.responseData);
            }
            return br;
        }

        /// <summary>
        /// Searches in Accounts object for Account by Account.name filed.
        /// Returns Account instance.
        /// </summary>
        /// <param name="name">Searching key value</param>
        /// <param name="accs">Accounts object for search.</param>
        /// <returns>Returns first Account where Account.name = name.</returns>
        public FBPage FindUserAccount(string name, FBPages accs)
        {
            foreach (var a in accs.data)
            {
                if (a.name == name) return a;
            }
            return null;
        }

        /// <summary>
        /// Searches for a Page by its Url string via GraphAPI.
        /// </summary>
        /// <param name="uri">Url adress of Page</param>
        /// <returns>Account object representing Page</returns>
        public FBPage GetPageByUrl(string uri)
        {
            var ind = uri.IndexOf("?");
            if (ind > 0) uri = uri.Substring(0, ind);
            string pUrl = graphBaseURL + uri + "?fields=picture,name" + 
                            "&access_token=" + _accessToken +
                            "&appsecret_proof=" + AppSecretProof;
            var br = ExecuteGetRequest(pUrl);
            if (br.success)
            {
                return JsonConvert.DeserializeObject<FBPage>(br.responseData);
            }
            return null;
        }

        /// <summary>
        /// Loads picture from Uri as byte[]
        /// </summary>
        /// <param name="url">url image adress</param>
        /// <returns>byte[] representing loaded data</returns>
        public byte[] LoadPictureFromUrl(string url)
        {
            byte[] data = null;
            using (var webClient = new WebClient())
            {
                try
                {
                    data = webClient.DownloadData(url);
                }
                catch (Exception e){}
            }
            return data;
        }

        public BaseResponse GetPageAccessToken(out string pageToken)
        {
            string pUrl = graphURLAndVersion +
                            "oauth/access_token" + "?grant_type=fb_exchange_token" +
                            "&client_id=" + appID +
                            "&client_secret=" + appSecret +
                            "&fb_exchange_token=" + _accessToken +
                            "&appsecret_proof=" + AppSecretProof;
            var br = ExecuteGetRequest(pUrl);
            pageToken = null;
            if (br.success)
            {
                pageToken = JsonConvert.DeserializeObject<AccessTokenResponse>(br.responseData).access_token;
            }
            return br;
        }


        public BaseResponse GetTopPosts(string pageId, out Posts posts, string fields = DEFAULT_POSTS_FILEDS, int limit = 100)
        {
            string pUrl = graphURLAndVersion +
                            pageId + "/posts?fields=" + fields +
                            "&access_token=" + _accessToken + 
                            "&appsecret_proof=" + AppSecretProof +
                            "&limit=" + limit;
            var br = ExecuteGetRequest(pUrl);
            posts = null;
            if(br.success)
            {
                posts = JsonConvert.DeserializeObject<Posts>(br.responseData);
            }
            return br;
        }

        public BaseResponse GetAllPosts(string pageId, out Posts posts, string fields = DEFAULT_POSTS_FILEDS)
        {
            Posts nextPosts = null;
            Posts _posts = new Posts() {data = new List<Post>()};
            var br = GetTopPosts(pageId, out nextPosts, fields);
            while(br.success)
            {
                string nextUrl = null;
                if (nextPosts != null && nextPosts.paging != null)
                {
                    nextUrl = nextPosts.paging.next;
                }
                if (string.IsNullOrEmpty(nextUrl))
                {
                    posts = _posts;
                    return br;
                }
                br = ExecuteGetRequest(nextUrl + "&appsecret_proof=" + AppSecretProof);
                nextPosts = JsonConvert.DeserializeObject<Posts>(br.responseData);
                _posts.data.AddRange(nextPosts.data);
            }
            posts = nextPosts;
            return br;
        }

        
        public BaseResponse PostMessage(string pageId, string message)
        {
            string pUrl = graphURLAndVersion + 
                                pageId + "/feed" + 
                                "?access_token=" + _accessToken + 
                                "&appsecret_proof=" + AppSecretProof;
            string postData = "message=" + message;
            return ExecutePostRequest(pUrl, postData);
        }

        /// <summary>
        /// Executes POST request.
        /// </summary>
        /// <param name="pUrl">Base request URL.</param>
        /// <param name="postData">POST parmeters.</param>
        /// <param name="result">Result or exception message of request.</param>
        /// <returns>
        /// true on success and result in "out result" parametr
        /// false and exception message in "out result" parametr
        /// </returns>
        public BaseResponse ExecutePostRequest(string pUrl, string postData)
        {
            HttpWebRequest webRequest = WebRequest.Create(pUrl) as HttpWebRequest;
            var data = Encoding.ASCII.GetBytes(postData);

            webRequest.Method = "POST";
            webRequest.ContentType = "application/x-www-form-urlencoded";
            webRequest.ContentLength = data.Length;

            try
            {
                using (var requestStream = webRequest.GetRequestStream())
                {
                    requestStream.Write(data, 0, data.Length);
                }
                WebResponse webResponse = webRequest.GetResponse();
                using (var responseStream = webResponse.GetResponseStream())
                {
                    using (var responseReader = new StreamReader(responseStream))
                    {
                        var responseData = responseReader.ReadToEnd();
                        return new BaseResponse()
                        {
                            responseData = responseData
                        };
                    }
                }
            }
            catch (Exception exc)
            {
                return new BaseResponse()
                {
                    Exception = exc
                };
            }
        }
        
        
        /// <summary>
        /// Executes GET request.
        /// </summary>
        /// <param name="pUrl">Base request URL.</param>
        /// <param name="response">Result or exception message of request.</param>
        /// <returns>
        /// true on success and result in "out result" parametr
        /// false and exception message in "out result" parametr
        /// </returns>
        public BaseResponse ExecuteGetRequest(string pUrl)
		{
			HttpWebRequest webRequest = System.Net.WebRequest.Create(pUrl) as HttpWebRequest;
            if (webRequest == null)
            {
                return new BaseResponse()
                {
                    Exception = new Exception(ERROR_MSG + pUrl)
                };
            }
			webRequest.Method = "GET";
			webRequest.ServicePoint.Expect100Continue = false;
			webRequest.Timeout = 20000;
            
			Stream responseStream = null;
			StreamReader responseReader = null;
			string responseData = "";
			try
			{
				WebResponse webResponse = webRequest.GetResponse();
				responseStream = webResponse.GetResponseStream();
				responseReader = new StreamReader(responseStream);
				responseData = responseReader.ReadToEnd();
			}
			catch (Exception exc)
			{
                return new BaseResponse()
                {
                    Exception = exc
                };
			}
			finally
			{
				if (responseStream != null)
				{
					responseStream.Close();
					responseReader.Close();
				}
			}
            return new BaseResponse()
            {
                responseData = responseData
            };
		}
    }
}

