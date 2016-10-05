USE [Ilaya(7.7)]
GO

/****** Object:  Trigger [dbo].[AIInIlayProductsInPackage]    Script Date: 04.10.2016 17:45:06 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		Biyovskiy Denis | Consimple
-- Create date: 03.10.16
-- Description:	After insert adds a records to ilayPriceForService
-- =============================================
ALTER TRIGGER [dbo].[AIInIlayProductsInPackage]
   ON  [Ilaya(7.7)].[dbo].[ilayProductsInPackage]
   AFTER INSERT
AS 
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	IF (select count(Id) from INSERTED) = 1
		BEGIN
			
			DECLARE
			@authorId uniqueidentifier,
			@ilayServiceId uniqueidentifier,
			@ilayPriceStatusId uniqueidentifier,
			@ilayPackageId uniqueidentifier

			CREATE TABLE #ilayPricePlanTemp (ilayPricePlanId uniqueidentifier, ilayPriceStatusId uniqueidentifier)		

			SET @authorId = (select top 1 CreatedById from inserted as i)
			SET	@ilayServiceId = (select top 1 ilayProductId from inserted as i)
			SET @ilayPackageId = (select top 1 ilayPackageId from inserted as i)
			insert into #ilayPricePlanTemp select Id, ilayPriceStatusId  from ilayPricePlan

			INSERT INTO [dbo].[ilayPriceForService]
				   ([Id]
				   ,[CreatedById]
				   ,[ModifiedById]
				   ,[ilayServiceId]
				   ,[ilayPriceId]
				   ,[ilayPriceStatusId]
				   ,[ilayPackageId])
			 SELECT
				   newId()
				   ,@authorId
				   ,@authorId
				   ,@ilayServiceId
				   ,ilayPricePlanId
				   ,ilayPriceStatusId
				   ,@ilayPackageId
			FROM #ilayPricePlanTemp

			DROP TABLE #ilayPricePlanTemp
		END
    -- Insert statements for trigger here

END

GO


