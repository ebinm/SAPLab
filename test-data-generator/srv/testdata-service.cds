using testdatagenerator as db from '../db/schema';

// Service definition
service TestDataService {
    entity InsuranceContract as projection on db.InsuranceContract;
    entity ContractDetails   as projection on db.ContractDetails;
    entity Emails            as projection on db.Emails;
    action generateData(contractCount : Integer);
    action resetDatabase();
}
