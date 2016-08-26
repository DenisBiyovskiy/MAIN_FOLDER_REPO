var currentSelect = new Select(UserConnection)
	.Column("Id") 
	.Column("Surname")
	.Column("GivenName")
	.Column("MiddleName")
	.From("Contact")
.Where("Id").IsEqual(Column.Parameter(Entity.GetTypedColumnValue<Guid>("Id"))) as Select;

using (var dbExecutor = UserConnection.EnsureDBConnection())
{
	using (var dataReader = currentSelect.ExecuteReader(dbExecutor))
	{
		while (dataReader.Read())
		{
			if(UserConnection.DBTypeConverter.DBValueToGuid(dataReader["Id"]) != Guid.Empty)
			{
				var name = Convert.ToString(dataReader["Surname"]) + " " + 
						Convert.ToString(dataReader["GivenName"]) + " " + 
						Convert.ToString(dataReader["MiddleName"]);
				var update = new Update(UserConnection, "Contact")
				.Set("Name", Column.Parameter(name))
				.Where("Id").IsEqual(Column.Parameter(Entity.GetTypedColumnValue<Guid>("Id"))) as Update;
				update.Execute();
			}
		}
	}
}
return true;