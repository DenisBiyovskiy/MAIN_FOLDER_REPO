using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FacebookGraphAPIHelper.Objects
{
     public class Account
    {
        public string access_token;
        public string id;
        public string name;
        public string category;
        public List<string> perms;
    }
}
