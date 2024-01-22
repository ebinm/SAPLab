using testdatagenerator as db from '../db/schema';

// Service definition
service TestDataService {
    entity InsuranceContract as projection on db.InsuranceContract;
    entity ContractDetails   as projection on db.ContractDetails;
    entity Emails            as projection on db.Emails;
    action generateData(
        contractCount : Integer,
        contractCreationYearRange : Integer,
        activeContractDist : Double,
        lowerBoundContractDetailsCount : Integer,
        upperBoundContractDetailsCount : Integer,
        reportingDuration : Integer,
        allowedDelay : Integer,
        latenessProb : Double,
        neutralContractsProb : Double,
        nonPenalizedContractsProb : Double,
        lowerBoundReportingValueVariance : Double,
        upperBoundReportingValueVariance : Double,
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
