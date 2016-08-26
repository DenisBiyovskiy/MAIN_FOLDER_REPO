if (object_id('tsp_RebuildOrReindex') is not null)
begin
	drop procedure [dbo].[tsp_RebuildOrReindex]
end
go
create procedure [dbo].[tsp_RebuildOrReindex]
as
begin
	DECLARE @IsDetailedScan BIT
	SELECT @IsDetailedScan = 1

	DECLARE @SQL NVARCHAR(MAX)
	SELECT @SQL = (
		SELECT '
		ALTER INDEX [' + i.name + N'] ON [' + SCHEMA_NAME(o.[schema_id]) + '].[' + o.name + '] ' +
			CASE WHEN s.avg_fragmentation_in_percent > 30
				THEN 'REBUILD WITH (SORT_IN_TEMPDB = ON'
					-- Enterprise, Developer
					+ CASE WHEN SERVERPROPERTY('EditionID') IN (1804890536, -2117995310)
							THEN ', ONLINE = ON'
							ELSE ''
					  END + ')'
				ELSE 'REORGANIZE'
			END + ';
		'
		FROM (
			SELECT 
				  s.[object_id]
				, s.index_id
				, avg_fragmentation_in_percent = MAX(s.avg_fragmentation_in_percent)
			FROM sys.dm_db_index_physical_stats(DB_ID(), NULL, NULL, NULL, 
									CASE WHEN @IsDetailedScan = 1 
										THEN 'DETAILED'
										ELSE 'LIMITED'
									END) s
			WHERE s.page_count > 128 -- > 1 MB
				AND s.index_id > 0 -- <> HEAP
				AND s.avg_fragmentation_in_percent > 5
			GROUP BY s.[object_id], s.index_id
		) s
		JOIN sys.indexes i WITH(NOLOCK) ON s.[object_id] = i.[object_id] AND s.index_id = i.index_id
		JOIN sys.objects o WITH(NOLOCK) ON o.[object_id] = s.[object_id]
		FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)')
		OPTION (OPTIMIZE FOR (@IsDetailedScan = 1))

	PRINT @SQL
	EXEC sys.sp_executesql @SQL
end
	