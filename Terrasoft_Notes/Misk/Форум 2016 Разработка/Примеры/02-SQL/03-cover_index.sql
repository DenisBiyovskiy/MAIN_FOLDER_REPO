dbcc freeproccache 
set statistics time on
set statistics io on  

select sum(b.Amount), a.Id
from Account a
inner join Opportunity b on a.Id = b.AccountId
group by a.Id

/*
CREATE NONCLUSTERED INDEX [IX_Opportunity_AccountId_Include_Amount] ON [dbo].[Opportunity]
(
	[AccountId] ASC
)
INCLUDE ([Amount]) 
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
*/