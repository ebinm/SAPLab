import { faker } from '@faker-js/faker'

/**
 * Generates one fake InsuranceContractDetail object
 * @returns {InsuranceContractDetail} Returns one fake InsuranceContractDetail object.
 */
export function generateContractDetail(contract) {
  const now = new Date();

  // Fake attributes of InsuranceContractDetail entity
  const ID = faker.string.uuid();
  const createdAt = faker.date.between({ from: contract.createdAt, to: now });
  const createdBy = faker.string.uuid();
  const modifiedAt = faker.date.between({ from: createdAt, to: now });
  // For simplicity: modifying user is the same as the creating user
  const modifiedBy = createdBy;
  // TODO creationDate vs. createdAt
  const creationDate = createdAt.toString();
  // TODO make contractNo unique
  const contractNo = faker.number.int({ min: 100000, max: 999999 }).toString();
  const contractDescription = faker.company.buzzPhrase();
  const reportingPeriodStart = faker.date.between({ from: createdAt, to: faker.date.soon() });
  // Assume that each reporting period is 30 days long
  const reportingPeriodEnd = new Date(reportingPeriodStart.setDate(reportingPeriodStart.getDate() + 30))
  // Assume that the allowed delay is 2 weeks
  const allowedDelay = 14;
  const finalReportingDate = new Date(reportingPeriodEnd.setDate(reportingPeriodEnd.getDate() + allowedDelay));
  const timezone = 'CEST';
  // TODO
  const penaltyEndorsement = false;

  // Set status and the respective submission/transfer date accordingly
  // 1. Set all values to null first
  // 2. Depending on the randomly selected contractDetailStatus, reassign the corresponding values
  let status = null;
  let reportSubmissionDate = null;
  let transferReportingDate = null;

  if (contract.policyStatus == 'REVERSED') {
    // All contract details are 'CANCELED' if the contract ifself is 'REVERSED'
    status = 'CANCELED';
  } else if (now < reportingPeriodStart) {
    // Reporting period is in the future
    status = faker.helpers.arrayElement(['TEMPORARY', 'NEW_IN_PROCESS']);

    // TODO reset final report values
  } else if (reportingPeriodStart <= now && now <= reportingPeriodEnd) {
    // Reporting period is currently active
    status = faker.helpers.arrayElement(['FINALIZED', 'NOTIFIED', 'NOTIFIED_FAILED', 'TRANSFER_OK', 'TRANSFER_FAILED']);

    if (status == 'FINALIZED' || status == 'TRANSFER_OK' || status == 'TRANSFER_FAILED') {
      reportSubmissionDate = faker.date.between({ from: reportingPeriodStart, to: now });

      if (status == 'TRANSFER_OK') {
        // Only set transfer date if transfer was successful
        transferReportingDate = faker.date.between({ from: reportSubmissionDate, to: now });
      }
    }
  } else {
    // Reporting period is in the past
    status = faker.helpers.arrayElement(['FINALIZED', 'TRANSFER_FAILED', 'TRANSFER_OK', 'REMINDED', 'REMINDED_FAILED'])

    if (status == 'FINALIZED' || status == 'TRANSFER_OK' || status == 'TRANSFER_FAILED') {
      // Report submitted
      reportSubmissionDate = faker.date.between({ from: reportingPeriodStart, to: reportingPeriodEnd });

      if (status == 'TRANSFER_OK') {
        // Only set transfer date if transfer was successful
        transferReportingDate = faker.date.between({ from: reportSubmissionDate, to: reportingPeriodEnd });
      }
    }
  }

  // TODO REVERSED status?

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
      // NOP does not require precision as there can only be complete people
      provisionalReportedNumberOfPersons = faker.number.float({ min: 100, max: 100000 });
      if (status == 'FINALIZED' || status == 'TRANSFER_OK' || status == 'TRANSFER_FAILED') {
        finalReportedNumberOfPersons = faker.number.float({ min: 100, max: 100000 });
      }
      break;
    case 'R':
      reportingValueUnit_code = '€';
      provisionalReportedAmount = faker.number.float({ min: 0, max: 100000000, precision: 0.01 });
      if (status == 'FINALIZED' || status == 'TRANSFER_OK' || status == 'TRANSFER_FAILED') {
        finalReportedAmount = faker.number.float({ min: 0, max: 100000000, precision: 0.01 });
      }
      break;
    case 'AS':
      reportingValueUnit_code = 'stocks';
      provisionalReportedAssetsStocks = faker.number.float({ min: 0, max: 10000000, precision: 0.001 });
      if (status == 'FINALIZED' || status == 'TRANSFER_OK' || status == 'TRANSFER_FAILED') {
        finalReportedAssetsStocks = faker.number.float({ min: 0, max: 10000000, precision: 0.001 });
      }
      break;
    case 'VOG':
      reportingValueUnit_code = '€';
      provisionalReportedValueOfGoods = faker.number.float({ min: 0, max: 10000000, precision: 0.01 });
      if (status == 'FINALIZED' || status == 'TRANSFER_OK' || status == 'TRANSFER_FAILED') {
        finalReportedValueOfGoods = faker.number.float({ min: 0, max: 10000000, precision: 0.01 });
      }
  }

  // TODO mail generator

  // Construct and return the fake InsuranceContractDetails object
  return {
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
    // emails: [],
    timezone: timezone,
  }
}
