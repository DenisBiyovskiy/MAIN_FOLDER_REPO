dbcc freeproccache 
set statistics time on
set statistics io on  

declare @SqlText nvarchar(max)
declare @MinAmount decimal(15, 2) = 10000

--НЕ правильный пример
set @SqlText = 'select sum(b.Amount), a.Id
from Account a
inner join Opportunity b on a.Id = b.AccountId
group by a.Id
having sum(b.Amount) > ' + cast(@MinAmount as nvarchar(max))

exec (@SqlText)

--Правильный пример
set @SqlText = 'select sum(b.Amount), a.Id
from Account a
inner join Opportunity b on a.Id = b.AccountId
group by a.Id
having sum(b.Amount) > @P1' 

exec sp_executesql @SqlText, N'@P1 decimal(15, 2)', @P1 = @MinAmount