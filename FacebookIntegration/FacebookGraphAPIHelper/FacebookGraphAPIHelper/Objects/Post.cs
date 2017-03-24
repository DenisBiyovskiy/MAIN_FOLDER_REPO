using System;

namespace FacebookGraphAPIHelper.Objects
{
    public class Post
    {
        public DateTime created_time;
        public string message;
        public string id;
        public Reactions reactions;
        public string link;
        public SharedPosts sharedposts;
        public Shares shares;
        public string permalink_url;
        public From from;
    }
}
