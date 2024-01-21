const constants = require("./constants");

/**
 * Class holding all params necessary for data generation
 */
class GenerationParameters {
  // Constructor to initialize the class instance with default params or params of the request
  constructor(
    contractCount,
    contractCreationYearRange,
    activeContractDist,
    lowerBoundContractDetailsCount,
    upperBoundContractDetailsCount,
    reportingDuration,
    allowedDelay,
    neutralContractsProb,
    nonPenalizedContractsProb,
    lowerBoundReportingValueVariance,
    upperBoundReportingValueVariance,
    lowerBoundNOP,
    upperBoundNOP,
    lowerBoundR,
    upperBoundR,
    lowerBoundAS,
    upperBoundAS,
    lowerBoundVOG,
    upperBoundVOG,
    clientChangesEmailProb
  ) {
    this.contractCount = contractCount ?? constants.CONTRACT_COUNT;
    this.contractCreationYearRange =
      contractCreationYearRange ?? constants.CONTRACT_CREATION_YEAR_RANGE;
    this.activeContractDist =
      activeContractDist ?? constants.ACTIVE_CONTRACT_DIST;
    this.lowerBoundContractDetailsCount =
      lowerBoundContractDetailsCount ??
      constants.LOWERBOUND_CONTRACTDETAILS_COUNT;
    this.upperBoundContractDetailsCount =
      upperBoundContractDetailsCount ??
      constants.UPPERBOUND_CONTRACTDETAILS_COUNT;
    this.reportingDuration = reportingDuration ?? constants.REPORTING_DURATION;
    this.allowedDelay = allowedDelay ?? constants.ALLOWED_DELAY;
    this.neutralContractsProb =
      neutralContractsProb ?? constants.NEUTRAL_CONTRACTS_PROB;
    this.nonPenalizedContractsProb =
      nonPenalizedContractsProb ?? constants.NONPENALIZED_CONTRACTS_PROB;
    this.lowerBoundReportingValueVariance =
      lowerBoundReportingValueVariance ??
      constants.LOWERBOUND_REPORTING_VALUE_VARIANCE;
    this.upperBoundReportingValueVariance =
      upperBoundReportingValueVariance ??
      constants.UPPERBOUND_REPORTING_VALUE_VARIANCE;
    this.lowerBoundNOP = lowerBoundNOP ?? constants.LOWERBOUND_NOP;
    this.upperBoundNOP = upperBoundNOP ?? constants.UPPERBOUND_NOP;
    this.lowerBoundR = lowerBoundR ?? constants.LOWERBOUND_R;
    this.upperBoundR = upperBoundR ?? constants.UPPERBOUND_R;
    this.lowerBoundAS = lowerBoundAS ?? constants.LOWERBOUND_AS;
    this.upperBoundAS = upperBoundAS ?? constants.UPPERBOUND_AS;
    this.lowerBoundVOG = lowerBoundVOG ?? constants.LOWERBOUND_VOG;
    this.upperBoundVOG = upperBoundVOG ?? constants.UPPERBOUND_VOG;
    this.clientChangesEmailProb =
      clientChangesEmailProb ?? constants.CLIENTCHANGESEMAIL_PROB;
  }

  // Validates the input given in the request
  validateParameters() {
    if (this.contractCount <= 0) {
      return "The count of to be generated contracts must not be (below) zero!";
    }
    if (this.contractCreationYearRange <= 0) {
      return "The range of the generated contract creation years must be positive!";
    } else if (this.contractCreationYearRange >= 50) {
      return "The year range of the generated contract creation dates must be realistic! (< 50 years)";
    }
    if (this.activeContractDist < 0 || this.activeContractDist > 1 ||
      this.neutralContractsProb < 0 || this.neutralContractsProb > 1 ||
      this.nonPenalizedContractsProb < 0 || this.nonPenalizedContractsProb > 1 ||
      this.clientChangesEmailProb < 0 || this.clientChangesEmailProb > 1) {
      return "All probabilities must be in the range [0, 1]!";
    }
    if (
      this.lowerBoundContractDetailsCount >=
        this.upperBoundContractDetailsCount ||
      this.lowerBoundReportingValueVariance >= this.upperBoundReportingValueVariance ||
      this.lowerBoundNOP >= this.upperBoundNOP ||
      this.lowerBoundR >= this.upperBoundR ||
      this.lowerBoundAS >= this.upperBoundAS ||
      this.lowerBoundVOG >= this.upperBoundVOG
    ) {
      return "The lower bound should never be greater/equal than the upper bound!";
    } else if (
      this.lowerBoundContractDetailsCount < 0 ||
      this.lowerBoundReportingValueVariance < 0 ||
      this.lowerBoundNOP < 0 ||
      this.lowerBoundR < 0 ||
      this.lowerBoundAS < 0 ||
      this.lowerBoundVOG < 0
    ) {
      return "The lower bound should never be below zero!";
    }
    if (this.reportingDuration <= 0) {
      return "The reporting duration must be a positive number of days!";
    }
    if (this.allowedDelay = 0) {
      return "The allowed delay must be zero or a positive number of days!";
    }

    return "";
  }

  displayParameters() {
    console.log(`
      * Contract count: ${this.contractCount}
      * Contract Creation Year Range: ${this.contractCreationYearRange}
      * Active Contracts Distribution: ${this.activeContractDist}
      * Lower Bound Contract Details Count: ${this.lowerBoundContractDetailsCount}
      * Upper Bound Contract Details Count: ${this.upperBoundContractDetailsCount}
      * Reporting Duration: ${this.reportingDuration}
      * Allowed Delay: ${this.allowedDelay}
      * Neutral Contracts Probability: ${this.neutralContractsProb}
      * Non-Penalized Contracts Probability: ${this.nonPenalizedContractsProb}
      * Lower Bound Reporting Value Variance: ${this.lowerBoundReportingValueVariance}
      * Upper Bound Reporting Value Variance: ${this.upperBoundReportingValueVariance}
      * Lower Bound NOP: ${this.lowerBoundNOP}
      * Upper Bound NOP: ${this.upperBoundNOP}
      * Lower Bound R: ${this.lowerBoundR}
      * Upper Bound R: ${this.upperBoundR}
      * Lower Bound AS: ${this.lowerBoundAS}
      * Upper Bound AS: ${this.upperBoundAS}
      * Lower Bound VOG: ${this.lowerBoundVOG}
      * Upper Bound VOG: ${this.upperBoundVOG}
      * Client Changes Email Prob: ${this.clientChangesEmailProb}`);
  }
}

module.exports = GenerationParameters;
