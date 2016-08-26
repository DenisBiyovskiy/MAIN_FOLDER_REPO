string[] stringSeparators = new string[] {";"};
string[] splitResult;
string resultString = ""; 
splitResult = StringOfContactGuids.Split(stringSeparators, StringSplitOptions.None);
if(splitResult[0] != ""){
	CurrentContactId = new Guid(splitResult[0]);
}
else
{
	CurrentContactId = Guid.Empty;
}
for(var i = 1; i < splitResult.Length; i++){
	resultString = resultString + splitResult[i] + ";";
}

if(resultString.Length > 0){
	StringOfContactGuids = resultString.Substring(0, resultString.Length - 1);
}
else
{
	StringOfContactGuids = "";
}
return true;