var UserConnection = context.UserConnection;

string ssFTPServer = SysSettings.GetValue<string>(UserConnection, "ExportProperties_FTPServer", "");
string ssFTPObjectsFilename = SysSettings.GetValue<string>(UserConnection, "ExportProperties_FTPObjectsFilename", "");
string ssFTPUser = SysSettings.GetValue<string>(UserConnection, "ExportProperties_FTPUser", "");
string ssFTPPassword = SysSettings.GetValue<string>(UserConnection, "ExportProperties_FTPPassword", "");
string ssFTPPath = SysSettings.GetValue<string>(UserConnection, "ExportProperties_FTPPath", "");
bool ssFTPUseSSL = SysSettings.GetValue<bool>(UserConnection, "ExportProperties_FTPUseSSL", false);

List<string> pictureList = new List<string>();

var PicturesESQ = new EntitySchemaQuery(UserConnection.EntitySchemaManager, "ListingGalleryImage");
PicturesESQ.AddAllSchemaColumns();
var PictureFilter = PicturesESQ.CreateFilterWithParameters(FilterComparisonType.Equal, "Listing", new Guid("47cb5803-ea09-4f51-9100-5e1e0a8e0462"));
PicturesESQ.Filters.Add(PictureFilter);
var PicturesEntities = PicturesESQ.GetEntityCollection(UserConnection);
foreach (Entity listingPicture in PicturesEntities) {
	FtpClient ftp = new FtpClient();
	ftp.Host = ssFTPServer;
	ftp.LoginName = ssFTPUser;
	ftp.LoginPassword = ssFTPPassword;

	string fileName = listingPicture.GetTypedColumnValue<string>("Name");
	var data = listingPicture.GetColumnValue("Data") as byte[];
	ftp.CreateFileFromContent(ssFTPPath, fileName, data, data.Length);
    pictureList.Add(fileName);
}
return true;