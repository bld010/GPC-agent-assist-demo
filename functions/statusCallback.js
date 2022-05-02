exports.handler = async function(context, event, callback) {

    const client = context.getTwilioClient();


    if (event.PaymentCardNumber && !event.PartialResult) {
        let paymentDetails = {
            paymentAmount: event.ChargeAmount,
            cardNumber: event.PaymentCardNumber,
            expirationDate: event.ExpirationDate, 
            postalCode: event.PaymentCardPostalCode, 
            securityCode: event.SecurityCode,
            errorType: event.ErrorType,
            result: event.Result, 
            paymentConfirmationCode: event.PaymentConfirmationCode
        }
    
        if (event.syncDocumentSid) {
            await client.sync.services(context.SYNC_SERVICE_SID)
                .documents(event.syncDocumentSid)
                .update({data: paymentDetails})
        }

    }

    callback(null, {});
}