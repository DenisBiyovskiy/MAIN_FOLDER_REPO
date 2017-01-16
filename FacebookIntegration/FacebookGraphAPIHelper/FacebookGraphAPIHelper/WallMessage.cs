using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FacebookGraphAPIHelper
{
    public class WallMessage
    {
        public DateTime created_time;
        public string message;
        public string id;
        public List<Like> likes;
        //public List<Like> likes;
    }
}
