-------------------------------------------------------------
------register section for print forms----------------------- 
-------------------------------------------------------------
USE [ilaya_ws_1]
GO

INSERT INTO [dbo].[SysModule]
           ([Id]
           ,[CreatedOn]
           ,[CreatedById]
           ,[ModifiedOn]
           ,[ModifiedById]
           ,[Caption]
           ,[SysModuleEntityId]
           ,[FolderModeId]
           ,[GlobalSearchAvailable]
           ,[HasAnalytics]
           ,[HasActions]
           ,[HasRecent]
           ,[Code]
           ,[ProcessListeners]
           ,[SysPageSchemaUId]
           ,[ModuleHeader]
           ,[CardSchemaUId]
           ,[SectionModuleSchemaUId]
           ,[SectionSchemaUId]
           ,[CardModuleUId]
           ,[TypeColumnValue]
           ,[Image32Id]
           ,[LogoId])
     VALUES
           ('7528D009-5648-4696-B049-CFD1594E8192'
           ,getdate()
           ,'410006E1-CA4E-4502-A9EC-E54D922D2C00'
           ,getdate()
           ,'410006E1-CA4E-4502-A9EC-E54D922D2C00'
           ,'Печатные формы документов'
           ,'0819A960-CEEF-4E30-B3A9-413B30A9F2A1'
           ,'B659D704-3955-E011-981F-00155D043204'
           ,1
           ,1
           ,1
           ,0
           ,'ilayDocReports'
           ,0
           ,null
           ,'Список: Печатные формы документов'
           ,'DD0AB408-E9FE-41CD-B311-B757E15BD989'
           ,'DF58589E-26A6-44D1-B8D4-EDF1734D02B4'
           ,'4EEB5A9B-7162-489E-A36C-ED1E2F8AD863'
           ,'4E1670DC-10DB-4217-929A-669F906E5D75'
           ,null
           ,null
           ,null)
GO

-------------------------------------------------------------

USE [ilaya_ws_1]
GO

INSERT INTO [dbo].[SysModuleEntity]
           ([Id]
           ,[CreatedOn]
           ,[CreatedById]
           ,[ModifiedOn]
           ,[ModifiedById]
           ,[TypeColumnUId]
           ,[ProcessListeners]
           ,[SysEntitySchemaUId])
     VALUES
           ('0819A960-CEEF-4E30-B3A9-413B30A9F2A1'
           ,getdate()
           ,'410006E1-CA4E-4502-A9EC-E54D922D2C00'
           ,getdate()
           ,'410006E1-CA4E-4502-A9EC-E54D922D2C00'
           ,NULL
           ,0
           ,'B0348013-9182-45B8-BD3D-60C6A8A1A44E')
GO

USE [ilaya_ws_1]
GO

-------------------------------------------------------------

INSERT INTO [dbo].[SysModuleInSysModuleFolder]
           ([Id]
           ,[CreatedOn]
           ,[CreatedById]
           ,[ModifiedOn]
           ,[ModifiedById]
           ,[SysModuleId]
           ,[SysModuleFolderId]
           ,[Position]
           ,[SubSysModuleFolderId]
           ,[ProcessListeners])
     VALUES
           ('EB4507A9-E621-49A2-95BC-58EDAC7A756B'
           ,getdate()
           ,'410006E1-CA4E-4502-A9EC-E54D922D2C00'
           ,getdate()
           ,'410006E1-CA4E-4502-A9EC-E54D922D2C00'
           ,'7528D009-5648-4696-B049-CFD1594E8192'
           ,'F330F0C2-3EE4-4A73-9AC9-8439543CA19B'
           ,20
           ,null
           ,0)
GO


--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------register page-------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

USE [ilaya_ws_1]
GO

INSERT INTO [dbo].[SysModuleEdit]
           ([Id]
           ,[CreatedOn]
           ,[CreatedById]
           ,[ModifiedOn]
           ,[ModifiedById]
           ,[SysModuleEntityId]
           ,[TypeColumnValue]
           ,[UseModuleDetails]
           ,[Position]
           ,[ProcessListeners]
           ,[SysPageSchemaUId]
           ,[CardSchemaUId]
           ,[ActionKindName]
           ,[PageCaption]
           ,[MiniPageSchemaUId])
     VALUES
           ('44928F63-2D2B-4E50-95F0-01CC0F8CEDDA'
           ,getdate()
           ,'410006E1-CA4E-4502-A9EC-E54D922D2C00'
           ,getdate()
           ,'410006E1-CA4E-4502-A9EC-E54D922D2C00'
           ,'0819A960-CEEF-4E30-B3A9-413B30A9F2A1'
           ,null
           ,1
           ,0
           ,0
           ,null
           ,'DD0AB408-E9FE-41CD-B311-B757E15BD989'
           ,'ilayDocReportsPage'
           ,'Печатные формы документов'
           ,null)
GO