/* eslint-disable prefer-arrow-callback */
/* eslint-disable promise/no-nesting */


const firebase = require('firebase');
const functions = require('firebase-functions');
// Set your secret key: remember to change this to your live secret key in production
// See your keys here: https://dashboard.stripe.com/account/apikeys
var stripe = require("stripe")("sk_test_6luAcTzWINurIjFVt5ZeeFU4");


const config = {
    apiKey: "AIzaSyCEeSAoo9PfTT1aK4CMgC_rhcCZ6H7HTmM",
    authDomain: "hiveautomation-c5f65.firebaseapp.com",
    databaseURL: "https://hiveautomation-c5f65.firebaseio.com",
    projectId: "hiveautomation-c5f65",
    storageBucket: "hiveautomation-c5f65.appspot.com",
    messagingSenderId: "828985598310"
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}
const database = firebase.database();

// Token is created using Checkout or Elements!
// Get the payment token ID submitted by the form:
// function updatePayments(){
//     database.ref('/payments/').once('value').then((snapshot)=>{
//         let dataArray = Object.values(snapshot.val());
//         dataArray.forEach((payment)=>{
//             let charge = stripe.charges.create({
//                 amount: payment.teamNumber * 25,
//                 currency: 'usd',
//                 description: payment.email,
//                 source: payment.token,
//               }, {
//                 idempotency_key: payment.email
//               }, function(err, charge) {
//                 // asynchronously called
//                 console.log(err, charge)
//               });

//         })
//         return snapshot.val();
//      }).catch((err)=>{
//         console.log(err);
//      });
// }

// const charge = stripe.charges.create({
//   amount: 999,
//   currency: 'usd',
//   description: 'Example charge',
//   source: token,
// });


function markPaid(email){
    database.ref('/users/'  + email.replace(/[^a-zA-Z ]/g, "") + '/paid/' ).set(true).then(() => {
        response.send("success");
        return 0;
        }).catch((err) => {
        response.send(err)
    });
}

exports.removeData = functions.https.onRequest((request, response) => {
    database.ref('/users/'+ request.query.email.replace(/[^a-zA-Z ]/g, "") + '/' ).remove().then((response)=>{
            response.setHeader("Access-Control-Allow-Origin", '*');
            response.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
            response.setHeader('Access-Control-Allow-Headers', 'Content-Type,Accept');
            response.header("Access-Control-Allow-Origin", '*');
            response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
            response.header('Access-Control-Allow-Headers', 'Content-Type,Accept');
            response.send("success");
            return 1;
        }).catch((err)=>{
            response.setHeader("Access-Control-Allow-Origin", '*');
            response.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
            response.setHeader('Access-Control-Allow-Headers', 'Content-Type,Accept');
            response.header("Access-Control-Allow-Origin", '*');
            response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
            response.header('Access-Control-Allow-Headers', 'Content-Type,Accept');
            response.send(err);
    });
});
function extractEmails (text)
{
    return text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
}

exports.memberfulWebhook = functions.https.onRequest((request, response) => {
    // console.log(request)

    let EMAIL = extractEmails(JSON.stringify(request.body))[0];

    // MAGICALLY PARSE EMAIL AND PASS IT THROUGH THIS FOLLOWING FUNCTION 
    markPaid(EMAIL);
});

exports.addData = functions.https.onRequest((request, response) => {
    database.ref('/users/'  + request.query.email.replace(/[^a-zA-Z ]/g, "") + '/' ).set({
        name:               request.query.name,
        email:              request.query.email,
        why1:               request.query.why1,
        why2:               request.query.why2,
        teamNumber:         request.query.teamNumber,
        verified:           false,
        paid:               false,
    }).then((res) => {
        response.send("success");
        return 0;
        }).catch((err) => {
        response.send(err)
    });
});
exports.updatePayments = functions.https.onRequest((request, response) => {
    let email = "test3@example.com";
    // const customer =  stripe.customers.create({
    //     source: "tok_1DT491KNaUjTAffWgriVdF2Y",
    //     email: email,
    // });
    // stripe.customers.list({email : customer.email}).then((

    // )
    database.ref('/users/').once('value').then((snapshot)=>{
        return snapshot.val();
    }).then((data)=>{
        // console.log(data)
        Object.keys(data).map((customer)=>{
            if(data[customer].id){
                stripe.subscriptions.create({
                    customer: data[customer].id,
                    items: [
                        {
                        plan: "plan_DvV0TG98SZkcY0",
                        quantity: data[customer].teamNumber,
                        },
                    ]
                    },{
                        idempotency_key: data[customer].id
                    }, function(err, subscription) {
                        markPaid(data[customer].email)
                        if(err){
                            console.log(err)
                        } else{
                            markPaid(data[customer].email)
                        }
                    }
                );

            }else{
                stripe.customers.create({
                    email : data[customer].email,
                    source: data[customer].token.id
                }).then((stripeResponse)=>{
                    // console.log(stripeResponse.id)
                    database.ref('/users/'+customer+'/id/').set(stripeResponse.id).catch(err=>console.log(err));
                    stripe.subscriptions.create({
                        customer: stripeResponse.id,
                        items: [
                            {
                            plan: "plan_DvV0TG98SZkcY0",
                            quantity: data[customer].teamNumber,
                            },
                        ]
                        },{
                            idempotency_key: stripeResponse.id
                        }, function(err, subscription) {
                            markPaid(data[customer].email)
                            if(err){
                                console.log(err)
                            } else{
                                markPaid(data[customer].email)
                            }
                        }
                    );
                    return 0
                }).catch(err=>console.log(err));
            }
        })
        response.send('success4')
        return 0
    }).catch(err=>console.log(err))
});

exports.getAll = functions.https.onRequest((request, response) => {
    database.ref('/users/' ).once('value').then((snapshot)=>{
        response.setHeader("Access-Control-Allow-Origin", '*');
        response.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
        response.setHeader('Access-Control-Allow-Headers', 'Content-Type,Accept');
        response.header("Access-Control-Allow-Origin", '*');
        response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
        response.header('Access-Control-Allow-Headers', 'Content-Type,Accept');
        response.send(snapshot.val());
        return snapshot.val();
     }).catch((err)=>{
        response.send(err);
     });
});
    
    