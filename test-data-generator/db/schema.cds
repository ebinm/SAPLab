/*
 * File: schema.cds
 * Description: Contains the rebuilt InValNoS data model schema
 */

namespace generator;

entity InsuranceContract {
  key ID : UUID;
  createdAt : Date;
  createdBy : String;
  modifiedAt : Date;
  modifiedBy : String;
  policy : String;
  insuranceID : String;
  insuranceName : String;
  clientID : String;
  clientName : String;
  clientEmail : String;
  policyStatus : String;
  // TODO connect with ContractDetails
}


// TODO: other classes
