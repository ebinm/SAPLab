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

        this.on('resetDatabase', async function onResetDatabase(request) {
            console.log('Resetting database, dumping data...');
            
            try {
                await DELETE.from(Emails);
                await DELETE.from(ContractDetails);
                await DELETE.from(InsuranceContract);

                console.log('Done.');
            } catch (error) {
                return request.error('Error resetting database:', error);
            }
        });

        // TODO boilerplate code? @Simon
        this.on('generateContracts', async function test() {
            console.log('Generating data for ' + 7 + ' contracts...');
            const testData = gen.genData(7);
            console.log('Inserting generated data into database...');
            try {
                await INSERT.into(InsuranceContract).entries(testData[0]);
                await INSERT.into(ContractDetails).entries(testData[1]);
                await INSERT.into(Emails).entries(testData[2]);
                console.log('Done.');
            } catch (error) {
                return console.error('Error inserting data:', error);
            }
            console.log('Done.');
            return "Successfully Generated 7 Contracts";
        });
        
        return super.init();
    }
}

module.exports = TestDataService