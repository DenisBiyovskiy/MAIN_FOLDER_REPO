select * from SysPackageSchemaDataColumn where ColumnName = 'Category'
AND PackageSchemaColumnUId = '84C5953D-E261-449E-9189-8FAC859DB36D'  order by ModifiedOn desc

select * from SysPackageSchemaData where 
	Id = 'B6DF7072-2A7A-49E9-AB35-AA9B1FD7AF19'
OR id = 'D39314C4-6D50-407E-981E-29C65C1434CE'
or id = '9D02E073-6DA1-42FF-BCCA-2C1A62040F26'
or id = '9445462D-BC21-4567-BF11-B83375FB1E8B'
or id = '69B5F378-903C-4504-92AC-161FFDABF655'
or id = '5269E8AF-2DBD-4E99-87F2-A4ED6F5CC492'
or id = '49DC22B9-1CF8-4773-8C9E-B6A54C4BCA20'
or id = '20F719C2-3A1F-4A7E-8987-81D7715CBF91'


select *, CategoryId, TypeId from Product order by ModifiedOn desc

select * from ProductType
select * from ProductCategory


select * from [Ilaya(7.7)TEMP].dbo.ProductType
select * from [Ilaya(7.7)TEMP].dbo.ProductCategory
select * from ProductCategory

delete from ProductCategory where
id = 'AD0FECFD-3B90-45C4-A9AC-4AF5E6BBD3F2'
or id = 'AEB3FD6F-7B7C-4987-9813-3FD014039BA7'
or id = '861AFD86-0F4C-4516-BD8E-8FDCCDEF1596'
or id = 'A2769371-7F61-449A-8617-C67DF1268901'
or id = '0686E604-C80D-48F3-9F87-451DA91B5B57'

delete from ProductType where
id = 'CD989A27-C91E-4429-90E4-70450861026E'
or
id = '64C3C3C1-706E-41C5-BEBB-BE04AE635BED'
or
id = 'A6142F09-1521-4C17-8E7C-CD0DED941CDA'
or
id = '3C2924A9-5A64-41A3-AF3A-D8A1F4921100'
or
id = '23F812DF-FEA3-45B7-8049-8D3E9A9E79D7'

select * from Product

update Product set ilayServCategoryId = '838F6484-FC59-4BD3-8741-050F7E245627' where ilayServCategoryId = 'CD989A27-C91E-4429-90E4-70450861026E'

delete from Product where id = '2B818D08-EAED-42C7-ABEA-C0E028EA2F89' or
id = 'D3F7CDBF-E38C-4D04-AA90-B660C6E3F4E9'
update Product set CategoryId = '8C9E4C7A-510A-4F51-97BE-607832A08DE1'


select * from [Ilaya(7.7)].dbo.Product order by ModifiedOn desc