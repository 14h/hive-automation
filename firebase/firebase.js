import * as firebase from 'firebase';

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
// const storage = firebase.storage();

export {
//   auth,
  database,
//   storage
};
// var userUID = null
// firebase.auth().onAuthStateChanged((user) => {
//     if (user) {
//       userUID = user.uid;
//     }
//   });
// export const getUserUID = ()=>userUID