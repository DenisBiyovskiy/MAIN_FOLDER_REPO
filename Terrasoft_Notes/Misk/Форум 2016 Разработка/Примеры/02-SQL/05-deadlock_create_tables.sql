if (object_id('ResA') is not null)
begin
	drop table dbo.ResA
end
if (object_id('ResB') is not null)
begin
	drop table dbo.ResB
end
create table dbo.ResA (Id int)
insert into dbo.ResA(Id) values(1),(2),(4),(6),(7),(8)
create table dbo.ResB (Id int)
insert into dbo.ResB(Id) values(1),(2),(4),(6),(7),(8)
