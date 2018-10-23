

const firebase = require('firebase');
const functions = require('firebase-functions');
//const gapi = require('gapi');

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


    
function getAll(){
    console.log(firebase)
    return database.ref('/' ).once('value').then((snapshot)=>{
       return snapshot.val();
    }).catch((err)=>{
        console.log(err);
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

exports.approveRequest = functions.https.onRequest((request, response) => {
    const email = request.query.email || 'default mail',
          user = request.query.user;

    response.setHeader("Access-Control-Allow-Origin", '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type,Accept');
    response.header("Access-Control-Allow-Origin", '*');
    response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    response.header('Access-Control-Allow-Headers', 'Content-Type,Accept');

    // sent invitation mail
    // var xhr = new XMLHttpRequest();
    // xhr.open("GET", "https://www.googleapis.com/gmail/v1/users/"+user+"/drafts");
    // xhr.responseType = 'json';
    // xhr.onload = () => {
    //   var status = xhr.status;
    //   if (status === 200) {
    //     console.log("the response is");
    //     console.log(xhr.response);
    //   } else {
    //     console.log("failed");
    //     console.log(xhr.status);
    //   }
    // }
    // xhr.send();

 //   function listDrafts(userId, callback) {
        var re = gapi.client.gmail.users.drafts.list({
          'userId': userId
        });
 //       console.log("1");
        re.execute((resp) => {
          var drafts = resp.drafts;
//          callback(drafts);
          response.send(drafts);
        });
  //    }

    response.send({"email": email, "user": user});
    return email;
});
