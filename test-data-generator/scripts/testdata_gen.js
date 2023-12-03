import { generateInsuranceContract } from './generators/contract_gen.js'
import { generateContractDetail } from './generators/contract_details_gen.js'

/**
 * Generates the desired number of fake InsuranceContract objects with its corresponding 
 * InsuranceContractDetails and Mails objects
 * @param {int} count - A param specifying the desired count of InsuranceContract objects
 * @returns {Array} Returns a 2D-array containing an InsuranceContract array, 
 * an InsuranceContractDetail array and a Mail array.
 */
function generateContracts(contractCount, detailsCount) {
    const fakeContracts = [];
    const fakeContractDetails = [];
    const fakeMails = [];

    for (let i = 0; i < contractCount; i++) {
        const contract = generateInsuranceContract();
        fakeContracts.push(contract);
        for (let n = 0; n < detailsCount; n++) {
            fakeContractDetails.push(generateContractDetail(contract))
            // TODO mails
        }
    }

    return [fakeContracts, fakeContractDetails, fakeMails]
}

console.log(generateContracts(2, 1));