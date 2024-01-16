const { faker } = require('@faker-js/faker');

/**
 * Generates one fake InsuranceContract object
 * @returns {InsuranceContract} Returns one fake InsuranceContract object.
 */
exports.genContract = function generateInsuranceContract() {
  const now = new Date();

  // Fake attributes of InsuranceContract entity
  const ID = faker.string.uuid();
  const createdAt = faker.date.past({ years: 10 }).toISOString().split("T")[0];
  const createdBy = faker.string.uuid();
  const modifiedAt = faker.date.between({from: createdAt, to: now}).toISOString().split("T")[0];
  // For simplicity: modifying user is the same as the creating user
  const modifiedBy = createdBy;
  // Fake numbers starting from 100000 to ensure 6-digit policies
  const policy = faker.number.int({ min: 100000, max: 999999}).toString();
  const insuranceID = faker.string.uuid();
  const insuranceName = faker.company.name();
  const clientID = faker.string.uuid();

  // Fake client name for 'clientName' and 'clientEmail' fields
  const clientName = faker.company.name();
  const clientEmail = faker.internet.email({ firstName: clientName});

  // Fake PolicyStatus
  let policyStatus = '';

  // Set roughly 80 % of all contracts to 'ACTIVE'
  const random_int = faker.number.int({min: 1, max: 10});
  if (random_int <= 8) {
    policyStatus = 'ACTIVE';
  } else {
    policyStatus = faker.helpers.arrayElement(['INACTIVE', 'REVERSED']);
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
  }
}