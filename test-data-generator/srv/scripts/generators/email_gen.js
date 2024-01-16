const { faker } = require('@faker-js/faker');

/**
 * Generates one or more fake Email objects
 * @param {InsuranceContract} contract - The InsuranceContract the Email object is associated with
 * @param {ContractDetails} contractDetails - The ContractDetails the Email object is associated with
 * @returns {Array} Returns an array with one or more fake Email objects.
 */
exports.genEmails = function generateEmails(contract, contractDetails) {
    const fakeEmails = [];

    let lastEmailDate = contractDetails.createdAt;

    // Set unlikely changes with the client's ID or email address to below 20%
    let random = faker.number.float();
    if (random < 0.2) {
        fakeEmails.push(generateEmail('UPDATE', 'COMPLETE', lastEmailDate, contract, contractDetails));
        lastEmailDate = fakeEmails[fakeEmails.length - 1].sentDateTime;
    }
    random = faker.number.float();
    if (random < 0.2) {
        fakeEmails.push(generateEmail('UPDATE_CLIENT', 'COMPLETE', lastEmailDate, contract, contractDetails));
        lastEmailDate = fakeEmails[fakeEmails.length - 1].sentDateTime;
    }
    random = faker.number.float();
    if (random < 0.2) {
        fakeEmails.push(generateEmail('REINSTATED', 'COMPLETE', lastEmailDate, contract, contractDetails));
        lastEmailDate = fakeEmails[fakeEmails.length - 1].sentDateTime;
    }

    // Determine email types based on ContractDetail status
    if (contractDetails.status == 'CANCELED' || contractDetails.status == 'REVERSED') {
        fakeEmails.push(generateEmail('REVERSED',  faker.helpers.arrayElement(['WAITING', 'COMPLETE', 'FAILED', 'RESENT']), lastEmailDate, contract, contractDetails));
    } else if (contractDetails.status == 'NOTIFIED' || contractDetails.status == 'NOTIFIED_FAILED') {
        const emailDispatchStatus = '';
        if (contractDetails.status == 'NOTIFIED_FAILED') {
            emailDispatchStatus = 'FAILED';
        } else {
            emailDispatchStatus = faker.helpers.arrayElement(['WAITING', 'COMPLETE', 'RESENT']);
        }

        fakeEmails.push(generateEmail('NOTIFICATION',  emailDispatchStatus, lastEmailDate, contract, contractDetails));
    } else if (contractDetails.status == 'REMINDED' || contractDetails.status == 'REMINDED_FAILED') {
        // REMINDER emails are alwys preceded by NOTIFICATION emails
        fakeEmails.push(generateEmail('NOTIFICATION', faker.helpers.arrayElement(['RESENT', 'COMPLETE']), lastEmailDate, contract, contractDetails));
        lastEmailDate = fakeEmails[fakeEmails.length - 1].sentDateTime;
    
        const emailDispatchStatus = '';
        if (contractDetails.status == 'REMINDED_FAILED') {
            emailDispatchStatus = 'FAILED';
        } else {
            emailDispatchStatus = faker.helpers.arrayElement(['WAITING', 'COMPLETE', 'RESENT']);
        }

        fakeEmails.push(generateEmail('REMINDER', emailDispatchStatus, lastEmailDate, contract, contractDetails));
    } else if (contractDetails.status == 'FINALIZED' || contractDetails.status == 'TRANSFER_OK' || contractDetails.status == 'TRANSFER_FAILED') {
        // TODO: add reminder/notification mails
        fakeEmails.push(generateEmail('SUMMARY',  faker.helpers.arrayElement(['WAITING', 'COMPLETE', 'FAILED', 'RESENT']), lastEmailDate, contract, contractDetails));
    }

    return fakeEmails;
}

/**
 * Generates one fake Email object
 * @param {String} emailType - Defines the type of the generated Email should be
 * @param {String} emailDispatchStatus - Defines which dispatch status the generated Email should have
 * @param {Date} lastEmailDate - Specifies the date of the last email, if it exists
 * @param {InsuranceContract} contract - The InsuranceContract the Email object is associated with
 * @param {ContractDetails} contractDetails - The ContractDetails the Email object is associated with
 * @returns {Email} Returns one fake Email object
 */
function generateEmail(emailType, emailDispatchStatus, lastEmailDate, contract, contractDetails) {
    const now = new Date();

    // Fake attributes of Mail entity
    const ID = faker.string.uuid();

    const sentDateTime = faker.date.between({ from: lastEmailDate, to: now });
    const clientEmail = contract.clientEmail;
    const graphMailID = faker.string.uuid();

    let deliveryErrorReason = '';
    let retry = 0;

    if (emailDispatchStatus == 'RESENT') {
        retry = faker.helpers.arrayElement([1,2]);
    } else if (emailDispatchStatus == 'FAILED') {
        deliveryErrorReason = faker.helpers.arrayElement(['Client email address is not reachable.', 'Mail server could not be reached.', 'Request timed out.']);
        retry = 3;
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