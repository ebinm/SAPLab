/**
 * Section 1: Adjustable default generation parameters for InsuranceContracts
 */

// Define number of to be created InsuranceContracts
const CONTRACT_COUNT = 1000;
// Define that the created InsuranceContracts range back 10 years
const CONTRACT_CREATION_YEAR_RANGE = 10;
// Set the share of active contracts to roughly 90 %
const ACTIVE_CONTRACT_DIST = 0.9;


/**
 * Section 2: Adjustable default generation parameters for ContractDetails
 */

// Upper/lower bounds for the count of ContractDetails per InsuranceContract
const LOWERBOUND_CONTRACTDETAILS_COUNT = 2;
const UPPERBOUND_CONTRACTDETAILS_COUNT = 10;
// Define whether the ContractDetails should have failed or not
const FAILURE_PROB = 0.1;
const TIMEZONE = 'CST';
// Assume the standard of 30 days to report
const REPORTING_DURATION = 30;
// Assume two weeks of allowed reporting delay
const ALLOWED_DELAY = 14;
// Rarely make status neutral for a more meaningful dashboard
const NEUTRAL_CONTRACTS_PROB = 0.05;
// Set probability of report lateness
const LATENESS_PROB = 0.05;
// Penalize some contracts in the past
const PENALIZED_CONTRACTS_PROB = 0.7;
// Set probabilty of outliers with vast reporting value differences
const OUTLIER_PROB = 0.01;
// Variance to randomize reporting value differences
const LOWERBOUND_OUTLIER_RVALUE_VARIANCE = 0;
const UPPERBOUND_OUTLIER_RVALUE_VARIANCE = 2;
const LOWERBOUND_NORMAL_RVALUE_VARIANCE = 0.7;
const UPPERBOUND_NORMAL_RVALUE_VARIANCE = 1.3;
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
 * Section 3: Adjustable default generation parameters for Emails
 */

// Set unlikely changes with the client's ID or email address to roughly 20%
const CLIENTCHANGESEMAIL_PROB = 0.2;

module.exports = {
    OUTLIER_PROB,
    CONTRACT_COUNT,
    CONTRACT_CREATION_YEAR_RANGE,
    ACTIVE_CONTRACT_DIST,
    LOWERBOUND_CONTRACTDETAILS_COUNT,
    UPPERBOUND_CONTRACTDETAILS_COUNT,
    FAILURE_PROB,
    TIMEZONE,
    REPORTING_DURATION,
    ALLOWED_DELAY,
    LATENESS_PROB,
    NEUTRAL_CONTRACTS_PROB,
    PENALIZED_CONTRACTS_PROB,
    OUTLIER_PROB,
    LOWERBOUND_OUTLIER_RVALUE_VARIANCE,
    UPPERBOUND_OUTLIER_RVALUE_VARIANCE,
    LOWERBOUND_NORMAL_RVALUE_VARIANCE,
    UPPERBOUND_NORMAL_RVALUE_VARIANCE,
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
