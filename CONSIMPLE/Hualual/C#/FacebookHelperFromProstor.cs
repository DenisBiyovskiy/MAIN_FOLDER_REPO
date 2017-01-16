using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Net;
using System.IO;
//using Facebook;
using System.Configuration;
using System.Collections.Specialized;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Dynamic;

namespace Terrasoft.Configuration.Facebook
{
    class FacebookHelper
    {
		
		private string appID;
		private string appSecret;
		private string redirectUri;
		
		public FacebookHelper(string appID, string appSecret, string redirectUri){
			this.appID = appID;
			this.appSecret = appSecret;
			this.redirectUri = redirectUri;
		}
		
		public string GetAccessToken(string code)
        {
            string urlGetAccessToken = "https://graph.facebook.com/oauth/access_token";
            urlGetAccessToken += "?client_id=" + appID;//APPID
            urlGetAccessToken += "&client_secret=" + appSecret;//APPSECRET
            urlGetAccessToken += "&redirect_uri=" + redirectUri;//REDIRECT(176...)
            urlGetAccessToken += "&code=" + code;//CODE
			urlGetAccessToken += "&scope=" + "publish_actions,user_managed_groups,user_photos,user_posts,manage_pages,publish_pages,publish_actions,read_stream";

            string responseData = RequestResponse(urlGetAccessToken); 
            if (responseData == "")
            {
                return "";
            }
            NameValueCollection qs = System.Web.HttpUtility.ParseQueryString(responseData);
            string access_token = qs["access_token"] == null ? "" : qs["access_token"];

            return access_token;
        }

		public string RequestResponse(string pUrl)
        {
            HttpWebRequest webRequest = System.Net.WebRequest.Create(pUrl) as HttpWebRequest;
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
            }
            finally
            {
                if (responseStream != null)
                {
                    responseStream.Close();
                    responseReader.Close();
                }
            }
            return responseData;
        }
		
		public JObject GetJSONResponce(string pUrl){
			JObject response = null;
			HttpWebRequest webRequest = System.Net.WebRequest.Create(pUrl) as HttpWebRequest;
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
				if(responseStream != null){
					responseStream.Close();
				}
				if(responseReader != null){
					responseReader.Close();
				}
				return response;
            }
           	responseStream.Close();
            responseReader.Close();
			response = JObject.Parse(responseData);
            return response;
		}
		
		private string HttpPost(string pUrl, string pPostData)
        {
            HttpWebRequest webRequest = (HttpWebRequest)HttpWebRequest.Create(pUrl);
            webRequest.ContentType = "application/x-www-form-urlencoded";
            webRequest.Method = "POST";
            byte[] bytes = System.Text.Encoding.UTF8.GetBytes(pPostData);
            Stream requestWriter = webRequest.GetRequestStream(); //GetRequestStream
            requestWriter.Write(bytes, 0, bytes.Length);
            requestWriter.Close();

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
                if(responseStream != null){
					responseStream.Close();
				}
				if(responseReader != null){
					responseReader.Close();
				}
				return responseData;
            }
			responseStream.Close();
            responseReader.Close();
            return responseData;
        }
		
		/*public string WallPost(string groupId, string message, string picturePath, string access_token){
			string photo_url = "";
            string datatype = "feed";
			string result = "";
            string urlWriteWall = "https://graph.facebook.com/" + groupId + "/feed?access_token=" + access_token;

			if(picturePath != ""){
				WebClient client = new WebClient();
	            var response = client.UploadFile("https://graph.facebook.com/" + "" + "/photos?access_token=" + "CAAFtKYF589QBAEkLdWO8l2BjW5T8ZB6qfhLJQ96lkomgHkDWZBCoajifgd6Qk0z1Voh9n3AgI4CqAnMd1XMmIS3dy1ZC3abyuf9j6vgYIiAY1ZA1ArgvobeemHYGsTdDipZB6VGm55PwrZAWkkrvvmCF4ucosKLhC4fV7a9UKzEqzHnNoxEIcX" + "&message=" + "", "POST", picturePath);
	            var responseData = System.Text.Encoding.UTF8.GetString(response);
				if(responseData != null){
					var responseJObject = JObject.Parse(responseData);
		            var photo_id = responseJObject["post_id"].ToString().Substring(responseJObject["post_id"].ToString().IndexOf("_") + 1);
					if(photo_id != null || photo_id != ""){
						photo_url = GetPictureUrl(photo_id, access_token);
						if(photo_url == ""){
							return result;
						}
					}else{
						return result;
					}
				}else{
					return result;
				}
			}
			
            //the message to post as a key/value pair
            string entityMessage = "message=" + message;
            entityMessage += "&picture=" + photo_url;
            entityMessage += "&link=";
            entityMessage += "&name=";
            entityMessage += "&caption=Writing to Facebook wall";

            result = HttpPost(urlWriteWall, entityMessage);
			return result;
		}
		
		public string WallPost2(){
			var ImagePath = "C:\\333aa41a18ed.jpg";

            var client = new FacebookClient("CAAFtKYF589QBAEkLdWO8l2BjW5T8ZB6qfhLJQ96lkomgHkDWZBCoajifgd6Qk0z1Voh9n3AgI4CqAnMd1XMmIS3dy1ZC3abyuf9j6vgYIiAY1ZA1ArgvobeemHYGsTdDipZB6VGm55PwrZAWkkrvvmCF4ucosKLhC4fV7a9UKzEqzHnNoxEIcX");
            dynamic parameters = new ExpandoObject();

            parameters.message = "Picture_Caption";
            parameters.subject = "test 7979";
            parameters.source = new FacebookMediaObject
            {
                ContentType = "image/gif",
                FileName = Path.GetFileName(ImagePath)
            }.SetValue(System.IO.File.ReadAllBytes(ImagePath));

            dynamic result = client.Post("510544665777132/photos", parameters);
			return result.ToString();
		}
		
		private string GetPictureUrl(string photo_id, string access_token)
        {
            WebResponse response = null;
            string pictureUrl = string.Empty;
            try
            {
                WebRequest request = WebRequest.Create(string.Format("https://graph.facebook.com/"+ photo_id + "/picture" + "?access_token=" + access_token));
                response = request.GetResponse();
                pictureUrl = response.ResponseUri.ToString();
            }
            catch (Exception ex)
            {
                //? handle
            }
            finally
            {
                if (response != null) response.Close();
            }
            return pictureUrl;
        }*/
		
		public JObject WallPost(string groupId, string message, string picturePath, string access_token){
			WebClient client = new WebClient();
			JObject responseJObject = null;
			try{
	            var responseByte = client.UploadFile("https://graph.facebook.com/" + "" + "/" + groupId + "/photos?access_token=" + access_token + "&message=" + message, "POST", picturePath);
	            var responseStr = System.Text.Encoding.UTF8.GetString(responseByte);
	            responseJObject = JObject.Parse(responseStr);
			}catch(Exception ex){
				return responseJObject;
			}
			return responseJObject;
		}
		
		public string GetLikes(string post_id, string access_token){
			var result = RequestResponse("https://graph.facebook.com/" + post_id + "/likes" + "?access_token=" + access_token);
			return result;
		}
    }
}