﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FacebookGraphAPIHelper;
using FacebookGraphAPIHelper.Objects;
using Newtonsoft.Json;

namespace GAPITEST
{
    class Program
    {
        static void Main(string[] args)
        {
            
            //uphUserId	uphPageToken	uphAppSecret	uphAppId	uphPageId
            //1091321741005034	EAAFFru3lRl0BAO8M52suZA1bDDuU4Sofsl85QZAVB3erojkZCTYBhnH6WXIQYl8gdxrbT57xZBrq1ZBOyiyUprYu1ERq1BMwmVKicDoUehDNkp66n6NSihqsZBjMV7eLV7yNZAZCwniekMYut2c8u12B9Dyb7z8X4HKIxp9gmPLZAmQZDZD	81f78efeb40c979e3c029d9f8c533212	358092594562653	1369352673095644
            Tools.ClearFile();
            //connection params
            string appID = "358092594562653";
            string appSecret = "81f78efeb40c979e3c029d9f8c533212";
            string exToken = "EAAFFru3lRl0BABjTuCyJ3c2IyR0iWQq91sf4kb463dttRZAubD2XEGMnNsmgMdOHTrPBUm0dIVSskqJrDEc19rMBfJJnsbgbUJAYyv3zQTXPArvm08NSavtZAzS7Qq2ca1KLMElQz21V3T643RNsog1WUJHEyn6gRvBGW94wZDZD";
            string pageId = "1369352673095644";
            string accToken = "";
            string pageToken = "";
            GraphAPIHelper gepiHelper = new GraphAPIHelper(appID, appSecret);

            BaseResponse res = gepiHelper.GetLongLivedAccessToken(exToken, out accToken);
            Accounts accs;
            res = gepiHelper.GetUserAccounts(accToken, out accs);
            Tools.WriteToFile(accs);
            Posts posts;
            gepiHelper.GetTopPosts(pageId, accToken, out posts);
            Tools.WriteToFile(posts);
            res = gepiHelper.GetPageAccessToken(accToken, out pageToken);
           //----- gepiHelper.PostMessage(pageId, accs.data[0].access_token, "autogenerated message 4");
            Tools.ClearFile();
            var br = gepiHelper.GetAllPosts("1396379433974581", accToken, out posts);
            Tools.WriteStringToFile(posts.data.Count);
            Tools.WriteToFile(posts);
        }
    }
}
