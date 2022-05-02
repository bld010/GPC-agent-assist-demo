exports.handler = (context, event, callback) => {
  
    console.log("Event received by mockPaymentProcessor: ", event);
  
    console.log('Authorization Headers: ', event.request.headers.authorization);
  
    const sampleResponse = {
        charge_id: "some_id_from_your_payment_processor",
        error_code: null,
        error_message: null
    };
  
    return callback(null, sampleResponse);
  };