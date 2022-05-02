exports.handler = function(context, event, callback) {
    const client = context.getTwilioClient();
    startPaySession(client, event.callSid, event.paymentAmount, event.syncDocumentSid, context, callback);
 }

 async function startPaySession(client, callSid, paymentAmount, syncDocumentSid, context, callback) {

    let payment = await client.calls(callSid)
        .payments
        .create({
            chargeAmount: paymentAmount,
            paymentConnector: context.PAY_CONNECTOR_NAME,
            paymentMethod: "credit-card", 
            idempotencyKey: callSid, 
            statusCallback: `https://${context.DOMAIN_NAME}/statusCallback?syncDocumentSid=${syncDocumentSid}`
        });

        const response = new Twilio.Response();

        const headers = {
            "Access-Control-Allow-Origin": "*", // change this to your client-side URL
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
            "Content-Type": "application/json"
        };
        response.setHeaders(headers);

        response.setStatusCode(200);
        response.setBody({ paymentSid: payment.sid });

    callback(null, response)
 }