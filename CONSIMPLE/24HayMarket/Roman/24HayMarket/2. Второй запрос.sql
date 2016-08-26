insert into SysUserInRole (SysUserId, SysRoleId) 
select SAU.Id, SAUR.Id 
from SysAdminUnit SAU, SysAdminUnit SAUR
where SAU.SysAdminUnitTypeValue = 4 and SAUR.Name = 'Все сотрудники компании'
and SAU.Id not in (select SysUserId from SysUserInRole where SysRoleId = (select Id from SysAdminUnit where Name = 'Все сотрудники компании'))

DECLARE @Entity VARCHAR(MAX) = 'Contact';
DECLARE @RightSchemaName nvarchar(max) = 'Sys' + @Entity + 'Right';
DECLARE @SQl nvarchar(MAX) = 
'DECLARE @Now DATETIME = getutcdate()
	DECLARE @SchemaUId UNIQUEIDENTIFIER = (SELECT DISTINCT UId FROM dbo.SysSchema ssis WHERE Name = ''' + @Entity + ''' and [ExtendParent] = ''0'');
DELETE ' + @RightSchemaName + ';
  Update ' +@Entity+'
  SET CreatedById = (SELECT id FROM Contact c WHERE c.Name = ''Supervisor'')
  where CreatedById not in (select Id from Contact);
WITH Rights
AS (SELECT DISTINCT
			c.Id RecordId
		, sesrdr.GranteeSysAdminUnitId SysAdminUnitId
		, sesrdr.Position + 1 position
		,' + '''f41e0268-e324-4228-9e9e-5cb7cc906398''' +
' AS source --по умолчанию 
		, sesrdr.Operation Operation
		, sesrdr.RightLevel RightLevel
		FROM
			dbo.' + @Entity +
' c
			CROSS APPLY GetParentAdminUnits(c.CreatedById) psau
			INNER JOIN dbo.SysEntitySchemaRecordDefRight sesrdr
				ON sesrdr.AuthorSysAdminUnitId = psau.SysAdminUnitId
				AND sesrdr.SubjectSchemaUId = @SchemaUId)
INSERT INTO dbo.' + @RightSchemaName +'
	(
	Id
, RecordId
, SysAdminUnitId
, Position
, SourceId
, CreatedOn
, CreatedById
, ModifiedOn
, ModifiedById
, Operation
, RightLevel
	)
SELECT newid()
		 , c.Id
		 , r.SysAdminUnitId
		 , r.position
		 , r.source
		 , @Now
		 , c.CreatedById
		 , @Now
		 , c.ModifiedById
		 , r.Operation
		 , r.RightLevel
FROM
	Rights r
	INNER JOIN dbo.' + @Entity +
' c
		ON c.Id = r.RecordId
--права создателя
INSERT INTO dbo.' + @RightSchemaName +'
		(
		Id
	, RecordId
	, SysAdminUnitId
	, Position
	, SourceId
	, CreatedOn
	, CreatedById
	, ModifiedOn
	, ModifiedById
	, Operation
	, RightLevel
		)
	SELECT newid() AS Id
			 , c.Id RecordId
			 , sau.Id
			 , 0
			 ,' + '''66ea17f7-df1d-4058-91ca-09a2057deae8''' + ' --владелец
			 , @Now
			 , c.CreatedById
			 , @Now
			 , c.ModifiedById
			 , operation.num
			 , 2
	FROM
		dbo.' + @Entity + ' c CROSS JOIN (SELECT 0 num UNION ALL SELECT 1 UNION ALL SELECT 2 ) AS operation
		INNER JOIN dbo.SysAdminUnit sau
			ON sau.ContactId = c.CreatedById;
'
  --PRINT @SQl
  EXEC (@SQl);
