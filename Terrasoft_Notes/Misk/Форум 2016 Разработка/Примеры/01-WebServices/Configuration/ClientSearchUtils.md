{
  "Version": "7.7.0.2219",
  "UId": "74177de5-0deb-4925-a693-b2b140bd54ed",
  "ManagerName": "SourceCodeSchemaManager",
  "Name": "ClientSearchUtils",
  "Caption": "ClientSearchUtils",
  "ExtendParent": false,
  "DenyExtending": false,
  "IncludeDependenciesSource": false,
  "Description": "",
  "MetaData": "{\r
\n  \"MetaData\": {\r
\n    \"Schema\": {\r
\n      \"ManagerName\": \"SourceCodeSchemaManager\",\r
\n      \"UId\": \"74177de5-0deb-4925-a693-b2b140bd54ed\",\r
\n      \"A2\": \"ClientSearchUtils\",\r
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
\n\\t\\r\
\n\\tpublic class ClientSearchUtils {\\r\
\n\\t\\tpublic ClientSearchUtils (UserConnection userConnection) {\\r\
\n\\t\\t\\tthis.UserConnection = userConnection;\\r\
\n\\t\\t}\\r\
\n\\t\\t\\r\
\n\\t\\tprivate UserConnection UserConnection {\\r\
\n\\t\\t\\tget;\\r\
\n\\t\\t\\tset;\\r\
\n\\t\\t}\\r\
\n\\t\\t\\r\
\n\\t\\tpublic EntityCollection SearchContactByEmail(string email) {\\r\
\n\\t\\t\\tif (string.IsNullOrEmpty(email)) {\\r\
\n\\t\\t\\t\\tthrow new ArgumentException(\\\"email is undefined.\\\");\\r\
\n\\t\\t\\t}\\r\
\n\\r\
\n\\t\\t\\tGuid emailCommunicationTypeId = new Guid(\\\"EE1C85C3-CFCB-DF11-9B2A-001D60E938C6\\\"); //e-mail\\r\
\n\\t\\t\\tvar entitySchemaManager = this.UserConnection.GetSchemaManager(\\\"EntitySchemaManager\\\") as EntitySchemaManager;\\r\
\n\\t\\t\\tvar esq = new EntitySchemaQuery(entitySchemaManager, \\\"ContactCommunication\\\");\\r\
\n\\t\\t\\tesq.RowCount = 20;\\r\
\n\\t\\t\\tesq.AddColumn(\\\"=Contact.Id\\\").Name = \\\"ContactId\\\";\\r\
\n\\t\\t\\tesq.AddColumn(\\\"=Contact.Name\\\").Name = \\\"ContactName\\\";\\r\
\n\\t\\t\\tesq.AddColumn(\\\"=Contact.Type.Name\\\").Name = \\\"ContactType\\\";\\r\
\n\\t\\t\\tesq.AddColumn(\\\"Number\\\").Name= \\\"ContactEmail\\\";\\r\
\n\\t\\t\\tesq.Filters.Add(esq.CreateFilterWithParameters(FilterComparisonType.Equal, \\\"CommunicationType\\\", \\r\
\n\\t\\t\\t\\temailCommunicationTypeId));\\r\
\n\\t\\t\\tesq.Filters.Add(esq.CreateFilterWithParameters(FilterComparisonType.Contain, \\\"Number\\\", email));\\r\
\n\\t\\t\\t\\r\
\n\\t\\t\\treturn esq.GetEntityCollection(this.UserConnection);\\r\
\n\\t\\t}\\r\
\n\\t\\t\\r\
\n\\t\\tpublic EntityCollection SearchAccountByWeb(string web) {\\r\
\n\\t\\t\\tif (string.IsNullOrEmpty(web)) {\\r\
\n\\t\\t\\t\\tthrow new ArgumentException(\\\"web is undefined.\\\");\\r\
\n\\t\\t\\t}\\r\
\n\\r\
\n\\t\\t\\tGuid emailCommunicationTypeId = new Guid(\\\"6A8BA927-67CC-DF11-9B2A-001D60E938C6\\\"); //web\\r\
\n\\t\\t\\tvar entitySchemaManager = this.UserConnection.GetSchemaManager(\\\"EntitySchemaManager\\\") as EntitySchemaManager;\\r\
\n\\t\\t\\tvar esq = new EntitySchemaQuery(entitySchemaManager, \\\"AccountCommunication\\\");\\r\
\n\\t\\t\\tesq.RowCount = 20;\\r\
\n\\t\\t\\tesq.AddColumn(\\\"=Account.Id\\\").Name = \\\"AccountId\\\";\\r\
\n\\t\\t\\tesq.AddColumn(\\\"=Account.Name\\\").Name = \\\"AccountName\\\";\\r\
\n\\t\\t\\tesq.AddColumn(\\\"=Account.Type.Name\\\").Name = \\\"AccountType\\\";\\r\
\n\\t\\t\\tesq.AddColumn(\\\"Number\\\").Name= \\\"AccountWeb\\\";\\r\
\n\\t\\t\\tesq.Filters.Add(esq.CreateFilterWithParameters(FilterComparisonType.Equal, \\\"CommunicationType\\\", \\r\
\n\\t\\t\\t\\temailCommunicationTypeId));\\r\
\n\\t\\t\\tesq.Filters.Add(esq.CreateFilterWithParameters(FilterComparisonType.Contain, \\\"Number\\\", web));\\r\
\n\\t\\t\\t\\r\
\n\\t\\t\\treturn esq.GetEntityCollection(this.UserConnection);\\r\
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
\n\t\t\t<Item Name=\"Caption\" Value=\"ClientSearchUtils\" />\r
\n\t\t</Items>\r
\n\t</Group>\r
\n</Resources>"
    }
  ],
  "Properties": []
}