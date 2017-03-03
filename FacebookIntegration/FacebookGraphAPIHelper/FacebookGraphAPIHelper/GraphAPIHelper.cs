using FacebookGraphAPIHelper.Objects;
using Newtonsoft.Json;
using System;
using System.IO;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using System.Threading;

namespace FacebookGraphAPIHelper
{
    /// <summary>
    /// Provides methods for GraphAPI calls.
    /// </summary>
    public class GraphAPIHelper
    {
        private const string DEFAULT_GRAPH_API_VERSION = "v2.8";
        private const string ERROR_MSG = "Unknown error. Request URL: ";
        private const string graphBaseURL = "https://graph.facebook.com/";
        private const string DEFAULT_POSTS_FIELDS = "message,created_time,link,sharedposts.limit(1000){from,created_time,story,id},shares,permalink_url";
        private const int DEFAULT_REACTIONS_LIMIT = 900;
        private const int DEFAULT_POSTS_LIMIT = 20;
        private const string DEFAULT_REACTIONS_FIELDS = "/reactions?limit=";
        private string _appSecretProof;
        private string _graphAPIVersion;
        private string appID;
        private string appSecret;
        private string _accessToken;
        private string graphURLAndVersion;

        string accessToken 
        { 
            get
            {
                if (string.IsNullOrEmpty(_accessToken)) throw new Exception("access token required");
                return _accessToken;
            }
            set
            {
                _accessToken = value;
            } 
        }

        private string AppSecretProof
        {
            get
            {
                if (!string.IsNullOrEmpty(_appSecretProof))
                    return _appSecretProof;

                if (string.IsNullOrEmpty(appSecret))
                    throw new Exception("appSecret");

                AppSecretProof = GenerateFacebookSecretProof(accessToken, appSecret);
                if (string.IsNullOrEmpty(_appSecretProof))
                    throw new Exception("appSecretProof");
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
            this.accessToken = access_token;
            graphURLAndVersion = graphBaseURL + GraphAPIVersion + "/";
        }

        /// <summary>
        /// Generate a facebook secret proof
        /// <seealso cref="http://stackoverflow.com/questions/20572523/c-sharp-help-required-to-create-facebook-appsecret-proof-hmacsha256"/>
        /// </summary>
        /// <param name="facebookAccessToken"></param>
        /// <param name="facebookAuthAppSecret"></param>
        /// <returns>App secret proof.</returns>
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

        /// <summary>
        /// Obtains long-lived user access token (expires in about 60 days).
        /// </summary>
        /// <param name="userExchangeToken">Short-lived user access token.</param>
        /// <param name="accessToken">Out parameter to return generated long-lived token.</param>
        /// <returns>Instance of BaseResponse class.</returns>
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
                this.accessToken = accessToken;
                this.AppSecretProof = null;
            }
            return br;
        }

        public BaseResponse GetUserAccounts(out FBPages accounts)
        {
            string pUrl = graphURLAndVersion + "me/accounts?access_token=" + accessToken +
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
            string pUrl = graphBaseURL + uri + "?fields=name" + 
                            "&access_token=" + accessToken +
                            "&appsecret_proof=" + AppSecretProof;
            var br = ExecuteGetRequest(pUrl);
            FBPage fbPage;
            if (br.success)
            {
                fbPage = JsonConvert.DeserializeObject<FBPage>(br.responseData);
                fbPage.picture = GetPagePicture(fbPage.id);
                return fbPage;
            }
            return null;
        }

        /// <summary>
        /// Requests for page picture.
        /// </summary>
        /// <param name="pageId">Page Id.</param>
        /// <param name="type">The size of this picture. 
        /// It can be one of the following values: <example>small, normal, large, square.</example>
        /// </param>
        /// <returns>
        /// FBPagePicture instance wich includes picture url. 
        /// Use <code>LoadPictureFromUrl</code> method to load picture.
        /// </returns>
        public Picture GetPagePicture(string pageId, string type = "large")
        {
            string pUrl = graphURLAndVersion + pageId + "/picture?redirect=0&type=" + type +
                              "&access_token=" + accessToken +
                              "&appsecret_proof=" + AppSecretProof;
            var br = ExecuteGetRequest(pUrl);
            if (br.success)
            {
                return JsonConvert.DeserializeObject<Picture>(br.responseData);
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
                catch (Exception){}
            }
            return data;
        }

        //TODO: implement a method for obtaining the page access token.
        //public BaseResponse GetPageAccessToken(out string pageToken) 
        //{
        //}

        /// <summary>
        /// Requests GraphAPI for top <paramref name="limit"/> posts of the Page.
        /// </summary>
        /// <param name="pageId">Id of the Page.</param>
        /// <param name="posts">Out parameter to receive the data.</param>
        /// <param name="fields">List of fields to include into request. Defaults to <paramref name="DEFAULT_POSTS_FIELDS"/></param>
        /// <param name="limit">Number of posts to get. Defaults to <paramref name="DEFAULT_POSTS_LIMIT"/></param>
        /// <returns>Instance of BaseResponse class.</returns>
        public BaseResponse GetTopPosts(string pageId, out Posts posts, string fields = DEFAULT_POSTS_FIELDS, int limit = DEFAULT_POSTS_LIMIT)
        {
            string pUrl = graphURLAndVersion +
                            pageId + "/posts?fields=" + fields +
                            "&access_token=" + accessToken + 
                            "&appsecret_proof=" + AppSecretProof +
                            "&limit=" + limit;
            var br = ExecuteGetRequest(pUrl);
            posts = null;
            if(br.success)
            {
                posts = JsonConvert.DeserializeObject<Posts>(br.responseData);
                for (int i = 0; i < posts.data.Count; i++)
                {
                    var p = posts.data[i];
                    br = GetPostReactions(ref p);
                    if (!br.success) throw br.Exception;
                }
            }
            return br;
        }

