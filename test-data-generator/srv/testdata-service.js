const cds = require('@sap/cds');
const gen = require('./scripts/testdata_gen');

// Service Implementation
class TestDataService extends cds.ApplicationService {
    init() {
        // Get the entity definitions from the db/schema.cds file to interact with the database
        const { InsuranceContract, ContractDetails, Emails } = cds.entities;

        // If generateData(contractCount) is called, generate test data and insert it into database
        this.on('generateData', async function onGenerateData(request) {
            console.log('Generating data for ' + request.data.contractCount + ' contracts...');
            const testData = gen.genData(request.data.contractCount);
            console.log('Done.');

            console.log('Inserting generated data into database...');
            try {
                await INSERT.into(InsuranceContract).entries(testData[0]);
                await INSERT.into(ContractDetails).entries(testData[1]);
                await INSERT.into(Emails).entries(testData[2]);
                console.log('Done.');
            } catch (error) {
                return request.error('Error inserting data:', error);
            }
        });

        return super.init();
    }
}

module.exports = TestDataService