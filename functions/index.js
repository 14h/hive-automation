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
        // response.send("success");
        return 0;
        }).catch((err) => {
        console.log(err)
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
        accountType:        request.query.accountType,
        verified:           false,
        paid:               false,
    }).then((res) => {
        // response.send("success");
        response.status(200).send(`<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
            <title>THANK YOU</title>
            <style>
                @import url("https://fonts.googleapis.com/css?family=Montserrat:200,300,400,600");
                @import url("https://fonts.googleapis.com/css?family=Lato");
                body {
                    margin: 0;
                    padding: 0;
                    overflow: hidden;
                    width: 100%;
                    height: 100%;
                    background: #121212;
                }
        
                .title {
                    z-index: 10;
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translateX(-50%) translateY(-50%) scale(0.8);
                    text-align: center;
                }
                .title h3 {
                    font-family: "Montserrat";
                    font-weight: 200;
                    font-size: 20px;
                    padding: 0;
                    margin: 0;
                    line-height: 1;
                    color: #FFFFFF;
                    letter-spacing: 2px;
                    user-select: none;
                }
        
            </style>
        </head>
        <body>
            <div class="title">
                <h3>VIELEN DANK, WIR MELDEN UNS BALD ZURUCK</h3>
              </div>
        </body>
        </html>`);
        return 0;
        }).catch((err) => {
        response.send(err)
    });
});
exports.updatePayments = functions.https.onRequest((request, response) => {
    database.ref('/users/').once('value').then((snapshot)=>{
        return snapshot.val();
    }).then((data)=>{
        Object.keys(data).map((customer)=>{
            // database.ref('/users/'+ data[customer].email.replace(/[^a-zA-Z ]/g, '') + '/paid/').set(true)
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
                        // markPaid(data[customer].email)
                        if(err){
                            console.log(err)
                        } else{
                            // markPaid(data[customer].email)
                        }
                    }
                );

            }else{
                stripe.customers.create({
                    email :     data[customer].email,
                    source:     data[customer].token.id,
                    metadata:   data[customer].metaData
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
                            // markPaid(data[customer].email)
                            if(err){
                                console.log(err)
                            } else{
                                // markPaid(data[customer].email)
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
    
    