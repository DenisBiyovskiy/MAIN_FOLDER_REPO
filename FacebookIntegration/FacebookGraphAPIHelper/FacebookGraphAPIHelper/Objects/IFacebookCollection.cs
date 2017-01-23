using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FacebookGraphAPIHelper.Objects
{
    interface IFacebookCollection
    {
        IFacebookCollection ConcatFBObjects<IFacebookCollection>();

        IFacebookCollection GetObjectData();
    }
}
