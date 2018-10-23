import React from 'react';

// import axios from 'axios';
// import https from 'https';
import './App.css';
import { Table, Icon, Button, notification, Steps, Popconfirm, message, Modal, Input} from 'antd';


import 'antd/dist/antd.css';

import * as firebase from 'firebase';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
const { TextArea } = Input;
//const gapi = require('gapi');


function confirm() {
  message.info('Entry deleted from the Database!');
}

const Step = Steps.Step;
const config = {
    apiKey: "AIzaSyCEeSAoo9PfTT1aK4CMgC_rhcCZ6H7HTmM",
    authDomain: "hiveautomation-c5f65.firebaseapp.com",
    databaseURL: "https://hiveautomation-c5f65.firebaseio.com",
    projectId: "hiveautomation-c5f65",
    storageBucket: "hiveautomation-c5f65.appspot.com",
    messagingSenderId: "828985598310",

    // clientId: "1052428497950-sap7htqn10i3dd90npfvmlt7bmdi6qsg.apps.googleusercontent.com",
    // lzumNNgPHT_kwTadXsP5Q3HM
    clientId: "828985598310-i29pqh0hc08bitv4icrnb8q2n8ihs34c.apps.googleusercontent.com",
    // gymnIPbSPiqgBXY3iW5d8sEv
    scopes: [
      "email",
      "profile",
      "https://www.googleapis.com/auth/gmail.compose",
      "https://www.googleapis.com/auth/gmail.send",
    ],
    discoveryDocs: [
      "https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"
    ]
};
if (!firebase.apps.length) {
  firebase.initializeApp(config);
}
const database = firebase.database();

