'UsrAccountStage', 'UsrAccountApplicationStat', 'AccountIndustry' , 'AccountAnnualRevenue', 'Account', 'AccountFile', 'AccountFolder', 'AccountInFolder', 'AccountTag', 'UsrPortfolio', 'UsrInvestmentOpp', 'UsrInvestor', 'UsrInvestorDocFile', 'UsrReporting', 'UsrInvestorDocuments', 'UsrReportingFile' , 'UsrInvestment'

delete SysSchemaProperty where CreatedById = 'DAD159F3-6C2D-446A-98D2-0F4D26662BBE'
and SysSchemaId in (
select [ss].[Id] from [dbo].[SysSchema] [ss]
left join [dbo].[SysPackage] [sp] on [ss].[SysPackageId] = [sp].[Id]
left join [dbo].[SysWorkspace] [sw] on [sp].[SysWorkspaceId] = [sw].[Id]
where [sw].[Id] = (select Id from SysWorkspace where IsDefault = '1')
and [ss].[ExtendParent] = 0
and [ss].[Name] in ('UsrAccountStage', 'UsrAccountApplicationStat', 'AccountIndustry' , 'AccountAnnualRevenue', 'Account', 'AccountFile', 'AccountFolder', 'AccountInFolder', 'AccountTag', 'UsrPortfolio', 'UsrInvestmentOpp', 'UsrInvestor', 'UsrInvestorDocFile', 'UsrReporting', 'UsrInvestorDocuments', 'UsrReportingFile' , 'UsrInvestment'))


insert into [dbo].[SysSchemaProperty] ([Id], [CreatedById], [Name], [Value], [SysSchemaId])
select newid(),'DAD159F3-6C2D-446A-98D2-0F4D26662BBE', 'AdministratedByColumns', 'false', [ss].[Id] from [dbo].[SysSchema] [ss]
left join [dbo].[SysPackage] [sp] on [ss].[SysPackageId] = [sp].[Id]
left join [dbo].[SysWorkspace] [sw] on [sp].[SysWorkspaceId] = [sw].[Id]
where [sw].[Id] = (select Id from SysWorkspace where IsDefault = '1')
and [ss].[ExtendParent] = 0
and [ss].[Name] in ('UsrAccountStage', 'UsrAccountApplicationStat', 'AccountIndustry' , 'AccountAnnualRevenue', 'Account', 'AccountFile', 'AccountFolder', 'AccountInFolder', 'AccountTag', 'UsrPortfolio', 'UsrInvestmentOpp', 'UsrInvestor', 'UsrInvestorDocFile', 'UsrReporting', 'UsrInvestorDocuments', 'UsrReportingFile' , 'UsrInvestment')

insert into [dbo].[SysSchemaProperty] ([Id], [CreatedById], [Name], [Value], [SysSchemaId])
select newid(), 'DAD159F3-6C2D-446A-98D2-0F4D26662BBE', 'AdministratedByOperations', 'true', [ss].[Id] from [dbo].[SysSchema] [ss]
left join [dbo].[SysPackage] [sp] on [ss].[SysPackageId] = [sp].[Id]
left join [dbo].[SysWorkspace] [sw] on [sp].[SysWorkspaceId] = [sw].[Id]
where [sw].[Id] = (select Id from SysWorkspace where IsDefault = '1')
and [ss].[ExtendParent] = 0
and [ss].[Name] in ('UsrAccountStage', 'UsrAccountApplicationStat', 'AccountIndustry' , 'AccountAnnualRevenue', 'Account', 'AccountFile', 'AccountFolder', 'AccountInFolder', 'AccountTag', 'UsrPortfolio', 'UsrInvestmentOpp', 'UsrInvestor', 'UsrInvestorDocFile', 'UsrReporting', 'UsrInvestorDocuments', 'UsrReportingFile' , 'UsrInvestment')

insert into [dbo].[SysSchemaProperty] ([Id], [CreatedById], [Name], [Value], [SysSchemaId])
select newid(), 'DAD159F3-6C2D-446A-98D2-0F4D26662BBE', 'AdministratedByRecords', 'false', [ss].[Id] from [dbo].[SysSchema] [ss]
left join [dbo].[SysPackage] [sp] on [ss].[SysPackageId] = [sp].[Id]
left join [dbo].[SysWorkspace] [sw] on [sp].[SysWorkspaceId] = [sw].[Id]
where [sw].[Id] = (select Id from SysWorkspace where IsDefault = '1')
and [ss].[ExtendParent] = 0
and [ss].[Name] in ('UsrAccountStage', 'UsrAccountApplicationStat', 'AccountIndustry' , 'AccountAnnualRevenue', 'Account', 'AccountFile', 'AccountFolder', 'AccountInFolder', 'AccountTag', 'UsrPortfolio', 'UsrInvestmentOpp', 'UsrInvestor', 'UsrInvestorDocFile', 'UsrReporting', 'UsrInvestorDocuments', 'UsrReportingFile' , 'UsrInvestment')

delete SysEntitySchemaOperationRight where CreatedById = 'DAD159F3-6C2D-446A-98D2-0F4D26662BBE'
and SubjectSchemaUId in (
select [ss].[UId] from [dbo].[SysSchema] [ss]
left join [dbo].[SysPackage] [sp] on [ss].[SysPackageId] = [sp].[Id]
left join [dbo].[SysWorkspace] [sw] on [sp].[SysWorkspaceId] = [sw].[Id]
where [sw].[Id] = (select Id from SysWorkspace where IsDefault = '1')
and [ss].[ExtendParent] = 0
and [ss].[Name] in ('UsrAccountStage', 'UsrAccountApplicationStat', 'AccountIndustry' , 'AccountAnnualRevenue', 'Account', 'AccountFile', 'AccountFolder', 'AccountInFolder', 'AccountTag', 'UsrPortfolio', 'UsrInvestmentOpp', 'UsrInvestor', 'UsrInvestorDocFile', 'UsrReporting', 'UsrInvestorDocuments', 'UsrReportingFile' , 'UsrInvestment'))

