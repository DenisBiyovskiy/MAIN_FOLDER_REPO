DECLARE @SysEntitySchemaUId NVARCHAR(255) = '25D7C1AB-1DE0-4501-B402-02E0E5A72D6E'
DECLARE @SysModuleEntityId NVARCHAR(255) = '9BE7BF65-7380-E011-AFBC-00155D04320C' 
DECLARE @SectionModuleSchemaUId NVARCHAR(255) = 'DF58589E-26A6-44D1-B8D4-EDF1734D02B4'
DECLARE @SysModuleId NVARCHAR(255)
declare @CardSchemaUId nvarchar(255) = 'aaf70254-b1f7-4e52-a968-4a854cd34d48'
declare @SectionSchemaUId nvarchar(255) = '3683b70b-b873-4867-833d-bf1a0bbca456'
DECLARE @SysModuleEditId NVARCHAR(255)
declare @SysCultureId nvarchar(255) = 'A5420246-0A8E-E111-84A3-00155D054C03'

INSERT INTO SysModule (Caption, SysModuleEntityId, FolderModeId, GlobalSearchAvailable, HasAnalytics, HasActions, HasRecent, Code, ModuleHeader, SectionModuleSchemaUId, CardSchemaUId, SectionSchemaUId) 
VALUES ('Invest Opportunity test', @SysModuleEntityId, 'B659D704-3955-E011-981F-00155D043204', 1, 1, 1, 0, 'Account', 'Investment Opportunity test', @SectionModuleSchemaUId, @CardSchemaUId, @SectionSchemaUId);

SET @SysModuleId = (SELECT TOP 1 Id FROM SysModule WHERE Caption = 'Invest Opportunity test');

INSERT INTO SysModuleLcz (RecordId, ColumnUId, SysCultureId, Value)
VALUES (@SysModuleId, '3DA3C3B2-02FB-4CCA-80C3-7946D4E8F565', @SysCultureId, 'Investment Opportunity test');

INSERT INTO SysModuleLcz (RecordId, ColumnUId, SysCultureId, Value)
VALUES (@SysModuleId, '7B904E78-84BF-408C-A7A1-1287E66837D3', @SysCultureId, 'Investment Opportunity test');

-- Регистрация страницы

INSERT INTO SysModuleEdit (SysModuleEntityId, UseModuleDetails, CardSchemaUId)
VALUES (@SysModuleEntityId, 1, @CardSchemaUId);

SET @SysModuleEditId = (SELECT TOP 1 Id FROM SysModuleEdit WHERE CardSchemaUId = @CardSchemaUId);

INSERT INTO SysModuleEditLcz (RecordId, ColumnUId, SysCultureId, Value)
VALUES (@SysModuleEditId, 'A19BF4BF-E22B-49B5-B6E0-918FF6290020', @SysCultureId, 'Investment Opportunity test');

INSERT INTO SysModuleEditLcz (RecordId, ColumnUId, SysCultureId, Value)
VALUES (@SysModuleEditId, 'A19BF4BF-E22B-49B5-B6E0-918FF6290020', @SysCultureId, 'Investment Opportunity test');

insert into SysModuleEntityInPortal (SysPortalId, SysModuleEntityId) 
values ('C8565240-1DA3-4A68-BD4E-280F17B0D32E', '9BE7BF65-7380-E011-AFBC-00155D04320C')