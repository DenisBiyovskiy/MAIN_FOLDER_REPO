var UserConnection = context.UserConnection;
var ListingESQ = new EntitySchemaQuery(UserConnection.EntitySchemaManager, "ListingGalleryImage");
ListingESQ.AddAllSchemaColumns();
var RGReservationsFilter = ListingESQ.CreateFilterWithParameters(FilterComparisonType.Equal, "Listing", Get<Guid>("SelectedListings"));
ListingESQ.Filters.Add(RGReservationsFilter);
var RGReservationsEntities = ListingESQ.GetEntityCollection(UserConnection);
List<string> list = new List<string>();
using (Ionic.Zip.ZipFile zip = new Ionic.Zip.ZipFile()) {
	foreach (Entity listingPicture in RGReservationsEntities) {
		string fileName = listingPicture.GetTypedColumnValue<string>("Name");
		var data = listingPicture.GetColumnValue("Data") as byte[];
		using (Image image = Image.FromStream(new MemoryStream(data))) {
		    image.Save(@"E:\\" + fileName, System.Drawing.Imaging.ImageFormat.Jpeg);
		    zip.AddFile(@"E:\\" + fileName);
		    list.Add(fileName);
		}
	}
	zip.Save(@"E:\\photos.zip");
	foreach (string file in list) {
		File.Delete(@"E:\\" + file);
	}
}
return true

//---------------------------------------------------------------------------------------

using:
System.IO
System.Drawing
System.Collections.Generic