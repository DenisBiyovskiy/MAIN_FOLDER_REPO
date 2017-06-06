declare @key1 varchar(100) = 'BC294BF8-3EAE-4ADD-BB60-1E576B87A360'
declare @key2 varchar(100) = '565C3873-4B6A-4477-A328-E74D2665F6CD'
declare @EnCultureId uniqueidentifier = 'A5420246-0A8E-E111-84A3-00155D054C03';
if exists (select * from SysModuleLcz  where RecordId = @key1)
	begin 
		update SysModuleLcz set Caption = 'Facebook pages' where RecordId = @key1
	end
else
	begin 
		insert into SysModuleLcz (RecordId, Caption, SysCultureId) values (@key1, 'Facebook pages', @EnCultureId)
	end

if exists (select * from SysModuleEditLcz  where RecordId = @key2)
	begin 
		update SysModuleEditLcz set ActionKindCaption = 'New' where RecordId = @key2
	end
else
	begin 
		insert into SysModuleEditLcz (RecordId, ActionKindCaption, SysCultureId) values (@key2, 'New', @EnCultureId)
	end
