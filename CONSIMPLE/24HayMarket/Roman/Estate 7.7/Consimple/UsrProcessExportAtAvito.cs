var UserConnection = context.UserConnection;

string ssFTPObjectsFilename = SysSettings.GetValue<string>(UserConnection, "ExportProperties_FTPObjectsFilename", "");
string ssFTPArchiveFilename = SysSettings.GetValue<string>(UserConnection, "ExportProperties_FTPArchiveFilename", "");

string ssFTPServer = SysSettings.GetValue<string>(UserConnection, "ExportProperties_FTPServer", "");
string ssFTPUser = SysSettings.GetValue<string>(UserConnection, "ExportProperties_FTPUser", "");
string ssFTPPassword = SysSettings.GetValue<string>(UserConnection, "ExportProperties_FTPPassword", "");
string ssFTPPath = SysSettings.GetValue<string>(UserConnection, "ExportProperties_FTPPath", "");
bool ssFTPUseSSL = SysSettings.GetValue<bool>(UserConnection, "ExportProperties_FTPUseSSL", false);

XmlWriterSettings settings = new XmlWriterSettings();
settings.Indent = true;
settings.Encoding = Encoding.UTF8;

var sw = new StringWriter();
var xw = XmlWriter.Create(sw, settings);
xw.WriteStartDocument();

