Transact-SQL samples
DELETE Join costraction

DELETE FROM [dbo].[Activity] from  [dbo].[Activity]as A inner join [dbo].[Contract] as C
  on A.ContractId = C.Id and C.PropertyId is not null
Search thrue all DB

use [Linevich (Original) (5.4)]

DECLARE @searchValue uniqueidentifier
SET @searchValue = '825bd742-07a6-454f-98eb-ba4b267c538b'

IF OBJECT_ID('tempdb..#results') IS NOT NULL DROP TABLE #results
CREATE TABLE #results (TableSchema SYSNAME, TableName SYSNAME);
DECLARE @sql NVARCHAR(MAX);
WITH cte_all_tables(SQL) AS (
    SELECT
          N' INSERT #results (TableSchema, TableName)'
        + N' SELECT ''' + t.TABLE_SCHEMA + ''', ''' + t.TABLE_NAME + N''''
        + N' FROM ' + QUOTENAME(t.TABLE_SCHEMA) + '.' +QUOTENAME(t.TABLE_NAME)
        + N' WHERE ' +
        (
                SELECT QUOTENAME(c.COLUMN_NAME) + N' = @searchValue OR '
                FROM INFORMATION_SCHEMA.Columns c
                WHERE c.TABLE_NAME = t.TABLE_NAME
                        AND c.TABLE_SCHEMA = t.TABLE_SCHEMA
                        AND c.DATA_TYPE = 'uniqueidentifier'
                FOR XML PATH('')
        ) + N'0=1'
   FROM INFORMATION_SCHEMA.Columns c
        INNER JOIN INFORMATION_SCHEMA.Tables t
        ON c.TABLE_NAME = t.TABLE_NAME
        AND t.TABLE_SCHEMA = c.TABLE_SCHEMA
        AND t.TABLE_TYPE = 'BASE TABLE'
    WHERE DATA_TYPE = 'uniqueidentifier')
SELECT @sql = (SELECT [SQL]+nchar(10) FROM cte_all_tables FOR XML PATH(''));

PRINT @SQL;
exec sp_executesql @sql, N'@searchValue uniqueidentifier', @searchValue;
SELECT * FROM #results
bpm packeges unlock

update SysPackage
set installType = '0'
where name in ('Custom', 'UserCustom', 'SupportPackage')
register detail in DB //does it realy works?

-----деталь
 insert into SysDetail (Id, CreatedOn, ModifiedOn, Caption, DetailSchemaUid, EntitySchemaUId) values (
 newid(),
 getdate(),
 getdate(),
 'Лицензии',
 '4048C2F8-72DD-4AC3-9633-2D8B8FF6FBB6', --detailschema
 '25D7C1AB-1DE0-4501-B402-02E0E5A72D6E') --entityschema
 select UId from VwSysEntitySchemaInWorkspace where Name like 'AccountLicense'   --entitySchemaUId
 select UId from VwSysSchemaInWorkspace where Name like 'AccountLicenseDetailV2'  --detailSchema


 -----карточка
 DECLARE @DetailEntityName nvarchar(max) = 'UsrCandidateCareer' --                               
 DECLARE @DetailEditPageName nvarchar(max) = 'UsrCandidateCareerPageV2' --                                               

 --                                                          SysModuleEntity
 INSERT INTO SysModuleEntity (SysEntitySchemaUId)
 VALUES ((SELECT UId FROM SysSchema WHERE Name = @DetailEntityName))

 --                                                                          SysModuleEdit
 INSERT INTO SysModuleEdit (SysModuleEntityId, CardSchemaUId)
 VALUES
 (
  (SELECT Id FROM SysModuleEntity WHERE SysEntitySchemaUId in
   (SELECT UId FROM SysSchema WHERE Name = @DetailEntityName)
  ),
  (SELECT UId FROM SysSchema WHERE Name = @DetailEditPageName)
 )
CURSOR sample

Syntax
Hide   Shrink    Copy Code
DECLARE @fName varchar(50), @lName varchar(50)
 
DECLARE cursorName CURSOR -- Declare cursor

LOCAL SCROLL STATIC
 
FOR
 
Select firstName, lastName FROM myTable
 
OPEN cursorName -- open the cursor
FETCH NEXT FROM cursorName
 
   INTO @fName, @lName
 
   PRINT @fName + ' ' + @lName -- print the name
WHILE @@FETCH_STATUS = 0
 
BEGIN
 
   FETCH NEXT FROM cursorName
 
   INTO @fName, @lName
 
   PRINT @fName + ' ' + @lName -- print the name
END
 
CLOSE cursorName -- close the cursor
DEALLOCATE cursorName -- Deallocate the cursor
Example
Hide   Copy Code
DECLARE @ColExpir datetime DECLARE @ColFallprotec datetime DECLARE @ColWorkid int--------------------------------------------------------
DECLARE @MyCursor CURSOR SET @MyCursor = CURSOR FAST_FORWARD
FOR SELECT Table_Training_Detalis.DateExpires,Table_Training_Detalis.Worker_ID
FROM   Table_Courses 
OPEN @MyCursor FETCH NEXT FROM @MyCursorINTO @ColExpir,@ColWorkid WHILE @@FETCH_STATUS = 0BEGINupdate Table_Workers set WHIMIS= @ColExpir where Worker_ID=@ColWorkid
 
FETCH NEXT FROM @MyCursor INTO @ColExpir, @ColWorkid END CLOSE @MyCursor DEALLOCATE @MyCursor


Example 2

DECLARE @ColGuid uniqueidentifier
DECLARE @NUM int
DECLARE @inputString varchar (100)
set @NUM = 1
--------------------------------------------------------
DECLARE @MyCursor CURSOR SET @MyCursor = CURSOR FAST_FORWARD
FOR
        SELECT top 10 A.Id
        FROM   [integrity(Original)(7.6)]. [dbo].[Activity] as A order by CreatedOn
OPEN @MyCursor
 FETCH NEXT FROM @MyCursor INTO @ColGuid
 WHILE @@FETCH_STATUS = 0
        BEGIN
               SET @inputString = cast( @NUM as varchar(10 ))
               SET @NUM = @NUM + 1
               update [integrity(Original)(7.6)]. [dbo].[Activity]
               set Notes = @inputString where [integrity(Original)(7.6)]. [dbo].[Activity] .Id = @ColGuid
 
               FETCH NEXT FROM @MyCursor INTO @ColGuid
        END
CLOSE @MyCursor
DEALLOCATE @MyCursor
DEALLOCATE @MyCursor
Example 3 (with temp teble samples)

DECLARE @ColGuid uniqueidentifier
DECLARE @name VARCHAR(1000) = ''
declare @ProductName table(namep varchar(1000), id uniqueidentifier, num int)
declare @id uniqueidentifier
set @name = ''
declare @count int
--------------------------------------------------------
DECLARE @MyCursor CURSOR SET @MyCursor = CURSOR FAST_FORWARD
FOR
    SELECT OP.OrderId
    FROM OrderProduct as OP where 1=1
OPEN @MyCursor
 FETCH NEXT FROM @MyCursor INTO @ColGuid
 WHILE @@FETCH_STATUS = 0
    BEGIN

        insert into @ProductName select P.Name, OrderProduct.Id, P.UsrProductNumber
        from Product as P inner join OrderProduct on P.Id = OrderProduct.ProductId
        AND OrderProduct.OrderId = @ColGuid order by P.UsrProductNumber asc

        select top 1 @id = id from @ProductName order by num asc
        set @name = (select top 1 namep from @ProductName order by num asc)

        delete @ProductName where id = @id

        while (select count(*) from @ProductName) > 0
            begin
                select top 1 @id = id from @ProductName order by num asc
                set @name = @name + ', ' + (select top 1 namep from @ProductName order by num asc)

                delete @ProductName where id = @id
            end

        update [Order]
        set [Order].UsrProductsInOrder = @name where [Order].Id = @ColGuid

        FETCH NEXT FROM @MyCursor INTO @ColGuid
    END
CLOSE @MyCursor
DEALLOCATE @MyCursor



