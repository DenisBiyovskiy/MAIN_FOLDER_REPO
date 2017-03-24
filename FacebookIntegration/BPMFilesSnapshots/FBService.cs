namespace FacebookGraphAPIHelper
{
    using System;
    using System.Collections.Generic;
    using System.ServiceModel;
    using System.ServiceModel.Activation;
    using System.ServiceModel.Web;
    using System.Web;
    using Terrasoft.Core;



    #region Class: FBService

    /// <summary>
    /// Service class for Facebook integration.
    /// </summary>
    [ServiceContract]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Required)]
    public class FBService
    {

        #region Static fields: Private
        private static string FB_PAGE_UPDATED_REMINDING_MSG = "Данные страницы \"{0}\" были обновлены.";
        private static string FB_CONTACT_BINDED_MSG = "Привязка контакта \"{0}\" к активностям FB выполнена.";
        private static string FB_PAGE_UPDATE_ERROR_MSG = "Обновление страницы \"{0}\" было прервано в связи с ошибкой. Обратитесь к администратору.";
        private static string FB_PAGES_UPDATE_ERROR_MSG = "Ежедневное обновление страниц было прервано в связи с ошибкой. Обратитесь к администратору.";
        private static string FB_CONTACT_BIND_ERROR_MSG = "Обновление контакта \"{0}\" было прервано в связи с ошибкой. Обратитесь к администратору.";
        private static string FB_CONTACTS_BIND_ERROR_MSG = "Ежедневное обновление контактов было прервано в связи с ошибкой. Обратитесь к администратору.";
        private static string FB_CONTACTS_CREATED_MSG = "Было создано {0} контактов. Было найдено {1} существующих контактов.";
        private static string FB_CONTACTS_CREATED_ERROR_MSG = "Создание контактов по активностям страницы было прервано в связи с ошибкой. Обратитесь к администратору.";
        #endregion Constants: Private

        #region Fields: Private
        private FBServiceHelper _fbServiceHelper;
        private UserConnection _userConnection;
        #endregion Fields: Private

        #region Propeties: Private
        public UserConnection userConnection
        {
            get
            {
                if (_userConnection != null)
                {
                    return _userConnection;
                }
                _userConnection = HttpContext.Current.Session["UserConnection"] as UserConnection;
                if (_userConnection != null)
                {
                    return _userConnection;
                }
                var appConnection = (AppConnection)HttpContext.Current.Application["AppConnection"];
                _userConnection = appConnection.SystemUserConnection;
                return _userConnection;
            }
            set
            {
                _userConnection = value;
            }
        }
        #endregion Propeties: Private

        #region Properties: Public
        public FBServiceHelper fbServiceHelper
        {
            get
            {
                return _fbServiceHelper ??
                    (_fbServiceHelper = new FBServiceHelper() { userConnection = userConnection });
            }
        }
        #endregion Properties: Public

        #region Methods: Public

        /// <summary>
        /// Looks for Facebook page via FB GraphAPI. 
        /// </summary>
        /// <param name="url">String url adress of searching FB Page</param>
        /// <returns>FBPageSearchResponse</returns>
        [OperationContract]
        [WebInvoke(Method = "POST", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        public FBPageSearchResponse FindFBPage(string url)
        {
            if (string.IsNullOrEmpty(url)) throw new Exception("Empty url");
            return fbServiceHelper.FindFBPage(url);
        }

        /// <summary>
        /// Generates long-lived access token.
        /// </summary>
        /// <param name="token">Shotr-lived exchange token.</param>
        /// <returns>BaseResponse representing response result.</returns>
        [OperationContract]
        [WebInvoke(Method = "POST", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        public BaseResponse GenerateLongLiveToken(string token)
        {
            if (string.IsNullOrEmpty(token)) throw new Exception("Exchange token is empty");
            return fbServiceHelper.GenerateLongLiveToken(token);
        }

        /// <summary>
        /// Updates FB Page information about Posts, and users reactions and shares.
        /// </summary>
        /// <param name="pageId">Page Id in system</param>
        /// <param name="fbPageId">Page Id in FB GraphAPI</param>
        /// <param name="fbPageName">Page Name (for creating reminding.)</param>
        [OperationContract]
        [WebInvoke(Method = "POST", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.Wrapped)]
        public void UpdateFBPageUserActionsInfo(Guid pageId, string fbPageId, string fbPageName)
        {
            if (string.IsNullOrEmpty(fbPageId)) throw new Exception("fbPageId is null or empty.");
            Authenticate();
            System.Threading.Tasks.Task.Factory.StartNew(
                () => executeUpdateFBPageUserActionsInfo(pageId, fbPageId, fbPageName)
            );
        }

        /// <summary>
        /// Updates all FB Pages information about Posts, and users reactions and shares.
        /// </summary>
        [OperationContract]
        [WebInvoke(Method = "POST", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        public void UpdateAllFBPagesUserActionsInfo(int postLimit)
        {
            Authenticate();
            System.Threading.Tasks.Task.Factory.StartNew(
                    () => executeUpdateAllFBPagesUserActionsInfo(postLimit)
            );
        }

        /// <summary>
        /// Binds already existing FB actions to newly added Contacts facebook communications.
        /// </summary>
        [OperationContract]
        [WebInvoke(Method = "POST", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        public void UpdateContactsBindingWithFB()
        {
            Authenticate();
            System.Threading.Tasks.Task.Factory.StartNew(
                () => executeUpdateContactsBindingWithFB()
            );
        }

        /// <summary>
        /// Binds already existing FB actions to Contact facebook communications.
        /// </summary>
        [OperationContract]
        [WebInvoke(Method = "POST", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.Wrapped)]
        public bool UpdateContactBindingWithFB(Guid contactId, string fbContactId, string contactName)
        {
            try
            {
                fbServiceHelper.UpdateContactBindingWithFB(contactId, fbContactId);
                return true;
            }
            catch (Exception ex)
            {
                fbServiceHelper.InsertFBPageReminding(String.Format(FB_CONTACT_BIND_ERROR_MSG, contactName), Guid.Empty, userConnection.CurrentUser.ContactId, ex.ToString());
                return false;
            }
        }

        /// <summary>
        /// Searches for existing contacts for binding with FB actions, 
        /// or creates new Contacts and binds actions to created contacts if search fails.
        /// </summary>
        /// <param name="contactId"></param>
        /// <param name="fbContactId"></param>
        /// <param name="contactName"></param>
        /// <returns></returns>
        [OperationContract]
        [WebInvoke(Method = "POST", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.Wrapped)]
        public void CreateContactsAndUpdateBinding(Dictionary<string, string> selectedFBContacts)
        {
            try
            {
                var createdCount = 0;
                var foundedCount = 0;
                fbServiceHelper.CreateContactsAndUpdateBinding(selectedFBContacts, out createdCount, out foundedCount);
                fbServiceHelper.InsertFBPageReminding(String.Format(FB_CONTACTS_CREATED_MSG, createdCount, foundedCount), Guid.Empty, userConnection.CurrentUser.ContactId);
            }
            catch (Exception ex)
            {
                fbServiceHelper.InsertFBPageReminding(String.Format(FB_CONTACTS_CREATED_ERROR_MSG), Guid.Empty, userConnection.CurrentUser.ContactId, ex.ToString());
            }
        }
        #endregion Methods: Public

        #region Methods: Private
        private void Authenticate()
        {
            if (userConnection == null)
            {
                throw new System.Security.Authentication.AuthenticationException();
            }
        }

        private void executeUpdateContactsBindingWithFB()
        {
            try
            {
                fbServiceHelper.UpdateContactsBindingWithFB();
            }
            catch (Exception ex)
            {
                fbServiceHelper.InsertFBPageReminding(FB_CONTACTS_BIND_ERROR_MSG, Guid.Empty, userConnection.CurrentUser.ContactId, ex.ToString());
            }
        }

        private void executeUpdateAllFBPagesUserActionsInfo(int postLimit)
        {
            try
            {
                fbServiceHelper.UpdateAllFBPagesUserActionsInfo(postLimit);
            }
            catch (Exception ex)
            {
                fbServiceHelper.InsertFBPageReminding(FB_PAGES_UPDATE_ERROR_MSG, Guid.Empty, userConnection.CurrentUser.ContactId, ex.ToString());
            }
        }

        private void executeUpdateFBPageUserActionsInfo(Guid pageId, string fbPageId, string fbPageName)
        {
            try
            {
                fbServiceHelper.UpdateFBPageUserActionsInfo(pageId, fbPageId);
                fbServiceHelper.InsertFBPageReminding(String.Format(FB_PAGE_UPDATED_REMINDING_MSG, fbPageName), pageId, userConnection.CurrentUser.ContactId);
            }
            catch (Exception ex)
            {
                fbServiceHelper.InsertFBPageReminding(String.Format(FB_PAGE_UPDATE_ERROR_MSG, fbPageName), pageId, userConnection.CurrentUser.ContactId, ex.ToString());
                throw ex;
            }
        }
        #endregion Methods: Private
    }

    #endregion Class: FBService
}