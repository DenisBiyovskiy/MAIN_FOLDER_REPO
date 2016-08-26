DECLARE @SysEntitySchemaUId NVARCHAR(255);
DECLARE @SysModuleEntityId NVARCHAR(255);
DECLARE @SectionModuleSchemaUId NVARCHAR(255);

DECLARE @SysModuleId NVARCHAR(255);

SET @SectionModuleSchemaUId = (SELECT TOP 1 Uid FROM SysSchema WHERE Name = 'ForecastsModule');
SET @SysEntitySchemaUId = (SELECT TOP 1 UId FROM SysSchema WHERE Name = 'UsrForecast');

INSERT INTO SysModuleEntity (SysEntitySchemaUId) VALUES (@SysEntitySchemaUId);

SET @SysModuleEntityId = (SELECT TOP 1 Id FROM SysModuleEntity WHERE SysEntitySchemaUId = @SysEntitySchemaUId);

INSERT INTO SysModule (Caption, SysModuleEntityId, FolderModeId, GlobalSearchAvailable, HasAnalytics, HasActions, HasRecent, Code, ModuleHeader, SectionModuleSchemaUId) 
VALUES ('Планирование', @SysModuleEntityId, 'B659D704-3955-E011-981F-00155D043204', 1, 1, 1, 0, 'UsrForecast', 'Планирование', @SectionModuleSchemaUId);

SET @SysModuleId = (SELECT TOP 1 Id FROM SysModule WHERE SysModuleEntityId = @SysModuleEntityId);

INSERT INTO SysModuleLcz (RecordId, ColumnUId, SysCultureId, Value)
VALUES (@SysModuleId, '3DA3C3B2-02FB-4CCA-80C3-7946D4E8F565', '1A778E3F-0A8E-E111-84A3-00155D054C03', 'Планирование');

INSERT INTO SysModuleLcz (RecordId, ColumnUId, SysCultureId, Value)
VALUES (@SysModuleId, '7B904E78-84BF-408C-A7A1-1287E66837D3', '1A778E3F-0A8E-E111-84A3-00155D054C03', 'Планирование');

-- Регистрация страницы

INSERT INTO SysModuleEdit (SysModuleEntityId, UseModuleDetails, CardSchemaUId)
VALUES (@SysModuleEntityId, 1, (SELECT TOP 1 Uid FROM SysSchema WHERE Name = 'ForecastPage'));

DECLARE @SysModuleEditId NVARCHAR(255);
SET @SysModuleEditId = (SELECT TOP 1 Id FROM SysModuleEdit WHERE SysModuleEntityId = @SysModuleEntityId);

INSERT INTO SysModuleEditLcz (RecordId, ColumnUId, SysCultureId, Value)
VALUES (@SysModuleEditId, 'A19BF4BF-E22B-49B5-B6E0-918FF6290020', '1A778E3F-0A8E-E111-84A3-00155D054C03', 'Планирование');

INSERT INTO SysModuleEditLcz (RecordId, ColumnUId, SysCultureId, Value)
VALUES (@SysModuleEditId, 'A19BF4BF-E22B-49B5-B6E0-918FF6290020', '1A778E3F-0A8E-E111-84A3-00155D054C03', 'Планирование');