export default class DataTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      selectedEmail:'',
      emailContent:"This is an automated mail from TheDive Hive. Thanks for willing to be a part of the TheDive Hive Community",
      uiConfig : {
        // Popup signin flow rather than redirect flow.
        signInFlow: 'popup',
        // We will display Google and Facebook as auth providers.
        signInOptions: [{
          provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          scopes: config.scopes
          // firebase.auth.FacebookAuthProvider.PROVIDER_ID
        }],
        callbacks: {
          // Avoid redirects after sign-in.
          signInSuccessWithAuthResult: () => false
        }
      },
      expandedRowRender: (record) =>{
        if(false){
          return <Steps style={{width: '80%', marginLeft: '10%'}}>
                    <Step status="finish" title="Registered" icon={<Icon type="user" />} />
                    <Step status="finish" title="Approved" icon={<Icon type="solution" />} />
                    <Step status="finish" title="Pay" icon={<Icon type="euro" />} />
                    <Step status="process" title="Verified" icon={<Icon type="database" />} />
                    <Step status="wait" title="Done" icon={<Icon type="smile-o" />} />
                  </Steps>
        }
        if(record.approved){
          return <Steps style={{width: '80%', marginLeft: '10%'}}>
                <Step status="finish" title="Registered" icon={<Icon type="user" />} />
                <Step status="finish" title="Approved" icon={<Icon type="solution" />} />
                <Step status="process" title="Pay" icon={<Icon type="loading" />} />
                <Step status="wait" title="Verified" icon={<Icon type="database" />} />
                <Step status="wait" title="Done" icon={<Icon type="smile-o" />} />
              </Steps>
        }
        return <Steps style={{width: '80%', marginLeft: '10%'}}>
                <Step status="finish" title="Registered" icon={<Icon type="user" />} />
                <Step status="process" title="Approved" icon={<Icon type="loading" />} />
                <Step status="wait" title="Pay" icon={<Icon type="euro" />} />
                <Step status="wait" title="Verified" icon={<Icon type="database" />} />
                <Step status="wait" title="Done" icon={<Icon type="smile-o" />} />
              </Steps>
      },
      isSignedIn: false,
      bordered: true,
      pagination: false,
      size: 'default',
      title: undefined,
      showHeader: true,
      selectedRows:[],
      rowSelection: {
        onChange: (selectedRowKeys, selectedRows) => {
          // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
          this.setState({selectedRows:selectedRows.map(entry=>entry.email)})
        },
        getCheckboxProps: record => ({
          disabled: record.name === 'Disabled User', // Column configuration not to be checked
          name: record.name,
        }),
      },
      scroll: undefined,
      hasData: true,
      data : [
        {key:0,name:'',email:'',why1:'',why2:''},
        {key:1,name:'',email:'',why1:'',why2:''},
        {key:2,name:'',email:'',why1:'',why2:''},
        {key:3,name:'',email:'',why1:'',why2:''},
        {key:4,name:'',email:'',why1:'',why2:''},
        
      ],
      loading: true,
      columns : [{
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        width: 170,
        render: text => <div>{text}</div>,
      }, {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        width: 200,
      }, {
        title: 'Wir sind neugierig, erzähl doch mal kurz wer du bist und was du machst!',
        dataIndex: 'why1',
        key: 'why1',
        width: 500,
      }, {
        title: 'Warum möchtest du Teil des Hives sein?',
        dataIndex: 'why2',
        key: 'why2',
        width: 500,
      }, {
        title: <Icon type="check-circle" theme="outlined"  style={{ fontSize: '25px', color: 'transparent' }}  /> ,
        key: 'action1',
        width: 70,
        render: (text, record) => (
          
            <div>
              {console.log(record)}
              <Icon type="check-circle" theme="outlined"  style={{ fontSize: '25px', color: record.approved?'#1aa85a':'#EEE' }}  /> 
            </div>
        ),
      }, {
        title: <Button onClick={()=>{
          this.state.selectedRows.forEach(selectedEmail=>this.approve(selectedEmail, firebase.auth().currentUser.email))
        }}>Approve</Button>,
        key: 'action2',
        width: 70,
        render: (text, record) => (
            <Button onClick={()=>{
              // this.approve(record.email, firebase.auth().currentUser.email)
              // this.sendEmail(record.email,"THEDIVE HIVE COMMUNITY", "EMAIL BODY")
              this.showModal(record.email)
            }}>Approve</Button>
        ),
      }, {
        title: <Popconfirm 
                placement="left" 
                title='You are attempting to delete more than one Entry, are you sure you want to do this!!!'
                onConfirm={
                  ()=>{
                    this.state.selectedRows.forEach(selectedEmail=>this.delete(selectedEmail));
                    confirm();
                  }
                } 
                okText="Yes" 
                cancelText="No">
                <Button type="danger" shape="circle" icon="delete"/>
              </Popconfirm>,
        key: 'action3',
        width: 50,
        render: (text, record) => (
          <span>
              <Popconfirm 
                placement="left" 
                title='Are you sure to delete this Entry?' 
                onConfirm={
                  ()=>{
                    this.delete(record.email);
                    confirm();
                  }
                } 
                okText="Yes" 
                cancelText="No">
                <Button type="danger" shape="circle" icon="delete"/>
              </Popconfirm>
          </span>
        ),
      }],
    }
    
    this.getJSONData = this.getJSONData.bind(this);
    this.unregisterAuthObserver = this.unregisterAuthObserver.bind(this);
  }

  showModal = (email) => {
    this.setState({
      modalVisible: true,
      selectedEmail: email
    });
  }

  handleOk = (e) => {
    console.log(e);
    this.sendEmail(this.state.selectedEmail,"TheDive Hive Community", this.state.emailContent);
    this.setState({
      modalVisible: false,
    });
  }

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      modalVisible: false,
    });
  }
  
  getJSONData(){
    let currentComponent = this;
    database.ref('/' ).once('value').then((snapshot)=>{
      let dataArray = Object.values(snapshot.val());
      dataArray.map((entry,i)=>{
        entry.key = i;
        return entry;
      })
      currentComponent.setState({
        data: dataArray,
        loading: false
      })
      return snapshot.val();
   }).catch((err)=>{
      console.log(err);
   });
    // if(currentComponent.state.data[0].name.length < 1){
    //   var getJSON = function(url, callback) {
    //     var xhr = new XMLHttpRequest();
    //     xhr.open('GET', url);
    //     xhr.responseType = 'json';
    //     xhr.onload = function() {
    //       var status = xhr.status;
    //       if (status === 200) {
    //         callback(null, xhr.response);
    //       } else {
    //         callback(status, xhr.response);
    //       }
    //     };
    //     xhr.send();
    // };

    // getJSON('https://us-central1-hiveautomation-c5f65.cloudfunctions.net/getAll',
    //   function(err, data) {
    //     if (err !== null) {
    //       alert('Something went wrong: ' + err);
    //     } else {
    //       let dataArray = Object.values(data);
    //       dataArray.map((entry,i)=>{
    //         entry.key = i;
    //         return entry;
    //       })
    //       currentComponent.setState({
    //         data: dataArray,
    //         loading: false
    //       })
    //     }
    //   });
    // }
  }
  delete(email){
    let currentComponent = this;
    currentComponent.setState({
      loading:true
    });
    var getJSON = function(url, callback) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      // xhr.setRequestHeader('Access-Control-Allow-Headers', 'true')
      // xhr.setRequestHeader('Access-Control-Allow-Origin', 'true')
      xhr.responseType = 'json';
      xhr.onload = function() {
        var status = xhr.status;
        if (status === 200) {
          callback(null, xhr.response);
        } else {
          callback(status, xhr.response);
        }
      };
      xhr.send();
    };

    getJSON('https://us-central1-hiveautomation-c5f65.cloudfunctions.net/removeData?email='+email,
      function(err, data) {
        if (err !== null) {
          alert('Something went wrong: ' + err);
        } else {
          currentComponent.setState((state) => {
            return {
              data: state.data.filter(entry => entry.email !== email),
              loading:false
             };
          });
        }
      });
  }
  unregisterAuthObserver(){
    let currentComponent = this;
    firebase.auth().onAuthStateChanged(function(user){
        currentComponent.setState({isSignedIn: !!user});
    });
  } 
  
  sendEmail(to, subject, body){
    if(window.Email){
      window.Email.send(
        "kawji@thedive.com",
        to,
        subject,
        body,
        "smtp.elasticemail.com",
        "kawji@thedive.com",
        "e30b528c-6007-41d1-923f-5530475d01b3",
        ()=>{  
          message.info('Email sent to '+ to);
          database.ref('/'  + to.replace(/[^a-zA-Z ]/g, "") + '/approved/' ).set(true).then((res) => {
              message.info('database updated');
              return 0;
            }).catch((err) => {
              console.log(err)
            });
            this.getJSONData();

         });

    }else{
      message.error('try again!')
    }
  }
  componentDidMount() {
    var smtp = document.createElement("script");
    smtp.type = "text/javascript";
    smtp.src = "https://smtpjs.com/v2/smtp.js";
    // Once the Google API Client is loaded, you can run your code
    smtp.onload = function(e) {

      console.log('smtp loaded')
    };
    // Add to the document
    document.getElementsByTagName("head")[0].appendChild(smtp);
    // let currentComponent = this;
    this.unregisterAuthObserver = firebase.auth().onAuthStateChanged(
        (user) => {
          this.setState({isSignedIn: !!user})
        }
    );
  }
  componentWillMount(){
    console.log("called")
    this.getJSONData();
    this.unregisterAuthObserver();
  }

  render() {
    const state = this.state;
    if(firebase.auth().currentUser){
    }
    if (!this.state.isSignedIn) {
      return (
        <div id="firebaseui-auth-container">
          <StyledFirebaseAuth uiConfig={this.state.uiConfig} firebaseAuth={firebase.auth()}/>
        </div>
      );
    }
    if(firebase.auth().currentUser && !firebase.auth().currentUser.email.includes("@thedive.com")){
      notification.open({
        message: 'Sign In Error',
        description: 'You have to sign in using you @thedive email address. You will be automatically signed out! please try again!',
      });

      firebase.auth().signOut();
      return (
        <div/>
      );
    }
    return (
      <div>
        <Table {...this.state} columns={this.state.columns} scroll={{ y: '86vh' }} dataSource={state.hasData ? this.state.data : null}   />
        <Modal
          title={this.state.selectedEmail}
          visible={this.state.modalVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <Button key="back" onClick={this.handleCancel}>Return</Button>,
            <Button key="submit" type="primary"  onClick={this.handleOk}>
              Send Email
            </Button>,
          ]}
        >
          <TextArea rows={4} value={this.state.emailContent} onChange={(e)=>{this.setState({emailContent:e.target.value})}}/>
        </Modal>
        <Button type="danger" id="firebaseui-auth-container" onClick={() => firebase.auth().signOut()}>Sign-out</Button>
        <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
        <form action="https://us-central1-hiveautomation-c5f65.cloudfunctions.net/addData" target="https://www.google.com">
          name: <input type="text" name="name" required/><br/>
          email: <input type="text" name="email" required/><br/>
          why1: <input type="text" name="why1" required/><br/>
          why2: <input type="text" name="why2" required/><br/>
          <input type="submit" value="Submit"/>
        </form>
      </div>
    );
  }
}

