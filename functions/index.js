const functions = require('firebase-functions');
const stripe = require('stripe')('sk_test_WiqLyDzs3Fd4wlHj7pNkvZJA00iqu0tcRc');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
exports.payWithStripe = functions.https.onRequest((request, response) => {
  // Set your secret key: remember to change this to your live secret key in production
  // See your keys here: https://dashboard.stripe.com/account/apikeys

  // eslint-disable-next-line promise/catch-or-return
  stripe.charges.create({
      amount: request.body.amount,
      currency: request.body.currency,
      source: request.body.token,
  }).then((charge) => {
          // asynchronously called
          return response.send(charge);
      })
      .catch(err =>{
        return console.log(err);
      });

});
