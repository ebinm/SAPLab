/*
 * File: schema.cds
 * Description: Contains the rebuilt InValNoS data model schema
 */

namespace testdatagenerator;

entity InsuranceContract {
  key ID              : UUID;
      createdAt       : Date;
      createdBy       : String;
      modifiedAt      : Date;
      modifiedBy      : String;
      policy          : String;
      insuranceID     : String;
      insuranceName   : String;
      clientID        : String;
      clientName      : String;
      clientEmail     : String;
      policyStatus    : String;

      // Connect InsuranceContract with ContractDetails
      contractDetails : Association to many ContractDetails
                          on contractDetails.insuranceContract = $self;
}

entity ContractDetails {
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

      // Connect emails and contract
      emails                             : Association to many Emails
                                             on emails.contractDetails = $self;
      insuranceContract                  : Association to InsuranceContract;
}

entity Emails {
  key ID                  : UUID;
      sentDateTime        : Timestamp;
      EmailType           : String;
      clientEmail         : String;
      graphMailID         : String;
      retry               : Integer;
      dispatchStatus      : String;
      deliveryErrorReason : String;

      // Connect Mail with ContractDetails
      contractDetails     : Association to ContractDetails;
}

// TODO: enums?
