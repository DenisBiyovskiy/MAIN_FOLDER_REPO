1/ sp_who - текущие запросы в бд

if OBJECT_ID('tempdb..#sp_who2') is not null drop table #sp_who2
CREATE TABLE #sp_who2 (SPID INT,Status VARCHAR(255), Login VARCHAR(255),HostName VARCHAR(255),BlkBy VARCHAR(255),DBName VARCHAR(255), 
Command VARCHAR(255),CPUTime INT, DiskIO INT,LastBatch VARCHAR(255), ProgramName VARCHAR(255),SPID2 INT, REQUESTID INT) 

INSERT INTO #sp_who2 EXEC sp_who2

select P.spid as [SPID] ,case
 when P.last_batch = '1900-01-01 00:00:00.000' then ''
 else right(convert(varchar, dateadd(second, datediff(second, P.last_batch, getdate()), '1900-01-01'), 121), 12)
 end as [Duration]
, P.program_name as [Program]
, P.status as [Status]
, P.hostname as [Hostname]
, P.open_tran as [TransOpen]
, #sp_who2.DBName as [DBName]
, P.cmd as [Command]
, st.text as [Request]
from #sp_who2
inner join master.dbo.sysprocesses P on #sp_who2.SPID = P.spid
CROSS APPLY sys.dm_exec_sql_text(p.sql_handle) AS st
where P.spid > 50
and P.status not in ('background', 'sleeping')
and P.cmd not in ('AWAITING COMMAND'
 ,'MIRROR HANDLER'
 ,'LAZY WRITER'
 ,'CHECKPOINT SLEEP'
 ,'RA MANAGER')
order by [Duration] desc

--------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------

2/ Поиск по GUID
use [db_name]

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

set offline, set online
USE master
GO
ALTER DATABASE [DemoMarketing(7.7)]
SET OFFLINE WITH ROLLBACK IMMEDIATE
GO

USE master
GO
ALTER DATABASE [DemoMarketing(7.7)]
SET ONLINE
GO


Продажи - действия - запустить корпоративные продажи






