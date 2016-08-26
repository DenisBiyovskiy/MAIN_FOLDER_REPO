IF OBJECT_ID('tempdb..#TableList') IS NOT NULL
BEGIN
    DROP TABLE [#TableList]
END
CREATE TABLE [#TableList] ([Name] nvarchar(255) NOT NULL);

IF OBJECT_ID('tempdb..#SchemaDataList') IS NOT NULL
BEGIN
    DROP TABLE [#SchemaDataList]
END
CREATE TABLE [#SchemaDataList] ([Id] UNIQUEIDENTIFIER, [UId] UNIQUEIDENTIFIER);

IF OBJECT_ID('tempdb..#SchemaDataListForRecords') IS NOT NULL
BEGIN
    DROP TABLE [#SchemaDataListForRecords]
END
CREATE TABLE [#SchemaDataListForRecords] ([Id] UNIQUEIDENTIFIER, [UId] UNIQUEIDENTIFIER);

IF OBJECT_ID('tempdb..#SchemaUIdForRecordDefRightList') IS NOT NULL
BEGIN
    DROP TABLE [#SchemaUIdForRecordDefRightList]
END
CREATE TABLE [#SchemaUIdForRecordDefRightList] ([UId] UNIQUEIDENTIFIER, [Name] NVARCHAR(500), [ExtendParent] BIT);

INSERT INTO [#TableList] ([Name]) VALUES 
('FolderType'),
('SysEmpty'),
('FolderFavorite'),
('ESNNotification'),
('ESNNotificationType'),
('Case'),
('CaseFile'),
('CaseTag'),
('CaseInTag'),
('Contact'),
('Account'),
('CaseStatus'),
('CasePriority'),
('CaseOrigin'),
('SysAdminUnit'),
('ClosureCode'),
('SatisfactionLevel'),
('CaseCategory'),
('ServiceItem'),
('RoleInServiceTeam'),
('RunButtonProcessList'),
('SocialChannel'),
('SocialMessage'),
('SocialMessageEntity'),
('SysModule'),
('SysModuleFolder'),
('SysModuleFolderLcz'),
('SysModuleInSysModuleFolder'),
('SysModuleLcz'),
('VwCommandAction'),
('VwSysProcess'),
('SocialSubscription'),
('SocialUnsubscription'),
('KnowledgeBase'),
('KnowledgeBaseFile'),
('KnowledgeBaseTag'),
('KnowledgeBaseTagDecoupling'),
('KnowledgeBaseTagV2'),
('KnowledgeBaseInTagV2'),
('KnowledgeBaseType'),
('Department'),
('ServiceStatus'),
('Calendar'),
('DayInCalendar'),
('DayOfWeek'),
('DayType'),
('TimeUnit'),
('WorkingTimeInterval'),
('TimeZone'),
('SocialLike'),
('Like'),
('SysImage'),
('SysDashboard'),
('FileType'),
('FileExtension'),
('MessageListener'),
('MessageNotifier'),
('ListenerByNotifier'),
('MessageNotifierBySection'),
('MessagePublisher'),
('MessagePublisherBySection'),
('PortalMessage'),
('CaseMessageHistory')

INSERT INTO [#SchemaDataList] ([Id], [UId])
SELECT [ss].[Id], [ss].[UId] from [dbo].[SysSchema] [ss]
	left join [dbo].[SysPackage] [sp] on [ss].[SysPackageId] = [sp].[Id]
	left join [dbo].[SysWorkspace] [sw] on [sp].[SysWorkspaceId] = [sw].[Id]
	where [sw].[Id] = (select Id from SysWorkspace where IsDefault = '1')
	and [ss].[Name] in (select [Name] COLLATE Cyrillic_General_CI_AI from [#TableList]) 

INSERT INTO [#SchemaDataListForRecords] ([Id], [UId])
SELECT [ss].[Id], [ss].[UId] from [dbo].[SysSchema] [ss]
	left join [dbo].[SysPackage] [sp] on [ss].[SysPackageId] = [sp].[Id]
	left join [dbo].[SysWorkspace] [sw] on [sp].[SysWorkspaceId] = [sw].[Id]
	where [sw].[Id] = (select Id from SysWorkspace where IsDefault = '1')
	and [ss].[ExtendParent] = 0
	and [ss].[Name] in (select [Name] COLLATE Cyrillic_General_CI_AI from [#TableList] WHERE [Name] NOT IN ('SocialChannel', 'CaseTag', 'CaseInTag', 'KnowledgeBaseTagV2', 'KnowledgeBaseInTagV2'))

INSERT INTO [#SchemaUIdForRecordDefRightList] ([UId], [Name], [ExtendParent])
SELECT [ss].[UId], [ss].[Name], [ss].[ExtendParent]from [dbo].[SysSchema] [ss]
	left join [dbo].[SysPackage] [sp] on [ss].[SysPackageId] = [sp].[Id]
	left join [dbo].[SysWorkspace] [sw] on [sp].[SysWorkspaceId] = [sw].[Id]
	where [sw].[Id] = (select Id from SysWorkspace where IsDefault = '1')
	and [ss].[Name] in ('KnowledgeBase', 'ServiceItem', 'SocialChannel', 'SysDashboard', 'Case', 'CaseInTag', 'KnowledgeBaseInTagV2')

DECLARE @Supervisor uniqueidentifier = '410006E1-CA4E-4502-A9EC-E54D922D2C00'
DECLARE @AllPortalUsersId uniqueidentifier = '720B771C-E7A7-4F31-9CFB-52CD21C3739F'
DECLARE @AllSystemUsersId uniqueidentifier = 'A29A3BA5-4B0D-DE11-9A51-005056C00008'

--AdministratedByOperations
delete SysSchemaProperty
	where SysSchemaId in (select [Id] from [#SchemaDataList]) and Name = 'AdministratedByOperations'

insert into [dbo].[SysSchemaProperty] ([Id], [CreatedById], [Name], [Value], [SysSchemaId])
	select newid(), @Supervisor, 'AdministratedByOperations', 'True', [Id] from [#SchemaDataList]

--AdministratedByColumns
delete SysSchemaProperty
	where SysSchemaId in (select [Id] from [#SchemaDataList]) and Name = 'AdministratedByColumns'

insert into [dbo].[SysSchemaProperty] ([Id], [CreatedById], [Name], [Value], [SysSchemaId])
	select newid(),@Supervisor, 'AdministratedByColumns', 'False', [Id] from [#SchemaDataList]

--AdministratedByRecords
delete SysSchemaProperty
	where SysSchemaId in (select [Id] from [#SchemaDataListForRecords]) and Name = 'AdministratedByRecords'

insert into [dbo].[SysSchemaProperty] ([Id], [CreatedById], [Name], [Value], [SysSchemaId])
	select newid(), @Supervisor, 'AdministratedByRecords', 'False', [Id] from [#SchemaDataListForRecords]

--SchemaOperationRight
delete SysEntitySchemaOperationRight
	where SubjectSchemaUId in (select [UId] from [#SchemaDataList])

insert into [dbo].[SysEntitySchemaOperationRight] ([Id], [CreatedById], [SysAdminUnitId], [CanRead], [CanAppend], [CanEdit], [Position], [SubjectSchemaUId])
	select newId(), @Supervisor, @AllPortalUsersId, 1, 0, 0, 0, [UId] from [#SchemaDataList]

insert into [dbo].[SysEntitySchemaOperationRight] ([Id], [CreatedById], [SysAdminUnitId], [CanRead], [CanAppend], [CanEdit], [CanDelete], [Position], [SubjectSchemaUId])
	select newId(), @Supervisor, @AllSystemUsersId, 1, 1, 1, 1, 1, [UId] from [#SchemaDataList]

--SysSSPEntitySchemaAccessList
delete SysSSPEntitySchemaAccessList 
	where EntitySchemaUId in (select [UId] from [#SchemaDataList])

insert into [dbo].[SysSSPEntitySchemaAccessList] ([Id], [CreatedById], [EntitySchemaUId])
	select newId(), @Supervisor, [UId] from [#SchemaDataList]

--SysEntitySchemaRecordDefRight (Права на существующие записи)
delete SysEntitySchemaRecordDefRight 
	where GranteeSysAdminUnitId = @AllPortalUsersId and SubjectSchemaUId in (select [UId] from [#SchemaUIdForRecordDefRightList] where Name <> 'Case' )

insert into SysEntitySchemaRecordDefRight (CreatedById, SubjectSchemaUId, AuthorSysAdminUnitId, GranteeSysAdminUnitId, Position, Operation, RightLevel)
	select @Supervisor, [UId], @AllSystemUsersId, @AllPortalUsersId, '0', '0', '1' from [#SchemaUIdForRecordDefRightList] where Name <> 'Case'

declare @CaseUId uniqueidentifier = (select top 1 [UId] from [#SchemaUIdForRecordDefRightList] where Name = 'Case' 
	and [ExtendParent] = 0)

delete SysEntitySchemaRecordDefRight 
	where SubjectSchemaUId = @CaseUId
	and AuthorSysAdminUnitId = @AllPortalUsersId

insert into SysEntitySchemaRecordDefRight (CreatedById, SubjectSchemaUId, AuthorSysAdminUnitId, GranteeSysAdminUnitId, Position, Operation, RightLevel)
	values( @Supervisor, @CaseUId , @AllPortalUsersId, @AllSystemUsersId,  '0', '0', '1' )
	
insert into SysEntitySchemaRecordDefRight (CreatedById, SubjectSchemaUId, AuthorSysAdminUnitId, GranteeSysAdminUnitId, Position, Operation, RightLevel)
	values( @Supervisor, @CaseUId , @AllPortalUsersId, @AllSystemUsersId,  '0', '1', '1' )

IF OBJECT_ID('tempdb..#TableList') IS NOT NULL
BEGIN
    DROP TABLE [#TableList]
END

IF OBJECT_ID('tempdb..#SchemaDataList') IS NOT NULL
BEGIN
    DROP TABLE [#SchemaDataList]
END

IF OBJECT_ID('tempdb..#SchemaDataListForRecords') IS NOT NULL
BEGIN
    DROP TABLE [#SchemaDataListForRecords]
END

IF OBJECT_ID('tempdb..#SchemaUIdForRecordDefRightList') IS NOT NULL
BEGIN
    DROP TABLE [#SchemaUIdForRecordDefRightList]
END