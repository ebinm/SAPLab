import cds from '@sap/cds';

class TestDataService extends cds.ApplicationService {
    init() {
        const { InsuranceContract } = this.entities('generator');

        return super.init();
    }
}

module.exports = TestDataService