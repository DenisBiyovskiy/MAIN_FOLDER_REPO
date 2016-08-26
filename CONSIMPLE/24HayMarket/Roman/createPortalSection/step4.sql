update [dbo].[SysEntitySchemaOperationRight] set CanAppend = '1' where SubjectSchemaUId in (select [UId] from SysSchema where Name = 'Account') and SysAdminUnitId = '720B771C-E7A7-4F31-9CFB-52CD21C3739F'
update [dbo].[SysEntitySchemaOperationRight] set CanEdit = '1' where SubjectSchemaUId in (select [UId] from SysSchema where Name = 'Account') and SysAdminUnitId = '720B771C-E7A7-4F31-9CFB-52CD21C3739F'
update [dbo].[SysEntitySchemaOperationRight] set CanAppend = '1' where SubjectSchemaUId in (select [UId] from SysSchema where Name = 'UsrPortfolio') and SysAdminUnitId = '720B771C-E7A7-4F31-9CFB-52CD21C3739F'
update [dbo].[SysEntitySchemaOperationRight] set CanEdit = '1' where SubjectSchemaUId in (select [UId] from SysSchema where Name = 'UsrPortfolio') and SysAdminUnitId = '720B771C-E7A7-4F31-9CFB-52CD21C3739F'
update [dbo].[SysEntitySchemaOperationRight] set CanAppend = '1' where SubjectSchemaUId in (select [UId] from SysSchema where Name = 'UsrInvestmentOpp') and SysAdminUnitId = '720B771C-E7A7-4F31-9CFB-52CD21C3739F'
update [dbo].[SysEntitySchemaOperationRight] set CanEdit = '1' where SubjectSchemaUId in (select [UId] from SysSchema where Name = 'UsrInvestmentOpp') and SysAdminUnitId = '720B771C-E7A7-4F31-9CFB-52CD21C3739F'

update [dbo].[SysEntitySchemaOperationRight] set CanAppend = '1' where SubjectSchemaUId in (select [UId] from SysSchema where Name = 'UsrInvestor') and SysAdminUnitId = '720B771C-E7A7-4F31-9CFB-52CD21C3739F'
update [dbo].[SysEntitySchemaOperationRight] set CanEdit = '1' where SubjectSchemaUId in (select [UId] from SysSchema where Name = 'UsrInvestor') and SysAdminUnitId = '720B771C-E7A7-4F31-9CFB-52CD21C3739F'
update [dbo].[SysEntitySchemaOperationRight] set CanDelete = '1' where SubjectSchemaUId in (select [UId] from SysSchema where Name = 'UsrInvestor') and SysAdminUnitId = '720B771C-E7A7-4F31-9CFB-52CD21C3739F'

	update [dbo].[SysEntitySchemaOperationRight] set CanAppend = '1' where SubjectSchemaUId in (select [UId] from SysSchema where Name = 'UsrInvestorDocFile') and SysAdminUnitId = '720B771C-E7A7-4F31-9CFB-52CD21C3739F'
update [dbo].[SysEntitySchemaOperationRight] set CanEdit = '1' where SubjectSchemaUId in (select [UId] from SysSchema where Name = 'UsrInvestorDocFile') and SysAdminUnitId = '720B771C-E7A7-4F31-9CFB-52CD21C3739F'
update [dbo].[SysEntitySchemaOperationRight] set CanDelete = '1' where SubjectSchemaUId in (select [UId] from SysSchema where Name = 'UsrInvestorDocFile') and SysAdminUnitId = '720B771C-E7A7-4F31-9CFB-52CD21C3739F'

	update [dbo].[SysEntitySchemaOperationRight] set CanAppend = '1' where SubjectSchemaUId in (select [UId] from SysSchema where Name = 'UsrReporting') and SysAdminUnitId = '720B771C-E7A7-4F31-9CFB-52CD21C3739F'
update [dbo].[SysEntitySchemaOperationRight] set CanEdit = '1' where SubjectSchemaUId in (select [UId] from SysSchema where Name = 'UsrReporting') and SysAdminUnitId = '720B771C-E7A7-4F31-9CFB-52CD21C3739F'
update [dbo].[SysEntitySchemaOperationRight] set CanDelete = '1' where SubjectSchemaUId in (select [UId] from SysSchema where Name = 'UsrReporting') and SysAdminUnitId = '720B771C-E7A7-4F31-9CFB-52CD21C3739F'

update [dbo].[SysEntitySchemaOperationRight] set CanAppend = '1' where SubjectSchemaUId in (select [UId] from SysSchema where Name = 'UsrInvestorDocuments') and SysAdminUnitId = '720B771C-E7A7-4F31-9CFB-52CD21C3739F'
update [dbo].[SysEntitySchemaOperationRight] set CanEdit = '1' where SubjectSchemaUId in (select [UId] from SysSchema where Name = 'UsrInvestorDocuments') and SysAdminUnitId = '720B771C-E7A7-4F31-9CFB-52CD21C3739F'
update [dbo].[SysEntitySchemaOperationRight] set CanDelete = '1' where SubjectSchemaUId in (select [UId] from SysSchema where Name = 'UsrInvestorDocuments') and SysAdminUnitId = '720B771C-E7A7-4F31-9CFB-52CD21C3739F'

	update [dbo].[SysEntitySchemaOperationRight] set CanAppend = '1' where SubjectSchemaUId in (select [UId] from SysSchema where Name = 'UsrReportingFile') and SysAdminUnitId = '720B771C-E7A7-4F31-9CFB-52CD21C3739F'
