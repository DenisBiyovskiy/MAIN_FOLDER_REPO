insert into SysModuleEntity (SysEntitySchemaUId) values ('25d7c1ab-1de0-4501-b402-02e0e5a72d6e')

insert into SysModuleEdit(
[SysModuleEntityId]
,[TypeColumnValue]
,[UseModuleDetails]
,[Position]
,[HelpContextId]
,[ProcessListeners]
,[SysPageSchemaUId]
,[CardSchemaUId]
,[ActionKindCaption]
,[ActionKindName]
,[PageCaption]) values
('0E97CCDF-03AE-443C-9B8D-0949F63A9C47', null, 1, 0, 1001, 0, null, 'F5EDC79D-8D39-4E51-A255-57CCF3F1349E', 'New portfolio', 'Portfolio', 'Portfolio')

insert into SysModule (
[Caption]
,[SysModuleEntityId]
,[Image16]
,[Image20]
,[FolderModeId]
,[GlobalSearchAvailable]
,[HasAnalytics]
,[HasActions]
,[HasRecent]
,[Code]
,[HelpContextId]
,[ProcessListeners]
,[SysPageSchemaUId]
,[ModuleHeader]
,[Attribute]
,[CardSchemaUId]
,[SectionModuleSchemaUId]
,[SectionSchemaUId]
,[CardModuleUId]
,[TypeColumnValue]
,[Image32Id]
,[LogoId]) 
values
('Portfolio', 
	'0E97CCDF-03AE-443C-9B8D-0949F63A9C47', 
	null, 
	null, 
	'B659D704-3955-E011-981F-00155D043204', 
	1, 
	1, 
	1, 
	0, 
	'Portfolio', 
	1001, 
	0, 
	null, 
	'List of portfolios',
	'',
	'e145fa7c-b64c-411f-8f17-e9f77db5c69c',
	'DF58589E-26A6-44D1-B8D4-EDF1734D02B4',
	'66bbaa2a-5463-4a9e-9a4f-64fb5409ecb9',
	'4E1670DC-10DB-4217-929A-669F906E5D75',
	null,
	'7A37BC33-F078-4A6D-ADEC-529BADE46802',
	'21399637-E87F-406C-A73B-74FAF2FD1BA2')

insert into SysModuleLcz(RecordId,ColumnUId,SysCultureId,Value) 
	values ('6F36BC59-34C9-42B9-820F-A4EDBC13B864', '3DA3C3B2-02FB-4CCA-80C3-7946D4E8F565', 'A5420246-0A8E-E111-84A3-00155D054C03', 'Portfolios')


insert into SysModuleEditLcz (RecordId,ColumnUId,SysCultureId,Value) 
	values ('58DE4BDC-62AE-41C4-AD70-801C1CA881E8', '55132174-2B96-4E0A-830C-B8E952B12C45', 'A5420246-0A8E-E111-84A3-00155D054C03', 'New portfolio')

insert into SysModuleEntityInPortal (SysPortalId, SysModuleEntityId) 
	values ('C8565240-1DA3-4A68-BD4E-280F17B0D32E', 'D3FF4C7A-F8A4-4097-9310-CB4AE2181E84')
