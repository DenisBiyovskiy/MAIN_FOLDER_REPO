SELECT        Id, CreatedOn, CreatedById, ModifiedOn, ModifiedById, Name, Description, OwnershipId, PrimaryContactId, ParentId, OwnerId, IndustryId, Code, TypeId, Phone, AdditionalPhone, Fax, Web, AddressTypeId, 
                         Address, CityId, RegionId, Zip, CountryId, AccountCategoryId, EmployeesNumberId, AnnualRevenueId, Notes, Logo, AlternativeName, ProcessListeners, GPSN, GPSE, PriceListId, Completeness, UsrKeySummary, 
                         UsrStageId, UsrApplicationStatusId, UsrInvestmentBudget, UsrAmountIndicated, UsrAmountCommitted, UsrFullName, UsrWorkPhone, UsrMobile, UsrEmailAdress, UsrLogoId
FROM            dbo.Account
WHERE        (TypeId = '57412FAD-53E6-DF11-971B-001D60E938C6') -- Investment Opportunity

SELECT        Id, CreatedOn, CreatedById, ModifiedOn, ModifiedById, Name, Description, OwnershipId, PrimaryContactId, ParentId, OwnerId, IndustryId, Code, TypeId, Phone, AdditionalPhone, Fax, Web, AddressTypeId, 
                         Address, CityId, RegionId, Zip, CountryId, AccountCategoryId, EmployeesNumberId, AnnualRevenueId, Notes, Logo, AlternativeName, ProcessListeners, GPSN, GPSE, PriceListId, Completeness, UsrKeySummary, 
                         UsrStageId, UsrApplicationStatusId, UsrInvestmentBudget, UsrAmountIndicated, UsrAmountCommitted, UsrFullName, UsrWorkPhone, UsrMobile, UsrEmailAdress, UsrLogoId
FROM            dbo.Account
WHERE        (TypeId = 'F2C0CE97-53E6-DF11-971B-001D60E938C6') -- Portfolio