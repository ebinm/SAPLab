const { faker } = require('@faker-js/faker');
const eg = require('./email_gen');

/**
 * Adjustable generation parameters for ContractDetails
 */
// Upper/lower bounds for the count of ContractDetails per InsuranceContract
exports.lowerBoundContractDetailsCount = 1;
exports.upperBoundContractDetailsCount = 10;
// Assume the standard of 30 days to report
const reportingDuration = 30;
// Assume two weeks of allowed reporting delay
const allowedDelay = 14;
// Rarely make status neutral for a more meaningful dashboard
const neutralContractsProb = 0.1;
// Penalize some contracts in the past
const nonpenalizedContractsProb = 0.7;
// Variance to avoid vast reporting value differences
const reportingValueVariance = faker.number.float({ min: 0.5, max: 2.0});
// Upper/lower bounds for provisional/final values
const lowerBoundNOP = 10;
const upperBoundNOP = 999;
const lowerBoundR = 1000000;
const upperBoundR = 100000000000;
const lowerBoundAS = 1000000;
const upperBoundAS = 10000000000;
const lowerBoundVOG = 1000000;
const upperBoundVOG = 10000000000;


/**
 * Generates one fake ContractDetails object with its associated Emails
 * @param {InsuranceContract} contract - The InsuranceContract the ContractDetails object is associated with
 * @returns {Array} Returns a nested 2D array with one fake ContractDetails object and an array of one or more associated Emails
 */
