import { database } from './firebase';


// export function writeUserDataEN(category, name, author, content, userUID, imageSRC, publishDate, publishMonth, publishYear) {
//     let publishTime = publishYear + '-' + publishMonth;
//     database.ref('stories/' + publishTime + '/en/' + category + '/' + name.replace(/[^a-zA-Z ]/g, "")).set({
//       username: name,
//       category: category,
//       author: author,
//       content: content,
//       userUID: userUID,
//       imageSRC: imageSRC,
//       publishDate: publishDate,
//       publishMonth: publishMonth,
//       publishYear: publishYear
//     }).then((res)=>{
//         console.log('success')

//       }).catch((err)=>{
//         console.log(err);
//         // event.preventDefault();
//       });
//   }

// export function updateProfile(userUID, name, imageSource) {
//     database.ref('users/' + userUID ).set({
//         username: userUID,
//         name: name,
//         imageSource: imageSource
//     }).then((res)=>{
//         console.log('success')

//         }).catch((err)=>{
//         console.log(err);
//         // event.preventDefault();
//         });
// }
// export function getProfile(userUID){
//     return database.ref('users/' + userUID).once('value').then((snapshot)=>{
//         return snapshot.val();
//     })
// }


// export function removeStory( version ,lang, category, name) {
//     console.log(lang,category,name)
//     database.ref('stories/' + version + '/' + lang+'/' + category + '/' + name ).remove().then((res)=>{
//         console.log('success')
//         console.log(res)
//         window.location.href = window.location.href;
        

//         }).catch((err)=>{
//         console.log(err);
//         // event.preventDefault();
//         });
// }

export function getAll(){

     return database.ref('/' ).once('value').then((snapshot)=>{
        return snapshot.val();
    })
     
}