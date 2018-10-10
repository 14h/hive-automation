

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
    console.log(firebase)
    return database.ref('/' ).once('value').then((snapshot)=>{
       return snapshot.val();
    }).catch((err)=>{
        console.log(err);
    });
}

function removeData( email ) {
    console.log(lang,category,name)
    database.ref('/' + email + '/' ).remove().then((res)=>{
        console.log('success');
        console.log(res);
        return 1;
        }).catch((err)=>{
        console.log(err);
    });
}
exports.removeData = functions.https.onRequest((request, response) => {
    removeData("email1")
    response.send("success");
});
module.exports.getAll = getAll;

exports.helloWorld = functions.https.onRequest((request, response) => {
    writeData("nam2", "email2", "whhhhyyy2y!");
    response.send("success");
});