insert into [dbo].[SysEntitySchemaOperationRight] ([Id], [CreatedById], [SysAdminUnitId], [CanRead], [CanAppend], [CanEdit], [Position], [SubjectSchemaUId])
select newId(), 'DAD159F3-6C2D-446A-98D2-0F4D26662BBE', '720B771C-E7A7-4F31-9CFB-52CD21C3739F', 1, 0, 0, 0, [ss].[UId] from [dbo].[SysSchema] [ss]
left join [dbo].[SysPackage] [sp] on [ss].[SysPackageId] = [sp].[Id]
left join [dbo].[SysWorkspace] [sw] on [sp].[SysWorkspaceId] = [sw].[Id]
where [sw].[Id] = (select Id from SysWorkspace where IsDefault = '1')
and [ss].[ExtendParent] = 0
and [ss].[Name] in ('UsrAccountStage', 'UsrAccountApplicationStat', 'AccountIndustry' , 'AccountAnnualRevenue', 'Account', 'AccountFile', 'AccountFolder', 'AccountInFolder', 'AccountTag', 'UsrPortfolio', 'UsrInvestmentOpp', 'UsrInvestor', 'UsrInvestorDocFile', 'UsrReporting', 'UsrInvestorDocuments', 'UsrReportingFile' , 'UsrInvestment')

insert into [dbo].[SysEntitySchemaOperationRight] ([Id], [CreatedById], [SysAdminUnitId], [CanRead], [CanAppend], [CanEdit], [CanDelete], [Position], [SubjectSchemaUId])
select newId(), 'DAD159F3-6C2D-446A-98D2-0F4D26662BBE', 'A29A3BA5-4B0D-DE11-9A51-005056C00008', 1, 1, 1, 1, 1, [ss].[UId] from [dbo].[SysSchema] [ss]
left join [dbo].[SysPackage] [sp] on [ss].[SysPackageId] = [sp].[Id]
left join [dbo].[SysWorkspace] [sw] on [sp].[SysWorkspaceId] = [sw].[Id]
where [sw].[Id] = (select Id from SysWorkspace where IsDefault = '1')
and [ss].[ExtendParent] = 0
and [ss].[Name] in ('UsrAccountStage', 'UsrAccountApplicationStat', 'AccountIndustry' , 'AccountAnnualRevenue', 'Account', 'AccountFile', 'AccountFolder', 'AccountInFolder', 'AccountTag', 'UsrPortfolio', 'UsrInvestmentOpp', 'UsrInvestor', 'UsrInvestorDocFile', 'UsrReporting', 'UsrInvestorDocuments', 'UsrReportingFile' , 'UsrInvestment')

delete SysSSPEntitySchemaAccessList where CreatedById = 'DAD159F3-6C2D-446A-98D2-0F4D26662BBE'
and EntitySchemaUId in (
select [ss].[UId] from [dbo].[SysSchema] [ss]
left join [dbo].[SysPackage] [sp] on [ss].[SysPackageId] = [sp].[Id]
left join [dbo].[SysWorkspace] [sw] on [sp].[SysWorkspaceId] = [sw].[Id]
where [sw].[Id] = (select Id from SysWorkspace where IsDefault = '1')
and [ss].[ExtendParent] = 0
and [ss].[Name] in ('UsrAccountStage', 'UsrAccountApplicationStat', 'AccountIndustry' , 'AccountAnnualRevenue', 'Account', 'AccountFile', 'AccountFolder', 'AccountInFolder', 'AccountTag', 'UsrPortfolio', 'UsrInvestmentOpp', 'UsrInvestor', 'UsrInvestorDocFile', 'UsrReporting', 'UsrInvestorDocuments', 'UsrReportingFile' , 'UsrInvestment'))

insert into [dbo].[SysSSPEntitySchemaAccessList] ([Id], [CreatedById], [EntitySchemaUId])
select newId(), 'DAD159F3-6C2D-446A-98D2-0F4D26662BBE', [ss].[UId] from [dbo].[SysSchema] [ss]
left join [dbo].[SysPackage] [sp] on [ss].[SysPackageId] = [sp].[Id]
left join [dbo].[SysWorkspace] [sw] on [sp].[SysWorkspaceId] = [sw].[Id]
where [sw].[Id] = (select Id from SysWorkspace where IsDefault = '1')
and [ss].[ExtendParent] = 0
and [ss].[Name] in ('UsrAccountStage', 'UsrAccountApplicationStat', 'AccountIndustry' , 'AccountAnnualRevenue', 'Account', 'AccountFile', 'AccountFolder', 'AccountInFolder', 'AccountTag', 'UsrPortfolio', 'UsrInvestmentOpp', 'UsrInvestor', 'UsrInvestorDocFile', 'UsrReporting', 'UsrInvestorDocuments', 'UsrReportingFile' , 'UsrInvestment')

delete SysEntitySchemaRecordDefRight where CreatedById = 'DAD159F3-6C2D-446A-98D2-0F4D26662BBE'
and SubjectSchemaUId in (
'0326868C-CE5E-4934-8F1F-178801BFE6C3'
,'C6C44F0A-193E-4B5C-B35E-220A60C06898'
,'595DDBDA-31CE-4CCA-9BDD-862257CEAF23'
,'E428B6E9-847F-49D2-866C-08DA12C39708'
,'B760454B-7CA9-4242-B851-4D7E224F037C') --UId's in SysSchema

