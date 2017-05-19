namespace FacebookGraphAPIHelper
{
    using FacebookGraphAPIHelper.Objects;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Runtime.Serialization;
    using System.Web;
    using Terrasoft.Common;
    using Terrasoft.Core;
    using Terrasoft.Core.DB;
    using Terrasoft.Core.Entities;

    #region Class: FBServiceHelper
    /// <summary>
    /// Helper class for Facebook integration.
    /// </summary>
    public class FBServiceHelper
    {
        #region Constants: Private
        private const string FBPageEntitySchemaName = "cnsFBPage";
        #endregion Constants: Private

        #region Static Fields: Private
        private static Guid _notificationType = new Guid("685E7149-C015-4A4D-B4A6-2E5625A6314C");
        private static Guid _entitySchemaUid = Guid.Empty;
        private static Guid _sourceId = new Guid("A66D08E1-2E2D-E011-AC0A-00155D043205");
        private static Guid _leadTypeTagged = new Guid("88A5491A-90B7-47D6-AE62-AE49A6F09FC1");
        private static Guid _leadRegisterMethod = new Guid("2F65913C-FF62-40FB-9D01-1A3E2E893E0E");
        private static string _NOT_LOGGED_IN_MSG = null;
        private static string _FB_PAGE_DIDNT_FOUND_MSG = null;
        private static string _FB_PAGE_ALREADY_EXISTS = null;
        private static string _FB_PAGE_SEARCH_SUCCESS = null;
        private static string _FB_ACTION_TYPE_DICTIONARY_EXC = null;
        private static string _FB_PAGE_NOT_ADMIN_MSG = null;
        private static string _FB_PAGE_TOKEN_SAVED = null;
        private static string connParamsEntitySchemaName = "cnsFBConnectionParams";
        private static string fbPageEntitySchemaName = "cnsFBPage";
        private static string fbPostEntitySchemaName = "cnsFBPost";
        private static string fbActionEntitySchemaName = "cnsFBAction";
        private static int _fbPostsLimit = 50;
        private static GraphAPIHelper _gah;
        #endregion Static Fields: Private

        #region Fields: Private
        private Dictionary<string, Guid> _cnsFbActionTypes = null;
        private UserConnection _userConnection;
        private Guid mainAppConParamId = new Guid("4776C7B3-685F-4A95-863D-F0B285877E39");
        private Guid fbCommunicationType = new Guid("2795DD03-BACF-E011-92C3-00155D04C01D");
        private Guid _fbShareActionTypeId = Guid.Empty;
        #endregion Fields: Private

        #region Properties: Private
        #region LocalizableStrings
        private string FB_PAGE_ALREADY_EXISTS
        {
            get
            {
                if (string.IsNullOrEmpty(_FB_PAGE_ALREADY_EXISTS))
                {
                	_FB_PAGE_ALREADY_EXISTS = new LocalizableString(userConnection.Workspace.ResourceStorage,
                    	"cnsFBServiceHelper", "LocalizableStrings.FB_PAGE_ALREADY_EXISTS.Value");
                }
                return _FB_PAGE_ALREADY_EXISTS;
            }
        }
        private string NOT_LOGGED_IN_MSG
        {
            get
            {
                if (string.IsNullOrEmpty(_NOT_LOGGED_IN_MSG))
                {
                	_NOT_LOGGED_IN_MSG = new LocalizableString(userConnection.Workspace.ResourceStorage,
                    	"cnsFBServiceHelper", "LocalizableStrings.NOT_LOGGED_IN_MSG.Value");
                }
                return _NOT_LOGGED_IN_MSG;
            }
        }
        private string FB_PAGE_DIDNT_FOUND_MSG
        {
            get
            {
                if (string.IsNullOrEmpty(_FB_PAGE_DIDNT_FOUND_MSG))
                {
                	_FB_PAGE_DIDNT_FOUND_MSG = new LocalizableString(userConnection.Workspace.ResourceStorage,
                    	"cnsFBServiceHelper", "LocalizableStrings.FB_PAGE_DIDNT_FOUND_MSG.Value");
                }
                return _FB_PAGE_DIDNT_FOUND_MSG;
            }
        }
        private string FB_PAGE_SEARCH_SUCCESS
        {
            get
            {
                if (string.IsNullOrEmpty(_FB_PAGE_SEARCH_SUCCESS))
                {
                	_FB_PAGE_SEARCH_SUCCESS = new LocalizableString(userConnection.Workspace.ResourceStorage,
                    	"cnsFBServiceHelper", "LocalizableStrings.FB_PAGE_SEARCH_SUCCESS.Value");
                }
                return _FB_PAGE_SEARCH_SUCCESS;
            }
        }
        private string FB_ACTION_TYPE_DICTIONARY_EXC
        {
            get
            {
                if (string.IsNullOrEmpty(_FB_ACTION_TYPE_DICTIONARY_EXC))
                {
                	_FB_ACTION_TYPE_DICTIONARY_EXC = new LocalizableString(userConnection.Workspace.ResourceStorage,
                    	"cnsFBServiceHelper", "LocalizableStrings.FB_ACTION_TYPE_DICTIONARY_EXC.Value");
                }
                return _FB_ACTION_TYPE_DICTIONARY_EXC;
            }
        }
        private string FB_PAGE_NOT_ADMIN_MSG
        {
            get
            {
                if (string.IsNullOrEmpty(_FB_PAGE_NOT_ADMIN_MSG))
                {
                	_FB_PAGE_NOT_ADMIN_MSG = new LocalizableString(userConnection.Workspace.ResourceStorage,
                    	"cnsFBServiceHelper", "LocalizableStrings.FB_PAGE_NOT_ADMIN_MSG.Value");
                }
                return _FB_PAGE_NOT_ADMIN_MSG;
            }
        }
        private string FB_PAGE_TOKEN_SAVED
        {
            get
            {
                if (string.IsNullOrEmpty(_FB_PAGE_TOKEN_SAVED))
                {
                	_FB_PAGE_TOKEN_SAVED = new LocalizableString(userConnection.Workspace.ResourceStorage,
                    	"cnsFBServiceHelper", "LocalizableStrings.FB_PAGE_TOKEN_SAVED.Value");
                }
                return _FB_PAGE_TOKEN_SAVED;
            }
        }
        #endregion LocalizableStrings
        private Guid FBEntitySchemaUid
        {
            get
            {
                if (_entitySchemaUid != Guid.Empty) return _entitySchemaUid;
                var manager = userConnection.GetSchemaManager("EntitySchemaManager");
                var cnsFBPage = manager.FindItemByName(FBPageEntitySchemaName);
                return (_entitySchemaUid = cnsFBPage.UId);
            }
        }

        private GraphAPIHelper graphHelper
        {
            get
            {
                return _gah ??
                    (_gah = CreateGraphAPIHelperInstance());
            }
        }

        private Guid fbShareActionTypeId
        {
            get
            {
                if (_fbShareActionTypeId != Guid.Empty) return _fbShareActionTypeId;
                if (!cnsFBActionTypes.TryGetValue("SHARE", out _fbShareActionTypeId)) throw new Exception(string.Format(FB_ACTION_TYPE_DICTIONARY_EXC, "Share"));
                return _fbShareActionTypeId;
            }
        }
        #endregion Properties: Private

        #region Properties: Public
        public int fbPostsLimit
        {
            get
            {
                return _fbPostsLimit;
            }
            set
            {
                if (0 < value && value <= 100)
                    _fbPostsLimit = value;
            }
        }
        public UserConnection userConnection
        {
            private get
            {
                return _userConnection ??
                    (_userConnection = HttpContext.Current.Session["UserConnection"] as UserConnection);
            }
            set
            {
                _userConnection = value;
            }
        }

        public Dictionary<string, Guid> cnsFBActionTypes
        {
            get
            {
                return _cnsFbActionTypes ??
                    (_cnsFbActionTypes = GetFBActionTypes());
            }
        }
        #endregion Properties: Public

        #region Methods: Private
        private Guid GetContactByFBName(string fbName)
        {
            var esq = new EntitySchemaQuery(userConnection.EntitySchemaManager, "Contact");
            var pcn = esq.AddColumn("Id").Name;
            esq.AddColumn("Name");
            var nameFilter = esq.CreateFilterWithParameters(FilterComparisonType.Equal, "Name", fbName);
            esq.Filters.Add(nameFilter);
            var col = esq.GetEntityCollection(userConnection);
            foreach (var c in col)
            {
                return c.GetTypedColumnValue<Guid>(pcn);
            }
            return Guid.Empty;
        }

        private Guid CreateContact(string name, string fbId)
        {
            Picture p = graphHelper.GetPagePicture(fbId);
            Guid pId = Guid.Empty;
            if (p.data != null && p.data.url != null)
            {
                pId = LoadAndSavePicture(p.data.url, name);
            }
            var id = Guid.NewGuid();
            var dic = new Dictionary<string, object>() { 
                {"Id", id},
                {"Name", name},
                {"Facebook", name},
                {"FacebookId", fbId},
                {"CreatedById", userConnection.CurrentUser.ContactId},
                {"ModifiedById", userConnection.CurrentUser.ContactId}
            };
            if (pId != Guid.Empty) dic["PhotoId"] = pId;
            var error = AddEntity(userConnection, "Contact", dic);
            if (!String.IsNullOrEmpty(error)) throw new Exception(error);
            CreateContactCommunication(name, fbId, id);
            return id;
        }

        private void CreateContactCommunication(string name, string fbId, Guid contactId)
        {
            var dic = new Dictionary<string, object>() { 
                {"CommunicationTypeId", fbCommunicationType},
                {"ContactId", contactId},
                {"SocialMediaId", fbId},
                {"Number", name},
                {"CreatedById", userConnection.CurrentUser.ContactId},
                {"ModifiedById", userConnection.CurrentUser.ContactId},
                {"IsCreatedBySynchronization", 1}
            };
            var error = AddEntity(userConnection, "ContactCommunication", dic);
            if (!String.IsNullOrEmpty(error)) throw new Exception(error);
        }

        private void UpdatePostEntity(Post post, Guid postId)
        {
            var esq = new EntitySchemaQuery(userConnection.EntitySchemaManager, fbActionEntitySchemaName);
            esq.AddAllSchemaColumns();
            var postFilter = esq.CreateFilterWithParameters(FilterComparisonType.Equal, fbPostEntitySchemaName, postId);
            esq.Filters.Add(postFilter);
            var existingActions = esq.GetEntityCollection(userConnection);
            var exReactionsUsersIds = existingActions.Where(er => er.GetTypedColumnValue<Guid>("cnsFBTypeId") != fbShareActionTypeId)
                .Select(er => er.GetTypedColumnValue<string>("cnsFBUserId"));
            var exSharesUsersIds = existingActions.Where(es => es.GetTypedColumnValue<Guid>("cnsFBTypeId") == fbShareActionTypeId)
                .Select(es => es.GetTypedColumnValue<string>("cnsFBUserId"));
            if (post.reactions != null && post.reactions.data != null)
            {
                var update = new Update(userConnection, fbPostEntitySchemaName)
                        .Set("ModifiedOn", Column.Parameter(DateTime.Now))
                        .Set("cnsFBReactionsCount", Column.Parameter(post.reactions.data.Count))
                     .Where("Id").IsEqual(Column.Parameter(postId)) as Update;
                if (post.shares != null) update.Set("cnsFBSharesCount", Column.Parameter(post.shares.count));
                update.Execute();
            }
            if (post.reactions != null && post.reactions.data != null)
            {
                foreach (var r in post.reactions.data)
                {
                    if (!exReactionsUsersIds.Contains(r.id))
                    {
                        InsertNewPostUserReaction(postId, r);
                    }
                    else
                    {
                        Guid curAType = existingActions.Where(ea => (ea.GetTypedColumnValue<Guid>("cnsFBTypeId") != fbShareActionTypeId
                                                                 && ea.GetTypedColumnValue<string>("cnsFBUserId") == r.id))
                                                       .Select(ea => ea.GetTypedColumnValue<Guid>("cnsFBTypeId")).First();

                        Guid newAType = Guid.Empty;
                        if (!cnsFBActionTypes.TryGetValue(r.type.ToUpper(), out newAType)) throw new Exception(string.Format(FB_ACTION_TYPE_DICTIONARY_EXC, r.type));
                        if (curAType != newAType && newAType != Guid.Empty)
                        {
                            var actionId = existingActions.Where(ea => (ea.GetTypedColumnValue<Guid>("cnsFBTypeId") != fbShareActionTypeId
                                                                 && ea.GetTypedColumnValue<string>("cnsFBUserId") == r.id))
                                                       .Select(ea => ea.GetTypedColumnValue<Guid>("Id")).First();
                            UpdatePostUserAction(actionId, newAType);
                        }
                    }
                }
            }
            if (post.sharedposts != null && post.sharedposts.data != null)
            {
                foreach (var sp in post.sharedposts.data)
                {
                    if (!exSharesUsersIds.Contains(sp.from.id))
                    {
                        InsertNewPostShares(postId, sp);
                    }
                    else
                    {
                        Guid curAType = existingActions.Where(ea => (ea.GetTypedColumnValue<Guid>("cnsFBTypeId") == fbShareActionTypeId
                                                                 && ea.GetTypedColumnValue<string>("cnsFBUserId") == sp.from.id))
                                                       .Select(ea => ea.GetTypedColumnValue<Guid>("cnsFBTypeId")).First();

                        Guid newAType = Guid.Empty;
                        if (!cnsFBActionTypes.TryGetValue("SHARE", out newAType)) throw new Exception(string.Format(FB_ACTION_TYPE_DICTIONARY_EXC, "Share"));
                        if (curAType != newAType && newAType != Guid.Empty)
                        {
                            var actionId = existingActions.Where(ea => (ea.GetTypedColumnValue<Guid>("cnsFBTypeId") == fbShareActionTypeId
                                                                 && ea.GetTypedColumnValue<string>("cnsFBUserId") == sp.from.id))
                                                       .Select(ea => ea.GetTypedColumnValue<Guid>("Id")).First();
                            UpdatePostUserAction(actionId, newAType);
                        }

                    }
                }
            }
        }

        private void UpdatePostUserAction(Guid actionId, Guid newAType)
        {
            var update = new Update(userConnection, fbActionEntitySchemaName)
                    .Set("ModifiedOn", Column.Parameter(DateTime.Now))
                    .Set("cnsFBTypeId", Column.Parameter(newAType))
                 .Where("Id").IsEqual(Column.Parameter(actionId)) as Update;
            update.Execute();
        }

        private Dictionary<string, Guid> GetFBActionTypes()
        {
            try
            {
                var esq = new EntitySchemaQuery(userConnection.EntitySchemaManager, "cnsFBActionType");
                esq.AddAllSchemaColumns();
                var coll = esq.GetEntityCollection(userConnection);
                var dic = new Dictionary<string, Guid>();
                foreach (var el in coll)
                {
                    var key = el.GetTypedColumnValue<string>("Name").ToUpper();
                    var value = el.GetTypedColumnValue<Guid>("Id");
                    dic[key] = value;
                }
                return dic;
            }
            catch (Exception ex)
            {
                var msg = "Error while trying get 'cnsFBActionType' dictionary data.";
                throw new Exception(msg, ex);
            }
        }

        private void CreateNewPostEntity(Post post, Guid pageId, string fbPageId)
        {
            Guid newGuid = Guid.NewGuid();
            Guid contactId = Guid.Empty;
            var dic = new Dictionary<string, object>()
                {
                    { "Id", newGuid },
                    { "cnsFBPageId", pageId },
                    { "cnsFBId", post.id},
                    { "cnsFBCreatedTime", post.created_time},
                    { "cnsFBMessage", post.message},
                    { "cnsFBLinkToPost", post.permalink_url}
                };
            if (post.reactions != null && post.reactions.data != null) dic["cnsFBReactionsCount"] = post.reactions.data.Count;
            if (post.shares != null) dic["cnsFBSharesCount"] = post.shares.count;
            if (post.link != null) dic["cnsFBLinkInPost"] = post.link;
            if (post.from != null)
            {
                dic["cnsFBFromId"] = post.from.id;
                dic["cnsFBFromName"] = post.from.name;
                contactId = GetContactByFBId(post.from.id);
                if (contactId != Guid.Empty) dic["cnsFBContactId"] = contactId;
            }
            var errorMsg = AddEntity(userConnection, fbPostEntitySchemaName, dic);
            if (post.from != null) CreateLead(post, contactId, newGuid);
            if (!string.IsNullOrEmpty(errorMsg)) throw new Exception(errorMsg);
            if (post.reactions != null && post.reactions.data != null)
            {
                foreach (var r in post.reactions.data)
                {
                    InsertNewPostUserReaction(newGuid, r);
                }
            }
            if (post.sharedposts != null && post.sharedposts.data != null)
            {
                foreach (var sp in post.sharedposts.data)
                {
                    InsertNewPostShares(newGuid, sp);
                }
            }
        }

        private void CreateLead(Post post, Guid contactId, Guid postId)
        {
            var dic = new Dictionary<string, object>()
                {
                    { "cnsFBPostId", postId },
                    { "LeadTypeId", _leadTypeTagged},
                    { "RegisterMethodId", _leadRegisterMethod },
                    { "Contact", post.from.name}
                };
            if (contactId != Guid.Empty) dic["QualifiedContactId"] = contactId;
            var errorMsg = AddEntity(userConnection, "Lead", dic);
            if (!string.IsNullOrEmpty(errorMsg)) throw new Exception(errorMsg);
        }

        private void InsertNewPostUserReaction(Guid postId, Reaction r)
        {
            Guid typeId = Guid.Empty;
            if (!cnsFBActionTypes.TryGetValue(r.type.ToUpper(), out typeId)) throw new Exception(string.Format(FB_ACTION_TYPE_DICTIONARY_EXC, r.type));
            Guid contactId = GetContactByFBId(r.id);
            var dic = new Dictionary<string, object>()
                {
                    { "cnsFBTypeId",  typeId },
                    { "cnsFBUserId", r.id },
                    { "cnsFBPostId", postId },
                    { "cnsFBUserName", r.name }
                };
            if (contactId != Guid.Empty) dic["cnsContactId"] = contactId;
            var errorMsg = AddEntity(userConnection, fbActionEntitySchemaName, dic);
            if (!string.IsNullOrEmpty(errorMsg)) throw new Exception(errorMsg);
        }

        private void InsertNewPostShares(Guid postId, SharedPost sp)
        {
            Guid typeId = Guid.Empty;
            From sf = sp.from;
            if (!cnsFBActionTypes.TryGetValue("SHARE", out typeId)) throw new Exception(string.Format(FB_ACTION_TYPE_DICTIONARY_EXC, "Share"));
            Guid contactId = GetContactByFBId(sp.id);
            var dic = new Dictionary<string, object>()
                {
                    { "cnsFBTypeId",  typeId },
                    { "cnsFBUserId", sf.id },
                    { "cnsFBPostId", postId },
                    { "cnsFBUserName", sf.name }
                };
            if (contactId != Guid.Empty) dic["cnsContactId"] = contactId;
            var errorMsg = AddEntity(userConnection, fbActionEntitySchemaName, dic);
            if (!string.IsNullOrEmpty(errorMsg)) throw new Exception(errorMsg);
        }

        private Guid GetContactByFBId(string fbId)
        {
            var esq = new EntitySchemaQuery(userConnection.EntitySchemaManager, "ContactCommunication");
            esq.AddColumn("Contact");
            var typeFilter = esq.CreateFilterWithParameters(FilterComparisonType.Equal, "CommunicationType", fbCommunicationType);
            var fbIdFilter = esq.CreateFilterWithParameters(FilterComparisonType.Equal, "SocialMediaId", fbId);
            esq.Filters.Add(typeFilter);
            esq.Filters.Add(fbIdFilter);
            var col = esq.GetEntityCollection(userConnection);
            foreach (var c in col)
            {
                return c.GetTypedColumnValue<Guid>("ContactId");
            }
            return Guid.Empty;
        }

        private Guid LoadAndSavePicture(string url, string name)
        {
            byte[] imgData = graphHelper.LoadPictureFromUrl(url);
            if (imgData == null) return Guid.Empty;
            Guid imgId = Guid.NewGuid();
            var dic = new Dictionary<string, object>()
            { 
                {"Id", imgId}, 
                {"UploadedOn", DateTime.Now},
                {"Data", imgData},
                {"MimeType", "image/png"},
                {"HasRef", false},
                {"Name", name + ".png"}
            };
            string error = AddEntity(userConnection, "SysImage", dic);
            if (error == String.Empty) return imgId;
            return Guid.Empty;
        }

        private bool CheckPageAlreadyAdded(string fbPageId)
        {
            var esq = new EntitySchemaQuery(userConnection.EntitySchemaManager, fbPageEntitySchemaName);
            var FBPageName = esq.AddColumn("cnsFBPageId").Name;
            esq.Filters.Add(esq.CreateFilterWithParameters(FilterComparisonType.Equal, FBPageName, fbPageId));
            var res = esq.GetEntityCollection(userConnection);
            if (res.Count > 0) return true;
            return false;
        }

        private GraphAPIHelper CreateGraphAPIHelperInstance()
        {
            var appParams = GetAppConnectionParams();
            if (string.IsNullOrEmpty(appParams.Item1) || string.IsNullOrEmpty(appParams.Item2)) return null;
            return new GraphAPIHelper(appParams.Item1, appParams.Item2, appParams.Item3);
        }

        private Tuple<string, string, string> GetAppConnectionParams()
        {
            Tuple<string, string, string> result = null;
            var esq = new EntitySchemaQuery(userConnection.EntitySchemaManager, connParamsEntitySchemaName);
            var appId = esq.AddColumn("cnsAppId").Name;
            var appSecret = esq.AddColumn("cnsAppSecret").Name;
            var appToken = esq.AddColumn("cnsUserLongLiveToken").Name;
            var ent = esq.GetEntity(userConnection, mainAppConParamId);
            if (ent != null)
            {
                result = Tuple.Create<string, string, string>(ent.GetTypedColumnValue<string>(appId), ent.GetTypedColumnValue<string>(appSecret), ent.GetTypedColumnValue<string>(appToken));
            }
            return result;
        }

        private string GetPageToken(Guid pageId)
        {
            string token = (new Select(userConnection)
                        .Column("cnsUserLongLiveToken")
                        .From(connParamsEntitySchemaName)
                        .Where("cnsPageId").IsEqual(Column.Parameter(pageId)) as Select).ExecuteScalar<string>();
            if (string.IsNullOrEmpty(token)) return null;
            return token;
        }

        private void savePageToken(Guid pageId, string pageToken)
        {
            using (var dbExecutor = userConnection.EnsureDBConnection())
            {
                Guid cnsPageConParamId = (new Select(userConnection)
                        .Column("Id")
                        .From(connParamsEntitySchemaName)
                        .Where("cnsPageId").IsEqual(Column.Parameter(pageId)) as Select).ExecuteScalar<Guid>(dbExecutor);
                if (cnsPageConParamId != Guid.Empty)
                {
                    var update = new Update(userConnection, connParamsEntitySchemaName)
                                    .Set("ModifiedOn", Column.Parameter(DateTime.Now))
                                    .Set("cnsUserLongLiveToken", Column.Parameter(pageToken))
                                .Where("Id").IsEqual(Column.Parameter(cnsPageConParamId)) as Update;
                    update.Execute(dbExecutor);
                }
                else
                {
                    var insert = new Insert(userConnection).Into(connParamsEntitySchemaName)
                                    .Set("cnsPageId", Column.Parameter(pageId))
                                    .Set("ModifiedOn", Column.Parameter(DateTime.Now))
                                    .Set("cnsUserLongLiveToken", Column.Parameter(pageToken)) as Insert;
                    insert.Execute(dbExecutor);
                }
            }
        }
        #endregion Methods: Private

        #region Methods: Public
        public void CreateContactsAndUpdateBinding(Dictionary<string, string> selectedFBContacts, out int cCount, out int fCount)
        {
            var contacts = new Dictionary<Guid, string>();
            cCount = 0;
            fCount = 0;
            foreach (var cFBId in selectedFBContacts.Keys)
            {
                Guid contactId = GetContactByFBId(cFBId);
                if (contactId != Guid.Empty)
                {
                    fCount++;
                    contacts[contactId] = cFBId;
                    continue;
                }
                contactId = GetContactByFBName(selectedFBContacts[cFBId]);
                if (contactId != Guid.Empty)
                {
                    fCount++;
                    contacts[contactId] = cFBId;
                    CreateContactCommunication(selectedFBContacts[cFBId], cFBId, contactId);
                    continue;
                }
                contactId = CreateContact(selectedFBContacts[cFBId], cFBId);
                if (contactId != Guid.Empty)
                {
                    cCount++;
                    contacts[contactId] = cFBId;
                }
            }
            foreach (var key in contacts.Keys)
            {
                UpdateContactBindingWithFB(key, contacts[key]);
            }
        }

        public void UpdateContactsBindingWithFB()
        {
            var subQuery = new EntitySchemaQuery(userConnection.EntitySchemaManager, fbActionEntitySchemaName);
            subQuery.IsDistinct = true;
            subQuery.AddColumn("cnsFBUserId");
            subQuery.Filters.Add(subQuery.CreateFilterWithParameters(FilterComparisonType.IsNull, "cnsContact"));



            var esq = new EntitySchemaQuery(userConnection.EntitySchemaManager, "ContactCommunication");
            esq.IsDistinct = true;
            esq.AddColumn("SocialMediaId");
            esq.AddColumn("Contact");
            var mainFilter = new EntitySchemaQueryFilter(FilterComparisonType.Equal);
            mainFilter.LeftExpression = esq.CreateSchemaColumnExpression("SocialMediaId");
            mainFilter.RightExpressions.Add(new EntitySchemaQueryExpression(subQuery));
            esq.Filters.Add(mainFilter);
            esq.Filters.Add(esq.CreateFilterWithParameters(FilterComparisonType.Equal, "CommunicationType", fbCommunicationType));
            var esqResult = esq.GetEntityCollection(userConnection);
            Dictionary<string, Guid> contactCommDic = esqResult.ToDictionary(t => t.GetTypedColumnValue<string>("SocialMediaId"), t => t.GetTypedColumnValue<Guid>("ContactId"));
            foreach (var key in contactCommDic.Keys)
            {
                UpdateContactBindingWithFB(contactCommDic[key], key);
            }
        }

        public void UpdateContactBindingWithFB(Guid cId, string fbCId)
        {
            var update = new Update(userConnection, fbActionEntitySchemaName)
                       .Set("cnsContactId", Column.Parameter(cId))
                    .Where("cnsFBUserId").IsEqual(Column.Parameter(fbCId)) as Update;
            update.Execute();
            update = new Update(userConnection, fbPostEntitySchemaName)
                       .Set("cnsFBContactId", Column.Parameter(cId))
                    .Where("cnsFBFromId").IsEqual(Column.Parameter(fbCId)) as Update;
            update.Execute();
        }
        /// <summary>
        /// Creates reminding about FB actions in system.
        /// </summary>
        /// <param name="caption">Notification message.</param>
        /// <param name="subjectId">FB Page Id (creates link to "cnsFBPage" instance page.)</param>
        /// <param name="contactId">Target contact id.</param>
        /// <param name="notificationType">Notification type Id</param>
        public void InsertFBPageReminding(string caption, Guid subjectId, Guid contactId, Guid notificationType, string description = "")
        {
            if (description.Length > 500) description = description.Substring(0, 500);
            EntitySchema entitySchema = userConnection.EntitySchemaManager.GetInstanceByName("Reminding");
            Entity entity = entitySchema.CreateEntity(userConnection);
            entity.SetDefColumnValues();
            entity.SetColumnValue("NotificationTypeId", notificationType);
            entity.SetColumnValue("SubjectCaption", caption);
            entity.SetColumnValue("Description", description);
            entity.SetColumnValue("ContactId", contactId);
            entity.SetColumnValue("RemindTime", DateTime.Now);
            entity.SetColumnValue("AuthorId", userConnection.CurrentUser.ContactId);
            entity.SetColumnValue("SourceId", _sourceId);
            entity.SetColumnValue("SysEntitySchemaId", FBEntitySchemaUid);
            if (subjectId != Guid.Empty) entity.SetColumnValue("SubjectId", subjectId);
            entity.Save();
        }

        public void InsertFBPageReminding(string caption, Guid subjectId, Guid contactId, string description = "")
        {
            InsertFBPageReminding(caption, subjectId, contactId, _notificationType, description);
        }

        /// <summary>
        /// Updates FB Page information about tagged Pages(Users reactions and shares in each post with taggs).
        /// </summary>
        /// <param name="pageId">Page Id in system</param>
        /// <param name="fbPageId">Page Id in FB GraphAPI</param>
        public void UpdateFBPageTaggedUserActionsInfo(Guid pageId, string fbPageId, string AccessToken = null)
        {
            var pageToken = GetPageToken(pageId);
            if (string.IsNullOrEmpty(pageToken)) return;
            UpdateFBPageUserActionsInfo(pageId, fbPageId, pageToken);
        }

        /// <summary>
        /// Updates FB Page information about Posts(Users reactions and shares in each post).
        /// </summary>
        /// <param name="pageId">Page Id in system</param>
        /// <param name="fbPageId">Page Id in FB GraphAPI</param>
        public void UpdateFBPageUserActionsInfo(Guid pageId, string fbPageId, string AccessToken = null)
        {
            var postsEsq = new EntitySchemaQuery(userConnection.EntitySchemaManager, fbPostEntitySchemaName);
            postsEsq.AddAllSchemaColumns();
            postsEsq.Filters.Add(postsEsq.CreateFilterWithParameters(FilterComparisonType.Equal, "cnsFBPage", pageId));
            var nodePath = "/posts";
            if (string.IsNullOrEmpty(AccessToken))
            {
                postsEsq.Filters.Add(postsEsq.CreateFilterWithParameters(FilterComparisonType.Equal, "cnsFBFromId", String.Empty));
            }
            else
            {
                postsEsq.Filters.Add(postsEsq.CreateFilterWithParameters(FilterComparisonType.NotEqual, "cnsFBFromId", String.Empty));
                nodePath = "/tagged";
            }
            AccessToken = GetPageToken(pageId);
            var existingPosts = postsEsq.GetEntityCollection(userConnection);
            Posts postsResponseData = null;
            BaseResponse br = null;
            if (existingPosts.Count > 0)
            {
                br = graphHelper.GetTopPosts(fbPageId, AccessToken, out postsResponseData, limit: fbPostsLimit, nodePath: nodePath);
            }
            else
            {
                br = graphHelper.GetAllPosts(fbPageId, AccessToken, out postsResponseData, nodePath: nodePath);
            }
            if (!br.success) throw br.Exception;
            var posts = postsResponseData.data;


            var existingPostsFbId = existingPosts.Select(ep => ep.GetTypedColumnValue<string>("cnsFBId"));

            foreach (var post in posts)
            {
                if (!existingPostsFbId.Contains(post.id))
                {
                    CreateNewPostEntity(post, pageId, fbPageId);
                }
                else
                {
                    Guid postId = existingPosts.Find("cnsFBId", post.id).GetTypedColumnValue<Guid>("Id");
                    UpdatePostEntity(post, postId);
                }

            }
        }

        public void UpdateAllFBPagesUserActionsInfo(int postLimit)
        {
            fbPostsLimit = postLimit;
            var esq = new EntitySchemaQuery(userConnection.EntitySchemaManager, fbPageEntitySchemaName);
            var idColName = esq.AddColumn("Id").Name;
            var fbIdColName = esq.AddColumn("cnsFBPageId").Name;
            var fbPages = esq.GetEntityCollection(userConnection);
            foreach (var page in fbPages)
            {
                UpdateFBPageUserActionsInfo(page.GetTypedColumnValue<Guid>(idColName), page.GetTypedColumnValue<string>(fbIdColName));
            }
        }

        public void UpdateAllFBPagesTaggedUserActionsInfo(int postLimit)
        {
            fbPostsLimit = postLimit;
            var esq = new EntitySchemaQuery(userConnection.EntitySchemaManager, fbPageEntitySchemaName);
            var idColName = esq.AddColumn("Id").Name;
            var fbIdColName = esq.AddColumn("cnsFBPageId").Name;
            var fbPages = esq.GetEntityCollection(userConnection);
            foreach (var page in fbPages)
            {
                var pToken = GetPageToken(page.GetTypedColumnValue<Guid>(idColName));
                if (string.IsNullOrEmpty(pToken)) continue;
                UpdateFBPageUserActionsInfo(page.GetTypedColumnValue<Guid>(idColName), page.GetTypedColumnValue<string>(fbIdColName), pToken);
            }
        }

        public BaseResponse GenerateLongLivePageToken(Guid pageId)
        {
            var esq = new EntitySchemaQuery(userConnection.EntitySchemaManager, fbPageEntitySchemaName);
            esq.AddAllSchemaColumns();
            var pageEntity = esq.GetEntity(userConnection, pageId);
            FBPages fbPages = null;
            var br = graphHelper.GetUserAccounts(out fbPages);
            if (!br.success) return br;
            var page = graphHelper.FindUserAccount(pageEntity.GetTypedColumnValue<string>("cnsName"), pageEntity.GetTypedColumnValue<string>("cnsFBPageId"), fbPages);
            if (page == null) return new BaseResponse() { responseData = FB_PAGE_NOT_ADMIN_MSG };
            try
            {
                string longToken = null;
                br = graphHelper.GetLongLivedAccessToken(page.access_token, out longToken, true);
                if (br.success)
                {
                    savePageToken(pageId, longToken);
                    return new BaseResponse() { responseData = FB_PAGE_TOKEN_SAVED };
                }
                return new BaseResponse() { responseData = null };
            }
            catch (Exception ex)
            {
                return new BaseResponse() { Exception = ex, responseData = null };
            }
        }

        public BaseResponse GenerateLongLiveToken(string token)
        {
            try
            {
                string longToken = null;
                var br = graphHelper.GetLongLivedAccessToken(token, out longToken);
                if (br.success)
                {
                    br.responseData = null;
                    var update = new Update(userConnection, "cnsFBConnectionParams")
                            .Set("ModifiedOn", Column.Parameter(DateTime.Now))
                            .Set("cnsUserLongLiveToken", Column.Parameter(longToken))
                        .Where("Id").IsEqual(Column.Parameter(mainAppConParamId)) as Update;
                    update.Execute();
                }
                return br;
            }
            catch (Exception ex)
            {
                return new BaseResponse() { Exception = ex };
            }
        }

        public FBPageSearchResponse FindFBPage(string url)
        {
            if (graphHelper == null)
                return new FBPageSearchResponse()
                {
                    Exc = new Exception(NOT_LOGGED_IN_MSG),
                    responseMessage = NOT_LOGGED_IN_MSG
                };

            FBPage fbPage = graphHelper.GetPageByUrl(url);
            if (fbPage == null)
                return new FBPageSearchResponse()
                {
                    Exc = new Exception(FB_PAGE_DIDNT_FOUND_MSG),
                    responseMessage = FB_PAGE_DIDNT_FOUND_MSG
                };
            if (CheckPageAlreadyAdded(fbPage.id))
                return new FBPageSearchResponse()
                {
                    Exc = new Exception(FB_PAGE_ALREADY_EXISTS),
                    responseMessage = FB_PAGE_ALREADY_EXISTS
                };
            var response = new FBPageSearchResponse()
            {
                fbPage = fbPage,
                responseMessage = FB_PAGE_SEARCH_SUCCESS
            };
            Guid imgId = Guid.Empty;
            if (fbPage.picture != null && fbPage.picture.data != null)
                imgId = LoadAndSavePicture(fbPage.picture.data.url, fbPage.name);

            if (imgId != Guid.Empty) response.logoId = imgId;
            return response;
        }

        public static string AddEntity(UserConnection userConnection, string entityName, Dictionary<string, object> fieldValues)
        {
            string result = string.Empty;
            EntitySchema entitySchema = userConnection.EntitySchemaManager.GetInstanceByName(entityName);
            Entity entity = entitySchema.CreateEntity(userConnection);
            entity.SetDefColumnValues();
            try
            {
                foreach (var fieldKeyValue in fieldValues)
                {
                    object value = fieldKeyValue.Value;
                    string key = fieldKeyValue.Key;
                    if (value is string)
                    {
                        string strValue = value.ToString();
                        if (!string.IsNullOrEmpty(strValue))
                        {
                            var textDataValueType = ((TextDataValueType)(entity.Schema.Columns.GetByColumnValueName(key).DataValueType));
                            int size = textDataValueType.Size;
                            if ((!textDataValueType.IsMaxSize) && (strValue.Length > size))
                            {
                                strValue = strValue.Substring(0, size);
                                //string descriptionText = EntityUtils.ErrorCode(userConnection, "IncorrectStringLength");
                            }
                            entity.SetColumnValue(key, strValue);
                        }
                    }
                    else if (value is DateTime)
                    {
                        if ((DateTime)value != DateTime.MinValue)
                        {
                            entity.SetColumnValue(key, value);
                        }
                    }
                    else if (value is Guid)
                    {
                        if ((Guid)value != Guid.Empty)
                        {
                            entity.SetColumnValue(key, value);
                        }
                    }
                    else
                    {
                        if (value != null)
                        {
                            entity.SetColumnValue(key, value);
                        }
                    }
                }
                entity.Save();
            }
            catch (Exception ex)
            {
                result = ex.Message;
            }
            return result;
        }
        #endregion Methods: Public

    }
    #endregion Class: FBHelper

    /// <summary>
    /// Class represents Facebook page search results.
    /// </summary>
    #region Class: FBPageSearchResponse
    [DataContract]
    public class FBPageSearchResponse
    {
        #region Fields: Private
        private Guid _logoId;
        private string _fbPageName;
        private string _fbPageId;
        private string _fbPageCategory;
        private string _responseMessage;
        private Exception _e;
        #endregion Fields: Private

        #region Properties: internal
        internal FBPage fbPage
        {
            set
            {
                fbPageId = value.id;
                fbPageName = value.name;
                fbPageCategory = value.category;
            }
        }
        #endregion Properties: internal

        #region Properties: Public
        /// <summary>
        /// Image id in SysImage table.
        /// </summary>
        [DataMember]
        public Guid logoId { get; internal set; }
        /// <summary>
        /// Facebook Page name
        /// </summary>
        [DataMember]
        public string fbPageName { get; internal set; }
        /// <summary>
        /// Facebook Page Id
        /// </summary>
        [DataMember]
        public string fbPageId { get; internal set; }
        /// <summary>
        /// Facebook Page category
        /// </summary>
        [DataMember]
        public string fbPageCategory { get; internal set; }
        /// <summary>
        /// Response message represents error message or response status.
        /// </summary>
        [DataMember]
        public string responseMessage { get; internal set; }
        [DataMember]
        public Exception Exc { get; internal set; }

        #endregion Properties: Public

        #region Constructors: Public
        public FBPageSearchResponse() { }

        public FBPageSearchResponse(FBPage fbPage, string responseMessage, Guid logoId)
        {
            this.fbPage = fbPage;
            this.logoId = logoId;
            this.responseMessage = responseMessage;
        }
        #endregion Constructors: Public

    }
    #endregion Class: FBPageSearchResponse
}
