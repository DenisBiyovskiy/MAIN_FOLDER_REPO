--Выборка для получения информации по фрагментации индексов
select 
	t.name as 'TableName',
	i.avg_fragmentation_in_percent as 'FragmentationPercent',
	ind.name as 'IndexName'
FROM sys.dm_db_index_physical_stats (DB_ID(), NULL, NULL, NULL, 'DETAILED') i
left join sys.tables  t on (t.object_id = i.object_id)
left join sys.indexes  ind on (ind.object_id = i.object_id and ind.index_id = i.index_id)
WHERE i.avg_fragmentation_in_percent > 0
and i.index_id > 0
and i.page_count > 128 -- > 1 MB
order by i.avg_fragmentation_in_percent desc
