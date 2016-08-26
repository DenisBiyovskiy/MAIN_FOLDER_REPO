{
  "Version": "7.7.0.2555",
  "UId": "aeb9a2cd-c27f-41b5-8947-0f6e016c4ef4",
  "ManagerName": "SourceCodeSchemaManager",
  "Name": "CbrfRestService",
  "Caption": "CbrfRestService",
  "ExtendParent": false,
  "DenyExtending": false,
  "IncludeDependenciesSource": false,
  "Description": "",
  "MetaData": "{\r
\n  \"MetaData\": {\r
\n    \"Schema\": {\r
\n      \"ManagerName\": \"SourceCodeSchemaManager\",\r
\n      \"UId\": \"aeb9a2cd-c27f-41b5-8947-0f6e016c4ef4\",\r
\n      \"A2\": \"CbrfRestService\",\r
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
\n\\tpublic class CbrfRestService {\\r\
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
\n\\t\\t[WebInvoke(Method = \\\"POST\\\", UriTemplate = \\\"GetCurrentCurrencyRate\\\", BodyStyle = WebMessageBodyStyle.Wrapped,\\r\
\n\\t\\t\\tRequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]\\r\
\n\\t\\tpublic decimal GetCurrentCurrencyRate(string Code) {\\r\
\n\\t\\t\\tCbrfProxyUtils utils = new CbrfProxyUtils(this.UserConnection);\\r\
\n\\t\\t\\treturn utils.GetCurrentCurrencyRate(Code);\\r\
\n\\t\\t}\\r\
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
\n\t\t\t<Item Name=\"Caption\" Value=\"CbrfRestService\" />\r
\n\t\t</Items>\r
\n\t</Group>\r
\n</Resources>"
    }
  ],
  "Properties": []
}