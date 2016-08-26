{
  "Version": "7.7.0.2219",
  "UId": "be804fa0-2b13-409a-a595-78427cd02e98",
  "ManagerName": "SourceCodeSchemaManager",
  "Name": "CbrfProxyUtils",
  "Caption": "CbrfProxyUtils",
  "ExtendParent": false,
  "DenyExtending": false,
  "IncludeDependenciesSource": false,
  "Description": "",
  "MetaData": "{\r
\n  \"MetaData\": {\r
\n    \"Schema\": {\r
\n      \"ManagerName\": \"SourceCodeSchemaManager\",\r
\n      \"UId\": \"be804fa0-2b13-409a-a595-78427cd02e98\",\r
\n      \"A2\": \"CbrfProxyUtils\",\r
\n      \"A5\": \"c827fd79-fffd-4542-b113-e608a3530cf9\",\r
\n      \"B1\": [],\r
\n      \"B2\": [],\r
\n      \"B3\": [],\r
\n      \"B6\": \"da0d3165-0a47-42e7-9754-7b8d98dd1bea\",\r
\n      \"B8\": \"7.7.0.2555\",\r
\n      \"HD1\": \"50e3acc0-26fc-4237-a095-849a1d534bd3\",\r
\n      \"HD2\": \"namespace Terrasoft.Configuration\\r\
\n{\\r\
\n\\tusing System;\\r\
\n\\tusing System.Collections.Generic;\\r\
\n\\tusing System.IO;\\r\
\n\\tusing Terrasoft.Core;\\r\
\n\\tusing Terrasoft.Core.Configuration;\\r\
\n\\tusing Terrasoft.Core.DB;\\r\
\n\\tusing Terrasoft.Core.Entities;\\r\
\n\\tusing System.ServiceModel;\\r\
\n\\tusing System.Data;\\r\
\n\\t\\r\
\n\\tpublic class CbrfProxyUtils {\\r\
\n\\t\\tpublic CbrfProxyUtils (UserConnection userConnection) {\\r\
\n\\t\\t\\tthis.UserConnection = userConnection;\\r\
\n\\t\\t}\\r\
\n\\t\\t\\r\
\n\\t\\tprivate UserConnection UserConnection {\\r\
\n\\t\\t\\tget;\\r\
\n\\t\\t\\tset;\\r\
\n\\t\\t}\\r\
\n\\t\\t\\r\
\n\\t\\tpublic decimal GetCurrentCurrencyRate(string Code) {\\r\
\n\\t\\t\\tif (string.IsNullOrEmpty(Code)) {\\r\
\n\\t\\t\\t\\treturn -1;\\r\
\n\\t\\t\\t}\\r\
\n\\t\\t\\ttry {\\r\
\n\\t\\t\\t\\tDataSet ds = CallCbrfGetCursOnDate();\\r\
\n\\t\\t\\t\\tif (ds == null) {\\r\
\n\\t\\t\\t\\t\\treturn -1;\\r\
\n\\t\\t\\t\\t}\\r\
\n\\t\\t\\t\\tif (ds.Tables.Count == 0) {\\r\
\n\\t\\t\\t\\t\\treturn -1;\\r\
\n\\t\\t\\t\\t}\\r\
\n\\t\\t\\t\\tfor (int i = 0; i < ds.Tables[0].Rows.Count; i++) {\\r\
\n\\t\\t\\t\\t\\tif (ds.Tables[0].Rows[i][\\\"VchCode\\\"].ToString() == Code) {\\r\
\n\\t\\t\\t\\t\\t\\treturn Convert.ToDecimal(ds.Tables[0].Rows[i][\\\"Vcurs\\\"].ToString());\\r\
\n\\t\\t\\t\\t\\t}\\r\
\n\\t\\t\\t\\t}\\r\
\n\\t\\t\\t\\treturn -1;\\r\
\n\\t\\t\\t} catch (Exception ex) {\\r\
\n\\t\\t\\t\\treturn -1;\\r\
\n\\t\\t\\t}\\r\
\n\\t\\t}\\r\
\n\\t\\t\\r\
\n\\t\\tprivate string GetCbrfDailyInfoServiceUrl() {\\r\
\n\\t\\t\\treturn (string)Terrasoft.Core.Configuration.SysSettings.GetValue(this.UserConnection, \\\"CbrfDailyInfoServiceUrl\\\");\\r\
\n\\t\\t}\\r\
\n\\t\\t\\r\
\n\\t\\tprivate DataSet CallCbrfGetCursOnDate() {\\r\
\n\\t\\t\\tBasicHttpBinding binding = new BasicHttpBinding();\\r\
\n\\t\\t\\tEndpointAddress address =\\r\
\n\\t\\t\\t\\tnew EndpointAddress(new Uri(GetCbrfDailyInfoServiceUrl()));\\r\
\n\\t\\t\\tCbrfProxy.CbrfService.DailyInfoSoapClient client = \\r\
\n\\t\\t\\t\\tnew CbrfProxy.CbrfService.DailyInfoSoapClient(binding, address);\\r\
\n\\t\\t\\treturn client.GetCursOnDate(DateTime.Now);\\r\
\n\\t\\t}\\r\
\n\\t\\t\\r\
\n\\t\\tprivate DataSet CallCbrfGetCursOnDateV2() {\\r\
\n\\t\\t\\tBasicHttpBinding binding = new BasicHttpBinding();\\r\
\n\\t\\t\\tEndpointAddress address =\\r\
\n\\t\\t\\t\\tnew EndpointAddress(new Uri(GetCbrfDailyInfoServiceUrl()));\\r\
\n\\t\\t\\tTerrasoft.Configuration.CbrfProxyV2.DailyInfoSoapClient client = \\r\
\n\\t\\t\\t\\tnew Terrasoft.Configuration.CbrfProxyV2.DailyInfoSoapClient(binding, address);\\r\
\n\\t\\t\\treturn client.GetCursOnDate(DateTime.Now);\\r\
\n\\t\\t}\\r\
\n\\t}\\r\
\n}\"\r
\n    }\r
\n  }",
  "Resources": [
    {
      "Culture": "ru-RU",
      "Source": "<?xml version=\"1.0\" encoding=\"utf-8\"?>\r
\n<Resources Culture=\"ru-RU\">\r
\n\t<Group Type=\"String\">\r
\n\t\t<Items>\r
\n\t\t\t<Item Name=\"Caption\" Value=\"CbrfProxyUtils\" />\r
\n\t\t</Items>\r
\n\t</Group>\r
\n</Resources>"
    }
  ],
  "Properties": []
}