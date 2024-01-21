/**
 * Adjustable default generation parameters for InsuranceContracts
 */

// Define number of to be created InsuranceContracts
const CONTRACT_COUNT = 10;
// Define that the created InsuranceContracts range back 10 years
const CONTRACT_CREATION_YEAR_RANGE = 10;
// Set the share of active contracts to roughly 80 %
const ACTIVE_CONTRACT_DIST = 0.8;


/**
 * Adjustable default generation parameters for ContractDetails
 */

// Upper/lower bounds for the count of ContractDetails per InsuranceContract
const LOWERBOUND_CONTRACTDETAILS_COUNT = 1;
const UPPERBOUND_CONTRACTDETAILS_COUNT = 10;
// Assume the standard of 30 days to report
const REPORTING_DURATION = 30;
// Assume two weeks of allowed reporting delay
const ALLOWED_DELAY = 14;
// Rarely make status neutral for a more meaningful dashboard
const NEUTRAL_CONTRACTS_PROB = 0.1;
// Penalize some contracts in the past
const NONPENALIZED_CONTRACTS_PROB = 0.7;
// Variance to avoid vast reporting value differences
const LOWERBOUND_REPORTING_VALUE_VARIANCE = 0.5;
const UPPERBOUND_REPORTING_VALUE_VARIANCE = 2.0;
// Upper/lower bounds for provisional/final values
const LOWERBOUND_NOP = 10;
const UPPERBOUND_NOP = 999;
const LOWERBOUND_R = 1000000;
const UPPERBOUND_R = 100000000000;
const LOWERBOUND_AS = 1000000;
const UPPERBOUND_AS = 10000000000;
const LOWERBOUND_VOG = 1000000;
const UPPERBOUND_VOG = 10000000000;

/**
 * Adjustable default generation parameters for Emails
 */

// Set unlikely changes with the client's ID or email address to roughly 20%
const CLIENTCHANGESEMAIL_PROB = 0.2;

module.exports = {
    CONTRACT_COUNT,
    CONTRACT_CREATION_YEAR_RANGE,
    ACTIVE_CONTRACT_DIST,
    LOWERBOUND_CONTRACTDETAILS_COUNT,
    UPPERBOUND_CONTRACTDETAILS_COUNT,
    REPORTING_DURATION,
    ALLOWED_DELAY,
    NEUTRAL_CONTRACTS_PROB,
    NONPENALIZED_CONTRACTS_PROB,
    LOWERBOUND_REPORTING_VALUE_VARIANCE,
    UPPERBOUND_REPORTING_VALUE_VARIANCE,
    LOWERBOUND_NOP,
    UPPERBOUND_NOP,
    LOWERBOUND_R,
    UPPERBOUND_R,
    LOWERBOUND_AS,
    UPPERBOUND_AS,
    LOWERBOUND_VOG,
    UPPERBOUND_VOG,
    CLIENTCHANGESEMAIL_PROB
};
