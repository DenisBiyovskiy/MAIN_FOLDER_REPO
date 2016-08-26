dbcc freeproccache 
set statistics time on
set statistics io on  

select OwnerId, Name
from Account 
order by OwnerId, Name

/*
CREATE NONCLUSTERED INDEX [IX_Account_OwnerId_Name] ON [dbo].[Account]
(
	[OwnerId] ASC,
	[Name] ASC
)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
*/