import React from 'react';
import './App.css';
import { Table, Icon, Button, notification, Popconfirm, message, Modal, Input} from 'antd';
import 'antd/dist/antd.css';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import * as firebase from 'firebase';

const config = {
  apiKey: "AIzaSyCEeSAoo9PfTT1aK4CMgC_rhcCZ6H7HTmM",
  authDomain: "hiveautomation-c5f65.firebaseapp.com",
  databaseURL: "https://hiveautomation-c5f65.firebaseio.com",
  projectId: "hiveautomation-c5f65",
  storageBucket: "hiveautomation-c5f65.appspot.com",
  messagingSenderId: "828985598310",
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

const { TextArea } = Input;

function confirm() {
  message.info('Entry deleted from the Database!');
}


const database = firebase.database();
const expandedRowTableConfig = {
  bordered: true,
  pagination: false,
  size: 'small',
  title: undefined,
  showHeader: false,
  selectedRows:undefined,
  rowSelection: undefined,
  scroll: undefined,
  hasData: true,
  data : [
    {key:0,name:'',email:''},
    {key:1,name:'',email:''},
    {key:2,name:'',email:''},
    {key:3,name:'',email:''},
    {key:4,name:'',email:''},
    
  ],
  loading: false,
  columns : [{
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    width: 300,
    render: text => <div>{text}</div>,
  }, {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
    width: 300,
  }, {
    title: <Icon type="solution" theme="outlined"  style={{ fontSize: '25px' }} /> ,
    key: 'action1',
    width: 20,
    align: 'center',
    render: (text, record) => (
        <div>
          {(record.approved)?(<Icon type="check-circle" theme="outlined"  style={{ fontSize: '25px', color: '#1aa85a' }} />):(<Icon type="loading" theme="outlined"  style={{ fontSize: '25px' }} />)}
        </div>
    ),
  }, {
    title: <Button onClick={()=>{
      this.state.selectedRows.forEach(selectedEmail=>this.approve(selectedEmail, firebase.auth().currentUser.email))
    }}>Approve</Button>,
    key: 'action2',
    width: 30,
    align: 'center',
    render: (text, record) => (
        <Button onClick={()=>{
          this.showModal(record.email)
        }}>Approve</Button>
    ),
  }],
}

export default class Dashboard extends React.Component {
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
        return <Table {...expandedRowTableConfig} columns={expandedRowTableConfig.columns} scroll={{ y: '100vh' }} dataSource={this.state.hasData ? this.state.data : null}   />
      },
      isSignedIn: false,
      bordered: true,
      pagination: false,
      size: 'small',
      title: undefined,
      showHeader: true,
      selectedRows:[],
      rowSelection: {
        onChange: (selectedRowKeys, selectedRows) => {
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
        {key:0,name:'',email:'',why1:'',why2:'',teamNumber:0},
        {key:1,name:'',email:'',why1:'',why2:'',teamNumber:0},
        {key:2,name:'',email:'',why1:'',why2:'',teamNumber:0},
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
        title: <Icon type="solution" theme="outlined"  style={{ fontSize: '25px' }} /> ,
        key: 'action1',
        width: 70,
        align: 'center',
        render: (text, record) => (
            <div>
              {(record.approved)?(<Icon type="check-circle" theme="outlined"  style={{ fontSize: '25px', color: '#1aa85a' }} />):(<Icon type="loading" theme="outlined"  style={{ fontSize: '25px' }} />)}
            </div>
        ),
      }, {
        title: <Icon type="euro" theme="outlined"  style={{ fontSize: '25px' }} /> ,
        key: 'action2',
        width: 70,
        align: 'center',
        render: (text, record) => (
            <div>
              {(record.approved && !record.paid)?(<Icon type="loading" theme="outlined"  style={{ fontSize: '25px' }} />):(<Icon type="check-circle" theme="outlined"  style={{ fontSize: '25px', color: record.approved?'#1aa85a':'#EEE' }} />)}
              {/* <Icon type="check-circle" theme="outlined"  style={{ fontSize: '25px', color: record.approved?'#1aa85a':'#EEE' }}  />  */}
            </div>
        ),
      }, {
        title: <Button onClick={()=>{
          this.state.selectedRows.forEach(selectedEmail=>this.approve(selectedEmail, firebase.auth().currentUser.email))
        }}>Approve</Button>,
        key: 'action3',
        width: 70,
        render: (text, record) => (
            <Button onClick={()=>{
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
        key: 'action4',
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
    this.sendEmail(this.state.selectedEmail,"TheDive Hive Community", this.state.emailContent + "/n https://hiveautomation-c5f65.firebaseapp.com/payment/"+this.state.selectedEmail);
    this.setState({
      modalVisible: false,
    });
  }

  handleCancel = (e) => {
    this.setState({
      modalVisible: false,
    });
  }
  
  getJSONData(){
    let currentComponent = this;
    database.ref('/users/' ).once('value').then((snapshot)=>{
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
  }
  delete(email){
    let currentComponent = this;
    currentComponent.setState({
      loading:true
    });
    database.ref('/users/'+ email.replace(/[^a-zA-Z ]/g, "") + '/' ).remove().then((response)=>{
      this.getJSONData();
      currentComponent.setState({
        loading:false
      });
      return 1;
    }).catch((err)=>{
        console.log(err)
    });
  }
  unregisterAuthObserver(){
    let currentComponent = this;
    firebase.auth().onAuthStateChanged(function(user){
        currentComponent.setState({isSignedIn: !!user});
    });
  } 
  
  sendEmail(to, subject, body){
    this.setState({
      loading:true
    });
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
          database.ref('/users/'  + to.replace(/[^a-zA-Z ]/g, "") + '/approved/' ).set(true).then((res) => {
              message.info('database updated');
              this.setState({
                loading:false
              });
              return 0;
            }).catch((err) => {
              console.log(err)
            });
            this.getJSONData();

         });

    }else{
      message.error('try again!')
      this.setState({
        loading:false
      });
    }
  }

  componentDidMount() {
    var smtp = document.createElement("script");
    smtp.type = "text/javascript";
    smtp.src = "https://smtpjs.com/v2/smtp.js";
    // Once the Google API Client is loaded, you can run your code
    smtp.onload = function(e) {
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
          <TextArea rows={4} value={this.state.emailContent+"/n https://hiveautomation-c5f65.firebaseapp.com/payment/"+this.state.selectedEmail} onChange={(e)=>{this.setState({emailContent:e.target.value})}}/>
        </Modal>
        <Button type="danger" id="firebaseui-auth-container" onClick={() => firebase.auth().signOut()}>Sign-out</Button>
        <br/><br/><br/><br/><br/><br/><br/><br/><br/>
        <form action="https://us-central1-hiveautomation-c5f65.cloudfunctions.net/addData" target="https://www.google.com">
          name: <input type="text" name="name" required/><br/>
          email: <input type="text" name="email" required/><br/>
          why1: <input type="text" name="why1" required/><br/>
          why2: <input type="text" name="why2" required/><br/>
          Team Members: <input type="number" name="teamNumber" required/><br/>
          <input type="submit" value="Submit"/>
        </form>
      </div>
    );
  }
}