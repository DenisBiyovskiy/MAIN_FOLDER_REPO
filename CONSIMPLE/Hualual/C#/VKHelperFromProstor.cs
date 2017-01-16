using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using System.IO;
using System.Net;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Terrasoft.Configuration.VK
{

    class VKHelper
    {
        private string token;

        public VKHelper(string token)
        {
            this.token = token;
        }

        private string Response(string request_path)    //на вход подаем URL API, например https://api.vk.com/method/photos.getWallUploadServer?group_id=123
        {
            string response = string.Empty;
            HttpWebRequest Request = (HttpWebRequest)WebRequest.Create(request_path);   //отправление запроса к серверу API
            HttpWebResponse Response = (HttpWebResponse)Request.GetResponse();      //получение ответа от сервера API
            Stream receiveStream = Response.GetResponseStream();
            Encoding encode = System.Text.Encoding.GetEncoding("utf-8");
            StreamReader readStream = new StreamReader(receiveStream, encode);

            Char[] read = new Char[256];
            int count = readStream.Read(read, 0, 256);

            while (count > 0)
            {
                String line = new String(read, 0, count);
                response += line + "\r\n";
                count = readStream.Read(read, 0, 256);
            }

            Response.Close();
            readStream.Close();

            return response;
        }

        private string photosGetWallUploadServer(string group_id)    //получить сервер для загрузки фото на стену (возвращает upload_url)
        {
            string request_path = "https://api.vk.com/method/photos.getWallUploadServer?";    //формируем ссылку с нужными параметрами для запроса к API
            request_path += "group_id" + group_id;
            request_path += "&v=5.27";
            request_path += "&access_token=" + token;

            var json = JObject.Parse(Response(request_path));     //json парсер
            return json["response"]["upload_url"].ToString();       //возвращает upload_url
        }

        private JObject photosUploadPhotoToURL(string URL, string file_path)    //загрузка фото на сервер
        {
            WebClient myWebClient = new WebClient();
            byte[] responseArray = myWebClient.UploadFile(URL, file_path);
            var json = JObject.Parse(System.Text.Encoding.ASCII.GetString(responseArray));

            return json;
        }
		
		private JObject photosUploadPhotoToURL(string URL, byte[] array)    //загрузка фото на сервер
        {
            WebClient myWebClient = new WebClient();
            byte[] responseArray = myWebClient.UploadData(URL, array);
            var json = JObject.Parse(System.Text.Encoding.ASCII.GetString(responseArray));

            return json;
        }

        private JObject photosSaveWallPhoto(string server, string photo, string hash)
        {
            string request_path = "https://api.vk.com/method/photos.saveWallPhoto?";
            request_path += "server=" + server;
            request_path += "&photo=" + photo;
            request_path += "&hash=" + hash;
            request_path += "&v=5.27";
            request_path += "&access_token=" + token;

            var json = JObject.Parse((Response(request_path).Replace("[", String.Empty)).Replace("]", String.Empty));       //сначала убираем '[' и ']' из ответа сервера, а зачем парсим
            return json;  //возвращаем объект класса JObject
        }

        public string wallPost(string owner_id, int friends_only = 0, int from_group = 1, string message = "", string attachments = "", long publish_date = 0)                    //пост на стенку
        {
            if (message == "" && attachments == "") return "Error: message and attachments is empty!";                //не вызывать API, если msg and attach пустые

            string request_path = "https://api.vk.com/method/wall.post?";     //путь обращения к vk.api
            request_path += "owner_id=" + owner_id;
            request_path += "&friends_only=" + friends_only;
            request_path += "&from_group=" + from_group;
            if (message != string.Empty) request_path += "&message=" + message;
            if (attachments != string.Empty) request_path += "&attachments=" + attachments;
            if (publish_date != 0) request_path += "&publish_date=" + publish_date;
            request_path += "&v=5.27";
            request_path += "&access_token=" + token;                                                          //токен (задается в конструкторе)

            return Response(request_path);
        }

        public string AddWallPost(string gid, string message = "", string attachment = "", string publish_date = "")
        {
            long time = 0;
            if (message == "" && attachment == "") return "Error";
            if (publish_date != "")
            {
                string response = string.Empty;
                int hour = int.Parse(publish_date.Split(':')[0]);
                int min = int.Parse(publish_date.Split(':')[1]);
                if ((min % 5) != 0) min += 5 - (min % 5);
                if (min == 60)
                {
                    hour++;
                    min = 0;
                }

                DateTime data_time = new DateTime(2015, 8, 31, hour, min, 0);
                time = (data_time.ToUniversalTime().Ticks - 621355968000000000) / 10000000; //перевод числа в unixtime
            }
            if (attachment != "")
            {
                string img_path = photosGetWallUploadServer(gid);
                var resp = photosUploadPhotoToURL(img_path, attachment);
                resp = photosSaveWallPhoto(resp["server"].ToString(), resp["photo"].ToString(), resp["hash"].ToString());
                attachment = "photo" + resp["response"]["owner_id"] + "_" + resp["response"]["id"];
            }

            return wallPost(gid, message: message, attachments: attachment, publish_date: time);
        }

        public string getLikes(string type, string owner_id, string item_id, string filter, int friends_only)
        {
            string request_path = "https://api.vk.com/method/likes.getList?";
            request_path += "type=" + type;
            request_path += "&owner_id=" + owner_id;
            request_path += "&item_id=" + item_id;
            request_path += "&filter=" + filter;
            request_path += "&friends_only=" + friends_only;
            request_path += "&v=5.27";
            request_path += "&access_token=" + token;

            return Response(request_path);
        }

        public string getUser(string id, string fields) //доступні параметрі через запятую("205387401,12124547")
        {
            string request_path = "https://api.vk.com/method/users.get?";
            request_path += "fields=" + fields;
            request_path += "&v=5.27";
            request_path += "&access_token=" + token;

            return Response(request_path);
        }
		
		public string getGroup(string group_ids, string group_id, string fields) 
        {
            string request_path = "https://api.vk.com/method/groups.getById?";
            request_path += "group_ids=" + group_ids;
            request_path += "&group_id=" + group_id;
            request_path += "&fields=" + fields;
            request_path += "&v=5.27";
            request_path += "&access_token=" + token;

            return Response(request_path);
        }
    }
}
