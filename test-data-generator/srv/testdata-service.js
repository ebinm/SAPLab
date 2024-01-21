const cds = require("@sap/cds");
const gen = require("./scripts/testdata_gen");
const GenerationParameters = require("./util/generation_parameters");

/**
 * Service Implementation
 */
class TestDataService extends cds.ApplicationService {
  init() {
    // Get the entity definitions from the db/schema.cds file to interact with the database
    const { InsuranceContract, ContractDetails, Emails } = cds.entities;

    // If generateData(contractCount) is called, generate test data and insert it into database
    this.on("generateData", async function onGenerateData(request) {
      // Collect all request parameters in GenerationParameters class
      const parameters = new GenerationParameters(
        request.data.contractCount,
        request.data.contractCreationYearRange,
        request.data.activeContractDist,
        request.data.lowerBoundContractDetailsCount,
        request.data.upperBoundContractDetailsCount,
        request.data.reportingDuration,
        request.data.allowedDelay,
        request.data.neutralContractsProb,
        request.data.nonPenalizedContractsProb,
        request.data.lowerBoundReportingValueVariance,
        request.data.upperBoundReportingValueVariance,
        request.data.lowerBoundNOP,
        request.data.upperBoundNOP,
        request.data.lowerBoundR,
        request.data.upperBoundR,
        request.data.lowerBoundAS,
        request.data.upperBoundAS,
        request.data.lowerBoundVOG,
        request.data.upperBoundVOG,
        request.data.clientChangesEmailProb,
      );

      console.log("Validating input parameters...");
      var validatingError = parameters.validateParameters();
      if (validatingError != "") {
        // Return 400 BAD REQUEST if parameters are wrong
        return request.error(400, validatingError);
      }

      console.log("Generating data with the following parameters...");
      parameters.displayParameters();

      var testData = [];
      try {
        testData = gen.genData(parameters);
      } catch (error) {
        return request.error(`Error generating data! ${error.message}`);
      }

      console.log("Inserting generated data into database...");
      try {
        // Only attempt insert if there is something to insert
        if (testData[0].length != 0) {
          await INSERT.into(InsuranceContract).entries(testData[0]);
        }
        if (testData[1].length != 0) {
          await INSERT.into(ContractDetails).entries(testData[1]);
        }
        if (testData[2].length != 0) {
          await INSERT.into(Emails).entries(testData[2]);
        }

        return request.reply(
          `Successfully generated ${testData[0].length} InsuranceContracts, ${testData[1].length} ContractDetails and ${testData[2].length} Emails.`
        );
      } catch (error) {
        return request.error(`Error inserting data! ${error.message}`);
      }
    });

    // If resetDatabase() is called, clean the database by deleting all data
    this.on("resetDatabase", async function onResetDatabase(request) {
      console.log("Resetting database, dumping data...");

      try {
        await DELETE.from(Emails);
        await DELETE.from(ContractDetails);
        await DELETE.from(InsuranceContract);

        return request.reply("Successfully dumped the database.");
      } catch (error) {
        return request.error("Error resetting database:", error);
      }
    });

    return super.init();
  }
}

module.exports = TestDataService;
