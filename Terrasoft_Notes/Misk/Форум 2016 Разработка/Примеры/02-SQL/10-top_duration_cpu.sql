--top 100 длительных запросов 
SELECT top 100 
creation_time,
	last_execution_time,
	execution_count,
	total_worker_time/1000 as CPU,
	convert(money, (total_worker_time))/(execution_count*1000)as [AvgCPUTime],
	qs.total_elapsed_time/1000 as TotalDuration,
	convert(money, (qs.total_elapsed_time))/(execution_count*1000)as [AvgDur],
	total_logical_reads as [Reads],
	total_logical_writes as [Writes],
	total_logical_reads+total_logical_writes as [AggIO],
	convert(money, (total_logical_reads+total_logical_writes)/(execution_count + 0.0))as [AvgIO],
	case 
		when sql_handle IS NULL then ' '
		else(substring(st.text,(qs.statement_start_offset+2)/2,(
			case
				when qs.statement_end_offset =-1 then len(convert(nvarchar(MAX),st.text))*2      
				else qs.statement_end_offset    
			end - qs.statement_start_offset)/2  ))
	end as query_text,
ISNULL(st.dbid,CONVERT(SMALLINT,att.value)) AS my_dbid, 
db_name(ISNULL(st.dbid,CONVERT(SMALLINT,att.value)))
FROM sys.dm_exec_query_stats AS qs 
CROSS APPLY sys.dm_exec_sql_text(sql_handle) AS st 
CROSS APPLY sys.dm_exec_plan_attributes(qs.plan_handle) att
where total_logical_reads > 0
and att.attribute= 'dbid'
and total_logical_reads > 0
order by AvgDur desc

--top 100 ресурсоемких запросов (CPU) 
SELECT TOP 100 total_worker_time/execution_count as AVGCPU, ST.[text], QP.query_plan
   FROM sys.dm_exec_query_stats QS
   CROSS APPLY sys.dm_exec_sql_text(QS.[sql_handle]) ST
   CROSS APPLY sys.dm_exec_query_plan(QS.plan_handle) QP
ORDER BY AVGCPU DESC
