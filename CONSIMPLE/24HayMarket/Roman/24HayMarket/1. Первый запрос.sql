CREATE FUNCTION dbo.GetParentAdminUnits
(
  @ContactId UNIQUEIDENTIFIER
)
RETURNS @ResultTable TABLE(
	SysAdminUnitId UNIQUEIDENTIFIER
)
AS
BEGIN
	WITH ParentUnits (ParentId, Id)
	AS (
	SELECT ParentRoleId
			 , Id
	FROM
		dbo.SysAdminUnit sau
	WHERE
		ParentRoleId IS NOT NULL
	UNION ALL
	SELECT sau.ParentRoleId
			 , sau.Id
	FROM
		dbo.SysAdminUnit sau
		INNER JOIN
			ParentUnits pu
			ON (sau.Id = ParentId)
	)
	INSERT INTO @ResultTable
	SELECT DISTINCT ParentId
	FROM
		ParentUnits
	WHERE
		ParentUnits.Id IN (SELECT DISTINCT sau.Id
											 FROM
												 dbo.SysAdminUnit sau
												 INNER JOIN dbo.SysUserInRole suir
													 ON suir.SysRoleId = sau.Id
												 INNER JOIN dbo.SysAdminUnit sau1
													 ON sau1.Id = suir.SysUserId
													 AND sau1.ContactId = @ContactId)
	UNION
	SELECT DISTINCT sau.Id
	FROM
		dbo.SysAdminUnit sau
		INNER JOIN dbo.SysUserInRole suir
			ON suir.SysRoleId = sau.Id
		INNER JOIN dbo.SysAdminUnit sau1
			ON sau1.Id = suir.SysUserId AND sau1.ContactId = @ContactId

	INSERT INTO @ResultTable
	SELECT DISTINCT Id
	FROM
		dbo.SysAdminUnit sau
	WHERE
		sau.ContactId = @ContactId
	RETURN
END
GO