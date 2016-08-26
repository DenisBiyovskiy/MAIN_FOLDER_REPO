--Step 2
begin tran
update ResB
set Id = 10
where Id = 1

update ResA
set Id = 10
where Id = 1