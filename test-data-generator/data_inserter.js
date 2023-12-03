import cds from '@sap/cds'
import { generateContracts } from './srv/scripts/testdata_gen.js'

/**
 * This function (when it finally works) should insert our generated data into our in-memory db
 * for debugging purposes
 */
async function insertTestData() {
    // Generate 1 InsuranceContract with 1 InsuranceContractDetails object
    const testData = generateContracts(1, 1);

    try {
      // TODO How to connect to my local database??? 
      // It does not recognize my declared entities from schema.cds
      const srv = await cds.connect.to('db')
      // If that would work, my InsuranceContract and InsuranceContractDetails would be printed here
      console.log(srv.entities);

      // Insert our data into the corresponding declared entity from schema.cds
      const { InsuranceContract, InsuranceContractDetails } = srv.entities;
      await srv.run(INSERT.into(InsuranceContract).entries(testData[0]));
      await srv.run(INSERT.into(InsuranceContractDetails).entries(testData[0]))
      console.log('Data inserted successfully into the database.');
    } catch (error) {
      console.error('Error inserting data:', error);
    }
  };

insertTestData();