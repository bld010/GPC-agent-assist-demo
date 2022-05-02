exports.handler = async function(context, event, callback) {

    const client = context.getTwilioClient();

    await client.calls(event.callSid)
        .payments(event.paymentSid)
        .update({
            status: 'complete',
            idempotencyKey: event.callSid,
            statusCallback: `https://${context.DOMAIN_NAME}/statusCallback?syncDocumentSid=${event.syncDocumentSid}`
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
        response.setBody(`Payment Complete`);

    callback(null, response)
}