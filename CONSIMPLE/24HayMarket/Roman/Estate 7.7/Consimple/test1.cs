var UserConnection = context.UserConnection;
string cityFile = @"F:\invest\city.txt";
string streetFile = @"F:\invest\street.txt";
string ownerFile = @"F:\invest\owner.txt";
string dateFile = @"F:\invest\date.txt";
int count = 0;
using (StreamReader srDate = new System.IO.StreamReader(dateFile)) {
	string currentDate;
	using (StreamReader srCity = new System.IO.StreamReader(cityFile)) {
	    string currentCity;
	    using (StreamReader srOwner = new System.IO.StreamReader(ownerFile)) {
	        string currentOwner;
	        using (StreamReader srStreet = new System.IO.StreamReader(streetFile)) {
	            string currentStreet = "";
	            string currentHouse = "";
	            string address;
	            using (System.IO.StreamWriter file = new System.IO.StreamWriter(@"E:\resultFound.txt")) {
	            	while ((address = srStreet.ReadLine()) != null) {
	            		count++;
			            currentOwner = srOwner.ReadLine();
			            currentCity = srCity.ReadLine();
			            currentDate = srDate.ReadLine();
		                if (address.Contains(',')) {
		                    string[] tmp = address.Split(',');
		                    for (int i = 0; i < tmp.Length; i++) {
		                        if (i == 0) currentStreet = tmp[i];
		                        else currentHouse = tmp[i].Trim();
		                    }
		                } else { 
		                    currentStreet = address;
		                    currentHouse = "";
		                }
		                if (currentStreet.Contains('.')) {
		                	string[] tmpStreet = currentStreet.Split('.');
		                	currentStreet = tmpStreet[1];
		                }
		                if (currentHouse != "") {
		                	//currentStreet = currentStreet.Substring(0, currentStreet.Length-1);
		                	//currentStreet = "%" + currentStreet + "%";
		                	var tmp = currentDate.Split('.');
		                    int year = Convert.ToInt32(tmp[2]);
		                    int month = Convert.ToInt32(tmp[1]);
		                    int day = Convert.ToInt32(tmp[0]);
		                    DateTime date = new DateTime(year, month, day);
							var ListingESQ = new EntitySchemaQuery(UserConnection.EntitySchemaManager, "Listing");
							ListingESQ.AddAllSchemaColumns();
							var CityFilter = ListingESQ.CreateFilterWithParameters(FilterComparisonType.Equal, "City.Name", currentCity);
							ListingESQ.Filters.Add(CityFilter);
							var OwnerFilter = ListingESQ.CreateFilterWithParameters(FilterComparisonType.Equal, "Owner.Surname", currentOwner);
							ListingESQ.Filters.Add(OwnerFilter);
							var StreetFilter = ListingESQ.CreateFilterWithParameters(FilterComparisonType.Contain, "Street", currentStreet);
							ListingESQ.Filters.Add(StreetFilter);
							var HouseFilter = ListingESQ.CreateFilterWithParameters(FilterComparisonType.Equal, "HouseNumber", currentHouse);
							ListingESQ.Filters.Add(HouseFilter);
							var listing = ListingESQ.GetEntityCollection(UserConnection);
							if (listing.Count > 0) {
								var update = new Update(UserConnection, "Listing")
									.Set("UsrExportedOnAvito",Column.Parameter(true))
									.Set("UsrLastExportAvito",Column.Parameter(date))
									.Where("Id").IsEqual(Column.Parameter(listing[0].GetTypedColumnValue<Guid>("Id"))) as Update;		
								update.Execute();
								file.WriteLine(count + " - found");
							} else {
								file.WriteLine(count + " - not found");
							}
						}
		            }
	            }
	        }
	    }
	}
}
return true;