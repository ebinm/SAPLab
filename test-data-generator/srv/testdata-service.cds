using testdatagenerator as db from '../db/schema';

// Section 1: Service definition
service TestDataService {
    entity InsuranceContract as projection on db.InsuranceContract;
    entity ContractDetails   as projection on db.ContractDetails;
    entity Emails            as projection on db.Emails;
    // Function 1.1: GET InsuranceContract count
    function getInsuranceContractCount() returns Integer;
    // Function 1.2: GET ContractDetails count
    function getContractDetailsCount() returns Integer;
    // Function 1.3: GET Email count
    function getEmailCount() returns Integer;
    // Function 1.4: POST generateData
    action generateData(
        contractCount : Integer,
        contractCreationYearRange : Integer,
        activeContractProb : Double,
        lowerBoundContractDetailsCount : Integer,
        upperBoundContractDetailsCount : Integer,
        failureProb : Double,
        timezone : String,
        reportingDuration : Integer,
        allowedDelay : Integer,
        latenessProb : Double,
        neutralContractsProb : Double,
        penalizedContractsProb : Double,
        outlierProb : Double,
        lowerBoundOutlierRValueVariance : Double,
        upperBoundOutlierRValueVariance : Double,
        lowerBoundNormalRValueVariance : Double,
        upperBoundNormalRValueVariance : Double,
        lowerBoundNOP : Integer,
        upperBoundNOP : Integer,
        lowerBoundR : Decimal,
        upperBoundR : Decimal,
        lowerBoundAS : Decimal,
        upperBoundAS : Decimal,
        lowerBoundVOG : Decimal,
        upperBoundVOG : Decimal,
        clientChangesEmailProb : Double,
        ) returns String;
    // Function 1.5: POST resetDatabase
    action resetDatabase() returns String;
}
