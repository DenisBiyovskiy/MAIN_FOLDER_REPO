Guid servId = Get<Guid>("ProcessServiceChosen");
//UserConnetction userConnetction = context.UserConnetction;
var serializedCollection = Get<String>("ProcessDocOrderEntCollection");
//List entCollection = Json.Deserialize<List>(serializedCollection);
var entCollection = JsonConvert.DeserializeObject<List<Guid>>(serializedCollection);
if(entCollection == null || entCollection.Count == 0) {
	Set<String>("ProcessDocOrderEntCollection", "END");
	Set<bool>("ProcessNextMedDocFlag", true);
	return true;
}
List<Guid> ent = entCollection;

if(ent != null && ent.Count != 0) {
	CreateBuhDocInOrder(ent[0]);
} else {
	entCollection = null;
	Set<String>("ProcessDocOrderEntCollection", "END");
	Set<bool>("ProcessNextMedDocFlag", true);
	return true;
}
if (entCollection != null) entCollection.Remove(ent[0]);

//SerializeEntCollection(entCollection);
serializedCollection = JsonConvert.SerializeObject(entCollection);
Set("ProcessDocOrderEntCollection", serializedCollection);

return true;
//using Terrasoft.Common.Json