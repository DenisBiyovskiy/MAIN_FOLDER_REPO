--Step 1
begin tran 
update ResA
set Id = 10
where Id = 1

return
--Step 3
update ResB
set Id = 10
where Id = 1

