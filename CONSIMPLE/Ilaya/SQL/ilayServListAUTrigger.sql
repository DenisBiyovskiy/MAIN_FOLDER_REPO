USE [Ilaya(7.7)]
GO
/****** Object:  Trigger [dbo].[AUTrigger]    Script Date: 12.07.2016 17:17:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Denis Biyovskit
-- Create date: 21.06.2016
-- Description:	Updating ilayServList fields: ilayPerfomStatusId, ilayVisittoDoctorId.
-- =============================================
ALTER TRIGGER [dbo].[AUTrigger] 
		   ON  [dbo].[ilayServList] 
	   AFTER UPDATE
AS 
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for trigger here
	-------------------------------------------------------------
	DECLARE @ColGuid uniqueidentifier
	DECLARE @iPerfDel bit = 0
	DECLARE @iPerfIns bit = 0
	DECLARE @performBit bit = 0
	DECLARE @performStatusId uniqueidentifier
	DECLARE @pat uniqueidentifier
	DECLARE @doc uniqueidentifier
	DECLARE @visit uniqueidentifier
	DECLARE @ilayCourseId uniqueidentifier
	DECLARE @perfStat1 uniqueidentifier = '766AFF6D-ECA4-4059-9553-A53E93F06015' --рекомендовано
	DECLARE @perfStat2 uniqueidentifier = 'D95D8D99-E240-4C02-A894-A31DBBE99A08' --узгоджено
	DECLARE @performStatus uniqueidentifier =  '2E0AFD6B-B528-482A-9F00-52CCCB14B3BA' --на виконаннi
	DECLARE @activityState uniqueidentifier = '6627B0F3-BC5F-44DD-923D-59565B8CEEAD' --йде прийом
	
	DECLARE @MyCursor CURSOR SET @MyCursor = CURSOR FAST_FORWARD
	FOR 
		SELECT Id, ilayPerform, ilayPerfomStatusId, ilayPatientId, ilayDoctorId, ilayCourseId FROM DELETED
	OPEN @MyCursor
	 FETCH NEXT FROM @MyCursor INTO @ColGuid, @iPerfDel, @performStatusId, @pat, @doc, @ilayCourseId
	 WHILE @@FETCH_STATUS = 0
		BEGIN
			SET @iPerfIns = ISNULL((
								select ilayPerform from INSERTED 
								where Id = @ColGuid AND(ilayPerfomStatusId = @perfStat1 OR ilayPerfomStatusId = @perfStat2)
							), 0)
			if(@iPerfIns != @iPerfDel AND (@iPerfIns = 1))
			BEGIN
				SET @visit = (select top 1 Id from [Ilaya(7.7)].dbo.Activity as a
								where 
								a.ilayCourseId = @ilayCourseId
								AND
								a.StatusId = @activityState
								AND
								a.StartDate between DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), DAY(GETDATE())) AND GETDATE()
								AND
								a.OwnerId = @doc
								AND
								a.ilayPatientId = @pat
							)
					update [Ilaya(7.7)].dbo.ilayServList
					SET ilayPerfomStatusId = @performStatus,
						ilayVisittoDoctorId = @visit
					where Id = @ColGuid
			END
			FETCH NEXT FROM @MyCursor INTO @ColGuid, @iPerfDel, @performStatusId, @pat, @doc, @ilayCourseId
		END
	CLOSE @MyCursor
	DEALLOCATE @MyCursor
END


