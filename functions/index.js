

const firebase = require('firebase');
const functions = require('firebase-functions');
const database = firebase.database();

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

function markPaid(email){
    database.ref('/'  + email.replace(/[^a-zA-Z ]/g, "") + '/paid/' ).set(true).then(() => {
        response.send("success");
        return 0;
        }).catch((err) => {
        response.send(err)
    });
}

exports.removeData = functions.https.onRequest((request, response) => {
    database.ref('/'+ request.query.email.replace(/[^a-zA-Z ]/g, "") + '/' ).remove().then((response)=>{
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

exports.memberfulWebhook = functions.https.onRequest((request, response) => {
    console.log( request.body.getOwnPropertyNames());
    
    // MAGICALLY PARSE EMAIL AND PASS IT THROUGH THIS FOLLOWING FUNCTION 
    // markPaid(EMAIL)
    
});

exports.addData = functions.https.onRequest((request, response) => {
    database.ref('/'  + request.query.email.replace(/[^a-zA-Z ]/g, "") + '/' ).set({
        name:   request.query.name,
        email:  request.query.email,
        why1:   request.query.why1,
        why2:   request.query.why2,
        verified: false
    }).then((res) => {
        response.send("success");
        return 0;
        }).catch((err) => {
        response.send(err)
    });
});

exports.getAll = functions.https.onRequest((request, response) => {
    database.ref('/' ).once('value').then((snapshot)=>{
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