// // Listen to the Firebase Auth state and set the local state.
// send() {
//   const script = document.createElement("script");
//   script.src = "https://apis.google.com/js/client.js";
//   script.onload = () => {
//     window.gapi.load('client', () => {
//       window.gapi.client.setApiKey(config.apiKey);
//       window.gapi.client.load('gmail', 'v1', () => {
//         // console.log(window.gapi.client.gmail.users)
//         var request = window.gapi.client.gmail.users.drafts.create({
//           // userId: config.userId
//           userId: "kawji@thedive.com"
//         });
//         request.execute((data)=>{
//           // console.log(data)
//         }); 
//       });
//     });
//   };
//   document.body.appendChild(script);
// }




// onAuthStateChanged
    // Make sure there is a valid user object
    // if (user) {
    //   var script = document.createElement("script");
    //   script.type = "text/javascript";
    //   script.src = "https://apis.google.com/js/api.js";
    //   // Once the Google API Client is loaded, you can run your code
    //   script.onload = function(e) {
    //     // Initialize the Google API Client with the config object
    //     window.gapi.load('client', () => {
    //       window.gapi.client.init({
    //         apiKey: config.apiKey,
    //         clientId: config.clientId,
    //         discoveryDocs: config.discoveryDocs,
    //         scope: config.scopes.join(" ")
    //       }).then(e=>{
    //         currentComponent.startApp(user);
            
    //       }).catch(err=>console.log(err))
    //     });
    //   };
    //   // Add to the document
    //   document.getElementsByTagName("head")[0].appendChild(script);
    // }





    // startApp(user){
    //   console.log(user)
      
    //   firebase.auth().currentUser.getIdToken()
    //   .then(function(token) {
    //     window.gapi.client.setToken({
    //       'access_token': token
    //     })
    //     // return window.gapi.client.calendar.events.list({
    //     // calendarId: "primary",
    //     // timeMin: new Date().toISOString(),
    //     // showDeleted: false,
    //     // singleEvents: true,
    //     // maxResults: 10,
    //     // orderBy: "startTime"
    //     // })  
    //   })
    //   .then(function(response) {
    //     window.gapi.auth2.getAuthInstance().signIn().then(()=>{
    //       let request = window.gapi.client.gmail.users.drafts.create({
    //         // 'userId': config.userId,
    //         'userId': user.uid,
    //         'resource': {
    //           'message': {
    //             'raw': "base64EncodedEmail"
    //           }
    //         }
    //       });
    //       request.execute(e=>console.log(e)); 
    //     })
        
    //   });
      
    // }



    // approve(email, user){
    //   var xhr = new XMLHttpRequest();
    //   xhr.open("GET", "http://localhost:5001/hiveautomation-c5f65/us-central1/approveRequest?email="+email+"&user="+user);
    //   xhr.responseType = 'json';
    //   xhr.onload = () => {
    //     var status = xhr.status;
    //     if (status === 200) {
    //       // console.log("the response is");
    //       // console.log(xhr.response);
    //     } else {
    //       // console.log("failed");
    //       // console.log(xhr.status);
    //     }
    //   }
    //   xhr.send();
    // }