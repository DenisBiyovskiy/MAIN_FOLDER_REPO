
insert into [Ilaya(7.7)].dbo.QualifyStatus (Id, Name, [Description], StageNumber)
values ('2F82E402-1DBA-48A0-B4CB-FBE828A1C554', 'Призначення візиту', 'Лід пацієнта', 2)
insert into [Ilaya(7.7)].dbo.QualifyStatus (Id, Name, [Description], StageNumber)
values ('48088D99-9AF1-4122-BDDE-4218CA1D7B60', 'Новий', 'Лід пацієнта', 1)
insert into [Ilaya(7.7)].dbo.QualifyStatus (Id, Name, [Description], StageNumber)
values ('D024F2A3-C95E-442A-A00B-12FFE8436347', 'Візит призначено', 'Лід пацієнта',  3)


update [Ilaya(7.7)].dbo.QualifyStatus set [Description] = 'Загальна' where Id = '128C3718-771A-4D1E-9035-6FA135CA5F70'
update [Ilaya(7.7)].dbo.QualifyStatus set [Description] = 'Лід партнера В2В' where Id = 'D790A45D-03FF-4DDB-9DEA-8087722C582C'
update [Ilaya(7.7)].dbo.QualifyStatus set [Description] = 'Лід партнера В2В' where Id = '7A90900B-53B5-4598-92B3-0AEE90626C56'
update [Ilaya(7.7)].dbo.QualifyStatus set [Description] = 'Лід партнера В2В' where Id = 'CEB70B3C-985F-4867-AE7C-88F9DD710688'
update [Ilaya(7.7)].dbo.QualifyStatus set [Description] = 'Загальна' where Id = '51ADC3EC-3503-4B10-A00B-8BE3B0E11F08'
update [Ilaya(7.7)].dbo.QualifyStatus set [Description] = 'Лід партнера В2В' where Id = '0A0808C5-5415-41F0-BEA3-118CC3089959'
update [Ilaya(7.7)].dbo.QualifyStatus set [Description] = 'Лід партнера В2В' where Id = '14CFC644-E3ED-497E-8279-ED4319BB8093'



	insert into SysDetail (Id, CreatedOn, ModifiedOn, Caption, DetailSchemaUid, EntitySchemaUId) values (
	(select top 1 UId from VwSysSchemaInWorkspace where Name like 'ilayServListInLeadDetail'),
	getdate(),
	getdate(),
	'Сервіси пацієнтів в ліді',
	(select top 1 UId from VwSysSchemaInWorkspace where Name like 'ilayServListInLeadDetail'), --detailschema
	(select top 1 UId from VwSysEntitySchemaInWorkspace where Name like 'ilayServList') --entityschema	
	)

update [Ilaya(7.7)].dbo.LeadType set [Description] = 'Использовать для создания лида пациента. Только по этой потребности будет работать процесс управления лидами пациентов' where Id = 'E12C4C83-97D3-42C7-B785-17B14179E879'

insert into [Ilaya(7.7)].dbo.LeadType (Id, Name ) values ('4190E153-62B2-4694-9AA7-C509673DD866', 'Потребность в партнерстве')
	
	
	
	--trigger1
	
	USE [Ilaya(7.7)]
GO

/****** Object:  Trigger [dbo].[AISetCardNumberTrigger]    Script Date: 18.07.2016 16:33:52 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================

CREATE TRIGGER [dbo].[AISetCardNumberTrigger]  
   ON  [dbo].[Contact] 
   AFTER INSERT
AS 
BEGIN
	-- SET NOCOUNT ON added to prevent extra result SETs FROM
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for trigger here
	DECLARE @Id uniqueidentIFier
	Declare @TypeId uniqueidentIFier
	DECLARE @TypePatient uniqueidentIFier = 'E16C5781-245B-43EA-B429-9F554EE392EC' -- тип контакта - пациент
	declare @CardNumber int
	declare @CurrentYear int = YEAR(GETDATE())


	DECLARE @MyCursor CURSOR SET @MyCursor = CURSOR FAST_FORWARD
	FOR 
		SELECT Id, TypeId FROM INSERTED
	OPEN @MyCursor
	 FETCH NEXT FROM @MyCursor INTO @id, @TypeId
	 WHILE @@FETCH_STATUS = 0
		BEGIN
			IF(@TypeId = @TypePatient)
			BEGIN
				IF ((SELECT COUNT(c.ilayCardNumber) FROM Contact AS c WHERE c.TypeId = @TypePatient) = 0)
				BEGIN
					--2016000001
					SET @CardNumber = CAST(@CurrentYear AS int) * 1000000 + 1
				END 
				ELSE BEGIN
					SET @CardNumber =  CAST((SELECT top 1 c.ilayCardNumber FROM Contact AS c WHERE c.TypeId = @TypePatient ORDER BY c.ilayCardNumber DESC)AS int) 
					IF (@CardNumber > @CurrentYear * 1000000) BEGIN
						SET @CardNumber = @CardNumber + 1
					END
					ELSE BEGIN
						SET @CardNumber = @CurrentYear * 1000000 + 1
					END
				END
				--print CAST(@CardNumber AS varchar)
				UPDATE Contact SET ilayCardNumber = @CardNumber WHERE Id = @Id
			END
			FETCH NEXT FROM @MyCursor INTO @id, @TypeId
		END
	CLOSE @MyCursor
	DEALLOCATE @MyCursor
END

GO



	
	--trigger2
	
	
	USE [Ilaya(7.7)]
GO

/****** Object:  Trigger [dbo].[AIUTrigger]    Script Date: 18.07.2016 16:34:21 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE TRIGGER [dbo].[AIUTrigger]  
   ON  [dbo].[Contact] 
   AFTER INSERT, UPDATE
AS 
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for trigger here
	DECLARE @Id uniqueidentIFier
	DECLARE @BirthDate date 
	DECLARE @Today date = getDate()
	DECLARE @Age int
	DECLARE @min date = '01-01-0001'

	DECLARE @MyCursor CURSOR SET @MyCursor = CURSOR FAST_FORWARD
	FOR 
		SELECT Id, BirthDate FROM INSERTED
	OPEN @MyCursor
	 FETCH NEXT FROM @MyCursor INTO @id, @BirthDate
	 WHILE @@FETCH_STATUS = 0
		BEGIN
			IF ((@BirthDate IS NOT NULL) AND (@BirthDate <> @min))
				BEGIN
					SET @age = datediff(year, @birthdate, @today)
					UPDATE Contact SET ilayAge = @Age WHERE Id = @Id
				END


			FETCH NEXT FROM @MyCursor INTO @id, @BirthDate
		END
	CLOSE @MyCursor
	DEALLOCATE @MyCursor









END

GO


