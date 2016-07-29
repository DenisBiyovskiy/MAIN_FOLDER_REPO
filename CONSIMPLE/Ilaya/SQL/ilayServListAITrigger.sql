USE [Ilaya(7.7)]
GO
/****** Object:  Trigger [dbo].[AITrigger]    Script Date: 12.07.2016 17:16:46 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Denis Biyovskiy
-- Create date: 23.06.16
-- Description:	Updating ilayServList fields: ilayPerfomStatusId, ilayVisittoDoctorId.
-- =============================================
ALTER TRIGGER [dbo].[AITrigger] 
   ON  [dbo].[ilayServList] 
   AFTER INSERT
AS 
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for trigger here
	DECLARE @id uniqueidentifier
	DECLARE @ilayServiceId uniqueidentifier
	DECLARE @medDocType uniqueidentifier = '2F3F339E-7A37-4772-8C87-C4DFF260B341' --Медичний документ
	DECLARE @BDocType uniqueidentifier = '6CA82292-133E-4788-9E65-55A3C2C1E7BA' --Бухгалтерський документ
	DECLARE @BDocCategory1 uniqueidentifier = 'BF89C7D7-7EB6-4F11-ABBD-6C79AE07AC03' --Додаткова угода
	DECLARE @BDocCategory2 uniqueidentifier = '98CAF920-2321-48DF-BB9C-BFA8F385D571' --Інформаційна згода
	DECLARE @notAssigned uniqueidentifier = '4B6B7735-46E4-4AC1-9FBD-2CAE77392C6E' --Не підписано
	DECLARE @noNeed uniqueidentifier = '77300FF4-1776-4B30-846F-C529D9DF5B13' --Не потребує


	DECLARE @MyCursor CURSOR SET @MyCursor = CURSOR LOCAL FAST_FORWARD
	FOR 
		SELECT Id, ilayServiceId FROM INSERTED
	OPEN @MyCursor
	 FETCH NEXT FROM @MyCursor INTO @id, @ilayServiceId
	 WHILE @@FETCH_STATUS = 0
		BEGIN
			if(exists(select top 1 isl.id from dbo.ilayDocOrderInServ as isl
					  where isl.ilayServiceId = @ilayServiceId 
						AND isl.ilayDocTypeId = @medDocType))
				BEGIN
					UPDATE dbo.ilayServList
					SET ilayMedDocSignId = @notAssigned
					where id = @id
				END
			ELSE
				BEGIN
					UPDATE dbo.ilayServList
					SET ilayMedDocSignId = @noNeed
					where id = @id
				END
			
			if(exists(select top 1 isl.id from dbo.ilayDocOrderInServ as isl
					  where isl.ilayServiceId = @ilayServiceId 
						AND isl.ilayDocTypeId = @BDocType
						AND (isl.ilayDocCategoryId = @BDocCategory1
							OR
							 isl.ilayDocCategoryId = @BDocCategory2)
						AND isl.ilayAtEndOfVisit = 0))
				BEGIN
					UPDATE dbo.ilayServList
					SET ilayInfoAgreeSignId = '3E592295-5F99-45B5-BDE2-9D8C5614BA0F' --Не підписано
					where id = @id
				END
			ELSE
				BEGIN
					UPDATE dbo.ilayServList
					SET ilayInfoAgreeSignId = '5013B42F-19D2-4E7B-A59D-D6D2DD80742B' --Не потребує
					where id = @id
				END

			UPDATE dbo.ilayServList
			SET ilayAddAgreeActSignId = '74811F5C-C100-4C77-948B-4864A19FD869' --Не підписано
			where id = @id

			FETCH NEXT FROM @MyCursor INTO @id, @ilayServiceId
		END
	CLOSE @MyCursor
	DEALLOCATE @MyCursor
END
