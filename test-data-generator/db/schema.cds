/*
 * File: schema.cds
 * Description: Contains the rebuilt InValNoS data model schema
 */

namespace testdatagenerator;

entity InsuranceContract {
  key ID            : UUID;
      createdAt     : Date;
      createdBy     : String;
      modifiedAt    : Date;
      modifiedBy    : String;
      policy        : String;
      insuranceID   : String;
      insuranceName : String;
      clientID      : String;
      clientName    : String;
      clientEmail   : String;
      policyStatus  : String;
// TODO connect with ContractDetails
}

entity InsuranceContractDetails {
  key ID                                 : UUID;
      createdAt                          : Date;
      createdBy                          : String;
      modifiedAt                         : Date;
      modifiedBy                         : String;
      creationDate                       : String;
      contractNo                         : String;
      contractDescription                : String;
      reportingValueType                 : String;
      provisionalReportedAmount          : Decimal;
      finalReportedAmount                : Decimal;
      reportingValueUnit_code            : String;
      provisionalReportedNumberOfPersons : Integer;
      finalReportedNumberOfPersons       : Integer;
      provisionalReportedAssetsStocks    : Decimal;
      finalReportedAssetsStocks          : Decimal;
      provisionalReportedValueOfGoods    : Decimal;
      finalReportedValueOfGoods          : Decimal;
      reportingPeriodStart               : DateTime;
      reportingPeriodEnd                 : DateTime;
      allowedDelay                       : Integer;
      finalReportingDate                 : DateTime;
      reportSubmissionDate               : String;
      transferReportingDate              : DateTime;
      penaltyEndorsement                 : Boolean;
      contractDetailStatus               : String;
      timezone                           : String;
// TODO mails
}


// TODO: other classes
