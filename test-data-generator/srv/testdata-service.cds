using testdatagenerator as db from '../db/schema';

// Service definition
service TestDataService {
    entity InsuranceContract as projection on db.InsuranceContract;
    entity ContractDetails   as projection on db.ContractDetails;
    entity Emails            as projection on db.Emails;
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
    action resetDatabase() returns String;
}
