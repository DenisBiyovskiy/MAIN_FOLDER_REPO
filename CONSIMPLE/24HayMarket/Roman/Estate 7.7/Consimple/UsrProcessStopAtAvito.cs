var UserConnection = context.UserConnection;
XmlWriterSettings settings = new XmlWriterSettings();
settings.Indent = true;
settings.Encoding = Encoding.UTF8;
var sw = new StringWriter();
var xw = XmlWriter.Create(sw, settings);
xw.WriteStartDocument();
string[] guids = getSelectedItemsID(Get<string>("SelectedListings"));
// open tag "Ads"
xw.WriteStartElement("Ads");
xw.WriteAttributeString("formatVersion", "3");
xw.WriteAttributeString("target", "Avito.ru");
for (int i = 0; i < guids.Length - 1; i++) {
	// open tag "Ad"
	xw.WriteStartElement("Ad"); 
	xw.WriteElementString("Id", guids[i]);
	xw.WriteElementString("DateEnd", DateTime.Today.AddDays(-7).ToString("yyyy-MM-dd"));
	xw.WriteEndElement(); // close tag "Ad"
	
	// update tbl.Listing 
	// date export and export done
	var update = new Update(UserConnection, "Listing")
		.Set("UsrStopAvito",Column.Parameter(DateTime.Now))
		.Set("UsrExportedOnAvito",Column.Parameter(false))
		.Where("Id").IsEqual(Column.Parameter(guids[i])) as Update;		
	update.Execute();
}
xw.WriteEndElement(); // close tag "Ads"
xw.WriteEndDocument();
xw.Close();
System.IO.File.WriteAllText(@"E:\StopListingsEstate.xml", sw.ToString().Replace("utf-16", "utf-8"));
return true;

//---------------------------------------------------------------------------------------------------------------
methods: 
public string[] getSelectedItemsID (string selected) {
	string[] split = selected.Split(new Char [] {','});
	return split;
}

usings: 
System.Text;
System.IO;
System.Xml;
System.Collections.Generic;
System.Xml.Linq;

parametrs:
string SelectedListings;