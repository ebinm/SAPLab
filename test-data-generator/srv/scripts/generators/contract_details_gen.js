const { faker } = require("@faker-js/faker");
const eg = require("./email_gen");

/**
 * Generates one fake ContractDetails object with its associated Emails
 * @param {InsuranceContract} contract - The InsuranceContract the ContractDetails object is associated with
 * @param {GenerationParameters} parameters - An object which olds all params necessary for data generation
 * @returns {Array} Returns a nested 2D array with one fake ContractDetails object and an array of one or more associated Emails
 */
exports.genContractDetails = function generateContractDetails(
  contract,
  parameters
) {
  const now = new Date();

  // Fake attributes of ContractDetails entity
  const ID = faker.string.uuid();
  const createdBy = faker.string.uuid();
  // Format Date to match HANA Date format, prevents null errors
  const createdAt = faker.date
    .between({ from: contract.createdAt, to: now })
    .toISOString()
    .split("T")[0];
  const modifiedAt = faker.date
    .between({ from: createdAt, to: now })
    .toISOString()
    .split("T")[0];
  // For simplicity: modifying user is the same as the creating user
  const modifiedBy = createdBy;
  const creationDate = createdAt.toString();
  // TODO make contractNo unique
  const contractNo = faker.number.int({ min: 100000, max: 999999 }).toString();
  const contractDescription = faker.company.buzzPhrase();
  const timezone = parameters.timezone;

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

  // Random variable for data randomization
  let random = null;

  if (contract.policyStatus == "REVERSED") {
    // If the contract ifself is 'REVERSED', the contractDetailStatus can only be 'CANCELED' or 'REVERSED'
    status = faker.helpers.arrayElement(["CANCELED", "REVERSED"]);
  } else {
    random = faker.number.float();

    if (random <= parameters.neutralContractsProb) {
      status = faker.helpers.arrayElement(["TEMPORARY", "NEW_IN_PROCESS"]);

      // Reporting period is in the future
      reportingPeriodStart = faker.date.between({
        from: now,
        to: faker.date.soon(),
      });
      reportingPeriodEnd = new Date(
        reportingPeriodStart.setDate(
          reportingPeriodStart.getDate() + parameters.reportingDuration
        )
      );
      finalReportingDate = new Date(
        reportingPeriodEnd.setDate(
          reportingPeriodEnd.getDate() + parameters.allowedDelay
        )
      );
    } else {
      random = faker.number.float();

      // Determine whether it should be late or not
      if (random <= parameters.latenessProb) {
        status = faker.helpers.arrayElement([
          "REMINDED",
          "REMINDED_FAILED",
          "NOTIFIED",
          "NOTIFIED_FAILED",
        ]);

        // Reporting period should be in the past
        finalReportingDate = faker.date.recent({ days: 14 });
        reportingPeriodEnd = new Date(finalReportingDate);
        reportingPeriodEnd.setDate(
          finalReportingDate.getDate() - parameters.allowedDelay
        );
        reportingPeriodStart = new Date(reportingPeriodEnd);
        reportingPeriodStart.setDate(
          reportingPeriodEnd.getDate() - parameters.reportingDuration
        );
      } else {
        status = faker.helpers.arrayElement([
          "FINALIZED",
          "TRANSFER_OK",
          "TRANSFER_FAILED",
        ]);

        // Reporting period is active or in the past
        reportingPeriodStart = faker.date.between({ from: createdAt, to: now });
        reportingPeriodEnd = new Date(reportingPeriodStart);
        reportingPeriodEnd.setDate(
          reportingPeriodEnd.getDate() + parameters.reportingDuration
        );
        finalReportingDate = new Date(reportingPeriodEnd);
        finalReportingDate.setDate(
          finalReportingDate.getDate() + parameters.allowedDelay
        );
      }

      if (
        status == "FINALIZED" ||
        status == "TRANSFER_OK" ||
        status == "TRANSFER_FAILED"
      ) {
        // Penalize some ContractDetails in the past
        if (
          random <= parameters.penalizedContractsProb &&
          finalReportingDate < now
        ) {
          penaltyEndorsement = true;
          reportSubmissionDate = faker.date
            .between({ from: finalReportingDate, to: now })
            .toISOString()
            .split("T")[0];
        } else {
          // Make sure that the submission date is never set in the future
          if (now <= finalReportingDate) {
            reportSubmissionDate = faker.date
              .between({ from: reportingPeriodStart, to: now })
              .toISOString()
              .split("T")[0];
          } else {
            reportSubmissionDate = faker.date
              .between({ from: reportingPeriodStart, to: finalReportingDate })
              .toISOString()
              .split("T")[0];
          }
        }

        if (status == "TRANSFER_OK") {
          // Only set transfer date if transfer was successful
          transferReportingDate = faker.date.between({
            from: reportSubmissionDate,
            to: now,
          });
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

  // Randomly determine whether the ContractDetails should be an outlier
  random = faker.number.float();
  var isOutlier = false;
  if (random > parameters.outlierProb) {
    isOutlier = true;
  }
  var reportingValueVariance;
  if (isOutlier) {
    random = faker.number.float();
    if (random > 0.5) {
      reportingValueVariance = faker.number.float({
        min: 1.0,
        max: parameters.upperBoundReportingValueVariance,
      });
    } else {
      reportingValueVariance = faker.number.float({
        min: parameters.lowerBoundReportingValueVariance,
        max: 1.0,
      });
    }
  } else {
    reportingValueVariance = faker.number.float({
      min: parameters.lowerBoundReportingValueVariance,
      max: parameters.upperBoundReportingValueVariance,
    });
  }

  // Randomly choose one ReportingValueType and set values accordingly
  reportingValueType = faker.helpers.arrayElement(["NOP", "R", "AS", "VOG"]);
  switch (reportingValueType) {
    case "NOP":
      reportingValueUnit_code = "persons";
      // Realistic value: 2-3 digits
      provisionalReportedNumberOfPersons = faker.number.int({
        min: parameters.lowerBoundNOP,
        max: parameters.upperBoundNOP,
      });
      if (
        status == "FINALIZED" ||
        status == "TRANSFER_OK" ||
        status == "TRANSFER_FAILED"
      ) {
        finalReportedNumberOfPersons = Math.round(
          reportingValueVariance * provisionalReportedNumberOfPersons
        );
      }
      break;
    case "R":
      reportingValueUnit_code = "€";
      // Highest value: millions to billions
      provisionalReportedAmount = faker.number.float({
        min: parameters.lowerBoundR,
        max: parameters.upperBoundR,
      });
      if (
        status == "FINALIZED" ||
        status == "TRANSFER_OK" ||
        status == "TRANSFER_FAILED"
      ) {
        finalReportedAmount =
          reportingValueVariance * provisionalReportedAmount;
      }
      break;
    case "AS":
      reportingValueUnit_code = "stocks";
      // Realistic value: millions to billions
      provisionalReportedAssetsStocks = faker.number.float({
        min: parameters.lowerBoundAS,
        max: parameters.upperBoundAS,
        precision: 0.001,
      });
      if (
        status == "FINALIZED" ||
        status == "TRANSFER_OK" ||
        status == "TRANSFER_FAILED"
      ) {
        finalReportedAssetsStocks =
          reportingValueVariance * provisionalReportedAssetsStocks;
      }
      break;
    case "VOG":
      reportingValueUnit_code = "€";
      // Realistic value: millions to billions
      provisionalReportedValueOfGoods = faker.number.float({
        min: parameters.lowerBoundVOG,
        max: parameters.upperBoundVOG,
      });
      if (
        status == "FINALIZED" ||
        status == "TRANSFER_OK" ||
        status == "TRANSFER_FAILED"
      ) {
        finalReportedValueOfGoods =
          reportingValueVariance * provisionalReportedValueOfGoods;
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
    allowedDelay: parameters.allowedDelay,
    finalReportingDate: finalReportingDate,
    reportSubmissionDate: reportSubmissionDate,
    transferReportingDate: transferReportingDate,
    penaltyEndorsement: penaltyEndorsement,
    contractDetailStatus: status,
    timezone: timezone,
    insuranceContract_ID: contract.ID,
  };

  // Generate suitable emails depending on status
  const emails = eg.genEmails(contract, contractDetails, parameters);

  // Return the fake InsuranceContractDetails object, as well as the emails array
  return [contractDetails, emails];
};