exports.genContractDetails = function generateContractDetails(contract) {
  const now = new Date();

  // Fake attributes of ContractDetails entity
  const ID = faker.string.uuid();
  const createdBy = faker.string.uuid();
  // Format Date to match HANA Date format, prevents null errors
  const createdAt = faker.date.between({ from: contract.createdAt, to: now }).toISOString().split("T")[0];
  const modifiedAt = faker.date.between({ from: createdAt, to: now }).toISOString().split("T")[0];
  // For simplicity: modifying user is the same as the creating user
  const modifiedBy = createdBy;
  const creationDate = createdAt.toString();
  // TODO make contractNo unique
  const contractNo = faker.number.int({ min: 100000, max: 999999 }).toString();
  const contractDescription = faker.company.buzzPhrase();
  const timezone = 'CEST';

  // Set status and the respective submission/transfer date accordingly
  // 1. Set all values to null first
  // 2. Depending on the randomly selected contractDetailStatus, reassign the corresponding values
  // 3. Set penaltyEndorsement depending on submissionDate
  let status = null;

  let reportingPeriodStart = null;
  let reportingPeriodEnd = null;
  let finalReportingDate = null;

  let reportSubmissionDate = null;
  let transferReportingDate = null;

  let penaltyEndorsement = false;

  if (contract.policyStatus == 'REVERSED') {
    // If the contract ifself is 'REVERSED', the contractDetailStatus can only be 'CANCELED' or 'REVERSED'
    status = faker.helpers.arrayElement(['CANCELED', 'REVERSED']);
  } else {
    let random = faker.number.float();

    if (random < neutralContractsProb) {
      status = faker.helpers.arrayElement(['TEMPORARY', 'NEW_IN_PROCESS']);

      // Reporting period is in the future
      reportingPeriodStart = faker.date.between({ from: now, to: faker.date.soon() });
      reportingPeriodEnd = new Date(reportingPeriodStart.setDate(reportingPeriodStart.getDate() + reportingDuration));
      finalReportingDate = new Date(reportingPeriodEnd.setDate(reportingPeriodEnd.getDate() + allowedDelay));
    } else {
      status = faker.helpers.arrayElement(['FINALIZED', 'REMINDED', 'REMINDED_FAILED', 'NOTIFIED', 'NOTIFIED_FAILED', 'TRANSFER_OK', 'TRANSFER_FAILED']);

      // Reporting period is active or in the past
      reportingPeriodStart = faker.date.between({ from: createdAt, to: now });
      reportingPeriodEnd = new Date(reportingPeriodStart);
      reportingPeriodEnd.setDate(reportingPeriodEnd.getDate() + reportingDuration);
      finalReportingDate = new Date(reportingPeriodEnd);
      finalReportingDate.setDate(finalReportingDate.getDate() + allowedDelay);
    
      if (status == 'FINALIZED' || status == 'TRANSFER_OK' || status == 'TRANSFER_FAILED') {
        // Penalize some ContractDetails in the past
        if (random > nonpenalizedContractsProb && finalReportingDate < now) {
          penaltyEndorsement = true;
          reportSubmissionDate = faker.date.between({ from: finalReportingDate, to: now }).toISOString().split("T")[0];
        } else {
          // Make sure that the submission date is never set in the future
          if (now <= finalReportingDate) {
            reportSubmissionDate = faker.date.between({ from: reportingPeriodStart, to: now }).toISOString().split("T")[0];
          } else {
            reportSubmissionDate = faker.date.between({ from: reportingPeriodStart, to: finalReportingDate }).toISOString().split("T")[0];
          }
        }

        if (status == 'TRANSFER_OK') {
          // Only set transfer date if transfer was successful
          transferReportingDate = faker.date.between({ from: reportSubmissionDate, to: now });
        }
      }
    }
  }

  // Generate provisional and final reported values
  // 1. Set all values to null first
  // 2. Depending on selected ReportingValueType, reassign the corresponding values
  let reportingValueType = null;
  let reportingValueUnit_code = null;
  let provisionalReportedAmount = null;
  let finalReportedAmount = null;
  let provisionalReportedNumberOfPersons = null;
  let finalReportedNumberOfPersons = null;
  let provisionalReportedAssetsStocks = null;
  let finalReportedAssetsStocks = null;
  let provisionalReportedValueOfGoods = null;
  let finalReportedValueOfGoods = null;

  // Randomly choose one ReportingValueType and set values accordingly
  reportingValueType = faker.helpers.arrayElement(['NOP', 'R', 'AS', 'VOG']);
  switch (reportingValueType) {
    case 'NOP':
      reportingValueUnit_code = 'persons';
      // Realistic value: 2-3 digits
      provisionalReportedNumberOfPersons = faker.number.int({ min: lowerBoundNOP, max: upperBoundNOP });
      if (status == 'FINALIZED' || status == 'TRANSFER_OK' || status == 'TRANSFER_FAILED') {
        finalReportedNumberOfPersons = Math.round(reportingValueVariance * provisionalReportedNumberOfPersons);
      }
      break;
    case 'R':
      reportingValueUnit_code = '€';
      // Highest value: millions to billions
      provisionalReportedAmount = faker.number.float({ min: lowerBoundR, max: upperBoundR });
      if (status == 'FINALIZED' || status == 'TRANSFER_OK' || status == 'TRANSFER_FAILED') {
        finalReportedAmount = reportingValueVariance * provisionalReportedAmount;
      }
      break;
    case 'AS':
      reportingValueUnit_code = 'stocks';
      // Realistic value: millions to billions
      provisionalReportedAssetsStocks = faker.number.float({ min: lowerBoundAS, max: upperBoundAS, precision: 0.001 });
      if (status == 'FINALIZED' || status == 'TRANSFER_OK' || status == 'TRANSFER_FAILED') {
        finalReportedAssetsStocks = reportingValueVariance * provisionalReportedAssetsStocks;
      }
      break;
    case 'VOG':
      reportingValueUnit_code = '€';
      // Realistic value: millions to billions
      provisionalReportedValueOfGoods = faker.number.float({ min: lowerBoundVOG, max: upperBoundVOG });
      if (status == 'FINALIZED' || status == 'TRANSFER_OK' || status == 'TRANSFER_FAILED') {
        finalReportedValueOfGoods = reportingValueVariance * provisionalReportedValueOfGoods;
      }
  }

  // Construct ContractDetails object
  const contractDetails = {
    ID: ID,
    createdAt: createdAt,
    createdBy: createdBy,
    modifiedAt: modifiedAt,
    modifiedBy: modifiedBy,
    creationDate: creationDate,
    contractNo: contractNo,
    contractDescription: contractDescription,
    reportingValueType: reportingValueType,
    provisionalReportedAmount: provisionalReportedAmount,
    finalReportedAmount: finalReportedAmount,
    reportingValueUnit_code: reportingValueUnit_code,
    provisionalReportedNumberOfPersons: provisionalReportedNumberOfPersons,
    finalReportedNumberOfPersons: finalReportedNumberOfPersons,
    provisionalReportedAssetsStocks: provisionalReportedAssetsStocks,
    finalReportedAssetsStocks: finalReportedAssetsStocks,
    provisionalReportedValueOfGoods: provisionalReportedValueOfGoods,
    finalReportedValueOfGoods: finalReportedValueOfGoods,
    reportingPeriodStart: reportingPeriodStart,
    reportingPeriodEnd: reportingPeriodEnd,
    allowedDelay: allowedDelay,
    finalReportingDate: finalReportingDate,
    reportSubmissionDate: reportSubmissionDate,
    transferReportingDate: transferReportingDate,
    penaltyEndorsement: penaltyEndorsement,
    contractDetailStatus: status,
    timezone: timezone,
    insuranceContract_ID: contract.ID,
  };

  // Generate suitable emails depending on status
  const emails = eg.genEmails(contract, contractDetails);
  
  // Return the fake InsuranceContractDetails object, as well as the emails array
  return [contractDetails, emails];
}