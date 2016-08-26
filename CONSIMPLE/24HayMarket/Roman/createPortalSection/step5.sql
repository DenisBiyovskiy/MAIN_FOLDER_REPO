IF NOT EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'tsp_GenerateSequenseNumber')
EXEC('CREATE PROCEDURE [dbo].[tsp_GenerateSequenseNumber] AS BEGIN SET NOCOUNT ON; END')
GO
ALTER PROCEDURE [dbo].[tsp_GenerateSequenseNumber] 
@entitySchemaName NVARCHAR(255),
@returnValue NVARCHAR(255) Out
AS
DECLARE @CodeMaskSettingName NVARCHAR (255)
DECLARE @LastNumberSettingName NVARCHAR (255)
DECLARE @SysSettingsId NVARCHAR (255)
DECLARE @IntegerValue NVARCHAR (255)
DECLARE @MaskValue NVARCHAR (255)
DECLARE @UpdateResult table(IntegerValue int)
SET @CodeMaskSettingName = @entitySchemaName + 'CodeMask'
SET @LastNumberSettingName = @entitySchemaName + 'LastNumber'
SELECT @MaskValue = TextValue
FROM SysSettingsValue 
where SysSettingsId in ( SELECT Id 
FROM SysSettings 
WHERE Code = @CodeMaskSettingName)
and SysAdminUnitId = 'A29A3BA5-4B0D-DE11-9A51-005056C00008'

SELECT @SysSettingsId = Id FROM SysSettings
WHERE Code = @LastNumberSettingName
UPDATE SysSettingsValue SET IntegerValue = IntegerValue + 1
OUTPUT inserted.IntegerValue into @UpdateResult
WHERE SysSettingsId = @SysSettingsId
and SysAdminUnitId = 'A29A3BA5-4B0D-DE11-9A51-005056C00008'
SELECT @IntegerValue = IntegerValue 
FROM @UpdateResult
Set @returnValue = REPLACE(@MaskValue, '{0}', @IntegerValue)
