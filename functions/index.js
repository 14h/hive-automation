

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

// const auth = firebase.auth();
const database = firebase.database();

function writeData(name, email,why) {
    database.ref('/' + email + '/' ).set({
        name:   name,
        email:  email,
        why:    why,

    }).then((res) => {
        console.log('success');
        return 0;

    }).catch((err) => {
        console.log(err);
        // event.preventDefault();
      });
  }
    
function getAll(){

    return database.ref('/' ).once('value').then((snapshot)=>{
       return snapshot.val();
    })
}

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
    writeData("nam1", "email1", "whhhhyyyy!");
    response.send(getAll());
});
