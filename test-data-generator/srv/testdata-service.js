const cds = require('@sap/cds');
const gen = require('./scripts/testdata_gen');

// Service Implementation
class TestDataService extends cds.ApplicationService {
    init() {
        // Get the entity definitions from the db/schema.cds file to interact with the database
        const { InsuranceContract } = cds.entities;

         // Generate test data and insert it into database
        this.on('generate', async function onGenerate(request) {
            console.log('Generating test data...');
            const testData = gen.genData(1, 1);

            console.log('Inserting test data into database...');
            try {
                await INSERT.into(InsuranceContract).entries(testData[0]);
            } catch (error) {
                return request.error('Error inserting data:', error);
            }
        });

        return super.init();
    }
}

module.exports = TestDataService