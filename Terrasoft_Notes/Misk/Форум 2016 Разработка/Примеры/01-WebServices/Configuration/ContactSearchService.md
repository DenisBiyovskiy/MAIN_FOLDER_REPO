{
  "Version": "7.7.0.2555",
  "UId": "ac2776dd-8259-4918-acad-33d864f82ce6",
  "ManagerName": "SourceCodeSchemaManager",
  "Name": "ContactSearchService",
  "Caption": "ContactSearchService",
  "ExtendParent": false,
  "DenyExtending": false,
  "IncludeDependenciesSource": false,
  "Description": "",
  "MetaData": "{\r
\n  \"MetaData\": {\r
\n    \"Schema\": {\r
\n      \"ManagerName\": \"SourceCodeSchemaManager\",\r
\n      \"UId\": \"ac2776dd-8259-4918-acad-33d864f82ce6\",\r
\n      \"A2\": \"ContactSearchService\",\r
\n      \"A5\": \"c827fd79-fffd-4542-b113-e608a3530cf9\",\r
\n      \"B1\": [],\r
\n      \"B2\": [],\r
\n      \"B3\": [],\r
\n      \"B6\": \"856045fa-787b-42ad-9363-3c3cea8beaf3\",\r
\n      \"B8\": \"7.7.0.2555\",\r
\n      \"HD1\": \"50e3acc0-26fc-4237-a095-849a1d534bd3\",\r
\n      \"HD2\": \"namespace Terrasoft.Configuration\\r\
\n{\\r\
\n\\tusing System;\\r\
\n\\tusing System.Collections.Generic;\\r\
\n\\tusing System.Runtime.Serialization;\\r\
\n\\tusing System.Linq;\\r\
\n\\tusing System.ServiceModel;\\r\
\n\\tusing System.ServiceModel.Web;\\r\
\n\\tusing System.ServiceModel.Activation;\\r\
\n\\tusing System.Web;\\r\
\n\\tusing System.IO;\\r\
\n\\tusing Terrasoft.Core;\\r\
\n\\tusing Terrasoft.Core.Configuration;\\r\
\n\\tusing Terrasoft.Core.DB;\\r\
\n\\tusing Terrasoft.Core.Entities;\\r\
\n\\t\\r\
\n\\t[ServiceContract]\\r\
\n\\t[AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Required)]\\r\
\n\\tpublic class ContactSearchService {\\r\
\n\\t\\t\\r\
\n\\t\\t#region Properties: Private\\r\
\n\\t\\tprivate UserConnection _userConnection;\\r\
\n\\t\\t/// <summary>\\r\
\n\\t\\t/// Пользовательское подключение.\\r\
\n\\t\\t/// </summary>\\r\
\n\\t\\tprivate UserConnection UserConnection {\\r\
\n\\t\\t\\tget {\\r\
\n\\t\\t\\t\\treturn _userConnection ?? (_userConnection = HttpContext.Current.Session[\\\"UserConnection\\\"] as UserConnection);\\r\
\n\\t\\t\\t}\\r\
\n\\t\\t}\\r\
\n\\t\\t#endregion Properties: Private\\r\
\n\\t\\t\\r\
\n\\t\\t[OperationContract]\\r\
\n\\t\\t[WebInvoke(Method = \\\"POST\\\", UriTemplate = \\\"SearchByEmail\\\", BodyStyle = WebMessageBodyStyle.Wrapped,\\r\
\n\\t\\t\\tRequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]\\r\
\n\\t\\tpublic SearchByEmailResponse SearchByEmail(string email) {\\r\
\n\\t\\t\\tSearchByEmailResponse result = new SearchByEmailResponse();\\r\
\n\\t\\t\\tClientSearchUtils clientSearchUtils = new ClientSearchUtils(this.UserConnection);\\r\
\n\\t\\t\\ttry {\\r\
\n\\t\\t\\t\\tresult.UserName = UserConnection.CurrentUser.Name;\\r\
\n\\t\\t\\t\\tvar contactCollection = clientSearchUtils.SearchContactByEmail(email);\\r\
\n\\t\\t\\t\\tforeach (var item in contactCollection) {\\r\
\n\\t\\t\\t\\t\\tresult.Response.Add(new SearchItem() {\\r\
\n\\t\\t\\t\\t\\t\\tId = item.GetTypedColumnValue<Guid>(\\\"ContactId\\\"),\\r\
\n\\t\\t\\t\\t\\t\\tName = item.GetTypedColumnValue<string>(\\\"ContactName\\\"),\\r\
\n\\t\\t\\t\\t\\t\\tType = item.GetTypedColumnValue<string>(\\\"ContactType\\\"),\\r\
\n\\t\\t\\t\\t\\t\\tEmail = item.GetTypedColumnValue<string>(\\\"ContactEmail\\\")\\r\
\n\\t\\t\\t\\t\\t});\\r\
\n\\t\\t\\t\\t}\\r\
\n\\t\\t\\t} catch (Exception ex) {\\r\
\n\\t\\t\\t\\tresult.Success = false;\\r\
\n\\t\\t\\t\\tresult.ErrorMessage = ex.Message;\\r\
\n\\t\\t\\t}\\r\
\n\\t\\t\\treturn result;\\r\
\n\\t\\t}\\r\
\n\\t\\t\\r\
\n\\t\\t#region Class: DataContract\\r\
\n\\t\\t\\r\
\n\\t\\t[DataContract]\\r\
\n\\t\\tpublic class SearchByEmailResponse {\\r\
\n\\t\\t\\tpublic SearchByEmailResponse() {\\r\
\n\\t\\t\\t\\tthis.Success = true;\\r\
\n\\t\\t\\t\\tthis.Response = new List<SearchItem>();\\r\
\n\\t\\t\\t}\\r\
\n\\t\\t\\t[DataMember]\\r\
\n\\t\\t\\tpublic List<SearchItem> Response {\\r\
\n\\t\\t\\t\\tget;\\r\
\n\\t\\t\\t\\tset;\\r\
\n\\t\\t\\t}\\r\
\n\\t\\t\\t[DataMember]\\r\
\n\\t\\t\\tpublic string UserName {\\r\
\n\\t\\t\\t\\tget;\\r\
\n\\t\\t\\t\\tset;\\r\
\n\\t\\t\\t}\\r\
\n\\t\\t\\t[DataMember]\\r\
\n\\t\\t\\tpublic bool Success {\\r\
\n\\t\\t\\t\\tget;\\r\
\n\\t\\t\\t\\tset;\\r\
\n\\t\\t\\t}\\r\
\n\\t\\t\\t[DataMember]\\r\
\n\\t\\t\\tpublic string ErrorMessage {\\r\
\n\\t\\t\\t\\tget;\\r\
\n\\t\\t\\t\\tset;\\r\
\n\\t\\t\\t}\\r\
\n\\t\\t}\\r\
\n\\r\
\n\\t\\t[DataContract]\\r\
\n\\t\\tpublic class SearchItem {\\r\
\n\\t\\t\\t[DataMember]\\r\
\n\\t\\t\\tpublic Guid Id {\\r\
\n\\t\\t\\t\\tget;\\r\
\n\\t\\t\\t\\tset;\\r\
\n\\t\\t\\t}\\r\
\n\\t\\t\\t[DataMember]\\r\
\n\\t\\t\\tpublic string Name {\\r\
\n\\t\\t\\t\\tget;\\r\
\n\\t\\t\\t\\tset;\\r\
\n\\t\\t\\t}\\r\
\n\\t\\t\\t[DataMember]\\r\
\n\\t\\t\\tpublic string Type {\\r\
\n\\t\\t\\t\\tget;\\r\
\n\\t\\t\\t\\tset;\\r\
\n\\t\\t\\t}\\r\
\n\\t\\t\\t[DataMember]\\r\
\n\\t\\t\\tpublic string Email {\\r\
\n\\t\\t\\t\\tget;\\r\
\n\\t\\t\\t\\tset;\\r\
\n\\t\\t\\t}\\r\
\n\\t\\t}\\r\
\n\\t\\r\
\n\\t\\t#endregion\\r\
\n\\t}\\r\
\n}\\r\
\n\"\r
\n    }\r
\n  }",
  "Resources": [
    {
      "Culture": "en-GB",
      "Source": "<?xml version=\"1.0\" encoding=\"utf-8\"?>\r
\n<Resources Culture=\"en-GB\">\r
\n\t<Group Type=\"String\" />\r
\n</Resources>"
    },
    {
      "Culture": "en-US",
      "Source": "<?xml version=\"1.0\" encoding=\"utf-8\"?>\r
\n<Resources Culture=\"en-US\">\r
\n\t<Group Type=\"String\" />\r
\n</Resources>"
    },
    {
      "Culture": "ru-RU",
      "Source": "<?xml version=\"1.0\" encoding=\"utf-8\"?>\r
\n<Resources Culture=\"ru-RU\">\r
\n\t<Group Type=\"String\">\r
\n\t\t<Items>\r
\n\t\t\t<Item Name=\"Caption\" Value=\"ContactSearchService\" />\r
\n\t\t</Items>\r
\n\t</Group>\r
\n</Resources>"
    }
  ],
  "Properties": []
}