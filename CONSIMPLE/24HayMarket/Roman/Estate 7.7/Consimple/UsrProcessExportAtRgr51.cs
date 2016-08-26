var UserConnection = context.UserConnection;
XmlWriterSettings settings = new XmlWriterSettings();
settings.Indent = true;
var sw = new StringWriter();
var xw = XmlWriter.Create(sw, settings);
string[] guids = getSelectedItemsID(Get<string>("SelectedListings"));

var ListingESQ = new EntitySchemaQuery(UserConnection.EntitySchemaManager, "Listing");
ListingESQ.AddAllSchemaColumns();
var groupFilter = new EntitySchemaQueryFilterCollection(ListingESQ, LogicalOperationStrict.Or);
for (int i = 0; i < guids.Length - 1; i++) {
	var filter = ListingESQ.CreateFilterWithParameters(FilterComparisonType.Equal, "Id", new Guid(guids[i]));
	groupFilter.Add(filter);
}
ListingESQ.Filters.Add(groupFilter);
// other param
var city = ListingESQ.AddColumn("City.Name").Name;
var region = ListingESQ.AddColumn("Region.Name").Name;
var ownerName = ListingESQ.AddColumn("Owner.Name").Name;
var ownerPhone = ListingESQ.AddColumn("Owner.MobilePhone").Name;
//-------
xw.WriteStartDocument();
var ListingEnteties = ListingESQ.GetEntityCollection(UserConnection);
if (ListingEnteties.Count > 0) {
	xw.WriteStartElement("Listings");
	foreach (Entity listing in ListingEnteties) {
		// открыт тег "Объект"
		xw.WriteStartElement("Object");
		xw.WriteAttributeString("City", listing.GetTypedColumnValue<string>(city));
		xw.WriteAttributeString("Region", listing.GetTypedColumnValue<string>(region));
		xw.WriteAttributeString("Street", listing.GetTypedColumnValue<string>("Street"));
		xw.WriteAttributeString("HouseNumber", listing.GetTypedColumnValue<string>("HouseNumber"));
		
		var AmenityESQ = new EntitySchemaQuery(UserConnection.EntitySchemaManager, "AmenityInObject");
		AmenityESQ.AddAllSchemaColumns();
		var AmenityFilter = AmenityESQ.CreateFilterWithParameters(FilterComparisonType.Equal, "Listing", listing.GetTypedColumnValue<Guid>("Id"));
		AmenityESQ.Filters.Add(AmenityFilter);
		var AmenityEnteties = AmenityESQ.GetEntityCollection(UserConnection);
		foreach (Entity amenity in AmenityEnteties) {
			addAmenityToDoc(xw, amenity);
		}
		// открыт тег "Площадь"
		xw.WriteStartElement("Squere");
		xw.WriteAttributeString("Full", Get<string>("fullSquere"));
		xw.WriteAttributeString("Living", Get<string>("livingSquere"));
		xw.WriteAttributeString("Kitchen", Get<string>("kitchenSquere"));
		xw.WriteAttributeString("Description", listing.GetTypedColumnValue<string>("Description"));
		xw.WriteEndElement();
		// закрыт тег "Площадь"
		//***
		// открыт тег "Информация"
		xw.WriteStartElement("Information");
		xw.WriteAttributeString("Contact", listing.GetTypedColumnValue<string>(ownerName));
		xw.WriteAttributeString("Phone", listing.GetTypedColumnValue<string>(ownerPhone));
		xw.WriteAttributeString("Price", listing.GetTypedColumnValue<int>("Price").ToString());
		xw.WriteEndElement();
		// закрыт тег "Информация"
		xw.WriteEndElement();
		// закрыт тег "Объект"
		//---
		// update tbl.Listing 
		// date export and export done
		var update = new Update(UserConnection, "Listing")
			.Set("UsrLastExportRgr51",Column.Parameter(DateTime.Now))
			.Set("UsrExportedOnRgr51",Column.Parameter(true))
			.Where("Id").IsEqual(Column.Parameter(listing.GetTypedColumnValue<Guid>("Id"))) as Update;		
		update.Execute();
		Set("kitchenSquere", "");
		Set("fullSquere", "");
		Set("livingSquere", "");
	}
	xw.WriteEndElement();
}
xw.WriteEndDocument();
xw.Close();
System.IO.File.WriteAllText(@"E:\ExportListingsEstate.xml", sw.ToString());
return true;

//-------------------------------------------------------------------------------------------------------------

methods:
public string[] getSelectedItemsID (string selected) {
	string[] split = selected.Split(new Char [] {','});
	return split;
}
public void addAmenityToDoc (XmlWriter xw, Entity amenity) {
	var kitchenSquereId = new Guid("D3E242ED-CD51-40FC-9432-5A43293CB243");// площадь кухни
	var fullSquereId = new Guid("ADCADD5A-A83E-407D-AAB7-90970CD3E795");// полная площадь
	var livingSquereId = new Guid("6A03F345-FB94-4348-996A-BC043B2C8F14");// жилая площадь
	var stageNumberId = new Guid("BFFCB9EB-1C86-4D2C-9AFF-AD20FE25220D");// этаж
	var houseStagesId = new Guid("B65FB423-0BE6-4A69-B673-B8F3DBD9E5CA");// этажность
	var roomNumbersId = new Guid("48481CE3-4AC7-461A-B640-16CFD30E9EC9");// количество комнат
	var materialOfHouseId = new Guid("1178B1DB-E5FF-4FB8-8184-4BA0234F9D4F");// материал стен
	
	if (amenity.GetTypedColumnValue<Guid>("AmenityId") == kitchenSquereId) {	
		Set("kitchenSquere", amenity.GetTypedColumnValue<string>("Value"));
		return;
	}
	if (amenity.GetTypedColumnValue<Guid>("AmenityId") == fullSquereId) {	
		Set("fullSquere", amenity.GetTypedColumnValue<string>("Value"));
		return;
	}
	if (amenity.GetTypedColumnValue<Guid>("AmenityId") == livingSquereId) {	
		Set("livingSquere", amenity.GetTypedColumnValue<string>("Value"));
		return;
	}
	if (amenity.GetTypedColumnValue<Guid>("AmenityId") == stageNumberId) {	
		xw.WriteAttributeString("NumberOfStage", amenity.GetTypedColumnValue<string>("Value"));
	} else if (amenity.GetTypedColumnValue<Guid>("AmenityId") == houseStagesId) {	
		xw.WriteAttributeString("CountOfStage", amenity.GetTypedColumnValue<string>("Value"));
	} else if (amenity.GetTypedColumnValue<Guid>("AmenityId") == roomNumbersId) {	
		xw.WriteAttributeString("CountOfRoom", amenity.GetTypedColumnValue<string>("Value"));
	} else if (amenity.GetTypedColumnValue<Guid>("AmenityId") == materialOfHouseId) {	
		xw.WriteAttributeString("MaterialOfHouse", amenity.GetTypedColumnValue<string>("Value"));
	} 
}

parametrs:
string SelectedListings;
string fullSquere;
string kitchenSquere;
string livingSquere;