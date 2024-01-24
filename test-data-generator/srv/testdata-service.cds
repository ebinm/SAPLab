using testdatagenerator as db from '../db/schema';

// Service definition
service TestDataService {
    entity InsuranceContract as projection on db.InsuranceContract;
    entity ContractDetails   as projection on db.ContractDetails;
    entity Emails            as projection on db.Emails;
    function getInsuranceContractCount() returns Integer;
    function getContractDetailsCount() returns Integer;
    function getEmailCount() returns Integer;
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
        lowerBoundR : Integer,
        upperBoundR : Integer,
        lowerBoundAS : Integer,
        upperBoundAS : Integer,
        lowerBoundVOG : Integer,
        upperBoundVOG : Integer,
        clientChangesEmailProb : Double,
        ) returns String;
    action resetDatabase() returns String;
}
