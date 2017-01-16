using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.Collections.Specialized;

namespace FacebookGraphAPIHelper
{
    public class GraphAPIHelper
    {
        public string _defaultGraphAPIVersion = "v2.8/";
        private string appID;
        private string appSecret;
        private const string ERROR_MSG = "Unknown error. Request URL: ";
        private const string graphBaseURL = "https://graph.facebook.com/";
        private string graphURLAndVersion;
        

        /**
         * GraphAPI version in format "vX.X/"
         */
        public string defaultGraphAPIVersion
        {
            get { return _defaultGraphAPIVersion; }
            set { _defaultGraphAPIVersion = onGraphVersionChange(value); }
        }
        
        private string onGraphVersionChange(string value)
        {
            graphURLAndVersion = graphBaseURL + _defaultGraphAPIVersion;
            return value;
        }
        public GraphAPIHelper(string appID, string appSecret)
        {
            this.appID = appID;
            this.appSecret = appSecret;
            graphURLAndVersion = graphBaseURL + _defaultGraphAPIVersion;
        }

        public bool GetLongLiveAccessToken (string userExchangeToken, out string accessToken)
        {
            string pUrl = graphURLAndVersion +
                            "oauth/access_token" + "?grant_type=fb_exchange_token" +
							"&client_id=" + appID + 
							"&client_secret=" + appSecret +
							"&fb_exchange_token=" + userExchangeToken;
            if (ExecuteGetRequest(pUrl, out accessToken))
            {
                accessToken = JsonConvert.DeserializeObject<AccessTokenResponse>(accessToken).access_token;
                return true;
            }
            return false;
        }

        public bool GetPageAccessToken(string userAccessToken, out string pageToken)
        {
            string pUrl = graphURLAndVersion +
                            "oauth/access_token" + "?grant_type=fb_exchange_token" +
                            "&client_id=" + appID +
                            "&client_secret=" + appSecret +
                            "&fb_exchange_token=" + userAccessToken;
            if (ExecuteGetRequest(pUrl, out pageToken))
            {
                pageToken = JsonConvert.DeserializeObject<AccessTokenResponse>(pageToken).access_token;
                return true;
            }
            return false;
        }

        /**
         * get posts of the page.
         */
        public bool GetPosts(string pageId, string access_token, out Posts posts)
        {
            string pUrl = graphURLAndVersion + 
                            pageId + "/posts" +
                            "?access_token=" + access_token;
            string responseData;
            if(ExecuteGetRequest(pUrl, out responseData))
            {
                posts = JsonConvert.DeserializeObject<Posts>(responseData);
                return true;
            }
            posts = new Posts();
            return false;
        }

        /**
         * post new message on page.
         */
        public bool PostMessage(string pageId, string accessToken, string message, out string result)
        {
            string pUrl = graphURLAndVersion + 
                                pageId + "/feed" + 
                                "?access_token=" + accessToken;
            string postData = "message=" + message;
            return ExecutePostRequest(pUrl, postData, out result);
        }

        /**
         * execute POST request
         */
        public bool ExecutePostRequest(string pUrl, string postData, out string result)
        {
            var request = WebRequest.Create(pUrl) as HttpWebRequest;
            var data = Encoding.ASCII.GetBytes(postData);

            request.Method = "POST";
            request.ContentType = "application/x-www-form-urlencoded";
            request.ContentLength = data.Length;

            using (var stream = request.GetRequestStream())
            {
                stream.Write(data, 0, data.Length);
            }

            var response = (HttpWebResponse)request.GetResponse();

            result = new StreamReader(response.GetResponseStream()).ReadToEnd();
            return true;
        }
        /**
         * execute GET request
         */
        public bool ExecuteGetRequest(string pUrl, out string response)
		{
            var wc = new WebClient();

			HttpWebRequest webRequest = System.Net.WebRequest.Create(pUrl) as HttpWebRequest;
            if (webRequest == null)
            {
                response = ERROR_MSG + pUrl;
                return false;
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
                response = exc.ToString();
                return false;
			}
			finally
			{
				if (responseStream != null)
				{
					responseStream.Close();
					responseReader.Close();
				}
			}
            response = responseData;
			return true;
		}
    }
}

