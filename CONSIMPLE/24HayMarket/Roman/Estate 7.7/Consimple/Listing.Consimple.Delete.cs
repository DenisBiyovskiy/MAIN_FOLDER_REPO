if (Entity.GetTypedColumnValue<bool>("UsrExportedOnAvito")) {
	var UserConnection = context.UserConnection;
	var manager = UserConnection.ProcessSchemaManager;
	var selectedId = Entity.GetTypedColumnValue<Guid>("Id");
	var processSchema = manager.GetInstanceByName("UsrProcessStopAtAvito");
	var process = processSchema.CreateProcess(UserConnection);
	if (processSchema.Parameters.ExistsByName("SelectedListings")) {
		process.SetPropertyValue("SelectedListings", quarterId);
	}
	process.Execute(UserConnection);
}
return true;