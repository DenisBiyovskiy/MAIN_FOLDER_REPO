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