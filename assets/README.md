# Generic Pay Connector + Agent Assist Demo Application

This demo application allows someone to call an "agent" who will capture payment information in a PCI-compliant manner. This is intended as an illustrative tool to show Twilio Support how Agent Assisted payments may be implemented. This is not anywhere near a production level app, and is not intended for such purposes. This repository is presented as-is, and will not be updated regularly. Nothing in the repository is meant to be shared with customers. 

This application showcases the use of the Payment Resource, which allows for agent-assisted payment detail collection through Twilio Voice. This application also uses a Generic Pay Connector, which allows Twilio customers to connect to their payment processor of choice. 



This application uses the following Twilio products/tools: 

- Runtime (Serverless Functions)
    - This application is deployed on Twilio Functions, so that hopefully you can set this application up once and never need to update it/edit it/run it locally/run an ngrok tunnel.
- Sync 
    - Whenever a caller enters payment details, Sync will save this redacted information and the frontend application will receive updates from Sync with this new information and be desplayed in the browser. This is not necessary for implementing Agent Assisted payments with Twilio. The status callbacks used by the Payment resource can be leveraged to update the agent with appropriate information throughout the process in whatever way a customer wants. 
- Voice JavaScript SDK
    - This application uses the Voice JavaScript SDK to receive calls in a browser-based client. This is just to visualize the process better. This is not the only way to implement agent-assisted payments. (Although Flex customers may use a similar setup for agent assisted payments. Flex uses the JavaScript SDK under the hood.)
- Twilio CLI and the Twilio Serverless Plugin
    - These tools will expedite the generation of the Twilio resources needed to run this application, as well as expedite the deployment of the application to Twilio Functions. 

Prerequisites: 
- You need the following installed on your machine: 
    - git
    - Twilio CLI
    - Twilio Serverless Plugin for the Twilio CLI
    - A code editor like VisualStudio Code

    - You need to have PCI Mode enabled on your account
    - You need to install a Generic Pay Connector and give it a Friendly Name (the username and password aren't important for this demo.). The Pay Connector's configuration URL will be configured after this project is deployed.

## Parts of this project: 

### Agent Assisted Payments
The Functions (endpoints) related specifically to the Payment Resource (and therefore agent-assisted payments): 
`/startPaySession`
`/updatePaySession`
`/completePaySession`
`/statusCallback`

In production, you could probably combine the `updatePaySession` and `completePaySession` steps into one endpoint, since they both update a [Payment Resource](https://www.twilio.com/docs/voice/api/payment-resource).

#### `/startPaySession`/`startPaySession.js`

The `./functions/startPaySession.js` file in this project creates the `/startPaySession` Twilio Function. 

This is where the Generic Pay Connector gets connected to the Pay Session: `paymentConnector: context.PAY_CONNECTOR_NAME`
Once the Pay Session is completed (in this case, using the `/completePaySession` endpoint), Twilio will send a POST request with the payment details to the URL specified in the Generic Pay Connector's configuration. This information is in a NON-PCI-COMPLIANT format. 

#### `/statusCallback`

The `./functions/statusCallback.js` file in this project creates the `/statusCallback` Twilio Function. 

This is the endpoint where Twilio will send webhooks whenever the Payment Resource is updated. The URL for this endpoint is included as the `statusCallback` within each of the `startPaySession` `updatePaySession` `completePaySession` Functions/endpoints. 
This endpoint is also where this application updates the underlying [Sync Document](https://www.twilio.com/docs/sync/api/document-resource) with relevant information for the agent to view. This isn't really part of the agent-assisted Payment process, and a customer would likely handle status updates differently. 

### Generic Pay Connector

#### `/mockPaymentProcessor`

The `./functions/mockPaymentProcessor.js` file in this project creates the `/mockPaymentProcessor` Twilio Function. 

This is the fake payment processor that is configured within the Generic Pay Connector. Typically, a Twilio customer would configure this to work with a third-party payment processor, but it is possible for a customer to create their own payment processor that is PCI-compliant. 

This endpoint is included only to showcase what information the Generic Pay Connector is sending to a payment processor, and how payment information is returned to Twilio from the payment processor.

Read the Generic Pay Connector documentation for more information

### The Front End (What you see in the browser)

#### `/assets`

#### `/twiml`

The `twiml.js` file is deployed as the `/twiml` Twilio Function endpoint. This file generates the TwiML that will be executed when someone dials your Twilio Number. The TwiML that is generated (using the Twilio Node Helper Library) is: 

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Dial>
        <Client>
            <Identity>user1</Identity>
            <Parameter name="parentCallSid" value="CAXXXX...."/>
        </Client>
    </Dial>
</Response>
```

The `parentCallSid` parameter is passed in because this particular call flow involves two calls: a parent call (the call between the caller and your Twilio Phone Number) and a child call (the `<Dial>` to your JavaScript SDK client's `identity`). The parent call's SID is needed by the Payment Resource when creating a new Pay Session. 

#### `/token`

The `token.js` file is deployed as the `/token` Twilio Function endpoint. This file generates the AccessToken needed by the JavaScript SDK and the Sync Client that are used in the browser application. It also sends your phone number to the frontend (this was done to simplify where your configuration information lives ... in this case, in the `.env` file)


Setup: 

// install a generic pay connector, give it a friendly name


You will need to provide several pieces of information in your .env file in order to get this application up and running. 

// create an API key + sid via cli??
// create a twiml app via cli
// create a sync service via cli
// enter your pay connector name
// buy a phone number
// configure with twiml app sid
// configure generic pay connector with /mockPaymentProcessor endpoint once deployed
// update Twiml app to point to /twiml endpoint once deployed


ACCOUNT_SID=
AUTH_TOKEN=
API_KEY_SID=
API_SECRET=
TWIML_APP_SID=
SYNC_SERVICE_SID=
PAY_CONNECTOR_NAME=
PHONE_NUMBER=



If you want to edit this project for yourself, you will need to run `twilio serverless:deploy` whenever you want changes to be deployed (available on the internet). 

If you want to make edits to the front end of the project, you will need to: 
- Edit the project in the `assets-src/frontend` directory.
- Run `npm run build` to create a deployment-ready set of files. 
- Copy the contents of the `dist` directory (which is created/updated when you run `npm run build`) into the `assets` directory of this project. 
- Deploy the project again with `twilio serverless:deploy`