string[] guids = getSelectedItemsID(Get<string>("SelectedListings"));
List<string> pictureList = new List<string>();
int addDays = 0;
if (Get<bool>("AddOrDelete")) {
	addDays += 30;
} else {
	addDays -= 30;
}
var ListingESQ = new EntitySchemaQuery(UserConnection.EntitySchemaManager, "Listing");
ListingESQ.AddAllSchemaColumns();
var groupFilter = new EntitySchemaQueryFilterCollection(ListingESQ, LogicalOperationStrict.Or);
for (int i = 0; i < guids.Length - 1; i++) {
	var filter = ListingESQ.CreateFilterWithParameters(FilterComparisonType.Equal, "Id", new Guid(guids[i]));
	groupFilter.Add(filter);
}
var filter2 = ListingESQ.CreateFilterWithParameters(FilterComparisonType.Equal, "UsrExportedOnAvito", true);
groupFilter.Add(filter2);
ListingESQ.Filters.Add(groupFilter);
// other param
var city = ListingESQ.AddColumn("City.Name").Name;
var region = ListingESQ.AddColumn("Region.Name").Name;
var ownerName = ListingESQ.AddColumn("Owner.Name").Name;
var ownerEmail = ListingESQ.AddColumn("Owner.Email").Name;
var ListingEnteties = ListingESQ.GetEntityCollection(UserConnection);
using (Ionic.Zip.ZipFile zip = new Ionic.Zip.ZipFile()) {
	zip.ProvisionalAlternateEncoding = System.Text.Encoding.GetEncoding(65001); 
	if (ListingEnteties.Count > 0) {
		// open tag "Ads"
		xw.WriteStartElement("Ads");
		xw.WriteAttributeString("formatVersion", "3");
		xw.WriteAttributeString("target", "Avito.ru");
		foreach (Entity listing in ListingEnteties) {
			string ownerPhone = "";
			var CommunicationESQ = new EntitySchemaQuery(UserConnection.EntitySchemaManager, "ContactCommunication");
			CommunicationESQ.AddAllSchemaColumns();
			var PhoneFilter = CommunicationESQ.CreateFilterWithParameters(FilterComparisonType.Equal, "CommunicationType", new Guid("3DDDB3CC-53EE-49C4-A71F-E9E257F59E49"));
			CommunicationESQ.Filters.Add(PhoneFilter);
			var ContactFilter = CommunicationESQ.CreateFilterWithParameters(FilterComparisonType.Equal, "Contact", listing.GetTypedColumnValue<Guid>("OwnerId"));
			CommunicationESQ.Filters.Add(ContactFilter);
			var CommunicationEnteties = CommunicationESQ.GetEntityCollection(UserConnection);
			if (CommunicationEnteties.Count > 0) {
				ownerPhone = CommunicationEnteties[0].GetTypedColumnValue<string>("Number");
			}

			var AmenityESQ = new EntitySchemaQuery(UserConnection.EntitySchemaManager, "AmenityInObject");
			AmenityESQ.AddAllSchemaColumns();
			var AmenityFilter = AmenityESQ.CreateFilterWithParameters(FilterComparisonType.Equal, "Listing", listing.GetTypedColumnValue<Guid>("Id"));
			AmenityESQ.Filters.Add(AmenityFilter);
			var AmenityEnteties = AmenityESQ.GetEntityCollection(UserConnection);
			// @param from amenity 
			string rooms = "";
			string fullSquare = "";
			string floor = "";
			string floors = "";
			string landArea = "";
			string wallsType = "";
			string leaseType = "";
			string houseType = "";
			string distanceToCity = "";
			string leaseCommission = "";
			string leaseCommissionSize = "";
			string leaseDeposit = "";
			string secured = "";
			string district = "";
			string objectType = "";
			string objectSubtype = "";
			foreach (Entity amenity in AmenityEnteties) {
				if (amenity.GetTypedColumnValue<Guid>("AmenityId") == new Guid("48481ce3-4ac7-461a-b640-16cfd30e9ec9")) {
					rooms = amenity.GetTypedColumnValue<string>("Value"); // Количество комнат
				} else if (amenity.GetTypedColumnValue<Guid>("AmenityId") == new Guid("adcadd5a-a83e-407d-aab7-90970cd3e795")) {
					fullSquare = amenity.GetTypedColumnValue<string>("Value"); // Полная площадь
				} else if (amenity.GetTypedColumnValue<Guid>("AmenityId") == new Guid("bffcb9eb-1c86-4d2c-9aff-ad20fe25220d")) {
					floor =  amenity.GetTypedColumnValue<string>("Value"); // Этаж
				} else if (amenity.GetTypedColumnValue<Guid>("AmenityId") == new Guid("b65fb423-0be6-4a69-b673-b8f3dbd9e5ca")) {
					floors =  amenity.GetTypedColumnValue<string>("Value"); // Этажей
				} else if (amenity.GetTypedColumnValue<Guid>("AmenityId") == new Guid("cf71a7bf-af7f-43e0-98b3-77a3cfc39cad")) {
					landArea =  amenity.GetTypedColumnValue<string>("Value"); // Площадь земельного участка
				} else if (amenity.GetTypedColumnValue<Guid>("AmenityId") == new Guid("1178b1db-e5ff-4fb8-8184-4ba0234f9d4f")) {
					wallsType =  amenity.GetTypedColumnValue<string>("Value"); // Материал стен
				} else if (amenity.GetTypedColumnValue<Guid>("AmenityId") == new Guid("4af47365-a786-400e-b1e1-48f4d338b06c")) {
					leaseType =  GetLeaseTypeName(amenity.GetTypedColumnValue<string>("Value")); // Тип аренды
				} else if (amenity.GetTypedColumnValue<Guid>("AmenityId") == new Guid("d412972a-da2e-40cf-ba3c-0491cab20c30")) {
					distanceToCity =  amenity.GetTypedColumnValue<string>("Value"); // расстояние до города
				} else if (amenity.GetTypedColumnValue<Guid>("AmenityId") == new Guid("b57f804d-1b67-43b9-8115-867ccf53e1d2")) {
					leaseCommission =  amenity.GetTypedColumnValue<string>("Value"); // Комиссия агенту
				} else if (amenity.GetTypedColumnValue<Guid>("AmenityId") == new Guid("4744b8f4-7e80-4ebf-9a2a-7fbc278be372")) {
					leaseCommissionSize =  amenity.GetTypedColumnValue<string>("Value"); // Размер комисии в %
				} else if (amenity.GetTypedColumnValue<Guid>("AmenityId") == new Guid("7c6f82d2-d76f-4d5c-a461-833e221bd24e")) {
					leaseDeposit =  amenity.GetTypedColumnValue<string>("Value"); // Залог
				} else if (amenity.GetTypedColumnValue<Guid>("AmenityId") == new Guid("d9b4659e-a172-4809-bd0b-ca599f793779")) {
					houseType =  amenity.GetTypedColumnValue<string>("Value"); // Тип дома
				} else if (amenity.GetTypedColumnValue<Guid>("AmenityId") == new Guid("b0f75c44-c345-4d0d-91d0-edaf587102f1")) {
					secured =  amenity.GetTypedColumnValue<string>("Value"); // Охрана объекта
				} else if (amenity.GetTypedColumnValue<Guid>("AmenityId") == new Guid("8287374e-6b5c-4f2c-856d-2d45ca382afb")) {
					district =  amenity.GetTypedColumnValue<string>("Value"); // Район города
				} else if (amenity.GetTypedColumnValue<Guid>("AmenityId") == new Guid("f32e505d-9573-4089-ab67-d2fe846d6703")) {
					objectSubtype =  amenity.GetTypedColumnValue<string>("Value"); // Подтип гаража\машиноместа
				}
				if (listing.GetTypedColumnValue<Guid>("PropertyTypeId") == new Guid("BE016F8F-C67C-484C-A469-EB2BCC01F70A")) { //если дом
					if (amenity.GetTypedColumnValue<Guid>("Id") == new Guid("6a6a9cd4-e2c8-4c55-8a64-bf3a290bb948")) {
						objectType = amenity.GetTypedColumnValue<string>("Value"); // Вид объекта
					}
				} else if (listing.GetTypedColumnValue<Guid>("PropertyTypeId") == new Guid("F520E605-6C35-499D-9A03-90A2C1D7320C")) { // если зем. участок
					if (amenity.GetTypedColumnValue<Guid>("Id") == new Guid("0d22139b-99fe-4011-adf8-3beeceb47c61")) {
						objectType = amenity.GetTypedColumnValue<string>("Value"); // Вид объекта
					}
				} else if (listing.GetTypedColumnValue<Guid>("PropertyTypeId") == new Guid("2B4F111F-D127-44C3-9ACC-0F902A42D2B5")) { // если ком. недвиж.
					if (amenity.GetTypedColumnValue<Guid>("Id") == new Guid("786b03ed-070e-40c2-be21-31f365332f58")) {
						objectType = amenity.GetTypedColumnValue<string>("Value"); // Вид объекта
					}
				} else if (listing.GetTypedColumnValue<Guid>("PropertyTypeId") == new Guid("6BD28092-F2DF-4DFB-AC9C-728BB6168D72")) { // если гараж 
					if (amenity.GetTypedColumnValue<Guid>("Id") == new Guid("4feec791-2c7b-4224-8ccd-e443358cd8f1")) {
						objectType = amenity.GetTypedColumnValue<string>("Value"); // Вид объекта
					}
				} 
			}
			// open tag "Ad"
			xw.WriteStartElement("Ad"); 
			// Общие елементы
			xw.WriteElementString("Id", listing.GetTypedColumnValue<Guid>("Id").ToString());
			if (listing.GetTypedColumnValue<bool>("UsrExportedOnAvito")) {
				xw.WriteElementString("DateBegin", listing.GetTypedColumnValue<DateTime>("UsrLastExportAvito").ToString("yyyy-MM-dd"));
				xw.WriteElementString("DateEnd", listing.GetTypedColumnValue<DateTime>("UsrLastExportAvito").AddDays(addDays).ToString("yyyy-MM-dd"));
			} else {
				xw.WriteElementString("DateBegin", DateTime.Today.ToString("yyyy-MM-dd"));
				xw.WriteElementString("DateEnd", DateTime.Today.AddDays(addDays).ToString("yyyy-MM-dd"));
			}
			xw.WriteElementString("AdStatus", "Free");
			// Контактная информация
			xw.WriteElementString("EMail", listing.GetTypedColumnValue<string>(ownerEmail));
			xw.WriteElementString("AllowEmail", "Да");
			xw.WriteElementString("CompanyName", "ООО 'Инвест'");
			xw.WriteElementString("ManagerName", listing.GetTypedColumnValue<string>(ownerName));
			xw.WriteElementString("ContactPhone", ownerPhone);
			//  Местоположение
			xw.WriteElementString("Region", listing.GetTypedColumnValue<string>(region));
			xw.WriteElementString("City", listing.GetTypedColumnValue<string>(city));
			if (district != "") {
				xw.WriteElementString("District", district);
			}
			xw.WriteElementString("Street", listing.GetTypedColumnValue<string>("Street") + ", д. " + listing.GetTypedColumnValue<string>("HouseNumber"));
			xw.WriteElementString("Latitude", listing.GetTypedColumnValue<string>("Latitude"));
			xw.WriteElementString("Longitude", listing.GetTypedColumnValue<string>("Longitude"));
			// Описание
			xw.WriteElementString("Description", listing.GetTypedColumnValue<string>("Description"));
			// Параметры недвижемости
			xw.WriteElementString("Category", GetPropertyTypeName(listing.GetTypedColumnValue<Guid>("PropertyTypeId")));
			xw.WriteElementString("OperationType", GetOperationTypeName(listing.GetTypedColumnValue<Guid>("ListingTypeId")));
			if (listing.GetTypedColumnValue<Guid>("PropertyTypeId") == new Guid("2B4F111F-D127-44C3-9ACC-0F902A42D2B5")) { //если коммерчиская недвижемость
				xw.WriteElementString("Title", listing.GetTypedColumnValue<string>("Name"));
			}
			xw.WriteElementString("Price", listing.GetTypedColumnValue<int>("Price").ToString());
			if (listing.GetTypedColumnValue<Guid>("PropertyTypeId") == new Guid("9433BF8A-A9E6-45F0-BA2F-4320F7BCC535")  //если квартира 
				|| listing.GetTypedColumnValue<Guid>("PropertyTypeId") == new Guid("2816C85B-B797-4724-8C23-FE1CD6579B61")) { // или комната
				
				xw.WriteElementString("Rooms", rooms);
				xw.WriteElementString("Floor", floor);
				xw.WriteElementString("HouseType", houseType);
			}
			if (listing.GetTypedColumnValue<Guid>("PropertyTypeId") != new Guid("F520E605-6C35-499D-9A03-90A2C1D7320C")) { //если не земельный участок
				xw.WriteElementString("Square", fullSquare);
			}
			if (listing.GetTypedColumnValue<Guid>("PropertyTypeId") == new Guid("BE016F8F-C67C-484C-A469-EB2BCC01F70A") //если частный дом 
				|| listing.GetTypedColumnValue<Guid>("PropertyTypeId") == new Guid("F520E605-6C35-499D-9A03-90A2C1D7320C")) { // или земельный участок
				
				xw.WriteElementString("LandArea", landArea);
				if (distanceToCity != "") {
					xw.WriteElementString("DistanceToCity", distanceToCity);
				}
			}
			if (listing.GetTypedColumnValue<Guid>("PropertyTypeId") != new Guid("9433BF8A-A9E6-45F0-BA2F-4320F7BCC535")) { //если не квартира
				xw.WriteElementString("ObjectType", objectType);
			}
			if (listing.GetTypedColumnValue<Guid>("PropertyTypeId") == new Guid("BE016F8F-C67C-484C-A469-EB2BCC01F70A") //если частный дом 
				|| listing.GetTypedColumnValue<Guid>("PropertyTypeId") == new Guid("9433BF8A-A9E6-45F0-BA2F-4320F7BCC535") // или квартира
				|| listing.GetTypedColumnValue<Guid>("PropertyTypeId") == new Guid("2816C85B-B797-4724-8C23-FE1CD6579B61")) { // или комната
				
				xw.WriteElementString("Floors", floors);
			}
			if (listing.GetTypedColumnValue<Guid>("PropertyTypeId") == new Guid("BE016F8F-C67C-484C-A469-EB2BCC01F70A")) { //если частный дом
				xw.WriteElementString("WallsType", wallsType);
			} 
			if (listing.GetTypedColumnValue<Guid>("PropertyTypeId") == new Guid("9433BF8A-A9E6-45F0-BA2F-4320F7BCC535")) { //если квартира
				if (listing.GetTypedColumnValue<Guid>("ListingTypeId") == new Guid("3D49D9DC-B41D-4483-AA22-FB7FF2B7E274")) {
					xw.WriteElementString("MarketType", "Вторичка");
				}
			}
			if (listing.GetTypedColumnValue<Guid>("PropertyTypeId") == new Guid("BDB20CBA-D534-45F4-9B5F-B1732CA671EE")) { //если гараж
				xw.WriteElementString("ObjectSubtype", objectSubtype);
				xw.WriteElementString("Secured", secured);
			} 
			if (listing.GetTypedColumnValue<Guid>("ListingTypeId") == new Guid("CB2738D4-958B-4C1C-97D1-7004730F6695")) { // если аренда
				xw.WriteElementString("LeaseType", leaseType);
				xw.WriteElementString("LeaseCommission", leaseCommission);
				xw.WriteElementString("LeaseCommissionSize", leaseCommissionSize);
				xw.WriteElementString("LeaseDeposit", leaseDeposit);
			}
			var PicturesESQ = new EntitySchemaQuery(UserConnection.EntitySchemaManager, "ListingGalleryImage");
			PicturesESQ.AddAllSchemaColumns();
			var PictureFilter = PicturesESQ.CreateFilterWithParameters(FilterComparisonType.Equal, "Listing", listing.GetTypedColumnValue<Guid>("Id"));
			PicturesESQ.Filters.Add(PictureFilter);
			var PicturesEntities = PicturesESQ.GetEntityCollection(UserConnection);
			if (PicturesEntities.Count > 0) {
				xw.WriteStartElement("Images");
				foreach (Entity listingPicture in PicturesEntities) {
					string fileName = listingPicture.GetTypedColumnValue<Guid>("Id").ToString() + listingPicture.GetTypedColumnValue<string>("Name");
					var data = listingPicture.GetColumnValue("Data") as byte[];
					using (Image image = Image.FromStream(new MemoryStream(data))) {
						zip.AddEntry(fileName, data);
					    xw.WriteStartElement("Image");
					    xw.WriteAttributeString("name", fileName);
					    xw.WriteEndElement();
					}
				}
				xw.WriteEndElement(); // close tag "Images"
			}
			xw.WriteEndElement(); // close tag "Ad"
			// update tbl.Listing 
			// date export and export done
			if (!listing.GetTypedColumnValue<bool>("UsrExportedOnAvito")) {
				var update = new Update(UserConnection, "Listing")
					.Set("UsrLastExportAvito",Column.Parameter(DateTime.Now))
					.Set("UsrExportedOnAvito",Column.Parameter(true))
					.Where("Id").IsEqual(Column.Parameter(listing.GetTypedColumnValue<Guid>("Id"))) as Update;		
				update.Execute();
			}
		}
		xw.WriteEndElement(); // close tag "Ads"
	}
	xw.WriteEndDocument();
	xw.Close();

	var stream = new MemoryStream();
	zip.Save(stream);
	byte[] archArray = stream.ToArray();

	//string emailBody = "";
	//List<string> contactsEmail = new List<string>();
	//contactsEmail.Add("roman@consimple.com");
	//string[] contactsEmailArray = contactsEmail.ToArray();
	byte[] buffer = Encoding.UTF8.GetBytes(sw.ToString().Replace("utf-16", "utf-8"));
	////////
	/*
	FtpClient ftp = new FtpClient();
	string path = "/Avito/";
	ftp.Host = "invest51-ftp.bpmonline.com";
	ftp.LoginName = "invest51-ftp.bpmonline.com|ftp-invest51";
	ftp.LoginPassword = "A3hodzIddNED1qLBYJSD";
	ftp.UseSSL = true;
	ftp.CreateFileFromContent(path, ssFTPArchiveFilename, archArray, archArray.Length);
	*/
	///////
	FtpClient ftp = new FtpClient();
	string path = "/Avito/";
	ftp.Host = "invest51-ftp.bpmonline.com";
	ftp.LoginName = "invest51-ftp.bpmonline.com|ftp-invest51";
	ftp.LoginPassword = "A3hodzIddNED1qLBYJSD";
	ftp.UseSSL = true;
	ftp.CreateFileFromContent(path, "test_" + ssFTPObjectsFilename, buffer, buffer.Length);
	ftp.CreateFileFromContent(path, "test_" + ssFTPArchiveFilename, archArray, archArray.Length);
	///////
	/*
	var smtpClient = new Terrasoft.Mail.SmtpClient(UserConnection);
	MailCredentials credentials = new MailCredentials();

	credentials.Host = (string)SysSettings.GetValue(UserConnection, "SmtpHost");
	credentials.Port = int.Parse(SysSettings.GetValue(UserConnection, "SmtpPort").ToString());
	credentials.UseSsl = (bool)SysSettings.GetValue(UserConnection, "SmtpEnableSsl");
	credentials.UserName = (string)SysSettings.GetValue(UserConnection, "SmtpUserName");
	credentials.UserPassword = (string)SysSettings.GetValue(UserConnection, "SmtpUserPassword");
	credentials.Timeout = 30000;
	if (credentials.Host != null && credentials.Port != null && credentials.UserName != null && credentials.UserPassword != null) {
		MailMessage message = smtpClient.CreateMessage(emailBody, "Автозагрузка с bpm'online на Avito.ru", contactsEmailArray, credentials.UserName,
		true, new Dictionary<Guid, Tuple<byte[], string>>(0));
		//message.Attachments.Add(archArray, ssFTPArchiveFilename, "", null, null, NewAttachmentOptions.None, MailTransferEncoding.Base64);
		message.Attachments.Add(buffer, ssFTPObjectsFilename, "", null, null, NewAttachmentOptions.None, MailTransferEncoding.Base64);
		smtpClient.SendMessage(message, credentials);
	}*/
}
return true;