const { faker } = require("@faker-js/faker");
const cg = require("./generators/contract_gen");
const cdg = require("./generators/contract_details_gen");

/**
 * Generates the desired number of fake InsuranceContract objects with a random number of ContractDetails and Mail objects
 * @param {GenerationParameters} parameters - An object which holds all params necessary for data generation
 * @returns {Array} Returns a 2D-array containing an InsuranceContract array, a ContractDetails array and a Mail array.
 */
exports.genData = function generateData(parameters) {
  const fakeContracts = [];
  const fakeContractDetails = [];
  const fakeEmails = [];

  for (let i = 0; i < parameters.contractCount; i++) {
    const contract = cg.genContract(parameters);
    fakeContracts.push(contract);

    // Only create ContractDetails/Emails if the contract is not INACTIVE
    if (contract.policyStatus != "INACTIVE") {
      // Create a customizable number of ContractDetails per Contract
      const contractDetailsCount = faker.number.int({
        min: parameters.lowerBoundContractDetailsCount,
        max: parameters.upperBoundContractDetailsCount,
      });
      for (let n = 0; n < contractDetailsCount; n++) {
        const result = cdg.genContractDetails(contract, parameters);
        fakeContractDetails.push(result[0]);
        fakeEmails.push(...result[1]);
      }
    }
  }

  return [fakeContracts, fakeContractDetails, fakeEmails];
};
