if (esqPC.GetEntityCollection(UserConnection).Count == 0)
       {

        var tsnDictionary = new Dictionary<string, object>()
         {
         {"Id", Guid.NewGuid()},
         {TargetNameId, pId},
         {TargetSchemaBindingColumnValueName, RootSchemaRecordId}
         };
        if (TargetSchemaName == "CampaingTarget" && TargetName == "Card")
        {
         Select selectContactByCard = new Select(UserConnection);
         selectContactByCard.Column("Id")
          .Column("ContactId")
          .From("Card").Where("Id").IsEqual(Column.Parameter(pId));
         using (IDataReader reader = selectContactByCard.ExecuteReader(dbExecutor))
         {
          while (reader.Read())
          {
           tsnDictionary.Add("ContactId", reader["ContactId"]);
           break;
          }
         }
        }
        var error = EntityUtils.AddEntity(UserConnection, TargetSchemaName, tsnDictionary);
       }
//---------------------------------------------------------------------------------------------------------------------------------
       public static string AddEntity(UserConnection userConnection, string entityName, Dictionary<string, object> fieldValues) {
      string result = string.Empty;
      EntitySchema entitySchema = userConnection.EntitySchemaManager.GetInstanceByName(entityName);
      Entity entity = entitySchema.CreateEntity(userConnection);
      entity.SetDefColumnValues();
      try {
        foreach (var fieldKeyValue in fieldValues) {
          object value = fieldKeyValue.Value;
          string key = fieldKeyValue.Key;
          if (value is string) {
            string strValue = value.ToString();
            if (!string.IsNullOrEmpty(strValue)) {
              var textDataValueType = ((TextDataValueType)(entity.Schema.Columns.GetByColumnValueName(key).DataValueType));
              int size = textDataValueType.Size;
              if ((!textDataValueType.IsMaxSize) && (strValue.Length > size)) {
                strValue = strValue.Substring(0, size);
                string descriptionText = EntityUtils.ErrorCode(userConnection, "IncorrectStringLength");
              }
              entity.SetColumnValue(key, strValue);
            }
          } else if (value is DateTime) {
            if ((DateTime)value != DateTime.MinValue){
              entity.SetColumnValue(key, value);
            }
          } else if (value is Guid) {
            if ((Guid)value != Guid.Empty) {
              entity.SetColumnValue(key, value);
            }
          } else {
            if (value != null) {
              entity.SetColumnValue(key, value);
            }
          }
        }
        entity.Save();
      }
      catch (Exception ex) {
        result = ex.Message;
      }
      return result;
    }