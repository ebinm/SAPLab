const cg = require('./generators/contract_gen');
const cdg = require('./generators/contract_details_gen');

/**
 * Generates the desired number of fake InsuranceContract objects with its corresponding 
 * InsuranceContractDetails and Mails objects
 * @param {int} contractCount - A param specifying the desired count of InsuranceContract objects
 * @param {int} detailsCount - A param specifying the desired count of InsuranceContractDetails objects for each InsuranceContract
 * @returns {Array} Returns a 2D-array containing an InsuranceContract array, an InsuranceContractDetail array and a Mail array.
 */
exports.genData = function generateData(contractCount, detailsCount) {
    const fakeContracts = [];
    const fakeContractDetails = [];
    const fakeMails = [];

    for (let i = 0; i < contractCount; i++) {
        const contract = cg.genContract();
        fakeContracts.push(contract);
        for (let n = 0; n < detailsCount; n++) {
            fakeContractDetails.push(cdg.genContractDetails(contract))
            // TODO mails
        }
    }

    return [fakeContracts, fakeContractDetails, fakeMails]
}