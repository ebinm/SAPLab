const { faker } = require('@faker-js/faker');
const eg = require('./email_gen');

/**
 * Generates one fake ContractDetails object
 * @param {InsuranceContract} contract - The InsuranceContract the ContractDetails object is associated with
 * @returns {ContractDetails} Returns one fake ContractDetails object.
 */
exports.genContractDetails = function generateContractDetails(contract) {
  const now = new Date();

  // Fake attributes of ContractDetails entity
  const ID = faker.string.uuid();
  const createdAt = faker.date.between({ from: contract.createdAt, to: now });
  const createdBy = faker.string.uuid();
  const modifiedAt = faker.date.between({ from: createdAt, to: now });
  // For simplicity: modifying user is the same as the creating user
  const modifiedBy = createdBy;
  const creationDate = createdAt.toString();
  // TODO make contractNo unique
  const contractNo = faker.number.int({ min: 100000, max: 999999 }).toString();
  const contractDescription = faker.company.buzzPhrase();
  // Assume that the allowed delay is 2 weeks
  const allowedDelay = 14;
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
    const random_int = faker.number.int({min: 1, max: 10});

    // Set neutral status to roughly 10 % for a more meaningful dashboard
    if (random_int == 1) {
      status = faker.helpers.arrayElement(['TEMPORARY', 'NEW_IN_PROCESS']);

      // Reporting period is in the future
      reportingPeriodStart = faker.date.between({ from: now, to: faker.date.soon() });
      // Assume that each reporting period is 30 days long
      reportingPeriodEnd = new Date(reportingPeriodStart.setDate(reportingPeriodStart.getDate() + 30));
      finalReportingDate = new Date(reportingPeriodEnd.setDate(reportingPeriodEnd.getDate() + allowedDelay));
    } else {
      status = faker.helpers.arrayElement(['FINALIZED', 'NOTIFIED', 'NOTIFIED_FAILED', 'TRANSFER_OK', 'TRANSFER_FAILED']);

      // Reporting period is active or in the past
      reportingPeriodStart = faker.date.between({ from: createdAt, to: now });
      // Assume that each reporting period is 30 days long
      reportingPeriodEnd = new Date(reportingPeriodStart);
      reportingPeriodEnd.setDate(reportingPeriodEnd.getDate() + 30);
      finalReportingDate = new Date(reportingPeriodEnd);
      finalReportingDate.setDate(finalReportingDate.getDate() + allowedDelay);
    
      if (status == 'FINALIZED' || status == 'TRANSFER_OK' || status == 'TRANSFER_FAILED') {
        // Penalize some ContractDetails in the past
        if (random_int > 7 && finalReportingDate < now) {
          penaltyEndorsement = true;
          reportSubmissionDate = faker.date.between({ from: finalReportingDate, to: now }).toLocaleDateString();
        } else {
          // Make sure that the submission date is never set in the future
          if (now <= finalReportingDate) {
            reportSubmissionDate = faker.date.between({ from: reportingPeriodStart, to: now }).toLocaleDateString();
          } else {
            reportSubmissionDate = faker.date.between({ from: reportingPeriodStart, to: finalReportingDate }).toLocaleDateString();
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
  // TODO provisional values should normally be closer to final?
  reportingValueType = faker.helpers.arrayElement(['NOP', 'R', 'AS', 'VOG']);
  switch (reportingValueType) {
    case 'NOP':
      reportingValueUnit_code = 'persons';
      // Realistic value: 2-3 digits
      provisionalReportedNumberOfPersons = faker.number.int({ min: 10, max: 999 });
      if (status == 'FINALIZED' || status == 'TRANSFER_OK' || status == 'TRANSFER_FAILED') {
        finalReportedNumberOfPersons = faker.number.int({ min: 10, max: 999 });
      }
      break;
    case 'R':
      reportingValueUnit_code = '€';
      // Highest value: millions to billions, in 100000 steps
      provisionalReportedAmount = Math.round(faker.number.float({ min: 1000000, max: 100000000000})/100000)*100000;
      if (status == 'FINALIZED' || status == 'TRANSFER_OK' || status == 'TRANSFER_FAILED') {
        finalReportedAmount = faker.number.float({ min: 0, max: 100000000, precision: 0.01 });
      }
      break;
    case 'AS':
      reportingValueUnit_code = 'stocks';
      // Realistic value: millions to billions
      provisionalReportedAssetsStocks = faker.number.float({ min: 1000000, max: 10000000000, precision: 0.001 });
      if (status == 'FINALIZED' || status == 'TRANSFER_OK' || status == 'TRANSFER_FAILED') {
        finalReportedAssetsStocks = faker.number.float({ min: 0, max: 10000000, precision: 0.001 });
      }
      break;
    case 'VOG':
      reportingValueUnit_code = '€';
      // Realistic value: millions to billions
      provisionalReportedValueOfGoods = faker.number.float({ min: 1000000, max: 10000000000, precision: 0.01 });
      if (status == 'FINALIZED' || status == 'TRANSFER_OK' || status == 'TRANSFER_FAILED') {
        finalReportedValueOfGoods = faker.number.float({ min: 0, max: 10000000, precision: 0.01 });
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

  // Generate suitable email depending on status
  // TODO multiple depending on status
  const emails = eg.genEmail(contract, contractDetails);
  
  // Return the fake InsuranceContractDetails object, as well as the emails array
  return [contractDetails, emails];
}