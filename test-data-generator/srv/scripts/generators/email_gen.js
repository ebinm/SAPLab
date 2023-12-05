const { faker } = require('@faker-js/faker');

/**
 * Generates one fake Email object
 * @param {InsuranceContract} contract - The InsuranceContract the Email object is associated with
 * @param {ContractDetails} contractDetails - The ContractDetails the Email object is associated with
 * @returns {Email} Returns one fake Email object.
 */
exports.genEmail = function generateEmail(contract, contractDetails) {
    const now = new Date();

    // Fake attributes of Mail entity
    const ID = faker.string.uuid();
    const sentDateTime = faker.date.between({ from: contractDetails.createdAt, to: now });
    const clientEmail = contract.clientEmail;
    const graphMailID = faker.string.uuid();

    // Determine email type and dispatch status
    let emailType = '';
    let emailDispatchStatus = '';
    if (contractDetails.status == 'CANCELED' || contractDetails.status == 'REVERSED') {
        emailDispatchStatus = faker.helpers.arrayElement(['WAITING', 'COMPLETE', 'FAILED', 'RESENT']);
        emailType = 'REVERSED';
    } else if (contractDetails.status == 'FINALIZED' || contractDetails.status == 'TRANSFER_OK' || contractDetails.status == 'TRANSFER_FAILED') {
        emailDispatchStatus = faker.helpers.arrayElement(['WAITING', 'COMPLETE', 'FAILED', 'RESENT']);
        emailType = 'SUMMARY';
    } else if (contractDetails.status == 'NOTIFIED' || contractDetails.status == 'NOTIFIED_FAILED') {
        if (contractDetails.status == 'NOTIFIED_FAILED') {
            emailDispatchStatus = 'FAILED';
        } else {
            emailDispatchStatus = faker.helpers.arrayElement(['WAITING', 'COMPLETE', 'RESENT']);
        }
        emailType = 'NOTIFICATION';
    } else if (contractDetails.status == 'REMINDED' || contractDetails.status == 'REMINDED_FAILED') {
        emailDispatchStatus = '';
        if (contractDetails.status == 'REMINDED_FAILED') {
            emailDispatchStatus = 'FAILED';
        } else {
            emailDispatchStatus = faker.helpers.arrayElement(['WAITING', 'COMPLETE', 'RESENT']);
        }
        emailType = 'REMINDER';
    } else {
        emailType = faker.helpers.arrayElement(['UDPATE', 'UPDATE_CLIENT', 'REINSTATED']);
        emailDispatchStatus = faker.helpers.arrayElement(['WAITING', 'COMPLETE', 'FAILED', 'RESENT']);
    }

    let deliveryErrorReason = '';
    let retry = 0;
    // Set these attributes only if the mail dispatch has failed
    if (emailDispatchStatus == 'FAILED') {
        // TODO wider variety
        deliveryErrorReason = 'Client email address is not reachable.';
        retry = 1;
    }

    // Construct and return the fake Emails object
    return {
        ID: ID,
        sentDateTime: sentDateTime,
        EmailType: emailType,
        clientEmail: clientEmail,
        graphMailID: graphMailID,
        retry: retry,
        dispatchStatus: emailDispatchStatus,
        deliveryErrorReason: deliveryErrorReason,
        contractDetails_ID: contractDetails.ID,
    }
}