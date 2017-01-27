using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FacebookGraphAPIHelper.Objects
{
    public class Picture
    {
        public PictureData data;

        public class PictureData
        {
            public bool is_silhouette;
            public string url;
        }
    }
}
