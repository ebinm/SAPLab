const cg = require('./generators/contract_gen');
const cdg = require('./generators/contract_details_gen');
const { faker } = require('@faker-js/faker');

/**
 * Generates the desired number of fake InsuranceContract objects with a random number of ContractDetails and Mail objects
 * @param {int} contractCount - A param specifying the desired count of to be generated InsuranceContract objects
 * @returns {Array} Returns a 2D-array containing an InsuranceContract array, a ContractDetails array and a Mail array.
 */
exports.genData = function generateData(contractCount) {
    const fakeContracts = [];
    const fakeContractDetails = [];
    const fakeMails = [];

    for (let i = 0; i < contractCount; i++) {
        const contract = cg.genContract();
        fakeContracts.push(contract);

        // Only create ContractDetails if the contract is not INACTIVE
        if (contract.policyStatus != 'INACTIVE') {
            // Create between 1 and 10 ContractDetails per Contract
            const contractDetailsCount = faker.number.int({ min: 1, max: 10})
            for (let n = 0; n < contractDetailsCount; n++) {
                fakeContractDetails.push(cdg.genContractDetails(contract))
                // TODO fake mails
            }
        }
    }

    return [fakeContracts, fakeContractDetails, fakeMails]
}