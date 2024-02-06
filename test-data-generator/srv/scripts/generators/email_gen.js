const { faker } = require("@faker-js/faker");

/**
 * Generates one or more fake Email objects
 * @param {InsuranceContract} contract - The InsuranceContract the Email object is associated with
 * @param {ContractDetails} contractDetails - The ContractDetails the Email object is associated with
 * @param {GenerationParameters} parameters - An object which olds all params necessary for data generation
 * @returns {Array} Returns an array with one or more fake Email objects.
 */
exports.genEmails = function generateEmails(
  contract,
  contractDetails,
  parameters
) {
  const fakeEmails = [];

  let lastEmailDate = contractDetails.reportingPeriodStart;

  const now = new Date();
  // Only create Emails if reportingPeriodStart is in past
  if (lastEmailDate < now) {
    // Generate emails for client information changes
    let random = faker.number.float();
    if (random < parameters.clientChangesEmailProb) {
      fakeEmails.push(
        generateEmail(
          "UPDATE",
          "COMPLETE",
          lastEmailDate,
          contract,
          contractDetails
        )
      );
    }
    random = faker.number.float();
    if (random < parameters.clientChangesEmailProb) {
      fakeEmails.push(
        generateEmail(
          "UPDATE_CLIENT",
          "COMPLETE",
          lastEmailDate,
          contract,
          contractDetails
        )
      );
    }
    random = faker.number.float();
    if (random < parameters.clientChangesEmailProb) {
      fakeEmails.push(
        generateEmail(
          "REINSTATED",
          "COMPLETE",
          lastEmailDate,
          contract,
          contractDetails
        )
      );
    }

    // Determine email types based on ContractDetails status
    if (
      contractDetails.contractDetailStatus == "CANCELED" ||
      contractDetails.contractDetailStatus == "REVERSED"
    ) {
      fakeEmails.push(
        generateEmail(
          "REVERSED",
          faker.helpers.arrayElement([
            "WAITING",
            "COMPLETE",
            "FAILED",
            "RESENT",
          ]),
          lastEmailDate,
          contract,
          contractDetails
        )
      );
    } else if (
      contractDetails.contractDetailStatus == "NOTIFIED" ||
      contractDetails.contractDetailStatus == "NOTIFIED_FAILED"
    ) {
      var emailDispatchStatus = "";
      if (contractDetails.contractDetailStatus == "NOTIFIED_FAILED") {
        emailDispatchStatus = "FAILED";
      } else {
        emailDispatchStatus = faker.helpers.arrayElement([
          "WAITING",
          "COMPLETE",
          "RESENT",
        ]);
      }

      fakeEmails.push(
        generateEmail(
          "NOTIFICATION",
          emailDispatchStatus,
          lastEmailDate,
          contract,
          contractDetails
        )
      );
    } else if (
      contractDetails.contractDetailStatus == "REMINDED" ||
      contractDetails.contractDetailStatus == "REMINDED_FAILED"
    ) {
      // REMINDER emails are always preceded by NOTIFICATION emails
      fakeEmails.push(
        generateEmail(
          "NOTIFICATION",
          faker.helpers.arrayElement(["RESENT", "COMPLETE"]),
          lastEmailDate,
          contract,
          contractDetails
        )
      );
      lastEmailDate = fakeEmails[fakeEmails.length - 1].sentDateTime;

      var emailDispatchStatus = "";
      if (contractDetails.contractDetailStatus == "REMINDED_FAILED") {
        emailDispatchStatus = "FAILED";
      } else {
        emailDispatchStatus = faker.helpers.arrayElement([
          "WAITING",
          "COMPLETE",
          "RESENT",
        ]);
      }

      fakeEmails.push(
        generateEmail(
          "REMINDER",
          emailDispatchStatus,
          lastEmailDate,
          contract,
          contractDetails
        )
      );
    } else if (
      contractDetails.contractDetailStatus == "FINALIZED" ||
      contractDetails.contractDetailStatus == "TRANSFER_OK" ||
      contractDetails.contractDetailStatus == "TRANSFER_FAILED"
    ) {
      fakeEmails.push(
        generateEmail(
          "SUMMARY",
          "COMPLETE",
          contractDetails.finalReportingDate,
          contract,
          contractDetails
        )
      );
    }
  }

  return fakeEmails;
};

/**
 * Generates one fake Email object
 * @param {String} emailType - Defines the type of the generated Email should be
 * @param {String} emailDispatchStatus - Defines which dispatch status the generated Email should have
 * @param {Date} lastEmailDate - Specifies the date of the last email, if it exists
 * @param {InsuranceContract} contract - The InsuranceContract the Email object is associated with
 * @param {ContractDetails} contractDetails - The ContractDetails the Email object is associated with
 * @returns {Email} Returns one fake Email object
 */
function generateEmail(
  emailType,
  emailDispatchStatus,
  lastEmailDate,
  contract,
  contractDetails
) {
  const now = new Date();

  // Fake attributes of Mail entity
  const ID = faker.string.uuid();

  var sentDateTime;
  if (lastEmailDate < now) {
    if (emailType == "SUMMARY") {
      sentDateTime = lastEmailDate;
    } else {
      sentDateTime = faker.date.between({
        from: lastEmailDate - 1,
        to: now + 1,
      });
    }
  } else {
    sentDateTime = now;
  }

  const clientEmail = contract.clientEmail;
  const graphMailID = faker.string.uuid();

  let deliveryErrorReason = "";
  let retry = 0;

  if (emailDispatchStatus == "RESENT") {
    retry = faker.helpers.arrayElement([1, 2]);
  } else if (emailDispatchStatus == "FAILED") {
    deliveryErrorReason = faker.helpers.arrayElement([
      "Client email address is not reachable.",
      "Mail server could not be reached.",
      "Request timed out.",
    ]);
    retry = 3;
  }

  // Construct and return the fake Emails object
  return {
    ID: ID,
    sentDateTime: sentDateTime,
    EmailType: emailType,
    clientEmail: clientEmail,
    graphMailID: graphMailID,
    retry: retry,
    dispatchStatus: emailDispatchStatus,
    deliveryErrorReason: deliveryErrorReason,
    contractDetails_ID: contractDetails.ID,
  };
}
