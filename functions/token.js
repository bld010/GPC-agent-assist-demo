exports.handler = (context, event, callback) => {
    
    const identity = "user1";
    const twilioAccountSid = context.ACCOUNT_SID;
    const twilioApiKey = context.API_KEY_SID;
    const twilioApiSecret = context.API_SECRET;

    const AccessToken = require('twilio').jwt.AccessToken;

    const token = new AccessToken(
        twilioAccountSid, 
        twilioApiKey,
        twilioApiSecret, 
        { identity }
    );

    const VoiceGrant = AccessToken.VoiceGrant;

    const voiceGrant = new VoiceGrant({
        outgoingApplicationSid: context.TWIML_APP_SID, 
        incomingAllow: true
    });

    token.addGrant(voiceGrant);
   
    var SyncGrant = AccessToken.SyncGrant;
    var syncGrant = new SyncGrant({
        serviceSid: context.SYNC_SERVICE_SID
    })
    token.addGrant(syncGrant);

    const Response = require('twilio').Response;
    const response = new Response();
  
    const headers = {
        "Access-Control-Allow-Origin": "*", // change this to your client-side URL
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json"
    };
        
    response.setHeaders(headers);
    response.setBody({
        accessToken: token.toJwt(),
        phoneNumber: context.PHONE_NUMBER
    });

    return callback(null, response);
}

