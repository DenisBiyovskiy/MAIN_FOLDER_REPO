using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
    }
}
