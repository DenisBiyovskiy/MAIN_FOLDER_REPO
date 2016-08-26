var currentSelect = new Select(UserConnection)
	.Column("Id") 
	.Column("UsrDocumentNamePrefix")
	.Column("UsrCurrentNumber")
	.Column("UsrLatestYear")
	.From("DocumentType")
.Where("Id").IsEqual(Column.Parameter(Entity.GetTypedColumnValue<Guid>("TypeId"))) as Select;

using (var dbExecutor = UserConnection.EnsureDBConnection())
{
	using (var dataReader = currentSelect.ExecuteReader(dbExecutor))
	{
		while (dataReader.Read())
		{
			if(UserConnection.DBTypeConverter.DBValueToGuid(dataReader["Id"]) != Guid.Empty)
			{
				DateTime date = DateTime.Now;
				string d = "" + date.Year;
				d = d.Substring(2,2);
				int latestYear = Convert.ToInt32(dataReader["UsrLatestYear"]);
				if(latestYear == 0){
					var update = new Update(UserConnection, "DocumentType")
					.Set("UsrLatestYear",Column.Parameter(d)) as Update;
					update.Execute();
					latestYear = Convert.ToInt32(d);
				}
				if(Convert.ToInt32(d) > latestYear){
					var update1 = new Update(UserConnection, "DocumentType")
					.Set("UsrCurrentNumber",Column.Parameter(0)) as Update;
					update1.Execute();
					var update2 = new Update(UserConnection, "DocumentType")
					.Set("UsrLatestYear",Column.Parameter(d)) as Update;
					update2.Execute();
				}
				int currNum = Convert.ToInt32(dataReader["UsrCurrentNumber"]) + 1;
				string tempNum = "" + currNum;
				while(tempNum.Length < 3){
					tempNum = "0" + tempNum;
				}
				var number = Convert.ToString(dataReader["UsrDocumentNamePrefix"]) + 
					"." + d + "." + tempNum;
				Entity.SetColumnValue("Number", number);
				var update3= new Update(UserConnection, "DocumentType")
				.Set("UsrCurrentNumber",Column.Parameter(currNum))
				.Where("Id").IsEqual(Column.Parameter(Entity.GetTypedColumnValue<Guid>("TypeId"))) as Update;
				update3.Execute();
			}
		}
	}
}
return true;