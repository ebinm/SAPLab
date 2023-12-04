using testdatagenerator as db from '../db/schema';

// Service definition
service TestDataService {
    entity InsuranceContract        as projection on db.InsuranceContract
    entity InsuranceContractDetails as projection on db.InsuranceContractDetails

    action generateData(contractCount: Integer);
}
