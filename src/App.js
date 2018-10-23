import React, { Component } from 'react';

// import axios from 'axios';
// import https from 'https';
import './App.css';
import { Table, Icon, Button, notification, Steps, Popconfirm, message } from 'antd';

import 'antd/dist/antd.css';

import * as firebase from 'firebase';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';


const deleteMessageText = 'Are you sure to delete this Entry?';

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

    clientId: "1052428497950-sap7htqn10i3dd90npfvmlt7bmdi6qsg.apps.googleusercontent.com",
    // lzumNNgPHT_kwTadXsP5Q3HM

    scopes: [
      "email",
      "profile",
      "https://www.googleapis.com/auth/gmail.compose",
      "https://www.googleapis.com/auth/gmail.send"
    ],
    discoveryDocs: [
      "https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"
    ]
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

// const auth = firebase.auth();


// const expandedRowRender = record => <p>{record.why2}</p>;
// const title = () => 'Here is title';
const showHeader = true;
// const footer = () => 'Here is footer';
// const scroll = { y: 240 };
// const pagination = { position: 'bottom' };


class DataTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
      expandedRowRender: (record) => <Steps style={{width: '80%', marginLeft: '10%'}}>
                                      <Step status="finish" title="Registered" icon={<Icon type="user" />} />
                                      <Step status="finish" title="Approved" icon={<Icon type="solution" />} />
                                      <Step status="process" title="Pay" icon={<Icon type="loading" />} />
                                      <Step status="wait" title="Verified" icon={<Icon type="database" />} />
                                      <Step status="wait" title="Done" icon={<Icon type="smile-o" />} />
                                    </Steps>,
      isSignedIn: false,
      bordered: true,
      pagination: false,
      size: 'default',
      title: undefined,
      showHeader,
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
        {
          key:    0,
          name:   '',
          email:  '',
          why1:   '',
          why2:   ''
        },
        {
          key:    1,
          name:   '',
          email:  '',
          why1:   '',
          why2:   ''
        },
        {
          key:    2,
          name:   '',
          email:  '',
          why1:   '',
          why2:   ''
        },
        {
          key:    3,
          name:   '',
          email:  '',
          why1:   '',
          why2:   ''
        },
        {
          key:    4,
          name:   '',
          email:  '',
          why1:   '',
          why2:   ''
        },
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
              <Icon type="check-circle" theme="outlined"  style={{ fontSize: '25px', color: record.done?'#1aa85a':'#EEE' }}  /> 
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
              this.approve(record.email, firebase.auth().currentUser.email)
              
            }}>Approve</Button>
        ),
      }, {
        title: <Button type="danger" shape="circle" icon="delete" onClick={()=>{
                  this.state.selectedRows.forEach(selectedEmail=>this.delete(selectedEmail))
                  
                }}/>,
        key: 'action3',
        width: 50,
        render: (text, record) => (
          <span>
              <Popconfirm 
                placement="left" 
                title={deleteMessageText} 
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
  
  



  getJSONData(){


    let currentComponent = this;
    if(currentComponent.state.data[0].name.length < 1){
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

      getJSON('https://us-central1-hiveautomation-c5f65.cloudfunctions.net/getAll',
        function(err, data) {
          if (err !== null) {
            alert('Something went wrong: ' + err);
          } else {
            console.log( Object.values(data))
            let dataArray = Object.values(data);
            dataArray.map((entry,i)=>{
              entry.key = i;
              return entry;
            })
            currentComponent.setState({
              data: dataArray,
              loading: false
            })
          }
        });
      }
    }


  approve(email, user){
    console.log("approving " + email);
    
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://localhost:5001/hiveautomation-c5f65/us-central1/approveRequest?email="+email+"&user="+user);
    xhr.responseType = 'json';
    xhr.onload = () => {
      var status = xhr.status;
      if (status === 200) {
        console.log("the response is");
        console.log(xhr.response);
      } else {
        console.log("failed");
        console.log(xhr.status);
      }
    }
    xhr.send();
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
          console.log(email)
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
    firebase.auth().onAuthStateChanged(function(user){
        
        this.setState({isSignedIn: !!user});
    });
  } 
/* 
              // Loading is finished, so start the app
              .then(function() {
                // Make sure the Google API Client is properly signed in
                if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
                  startApp(user);
                } else {
                  firebase.auth().signOut(); // Something went wrong, sign out
                }
              });
               */


  // Listen to the Firebase Auth state and set the local state.
  send() {
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/client.js";
    script.onload = () => {
      window.gapi.load('client', () => {
        window.gapi.client.setApiKey(config.apiKey);
        window.gapi.client.load('gmail', 'v1', () => {
          console.log(window.gapi.client.gmail.users)
          var request = window.gapi.client.gmail.users.drafts.create({
            userId: config.userId
          });
          request.execute((data)=>{
            console.log(data)
          }); 
        });
      });
    };
    document.body.appendChild(script);
  }
  startApp(user){
    firebase.auth().currentUser.getToken()
    .then(function(token) {
      return window.gapi.client.calendar.events.list({
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      showDeleted: false,
      singleEvents: true,
      maxResults: 10,
      orderBy: "startTime"
      })  
    })
    .then(function(response) {
      console.log(response);  
    });
    let request = window.gapi.client.gmail.users.drafts.create({
      'userId': config.userId,
      'resource': {
        'message': {
          'raw': "base64EncodedEmail"
        }
      }
    });
    request.execute(e=>console.log(e));
  }
  componentDidMount() {
    let currentComponent = this;
    this.unregisterAuthObserver = firebase.auth().onAuthStateChanged(
        (user) => {

    // Make sure there is a valid user object
    if (user) {
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.src = "https://apis.google.com/js/api.js";
      // Once the Google API Client is loaded, you can run your code
      script.onload = function(e) {
        // Initialize the Google API Client with the config object

        window.gapi.load('client', () => {
          window.gapi.client.init({
            apiKey: config.apiKey,
            clientId: config.clientId,
            discoveryDocs: config.discoveryDocs,
            scope: config.scopes.join(" ")
          }).then(e=>{
            currentComponent.startApp(user);
            
          }).catch(err=>console.log(err))
          


          // window.gapi.client.setApiKey(config.apiKey);
          // window.gapi.client.load('gmail', 'v1', () => {
          //   console.log(window.gapi.client.gmail.users)
          //   var request = window.gapi.client.gmail.users.drafts.create({
          //     userId: config.userId
          //   });
          //   request.execute((data)=>{
          //     console.log(data)
          //   }); 
          // });
        });
        console.log()
        
      };
      // Add to the document
      document.getElementsByTagName("head")[0].appendChild(script);
    }

          this.setState({isSignedIn: !!user})
        }
    );

    // this.send();
  }
  componentWillMount(){
    console.log("called")
    this.getJSONData();
    this.unregisterAuthObserver();
  }

  render() {
    const state = this.state;
    if(firebase.auth().currentUser){
      console.log(firebase.auth().currentUser.email);
      // console.log(firebase.auth().currentUser);
      // firebase.auth().currentUser.getToken().then(function(token) {
      //   console.log(token);
      // });
    }
    if (!this.state.isSignedIn) {
      return (
        <div id="firebaseui-auth-container">
          {/* <h1>My App</h1>
          <p>Please sign-in:</p> */}
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


class App extends Component {
  
  render() {
    return (
      <div className="App">
        <DataTable />
        
      </div>
    );
  }
}

export default App;
