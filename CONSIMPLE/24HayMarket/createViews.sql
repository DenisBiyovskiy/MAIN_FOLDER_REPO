CREATE VIEW UsrPortfolio
AS
SELECT Id, CreatedOn, CreatedById, ModifiedOn, ModifiedById, Name, Description, OwnershipId, PrimaryContactId, ParentId, OwnerId, IndustryId, Code, TypeId, Phone, AdditionalPhone, Fax, Web, AddressTypeId, 
	Address, CityId, RegionId, Zip, CountryId, AccountCategoryId, EmployeesNumberId, AnnualRevenueId, Notes, Logo, AlternativeName, ProcessListeners, GPSN, GPSE, PriceListId, Completeness, UsrKeySummary, 
	UsrStageId, UsrApplicationStatusId, UsrInvestmentBudget, UsrAmountIndicated, UsrAmountCommitted, UsrFullName, UsrWorkPhone, UsrMobile, UsrEmailAdress, UsrLogoId
FROM dbo.Account as acc
WHERE (acc.TypeId = 'F2C0CE97-53E6-DF11-971B-001D60E938C6')


CREATE VIEW UsrInvestmentOpp
AS
SELECT Id, CreatedOn, CreatedById, ModifiedOn, ModifiedById, Name, Description, OwnershipId, PrimaryContactId, ParentId, OwnerId, IndustryId, Code, TypeId, Phone, AdditionalPhone, Fax, Web, AddressTypeId, 
 Address, CityId, RegionId, Zip, CountryId, AccountCategoryId, EmployeesNumberId, AnnualRevenueId, Notes, Logo, AlternativeName, ProcessListeners, GPSN, GPSE, PriceListId, Completeness, UsrKeySummary, 
 UsrStageId, UsrApplicationStatusId, UsrInvestmentBudget, UsrAmountIndicated, UsrAmountCommitted, UsrFullName, UsrWorkPhone, UsrMobile, UsrEmailAdress, UsrLogoId
FROM dbo.Account as acc
WHERE (acc.TypeId = '57412FAD-53E6-DF11-971B-001D60E938C6')