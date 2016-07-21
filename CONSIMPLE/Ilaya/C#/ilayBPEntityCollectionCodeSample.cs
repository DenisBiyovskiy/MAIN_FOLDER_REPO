Guid contactId = new Guid("B774D264-3F11-4D9E-9C09-75F9C5CA1DA8");
//var userConnection = Get<UserConnection>("UserConnection");
// Создание запроса к схеме City, добавление в запрос колонки Name.
var esqResult = new EntitySchemaQuery(UserConnection.EntitySchemaManager, "Account");
esqResult.AddColumn("Name");

// Выполнение запроса к базе данных и получение всей результирующей коллекции объектов.
var entities = esqResult.GetEntityCollection(UserConnection);
//Set("testParam", entities);
var testParam =  entities;

var newEnt = testParam;

string res = "";
foreach(var ent in newEnt) {
	res += ent.GetTypedColumnValue<string>("Name") + " ";
}

var update = new Update(UserConnection, "Contact")
		.Set("Name", Column.Parameter(res))
	.Where("Id").IsEqual(Column.Parameter(contactId)) as Update;
using (var dbExecutor = UserConnection.EnsureDBConnection())
{
	update.Execute(dbExecutor);
}
return true;
