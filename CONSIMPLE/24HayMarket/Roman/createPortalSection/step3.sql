insert into SysEntitySchemaRecordDefRight (CreatedById, SubjectSchemaUId, AuthorSysAdminUnitId, GranteeSysAdminUnitId, Position, Operation, RightLevel)
values (
'DAD159F3-6C2D-446A-98D2-0F4D26662BBE',
'0326868C-CE5E-4934-8F1F-178801BFE6C3',
'A29A3BA5-4B0D-DE11-9A51-005056C00008',
'720B771C-E7A7-4F31-9CFB-52CD21C3739F',
'0',
'0',
'1'
)


insert into SysEntitySchemaRecordDefRight (CreatedById, SubjectSchemaUId, AuthorSysAdminUnitId, GranteeSysAdminUnitId, Position, Operation, RightLevel)
values (
'DAD159F3-6C2D-446A-98D2-0F4D26662BBE',
'C6C44F0A-193E-4B5C-B35E-220A60C06898',
'A29A3BA5-4B0D-DE11-9A51-005056C00008',
'720B771C-E7A7-4F31-9CFB-52CD21C3739F',
'0',
'0',
'1'
)


insert into SysEntitySchemaRecordDefRight (CreatedById, SubjectSchemaUId, AuthorSysAdminUnitId, GranteeSysAdminUnitId, Position, Operation, RightLevel)
values (
'DAD159F3-6C2D-446A-98D2-0F4D26662BBE',
'595DDBDA-31CE-4CCA-9BDD-862257CEAF23',
'A29A3BA5-4B0D-DE11-9A51-005056C00008',
'720B771C-E7A7-4F31-9CFB-52CD21C3739F',
'0',
'0',
'1'
)


insert into SysEntitySchemaRecordDefRight (CreatedById, SubjectSchemaUId, AuthorSysAdminUnitId, GranteeSysAdminUnitId, Position, Operation, RightLevel)
values (
'DAD159F3-6C2D-446A-98D2-0F4D26662BBE',
'DF695B99-74E5-49D7-A48F-BCF169392C27',
'A29A3BA5-4B0D-DE11-9A51-005056C00008',
'720B771C-E7A7-4F31-9CFB-52CD21C3739F',
'0',
'0',
'1'
)

insert into SysEntitySchemaRecordDefRight (CreatedById, SubjectSchemaUId, AuthorSysAdminUnitId, GranteeSysAdminUnitId, Position, Operation, RightLevel)
values (
'DAD159F3-6C2D-446A-98D2-0F4D26662BBE',
'2708FF0D-6349-43FB-A407-EBC5F0A4FA9C',
'A29A3BA5-4B0D-DE11-9A51-005056C00008',
'720B771C-E7A7-4F31-9CFB-52CD21C3739F',
'0',
'0',
'1'
)


select SA.Name, sso.* from SysEntitySchemaOperationRight sso
inner join SysSchema SS on SS.Uid = sso.SubjectSchemaUId
inner join SysAdminUnit SA on SA.Id = sso.SysAdminUnitId
Where SS.Name = 'Account'

delete from SysEntitySchemaOperationRight
where Id in (select sso.Id from SysEntitySchemaOperationRight sso
inner join SysSchema SS on SS.Uid = sso.SubjectSchemaUId
inner join SysAdminUnit SA on SA.Id = sso.SysAdminUnitId
Where SS.Name = 'Account')


delete from SysEntitySchemaOperationRight where Id in
(select top(2) Id from SysEntitySchemaOperationRight where SubjectSchemaUId in
(select UId from SysSchema where name = 'SysImage'))