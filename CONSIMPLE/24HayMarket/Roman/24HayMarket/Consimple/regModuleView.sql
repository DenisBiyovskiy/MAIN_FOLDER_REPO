DECLARE @SysEntitySchemaUId NVARCHAR(255);
DECLARE @SysModuleEntityId NVARCHAR(255);
DECLARE @SectionModuleSchemaUId NVARCHAR(255);
DECLARE @SysModuleId NVARCHAR(255);
DECLARE @SectionSchemaUId NVARCHAR(255);
DECLARE @CardSchemaUId NVARCHAR(255);
DECLARE @SysCultureId nvarchar(255) = 'A5420246-0A8E-E111-84A3-00155D054C03'

SET @SectionModuleSchemaUId = (SELECT TOP 1 Uid FROM SysSchema WHERE Name = 'SectionModuleV2');
SET @SysEntitySchemaUId = (SELECT TOP 1 UId FROM SysSchema WHERE Name = 'UsrPortfolio');
SET @CardSchemaUId = (SELECT TOP 1 UId FROM SysSchema WHERE Name = 'UsrPortfolioPageV2');
SET @SectionSchemaUId = (SELECT TOP 1 UId FROM SysSchema WHERE Name = 'UsrPortfolioSectionV2');

INSERT INTO SysModuleEntity (SysEntitySchemaUId) VALUES (@SysEntitySchemaUId);

SET @SysModuleEntityId = (SELECT TOP 1 Id FROM SysModuleEntity WHERE SysEntitySchemaUId = @SysEntitySchemaUId);

INSERT INTO SysModule (Caption, SysModuleEntityId, FolderModeId, GlobalSearchAvailable, HasAnalytics, HasActions, HasRecent, Code, ModuleHeader, SectionModuleSchemaUId, CardSchemaUId, SectionSchemaUId) 
VALUES ('Portfolio', @SysModuleEntityId, 'B659D704-3955-E011-981F-00155D043204', 1, 1, 1, 0, 'UsrPortfolio', 'List of portfolios', @SectionModuleSchemaUId, @CardSchemaUId, @SectionSchemaUId);

SET @SysModuleId = (SELECT TOP 1 Id FROM SysModule WHERE SysModuleEntityId = @SysModuleEntityId);

INSERT INTO SysModuleLcz (RecordId, ColumnUId, SysCultureId, Value)
VALUES (@SysModuleId, '3DA3C3B2-02FB-4CCA-80C3-7946D4E8F565', @SysCultureId, 'Portfolio');

INSERT INTO SysModuleLcz (RecordId, ColumnUId, SysCultureId, Value)
VALUES (@SysModuleId, '7B904E78-84BF-408C-A7A1-1287E66837D3', @SysCultureId, 'List of portfolios');

-- Регистрация страницы

INSERT INTO SysModuleEdit (SysModuleEntityId, UseModuleDetails, CardSchemaUId, ActionKindCaption)
VALUES (@SysModuleEntityId, 1, @CardSchemaUId, 'New portfolio');

DECLARE @SysModuleEditId NVARCHAR(255);
SET @SysModuleEditId = (SELECT TOP 1 Id FROM SysModuleEdit WHERE SysModuleEntityId = @SysModuleEntityId);

INSERT INTO SysModuleEditLcz (RecordId, ColumnUId, SysCultureId, Value)
VALUES (@SysModuleEditId, 'A19BF4BF-E22B-49B5-B6E0-918FF6290020', @SysCultureId, 'Portfolio');

INSERT INTO SysModuleEditLcz (RecordId, ColumnUId, SysCultureId, Value)
VALUES (@SysModuleEditId, 'A19BF4BF-E22B-49B5-B6E0-918FF6290020', @SysCultureId, 'Portfolio');