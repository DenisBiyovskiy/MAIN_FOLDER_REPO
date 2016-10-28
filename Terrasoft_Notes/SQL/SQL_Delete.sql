declare @ColumnName nvarchar(250)
declare @TableName nvarchar(250)
declare @TempSQL nvarchar(4000)
declare @ContactID nvarchar(250)
declare @ContactName nvarchar(4000)
declare @ParentTableName nvarchar(4000)
--declare @Number int
SET @ContactName = 'Supervisor' --здесь вводится имя записи которую нужно оставить
SET @ParentTableName = 'Contact' -- таблица которую чистим
--SET @Number = 0

declare test cursor LOCAL FORWARD_ONLY STATIC FOR
	SELECT ID FROM /*@ParentTableName*/[Contact]/*@ParentTableName*/  WHERE [Name] != @ContactName
open test
fetch next FROM test INTO @ContactID
while @@fetch_Status = 0
	begin
		declare test2 cursor LOCAL FORWARD_ONLY STATIC FOR
			SELECT DISTINCT
			CONSTRAINT_COLUMN_USAGE.COLUMN_NAME AS COLUMN_NAME, 
			CONSTRAINT_COLUMN_USAGE.TABLE_NAME AS TABLE_NAME
			FROM
			((INFORMATION_SCHEMA.CONSTRAINT_COLUMN_USAGE AS CONSTRAINT_COLUMN_USAGE 
			INNER JOIN INFORMATION_SCHEMA.TABLE_CONSTRAINTS AS TABLE_CONSTRAINTS
			ON CONSTRAINT_COLUMN_USAGE.CONSTRAINT_NAME = TABLE_CONSTRAINTS.CONSTRAINT_NAME)
			INNER JOIN INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS AS REFERENTIAL_CONSTRAINTS
			ON CONSTRAINT_COLUMN_USAGE.CONSTRAINT_NAME = REFERENTIAL_CONSTRAINTS.CONSTRAINT_NAME)
			INNER JOIN INFORMATION_SCHEMA.TABLE_CONSTRAINTS AS PARENT_TABLES
			ON REFERENTIAL_CONSTRAINTS.UNIQUE_CONSTRAINT_NAME = PARENT_TABLES.CONSTRAINT_NAME
			WHERE TABLE_CONSTRAINTS.CONSTRAINT_TYPE = 'FOREIGN KEY'
			AND 
			PARENT_TABLES.TABLE_NAME = @ParentTableName
		open test2 
		fetch next FROM test2 INTO @ColumnName, @TableName
		while @@fetch_Status = 0
			begin
				SET @TempSQL = 'UPDATE [' + @TableName + '] SET [' + @ColumnName + '] = null' + ' WHERE ['+ @ColumnName + '] = ''{' + @ContactID + '}''' 
				--для отладки (без удаления) - строка ниже:
				--print @TempSQL
				--для удаления раскомментировать эту строку:
				exec sp_executesql @TempSQL
				fetch next FROM test2 INTO @ColumnName, @TableName
			end
		close test2
		deallocate test2
		-- удаление самого контакта
		--для отладки:
		--SELECT * FROM Contact WHERE [ID] = @ContactID
		--для удаления
		delete from /*@ParentTableName*/[Contact]/*@ParentTableName*/ where [ID] = @ContactID
		--SET @Number = @Number + 1
		--print 'Row Number = ' + CAST( @Number as varchar(20) )
		fetch next FROM test INTO @ContactID
	end
close test
deallocate test