update [dbo].[SysEntitySchemaOperationRight] set CanEdit = '1' where SubjectSchemaUId in (select [UId] from SysSchema where Name = 'UsrReportingFile') and SysAdminUnitId = '720B771C-E7A7-4F31-9CFB-52CD21C3739F'
update [dbo].[SysEntitySchemaOperationRight] set CanDelete = '1' where SubjectSchemaUId in (select [UId] from SysSchema where Name = 'UsrReportingFile') and SysAdminUnitId = '720B771C-E7A7-4F31-9CFB-52CD21C3739F'

	update [dbo].[SysEntitySchemaOperationRight] set CanAppend = '1' where SubjectSchemaUId in (select [UId] from SysSchema where Name = 'UsrInvestment') and SysAdminUnitId = '720B771C-E7A7-4F31-9CFB-52CD21C3739F'
update [dbo].[SysEntitySchemaOperationRight] set CanEdit = '1' where SubjectSchemaUId in (select [UId] from SysSchema where Name = 'UsrInvestment') and SysAdminUnitId = '720B771C-E7A7-4F31-9CFB-52CD21C3739F'
update [dbo].[SysEntitySchemaOperationRight] set CanDelete = '1' where SubjectSchemaUId in (select [UId] from SysSchema where Name = 'UsrInvestment') and SysAdminUnitId = '720B771C-E7A7-4F31-9CFB-52CD21C3739F'


/*SocialMessage CanAppend CanEdit CanDelete*/
update [dbo].[SysEntitySchemaOperationRight] set CanAppend = '1' where SubjectSchemaUId in (select [UId] from SysSchema where Name = 'SocialMessage') and SysAdminUnitId = '720B771C-E7A7-4F31-9CFB-52CD21C3739F'
update [dbo].[SysEntitySchemaOperationRight] set CanEdit = '1' where SubjectSchemaUId in (select [UId] from SysSchema where Name = 'SocialMessage') and SysAdminUnitId = '720B771C-E7A7-4F31-9CFB-52CD21C3739F'
update [dbo].[SysEntitySchemaOperationRight] set CanDelete = '1' where SubjectSchemaUId in (select [UId] from SysSchema where Name = 'SocialMessage') and SysAdminUnitId = '720B771C-E7A7-4F31-9CFB-52CD21C3739F'
/*SocialLike CanAppend CanDelete*/
update [dbo].[SysEntitySchemaOperationRight] set CanAppend = '1' where SubjectSchemaUId in (select [UId] from SysSchema where Name = 'SocialLike') and SysAdminUnitId = '720B771C-E7A7-4F31-9CFB-52CD21C3739F'
update [dbo].[SysEntitySchemaOperationRight] set CanDelete = '1' where SubjectSchemaUId in (select [UId] from SysSchema where Name = 'SocialLike') and SysAdminUnitId = '720B771C-E7A7-4F31-9CFB-52CD21C3739F'
/*Like CanAppend CanDelete*/
update [dbo].[SysEntitySchemaOperationRight] set CanAppend = '1' where SubjectSchemaUId in (select [UId] from SysSchema where Name = 'Like') and SysAdminUnitId = '720B771C-E7A7-4F31-9CFB-52CD21C3739F'
update [dbo].[SysEntitySchemaOperationRight] set CanDelete = '1' where SubjectSchemaUId in (select [UId] from SysSchema where Name = 'Like') and SysAdminUnitId = '720B771C-E7A7-4F31-9CFB-52CD21C3739F'
/*SocialChannel CanAppend*/
update [dbo].[SysEntitySchemaOperationRight] set CanAppend = '1' where SubjectSchemaUId in (select [UId] from SysSchema where Name = 'SocialChannel') and SysAdminUnitId = '720B771C-E7A7-4F31-9CFB-52CD21C3739F'
/*SocialSubscription CanAppend*/
update [dbo].[SysEntitySchemaOperationRight] set CanAppend = '1' where SubjectSchemaUId in (select [UId] from SysSchema where Name = 'SocialSubscription') and SysAdminUnitId = '720B771C-E7A7-4F31-9CFB-52CD21C3739F'
/*CaseFile CanAppend CanEdit CanDelete*/
update [dbo].[SysEntitySchemaOperationRight] set CanAppend = '1' where SubjectSchemaUId in (select [UId] from SysSchema where Name = 'AccountFile') and SysAdminUnitId = '720B771C-E7A7-4F31-9CFB-52CD21C3739F'
update [dbo].[SysEntitySchemaOperationRight] set CanEdit = '1' where SubjectSchemaUId in (select [UId] from SysSchema where Name = 'AccountFile') and SysAdminUnitId = '720B771C-E7A7-4F31-9CFB-52CD21C3739F'
update [dbo].[SysEntitySchemaOperationRight] set CanDelete = '1' where SubjectSchemaUId in (select [UId] from SysSchema where Name = 'AccountFile') and SysAdminUnitId = '720B771C-E7A7-4F31-9CFB-52CD21C3739F'
/*ESNNotification CanEdit CanDelete*/
update [dbo].[SysEntitySchemaOperationRight] set CanEdit = '1' where SubjectSchemaUId in (select [UId] from SysSchema where Name = 'ESNNotification') and SysAdminUnitId = '720B771C-E7A7-4F31-9CFB-52CD21C3739F'
update [dbo].[SysEntitySchemaOperationRight] set CanDelete = '1' where SubjectSchemaUId in (select [UId] from SysSchema where Name = 'ESNNotification') and SysAdminUnitId = '720B771C-E7A7-4F31-9CFB-52CD21C3739F'

