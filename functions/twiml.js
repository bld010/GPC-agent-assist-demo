exports.handler = function(context, event, callback) {

    const VoiceResponse = require('twilio').twiml.VoiceResponse;

    const twiml = new VoiceResponse();
    const dial = twiml.dial();
    const client = dial.client();
    client.identity('user1');
    client.parameter({
        name: "parentCallSid",
        value: event.CallSid
    })

    callback(null, twiml);
}
 