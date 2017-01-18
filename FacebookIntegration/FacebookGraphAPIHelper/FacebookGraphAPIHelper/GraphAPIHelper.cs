using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.Collections.Specialized;
using FacebookGraphAPIHelper.Objects;

namespace FacebookGraphAPIHelper
{
    public class GraphAPIHelper
    {
        private const string DEFAULT_GRAPH_API_VERSION = "v2.8";
        private string _graphAPIVersion;
        private string appID;
        private string appSecret;
        private const string ERROR_MSG = "Unknown error. Request URL: ";
        private const string graphBaseURL = "https://graph.facebook.com/";
        private string graphURLAndVersion;


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
        public GraphAPIHelper(string appID, string appSecret, string APIversion = DEFAULT_GRAPH_API_VERSION)
        {
            this.appID = appID;
            this.appSecret = appSecret;
            this.GraphAPIVersion = APIversion;
            graphURLAndVersion = graphBaseURL + GraphAPIVersion + "/";
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
            }
            return br;
        }

        public BaseResponse GetUserAccounts(string userAccessToken, out Accounts accounts)
        {
            string pUrl = graphURLAndVersion + "me/accounts?access_token=" + userAccessToken;
            BaseResponse br = ExecuteGetRequest(pUrl);
            accounts = null;
            if (br.success)
            {
                accounts = JsonConvert.DeserializeObject<Accounts>(br.responseData);
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
        public Account FindUserAccount(string name, Accounts accs)
        {
            foreach (var a in accs.data)
            {
                if (a.name == name) return a;
            }
            return null;
        }

        public BaseResponse GetPageAccessToken(string userAccessToken, out string pageToken)
        {
            string pUrl = graphURLAndVersion +
                            "oauth/access_token" + "?grant_type=fb_exchange_token" +
                            "&client_id=" + appID +
                            "&client_secret=" + appSecret +
                            "&fb_exchange_token=" + userAccessToken;
            var br = ExecuteGetRequest(pUrl);
            pageToken = null;
            if (br.success)
            {
                pageToken = JsonConvert.DeserializeObject<AccessTokenResponse>(br.responseData).access_token;
            }
            return br;
        }


        public BaseResponse GetPosts(string pageId, string access_token, out Posts posts, string fields = "likes,message,created_time")
        {
            string pUrl = graphURLAndVersion +
                            pageId + "/posts?fields=" + fields +
                            "&access_token=" + access_token;
            var br = ExecuteGetRequest(pUrl);
            posts = null;
            if(br.success)
            {
                posts = JsonConvert.DeserializeObject<Posts>(br.responseData);
            }
            return br;
        }

        
        public BaseResponse PostMessage(string pageId, string accessToken, string message)
        {
            string pUrl = graphURLAndVersion + 
                                pageId + "/feed" + 
                                "?access_token=" + accessToken;
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

