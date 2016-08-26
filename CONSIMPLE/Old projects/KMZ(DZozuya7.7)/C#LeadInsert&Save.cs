if(Entity.GetTypedColumnValue<Guid>("OwnerId")!=Guid.Empty){
	Entity.SetColumnValue("QualifyStatusId", new Guid("CEB70B3C-985F-4867-AE7C-88F9DD710688"));
}
else{
	Entity.SetColumnValue("QualifyStatusId", new Guid("14CFC644-E3ED-497E-8279-ED4319BB8093"));
}

return true;


if((Entity.GetTypedColumnValue<Guid>("OwnerId")!=Guid.Empty) && (Entity.GetTypedColumnValue<Guid>("QualifyStatusId") == new Guid("14CFC644-E3ED-497E-8279-ED4319BB8093"))){
	Entity.SetColumnValue("QualifyStatusId", new Guid("CEB70B3C-985F-4867-AE7C-88F9DD710688"));
}
return true;