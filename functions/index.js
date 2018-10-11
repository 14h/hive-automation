

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

function writeData(name, email,why1, why2) {
    database.ref('/'  + email + '/' ).set({
        name:   name,
        email:  email,
        why1:   why1,
        why2:   why2,

    }).then((res) => {
        console.log('success');
        return 0;

    }).catch((err) => {
        console.log(err);
        // event.preventDefault();
    });
}

    
function getAll(){
    console.log(firebase)
    return database.ref('/' ).once('value').then((snapshot)=>{
       return snapshot.val();
    }).catch((err)=>{
        console.log(err);
    });
}

function removeData( email ) {

    database.ref('/'+ 'entries'+'/' + email + '/' ).remove().then((response)=>{
        response.send("success");
        return 1;
    }).catch((err)=>{
        response.send(err);
    });
}
exports.removeData = functions.https.onRequest((request, response) => {
    removeData(request.query.email.replace(/[^a-zA-Z ]/g, ""))
    response.send("success");
});


exports.addData = functions.https.onRequest((request, response) => {
    database.ref('/'  + request.query.email.replace(/[^a-zA-Z ]/g, "") + '/' ).set({
        name:   request.query.name,
        email:  request.query.email,
        why1:   request.query.why1,
        why2:   request.query.why2,
        verified: false

    }).then((res) => {
        // console.log('success');
        response.send("success");
        return 0;

    }).catch((err) => {
        // console.log(err);
        response.send(err);

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
        response.send((err);
     });
});

