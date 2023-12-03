using generator from '../db/schema';

@path: 'service/testdata'
service TestDataService {
    entity InsuranceContract as projection on generator.InsuranceContract
    entity InsuranceContractDetails as projection on generator.InsuranceContractDetails
}