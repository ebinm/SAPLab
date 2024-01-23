const constants = require("./constants");

/**
 * Class holding all params necessary for data generation
 */
class GenerationParameters {
  // Constructor to initialize the class instance with default params or params of the request
  constructor(
    contractCount,
    contractCreationYearRange,
    activeContractProb,
    lowerBoundContractDetailsCount,
    upperBoundContractDetailsCount,
    timezone,
    reportingDuration,
    allowedDelay,
    latenessProb,
    neutralContractsProb,
    penalizedContractsProb,
    outlierProb,
    lowerBoundOutlierRValueVariance,
    upperBoundOutlierRValueVariance,
    lowerBoundNormalRValueVariance,
    upperBoundNormalRValueVariance,
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
    this.activeContractProb =
      activeContractProb ?? constants.ACTIVE_CONTRACT_DIST;
    this.lowerBoundContractDetailsCount =
      lowerBoundContractDetailsCount ??
      constants.LOWERBOUND_CONTRACTDETAILS_COUNT;
    this.upperBoundContractDetailsCount =
      upperBoundContractDetailsCount ??
      constants.UPPERBOUND_CONTRACTDETAILS_COUNT;
    this.timezone = timezone ?? constants.TIMEZONE;
    this.reportingDuration = reportingDuration ?? constants.REPORTING_DURATION;
    this.allowedDelay = allowedDelay ?? constants.ALLOWED_DELAY;
    this.latenessProb = latenessProb ?? constants.LATENESS_PROB;
    this.neutralContractsProb =
      neutralContractsProb ?? constants.NEUTRAL_CONTRACTS_PROB;
    this.penalizedContractsProb =
      penalizedContractsProb ?? constants.PENALIZED_CONTRACTS_PROB;
    this.outlierProb = outlierProb ?? constants.OUTLIER_PROB;
    this.lowerBoundOutlierRValueVariance =
      lowerBoundOutlierRValueVariance ??
      constants.LOWERBOUND_OUTLIER_RVALUE_VARIANCE;
    this.upperBoundOutlierRValueVariance =
      upperBoundOutlierRValueVariance ??
      constants.UPPERBOUND_OUTLIER_RVALUE_VARIANCE;
    this.lowerBoundNormalRValueVariance =
      lowerBoundNormalRValueVariance ??
      constants.LOWERBOUND_NORMAL_RVALUE_VARIANCE;
    this.upperBoundNormalRValueVariance =
      upperBoundNormalRValueVariance ??
      constants.UPPERBOUND_NORMAL_RVALUE_VARIANCE;
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
    if (
      this.outlierProb < 0 ||
      this.outlierProb > 1 ||
      this.activeContractProb < 0 ||
      this.activeContractProb > 1 ||
      this.neutralContractsProb < 0 ||
      this.neutralContractsProb > 1 ||
      this.latenessProb < 0 ||
      this.latenessProb > 1 ||
      this.penalizedContractsProb < 0 ||
      this.penalizedContractsProb > 1 ||
      this.clientChangesEmailProb < 0 ||
      this.clientChangesEmailProb > 1
    ) {
      return "All probabilities must be in the range [0, 1]!";
    }
    if (
      this.lowerBoundContractDetailsCount >=
        this.upperBoundContractDetailsCount ||
      this.lowerBoundNormalRValueVariance >=
        this.upperBoundNormalRValueVariance ||
      this.lowerBoundOutlierRValueVariance >=
        this.upperBoundOutlierRValueVariance ||
      this.lowerBoundNOP >= this.upperBoundNOP ||
      this.lowerBoundR >= this.upperBoundR ||
      this.lowerBoundAS >= this.upperBoundAS ||
      this.lowerBoundVOG >= this.upperBoundVOG
    ) {
      return "The lower bound should never be greater/equal than the upper bound!";
    } else if (
      this.lowerBoundContractDetailsCount < 0 ||
      this.lowerBoundNormalRValueVariance < 0 ||
      this.lowerBoundOutlierRValueVariance < 0 ||
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
    if (this.allowedDelay <= 0) {
      return "The allowed delay must be a positive number of days!";
    }

    return "";
  }

  displayParameters() {
    console.log(`
      * Contract count: ${this.contractCount}
      * Contract Creation Year Range: ${this.contractCreationYearRange}
      * Active Contracts Distribution: ${this.activeContractProb}
      * Lower Bound Contract Details Count: ${this.lowerBoundContractDetailsCount}
      * Upper Bound Contract Details Count: ${this.upperBoundContractDetailsCount}
      * Timezone: ${this.timezone}
      * Reporting Duration: ${this.reportingDuration}
      * Allowed Delay: ${this.allowedDelay}
      * Lateness Probability: ${this.latenessProb}
      * Neutral Contracts Probability: ${this.neutralContractsProb}
      * Penalized Contracts Probability: ${this.penalizedContractsProb}
      * Outlier Probability: ${this.outlierProb}
      * Lower Bound Outlier Reporting Value Variance: ${this.lowerBoundOutlierRValueVariance}
      * Upper Bound Outlier Reporting Value Variance: ${this.upperBoundOutlierRValueVariance}
      * Lower Bound Normal Reporting Value Variance: ${this.lowerBoundNormalRValueVariance}
      * Upper Bound Normal Reporting Value Variance: ${this.upperBoundNormalRValueVariance}
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
