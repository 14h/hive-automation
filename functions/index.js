

const firebase = require('firebase');
const functions = require('firebase-functions');


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
function extractEmails (text)
{
    return text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
}

exports.memberfulWebhook = functions.https.onRequest((request, response) => {

    let EMAIL = extractEmails(JSON.stringify(request.body))[0];

    // MAGICALLY PARSE EMAIL AND PASS IT THROUGH THIS FOLLOWING FUNCTION 
    markPaid(EMAIL);
});

exports.addData = functions.https.onRequest((request, response) => {
    database.ref('/'  + request.query.email.replace(/[^a-zA-Z ]/g, "") + '/' ).set({
        name:   request.query.name,
        email:  request.query.email,
        why1:   request.query.why1,
        why2:   request.query.why2,
        verified: false,
        paid: false,
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



    // database.ref('/events2/').set({
    //     // data: JSON.stringify(request.body),
    //     // data3: JSON.stringify(request.body.event),
    //     // data4: JSON.stringify(request.body['event']),
    //     data7: JSON.stringify(request.body).split('name')[1].split('slug')[0],
    //     data5: JSON.stringify(request.body),
    //     email: extractEmails(JSON.stringify(request.body))[0],
    //     // data2:JSON.stringify(request.body, null, 2),
    // }).then((res) => {
    //     response.send("success");
    //     return 0;
    //     }).catch((err) => {
    //     response.send(err)
    // });
    
    
    
    