        /// <summary>
        /// Requests GraphAPI for all posts of the Page.
        /// </summary>
        /// <param name="pageId">Id of the Page.</param>
        /// <param name="posts">Out parameter to receive the data.</param>
        /// <param name="fields">List of fields to include into request. Defaults to <paramref name="DEFAULT_POSTS_FIELDS"/></param>
        /// <returns>Instance of BaseResponse class.</returns>
        public BaseResponse GetAllPosts(string pageId, out Posts posts, string fields = DEFAULT_POSTS_FIELDS)
        {
            int sameRequestsCount = 0;
            Posts nextPosts = null;
            Posts _posts = null;
            var br = GetTopPosts(pageId, out _posts, fields);
            nextPosts = _posts;
            while(br.success)
            {
                string nextUrl = null;
                if (nextPosts != null && nextPosts.paging != null)
                {
                    nextUrl = nextPosts.paging.next;
                }
                if (string.IsNullOrEmpty(nextUrl))
                {
                    break;
                }
                br = ExecuteGetRequest(nextUrl + "&appsecret_proof=" + AppSecretProof);
                //When graphAPI request returns: error code==1 && subcode==99 
                //try send request again.
                //https://developers.facebook.com/docs/graph-api/using-graph-api/ search for "Error Codes" topic for more info.
                if (!br.success)
                {
                    sameRequestsCount++;
                    var e = JsonConvert.DeserializeObject<FBGraphAPIException>(br.responseData);
                    br.success = true;
                    if (sameRequestsCount >= 10) throw br.Exception;
                    if (e != null && e.error.code == 1 && e.error.error_subcode == 99) Thread.Sleep(10000);
                }
                else
                {
                    nextPosts = JsonConvert.DeserializeObject<Posts>(br.responseData);
                    _posts.data.AddRange(nextPosts.data);
                    sameRequestsCount = 0;
                }
            }
            posts = _posts;
            for (int i = DEFAULT_POSTS_LIMIT; i < posts.data.Count; i++)
            {
                var p = posts.data[i];
                br = GetPostReactions(ref p);
                if (!br.success) throw br.Exception;
            }
            return br;
        }

        /// <summary>
        /// Requests GraphAPI for reactions of the post.
        /// </summary>
        /// <param name="post">Ref parameter to receive the data.</param>
        /// <param name="rLimit">Number of reactions to get per request. Defaults to <paramref name="DEFAULT_REACTIONS_LIMIT"/></param>
        /// <returns></returns>
        public BaseResponse GetPostReactions(ref Post post, int rLimit = DEFAULT_REACTIONS_LIMIT)
        {
            var baseURL = graphURLAndVersion + post.id + DEFAULT_REACTIONS_FIELDS + rLimit +
                            "&access_token=" + accessToken +
                            "&appsecret_proof=" + AppSecretProof;
            var br = ExecuteGetRequest(baseURL);
            if (!br.success) throw br.Exception;
            Reactions r = JsonConvert.DeserializeObject<Reactions>(br.responseData);
            Reactions nextR = r;
            while (br.success && nextR != null && nextR.data.Count >= rLimit
                       && nextR.paging != null && nextR.paging.cursors != null)
            {
                string url = nextR.paging.next;
                if (string.IsNullOrEmpty(url))
                {
                    url = baseURL + "&after=" + nextR.paging.cursors.after;
                }
                br = ExecuteGetRequest(url);
                if (!br.success) throw br.Exception;
                nextR = JsonConvert.DeserializeObject<Reactions>(br.responseData);
                r.data.AddRange(nextR.data);
            }
            post.reactions = r;
            return br;
        }
        
        public BaseResponse PostMessage(string pageId, string message)
        {
            string pUrl = graphURLAndVersion + 
                                pageId + "/feed" + 
                                "?access_token=" + accessToken + 
                                "&appsecret_proof=" + AppSecretProof;
            string postData = "message=" + message;
            return ExecutePostRequest(pUrl, postData);
        }

        /// <summary>
        /// Executes POST request.
        /// </summary>
        /// <param name="pUrl">Base request URL.</param>
        /// <param name="postData">POST parmeters.</param>
        /// <returns>
        /// Instance of BaseResponse class.
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
                            responseData = responseData,
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
        /// <returns>
        /// Instance of BaseResponse class.
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
			webRequest.Timeout = 800000;
            
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
                try
                {
                    var we = (((System.Net.WebException)(exc)).Response);
                    responseStream = we.GetResponseStream();
                    responseReader = new StreamReader(responseStream);
                    responseData = responseReader.ReadToEnd();
                    return new BaseResponse()
                    {
                        Exception = new Exception(responseData, exc),
                        responseData = responseData
                    };
                }
                catch (Exception inExc)
                {
                    return new BaseResponse()
                    {
                        Exception = inExc
                    };
                }
               
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

