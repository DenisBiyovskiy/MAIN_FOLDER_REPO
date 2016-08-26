dbcc freeproccache 
set statistics time on
set statistics io on  

select Name
from Account 
order by Name asc

/*
CREATE NONCLUSTERED INDEX [IX_Account_Name] ON [dbo].[Account]
(
	[Name] ASC
)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
*/
