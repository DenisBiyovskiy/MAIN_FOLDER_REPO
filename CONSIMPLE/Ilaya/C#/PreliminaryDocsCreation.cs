Guid servId = Get<Guid>("ProcessServiceChosen");
Guid medDoc = new Guid("2F3F339E-7A37-4772-8C87-C4DFF260B341");//Тип - мед.док.
//UserConnetction userConnetction = context.UserConnetction;
var serializedCollection = Get<String>("ProcessDocOrderEntCollection");
//List entCollection = Json.Deserialize<List>(serializedCollection);
var entCollection = JsonConvert.DeserializeObject<List<List<Guid>>>(serializedCollection);
if(entCollection == null) {
	Set<String>("ProcessDocOrderEntCollection", "END");
	Set<bool>("ProcessNextMedDocFlag", true);
	return true;
}
List<Guid> ent = null;
if(entCollection.Count > 0) {
	ent = entCollection[0];
}
if(ent != null && !ent[0].Equals(medDoc)) {
	CreateBuhDocInOrder(ent[1]);
} else {
	entCollection = null;
	Set<String>("ProcessDocOrderEntCollection", "END");
	Set<bool>("ProcessNextMedDocFlag", true);
	return true;
}
if (entCollection != null) entCollection.Remove(ent);

//SerializeEntCollection(entCollection);
serializedCollection = JsonConvert.SerializeObject(entCollection);
Set("ProcessDocOrderEntCollection", serializedCollection);

return true;