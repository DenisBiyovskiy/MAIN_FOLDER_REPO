var UserConnection = context.UserConnection;
Dictionary<int, string> week = new Dictionary<int,string>();
week.Add(1, "ilayMonday");
week.Add(2, "ilayTuesday");
week.Add(3, "ilayWednesday");
week.Add(4, "ilayThursday");
week.Add(5, "ilayFriday");
week.Add(6, "ilaySaturday");

string[] guids = Get<string>("cabinetsID").Split(new Char [] {','});

foreach (string currentID in guids) {
	var ilayWorkWeeksESQ = new EntitySchemaQuery(UserConnection.EntitySchemaManager, "ilayWorkWeeks");
	ilayWorkWeeksESQ.AddAllSchemaColumns();
	var ilayCabinetForDoctorFilter = ilayWorkWeeksESQ.CreateFilterWithParameters(FilterComparisonType.Equal, "ilayCabinetForDoctor", currentID);
	ilayWorkWeeksESQ.Filters.Add(ilayCabinetForDoctorFilter);
	var ilayXCabinetName = ilayWorkWeeksESQ.AddColumn("ilayCabinetForDoctor.ilayXCabinet.ilayName").Name;
	var ilayDoctorName = ilayWorkWeeksESQ.AddColumn("ilayCabinetForDoctor.ilayDoctor.Name").Name;
	var ilayXCabinetId = ilayWorkWeeksESQ.AddColumn("ilayCabinetForDoctor.ilayXCabinet.Id").Name;
	var ilayDoctorId = ilayWorkWeeksESQ.AddColumn("ilayCabinetForDoctor.ilayDoctor.Id").Name;
	ilayWorkWeeksESQ.AddColumn("ilayWeekNumber").OrderByAsc();
	var ilayWorkWeeksEnteties = ilayWorkWeeksESQ.GetEntityCollection(UserConnection);
	if (ilayWorkWeeksEnteties.Count > 0) {
		string activityTitle = ilayWorkWeeksEnteties[0].GetTypedColumnValue<string>(ilayXCabinetName) + ": " + ilayWorkWeeksEnteties[0].GetTypedColumnValue<string>(ilayDoctorName);
		var activityDate = DateTime.Now;
		activityDate = activityDate.AddMonths(1);
		var daysInMonth = DateTime.DaysInMonth(activityDate.Year, activityDate.Month);
		activityDate = activityDate.AddDays( - (activityDate.Day - 1));
		if (activityDate.DayOfWeek == DayOfWeek.Sunday) {
			activityDate = activityDate.AddDays(1);
		}
		int i = 0;
		switch (ilayWorkWeeksEnteties.Count) {
			case 1:
				foreach (Entity ilayWorkWeek in ilayWorkWeeksEnteties) {
					switch (activityDate.DayOfWeek) {
						case DayOfWeek.Monday:
							i = 1;
							break;
						case DayOfWeek.Tuesday:
							i = 2;
							break;
						case DayOfWeek.Wednesday:
							i = 3;
							break;
						case DayOfWeek.Thursday:
							i = 4;
							break;
						case DayOfWeek.Friday:
							i = 5;
							break;
						case DayOfWeek.Saturday:
							i = 6;
							break;
					}
					for (int j = activityDate.Day; j <= daysInMonth; j++) {
						if (i % 7 == 0) {
							activityDate = activityDate.AddDays(1);
							i = 1;
							continue;
						}
						var hoursStart = ilayWorkWeek.GetTypedColumnValue<DateTime>(week[i] + "From") != DateTime.MinValue ? ilayWorkWeek.GetTypedColumnValue<DateTime>(week[i] + "From").ToUniversalTime().Hour : 25;
						var hoursEnd = ilayWorkWeek.GetTypedColumnValue<DateTime>(week[i] + "To") != DateTime.MinValue ? ilayWorkWeek.GetTypedColumnValue<DateTime>(week[i] + "To").ToUniversalTime().Hour : 25;
						if (hoursStart < 25 && hoursEnd < 25) {
							var minutesStart = ilayWorkWeek.GetTypedColumnValue<DateTime>(week[i] + "From").Minute;
							var minutesEnd = ilayWorkWeek.GetTypedColumnValue<DateTime>(week[i] + "To").Minute;
							var activityDateStart = new DateTime(activityDate.Year, activityDate.Month, activityDate.Day, hoursStart, minutesStart, 0);
							var activityDateDue = new DateTime(activityDate.Year, activityDate.Month, activityDate.Day, hoursEnd, minutesEnd, 0);
							var owner = ilayWorkWeek.GetTypedColumnValue<Guid>(ilayDoctorId);
							var cabinet = ilayWorkWeek.GetTypedColumnValue<Guid>(ilayXCabinetId);
							var workWeek = ilayWorkWeek.GetTypedColumnValue<Guid>("Id");
							CreateActivity(activityTitle, activityDateStart, activityDateDue, owner, cabinet, workWeek, UserConnection);
						}
						activityDate = activityDate.AddDays(1);
						i++;
					} 
				}
				break;
			case 2:
				var lastWeekStartDay = SetLastWeekDate(activityDate, daysInMonth);
				var thirdWeek = lastWeekStartDay - 14;
				switch (activityDate.DayOfWeek) {
					case DayOfWeek.Monday:
						i = 1;
						break;
					case DayOfWeek.Tuesday:
						i = 2;
						break;
					case DayOfWeek.Wednesday:
						i = 3;
						break;
					case DayOfWeek.Thursday:
						i = 4;
						break;
					case DayOfWeek.Friday:
						i = 5;
						break;
					case DayOfWeek.Saturday:
						i = 6;
						break;
				}
				bool isLastWeek = true;
				bool isThirdWeek = true;
				int countWeeks = 0;
				foreach (Entity ilayWorkWeek in ilayWorkWeeksEnteties) {
					i = (i == 7) ? 1 : i;
					if (isLastWeek) {
						int day = 1;
						var activityDateLastWeek = activityDate.AddDays(lastWeekStartDay - activityDate.Day);
						while (lastWeekStartDay <= daysInMonth) {
							if (activityDateLastWeek.DayOfWeek == DayOfWeek.Sunday) {
								break;
							}
							var hoursStart = ilayWorkWeek.GetTypedColumnValue<DateTime>(week[day] + "From") != DateTime.MinValue ? ilayWorkWeek.GetTypedColumnValue<DateTime>(week[day] + "From").ToUniversalTime().Hour : 25;
							var hoursEnd = ilayWorkWeek.GetTypedColumnValue<DateTime>(week[day] + "To") != DateTime.MinValue ? ilayWorkWeek.GetTypedColumnValue<DateTime>(week[day] + "To").ToUniversalTime().Hour : 25;
							if (hoursStart < 25 && hoursEnd < 25) {
								var minutesStart = ilayWorkWeek.GetTypedColumnValue<DateTime>(week[day] + "From").Minute;
								var minutesEnd = ilayWorkWeek.GetTypedColumnValue<DateTime>(week[day] + "To").Minute;
								var activityDateStart = new DateTime(activityDateLastWeek.Year, activityDateLastWeek.Month, activityDateLastWeek.Day, hoursStart, minutesStart, 0);
								var activityDateDue = new DateTime(activityDateLastWeek.Year, activityDateLastWeek.Month, activityDateLastWeek.Day, hoursEnd, minutesEnd, 0);
								var owner = ilayWorkWeek.GetTypedColumnValue<Guid>(ilayDoctorId);
								var cabinet = ilayWorkWeek.GetTypedColumnValue<Guid>(ilayXCabinetId);
								var workWeek = ilayWorkWeek.GetTypedColumnValue<Guid>("Id");
								CreateActivity(activityTitle, activityDateStart, activityDateDue, owner, cabinet, workWeek, UserConnection);
							}
							day++;
							activityDateLastWeek = activityDateLastWeek.AddDays(1);
							lastWeekStartDay++;
						}
						countWeeks++;
						isLastWeek = false;
					} 
					if (isThirdWeek) {
						int day = 1;
						var activityDateThirdWeek = activityDate.AddDays(thirdWeek - activityDate.Day);
						var thirdWeekEnd = thirdWeek + 7;
						while (thirdWeek <= thirdWeekEnd) {
							if (activityDateThirdWeek.DayOfWeek == DayOfWeek.Sunday) {
								break;
							}
							var hoursStart = ilayWorkWeek.GetTypedColumnValue<DateTime>(week[day] + "From") != DateTime.MinValue ? ilayWorkWeek.GetTypedColumnValue<DateTime>(week[day] + "From").ToUniversalTime().Hour : 25;
							var hoursEnd = ilayWorkWeek.GetTypedColumnValue<DateTime>(week[day] + "To") != DateTime.MinValue ? ilayWorkWeek.GetTypedColumnValue<DateTime>(week[day] + "To").ToUniversalTime().Hour : 25;
							if (hoursStart < 25 && hoursEnd < 25) {
								var minutesStart = ilayWorkWeek.GetTypedColumnValue<DateTime>(week[day] + "From").Minute;
								var minutesEnd = ilayWorkWeek.GetTypedColumnValue<DateTime>(week[day] + "To").Minute;
								var activityDateStart = new DateTime(activityDateThirdWeek.Year, activityDateThirdWeek.Month, activityDateThirdWeek.Day, hoursStart, minutesStart, 0);
								var activityDateDue = new DateTime(activityDateThirdWeek.Year, activityDateThirdWeek.Month, activityDateThirdWeek.Day, hoursEnd, minutesEnd, 0);
								var owner = ilayWorkWeek.GetTypedColumnValue<Guid>(ilayDoctorId);
								var cabinet = ilayWorkWeek.GetTypedColumnValue<Guid>(ilayXCabinetId);
								var workWeek = ilayWorkWeek.GetTypedColumnValue<Guid>("Id");
								CreateActivity(activityTitle, activityDateStart, activityDateDue, owner, cabinet, workWeek, UserConnection);
							}
							day++;
							activityDateThirdWeek = activityDateThirdWeek.AddDays(1);
							thirdWeek++;
						}
						countWeeks++;
						isThirdWeek = false;
					}
					for (int j = i; j < 7; j++) {
						var hoursStart = ilayWorkWeek.GetTypedColumnValue<DateTime>(week[i] + "From") != DateTime.MinValue ? ilayWorkWeek.GetTypedColumnValue<DateTime>(week[i] + "From").ToUniversalTime().Hour : 25;
						var hoursEnd = ilayWorkWeek.GetTypedColumnValue<DateTime>(week[i] + "To") != DateTime.MinValue ? ilayWorkWeek.GetTypedColumnValue<DateTime>(week[i] + "To").ToUniversalTime().Hour : 25;
						if (hoursStart < 25 && hoursEnd < 25) {
							var minutesStart = ilayWorkWeek.GetTypedColumnValue<DateTime>(week[i] + "From").Minute;
							var minutesEnd = ilayWorkWeek.GetTypedColumnValue<DateTime>(week[i] + "To").Minute;
							var activityDateStart = new DateTime(activityDate.Year, activityDate.Month, activityDate.Day, hoursStart, minutesStart, 0);
							var activityDateDue = new DateTime(activityDate.Year, activityDate.Month, activityDate.Day, hoursEnd, minutesEnd, 0);
							var owner = ilayWorkWeek.GetTypedColumnValue<Guid>(ilayDoctorId);
							var cabinet = ilayWorkWeek.GetTypedColumnValue<Guid>(ilayXCabinetId);
							var workWeek = ilayWorkWeek.GetTypedColumnValue<Guid>("Id");
							CreateActivity(activityTitle, activityDateStart, activityDateDue, owner, cabinet, workWeek, UserConnection);
							if (ilayWorkWeek.GetTypedColumnValue<int>("ilayWeekNumber") == 2) {
								activityDateStart = new DateTime(activityDate.Year, activityDate.Month, activityDate.AddDays(14).Day, hoursStart, minutesStart, 0);
								activityDateDue = new DateTime(activityDate.Year, activityDate.Month, activityDate.AddDays(14).Day, hoursEnd, minutesEnd, 0);
								CreateActivity(activityTitle, activityDateStart, activityDateDue, owner, cabinet, workWeek, UserConnection);
							}
						}
						activityDate = activityDate.AddDays(1);
						i++;

					}
					countWeeks++;
					activityDate = activityDate.AddDays(1);
				}

				break;
			case 4:
				lastWeekStartDay = SetLastWeekDate(activityDate, daysInMonth);
				switch (activityDate.DayOfWeek) {
					case DayOfWeek.Monday:
						i = 1;
						break;
					case DayOfWeek.Tuesday:
						i = 2;
						break;
					case DayOfWeek.Wednesday:
						i = 3;
						break;
					case DayOfWeek.Thursday:
						i = 4;
						break;
					case DayOfWeek.Friday:
						i = 5;
						break;
					case DayOfWeek.Saturday:
						i = 6;
						break;
				}
				var isFirstWeek = true;
				foreach (Entity ilayWorkWeek in ilayWorkWeeksEnteties) {
					i = (i == 7) ? 1 : i;
					if (isFirstWeek) {
						int day = 1;
						var activityDateFirstWeek = activityDate.AddDays(lastWeekStartDay - activityDate.Day);
						while (lastWeekStartDay <= daysInMonth) {
							if (activityDateFirstWeek.DayOfWeek == DayOfWeek.Sunday) {
								break;
							}
							var hoursStart = ilayWorkWeek.GetTypedColumnValue<DateTime>(week[day] + "From") != DateTime.MinValue ? ilayWorkWeek.GetTypedColumnValue<DateTime>(week[day] + "From").ToUniversalTime().Hour : 25;
							var hoursEnd = ilayWorkWeek.GetTypedColumnValue<DateTime>(week[day] + "To") != DateTime.MinValue ? ilayWorkWeek.GetTypedColumnValue<DateTime>(week[day] + "To").ToUniversalTime().Hour : 25;
							if (hoursStart < 25 && hoursEnd < 25) {
								var minutesStart = ilayWorkWeek.GetTypedColumnValue<DateTime>(week[day] + "From").Minute;
								var minutesEnd = ilayWorkWeek.GetTypedColumnValue<DateTime>(week[day] + "To").Minute;
								var activityDateStart = new DateTime(activityDateFirstWeek.Year, activityDateFirstWeek.Month, activityDateFirstWeek.Day, hoursStart, minutesStart, 0);
								var activityDateDue = new DateTime(activityDateFirstWeek.Year, activityDateFirstWeek.Month, activityDateFirstWeek.Day, hoursEnd, minutesEnd, 0);
								var owner = ilayWorkWeek.GetTypedColumnValue<Guid>(ilayDoctorId);
								var cabinet = ilayWorkWeek.GetTypedColumnValue<Guid>(ilayXCabinetId);
								var workWeek = ilayWorkWeek.GetTypedColumnValue<Guid>("Id");
								CreateActivity(activityTitle, activityDateStart, activityDateDue, owner, cabinet, workWeek, UserConnection);
							}
							day++;
							activityDateFirstWeek = activityDateFirstWeek.AddDays(1);
							lastWeekStartDay++;
						}
						isFirstWeek = false;
					}
					for (int j = i; j < 7; j++) {
						var hoursStart = ilayWorkWeek.GetTypedColumnValue<DateTime>(week[i] + "From") != DateTime.MinValue ? ilayWorkWeek.GetTypedColumnValue<DateTime>(week[i] + "From").ToUniversalTime().Hour : 25;
						var hoursEnd = ilayWorkWeek.GetTypedColumnValue<DateTime>(week[i] + "To") != DateTime.MinValue ? ilayWorkWeek.GetTypedColumnValue<DateTime>(week[i] + "To").ToUniversalTime().Hour : 25;
						if (hoursStart < 25 && hoursEnd < 25) {
							var minutesStart = ilayWorkWeek.GetTypedColumnValue<DateTime>(week[i] + "From").Minute;
							var minutesEnd = ilayWorkWeek.GetTypedColumnValue<DateTime>(week[i] + "To").Minute;
							var activityDateStart = new DateTime(activityDate.Year, activityDate.Month, activityDate.Day, hoursStart, minutesStart, 0);
							var activityDateDue = new DateTime(activityDate.Year, activityDate.Month, activityDate.Day, hoursEnd, minutesEnd, 0);
							var owner = ilayWorkWeek.GetTypedColumnValue<Guid>(ilayDoctorId);
							var cabinet = ilayWorkWeek.GetTypedColumnValue<Guid>(ilayXCabinetId);
							var workWeek = ilayWorkWeek.GetTypedColumnValue<Guid>("Id");
							CreateActivity(activityTitle, activityDateStart, activityDateDue, owner, cabinet, workWeek, UserConnection);
						}
						activityDate = activityDate.AddDays(1);
						i++;
					}
					activityDate = activityDate.AddDays(1);
				}
				break;
			default: break;
		}
	}
}
return true;