--select *, (select top 1 Name from SysSchema where Uid = ec.SysEntitySchemaUId) from EntityConnection ec order by ModifiedOn desc

--insert into EntityConnection (SysEntitySchemaUid, ColumnUid) values ('04B3259D-B790-4661-B05E-0967EB867EE9', '938140f1-db42-466e-804c-0ec09c2ea040')

--update SysModuleEdit set ActionKindCaption = 'Клієнт', PageCaption = 'Клієнт' where Id = 'F89C5913-42BB-4070-A49F-AE4E828B19D3'
--update SysModuleEdit set ActionKindCaption = 'Партнер', PageCaption = 'Партнер' where Id = '8B23A12E-769C-424B-84CA-4C73B004B569'
--update SysModuleEditLcz set Value = 'Клієнт' where Value = 'B2C'
--update SysModuleEditLcz set Value = 'Партнер' where Value = 'B2B'
