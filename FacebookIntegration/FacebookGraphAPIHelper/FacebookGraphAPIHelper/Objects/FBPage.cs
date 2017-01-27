using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FacebookGraphAPIHelper.Objects
{
     public class FBPage
    {
        public string access_token;
        public string id;
        public string name;
        public string category;
        public Picture picture;
        public List<string> perms;
    }
}
