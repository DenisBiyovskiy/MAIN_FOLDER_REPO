DECLARE @dbid INT
 
SELECT @dbid = DB_ID(DB_NAME())
 
SELECT 
  [object_name] = OBJECT_NAME(i.object_id),
  [index_name] = i.name,
  [index_id] = i.index_id
FROM 
  sys.indexes i 
  JOIN sys.objects o ON i.object_id = o.object_id
WHERE 
  OBJECTPROPERTY(o.object_id,'IsUserTable') = 1 AND i.index_id NOT IN (
    SELECT 
      s.index_id
    FROM 
      sys.dm_db_index_usage_stats s
    WHERE 
      s.object_id = i.object_id AND s.index_id = i.index_id AND s.database_id = @dbid
  ) 
ORDER BY 
  [object_name], [index_name], [index_id]