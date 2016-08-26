//Удалять табы так:
onChangeDonor: function () {
	var tabsCollection = this.get("TabsCollection");
	var ilayContactType1Page10Tab = tabsCollection.contains("ilayContactType1Page10Tab")?tabsCollection.get("ilayContactType1Page10Tab"):false;
	if(!this.get("ilayDonor") && ilayContactType1Page10Tab) {
		Terrasoft.Contact.ilayContactType1Page10Tab = ilayContactType1Page10Tab;
		tabsCollection.removeByKey("ilayContactType1Page10Tab");
	} else if (!ilayContactType1Page10Tab) {
		tabsCollection.insert(2, "ilayContactType1Page10Tab", Terrasoft.Contact.ilayContactType1Page10Tab);
	}
},