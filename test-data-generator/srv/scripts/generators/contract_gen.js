const { faker } = require("@faker-js/faker");

// Section 1: InsuranceObject generation
/**
 * Function 1.1: Generates one fake InsuranceContract object
 * @param {GenerationParameters} parameters - An object which holds all params necessary for data generation
 * @returns {InsuranceContract} Returns one fake InsuranceContract object.
 */
exports.genContract = function generateInsuranceContract(parameters) {
  const now = new Date();

  // Fake attributes of InsuranceContract entity
  const ID = faker.string.uuid();
  const createdBy = faker.string.uuid();

  // Format Date to match HANA Date format, prevents null errors
  const createdAt = faker.date
    .past({ years: parameters.contractCreationYearRange })
    .toISOString()
    .split("T")[0];
  const modifiedAt = faker.date
    .between({ from: createdAt, to: now })
    .toISOString()
    .split("T")[0];
  // For simplicity: modifying user is the same as the creating user
  const modifiedBy = createdBy;
  // Fake numbers starting from 100000 to ensure 6-digit policies
  const policy = faker.number.int({ min: 100000, max: 999999 }).toString();
  const insuranceID = faker.string.uuid();
  const insuranceName = faker.company.name();
  const clientID = faker.string.uuid();

  // Fake client name for 'clientName' and 'clientEmail' fields
  const clientName = faker.company.name();
  const clientEmail = faker.internet.email({ firstName: clientName });

  // Fake PolicyStatus
  let policyStatus = "";

  // Set a user-customizable percentage of InsuranceContracts to 'ACTIVE'
  const random_float = faker.number.float();
  if (random_float <= parameters.activeContractProb) {
    policyStatus = "ACTIVE";
  } else {
    policyStatus = faker.helpers.arrayElement(["INACTIVE", "REVERSED"]);
  }

  // Construct and return the fake InsuranceContract object
  return {
    ID: ID,
    createdAt: createdAt,
    createdBy: createdBy,
    modifiedAt: modifiedAt,
    modifiedBy: modifiedBy,
    policy: policy,
    insuranceID: insuranceID,
    insuranceName: insuranceName,
    clientID: clientID,
    clientName: clientName,
    clientEmail: clientEmail,
    policyStatus: policyStatus,
  };
};
