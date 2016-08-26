DECLARE @SysDashboardId NVARCHAR(255) = '0ca4b4ab-ca63-4360-9589-de74ad010fdb' --dashboard id
declare @SysAdminUnitId nvarchar(255) = '720b771c-e7a7-4f31-9cfb-52cd21c3739f' --portal user admin unit id
declare @SectionId nvarchar(255) = 'bc7f71d2-76b5-47d8-a4ed-c37d09f12e8a' --portfolio module id
--insert dashboard
insert into SysDashboard (Caption, ViewConfig, Items, SectionId) values
((select Caption from SysDashboard where Id = @SysDashboardId),
(select ViewConfig from SysDashboard where Id = @SysDashboardId),
(select Items from SysDashboard where Id = @SysDashboardId),
@SectionId)
--insert rights for dashboard
insert into SysDashboardRight (RecordId, SysAdminUnitId, Operation, RightLevel, SourceId) values 
(@SysDashboardId, @SysAdminUnitId, 0, 1, '8A248A03-E9A5-DF11-9989-485B39C18470')
--it's for check added
select * from SysDashboard 
where SectionId = @SectionId