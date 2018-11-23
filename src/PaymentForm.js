import React from 'react';
import './App.css';
import * as firebase from 'firebase';
import {CardElement, injectStripe, Elements, StripeProvider} from 'react-stripe-elements';
import { Redirect } from "react-router-dom";

// const INITIAL_PRICE = 25;

const config = {
  apiKey: "AIzaSyCEeSAoo9PfTT1aK4CMgC_rhcCZ6H7HTmM",
  authDomain: "hiveautomation-c5f65.firebaseapp.com",
  databaseURL: "https://hiveautomation-c5f65.firebaseio.com",
  projectId: "hiveautomation-c5f65",
  storageBucket: "hiveautomation-c5f65.appspot.com",
  messagingSenderId: "828985598310",
  clientId: "828985598310-i29pqh0hc08bitv4icrnb8q2n8ihs34c.apps.googleusercontent.com",
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
const handleBlur = () => console.log('[blur]');
const handleChange = (change) => console.log('[change]', change);
// const handleClick = () => console.log('[click]');
const handleFocus = () => console.log('[focus]');


const createOptions = (fontSize, padding) => {
  return {
    style: {
      base: {
        fontSize,
        color: '#424770',
        letterSpacing: '0.025em',
        fontFamily: 'Source Code Pro, monospace',
        '::placeholder': {
          color: '#aab7c4',
        },
        padding,
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };
};



class _CardForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      INITIAL_PRICE:  1,
      teamNumber :    1,
      selection:      1,
      customer:       {name: '',email: '',teamNumber: 0,why1:'',why2:'', accountType: '', paid: false},
      updated:        false
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleReady = this.handleReady.bind(this)
  }
  updatePayments = firebase.functions().httpsCallable('updatePayments')
  handleReady = () => this.setState({ready:true});
  handleSubmit = (ev) => {
    ev.preventDefault();
    if (this.props.stripe) {
      this.props.stripe
        .createToken()
        .then((payload) => {
          database.ref('/users/'+ this.state.customer.email.replace(/[^a-zA-Z ]/g, '') + '/token/').set(payload.token)
          database.ref('/users/'+ this.state.customer.email.replace(/[^a-zA-Z ]/g, '') + '/metaData/').set({
            strasse:          this.state.strasse,
            hausNummer:       this.state.hausNummer,
            plz:              this.state.plz,
            stadt:            this.state.stadt,
            name:             this.state.customer.name,
            email:             this.state.customer.email,
          })
          
          this.updatePayments();
          this.setState({updated: true})
        });
    } else {
      console.log("Stripe.js hasn't loaded yet.");
    }
  };
  componentDidMount(){
    database.ref('/users/'+this.props.email.replace(/[^a-zA-Z ]/g, "")+'/').once('value').then((snapshot)=>{
      this.setState({customer: snapshot.val()})
      if(snapshot.val().accountType === 'Basic'){
        this.setState({INITIAL_PRICE: 10})
      }
      if(snapshot.val().accountType === 'Individual'){
        this.setState({INITIAL_PRICE: 20})
      }
      if(snapshot.val().accountType === 'Entrepeneur'){
        this.setState({INITIAL_PRICE: 30})
      }
      if(snapshot.val().accountType === 'Corporate'){
        this.setState({INITIAL_PRICE: 40})
      }
      if(snapshot.val().paid){
        this.setState({updated: true})
      }
    })
    
  }
  render() {
    return (
      <form onSubmit={this.handleSubmit} style={{
        width:      '500px',
        margin:     '0 auto',
        marginTop:  '50px'
      }}>
        {(this.state.updated ) && <Redirect to="/thanks"/>}
        <input name="name" type="text" placeholder={"Name: "+this.state.customer.name} disabled />
        <input name="email" type="text" placeholder={"Email: "+this.state.customer.email} disabled />
        <input  placeholder={this.state.customer.teamNumber + " Team Members"} disabled />
        <input  placeholder={this.state.customer.why1 + " "} disabled />
        <input  placeholder={this.state.customer.why2 + " "} disabled />
        <input  placeholder={this.state.customer.accountType + " "} disabled />
        <br/>
        <br/>
        <div style={{textAlign: 'center', width: '500px'}} >
          <span style={{fontSize: '18px'}}>Rechnung Adresse</span>
        </div>
        
        <br/>
        <label>Firma</label>
        <input value={this.state.firma} onChange={(e)=>this.setState({firma: e.target.value})} style={{width:'500px'}} />
        <br/>
        <div className="line" style={{display: 'flex', flexDirection:'row', justifyContent:'space-between', width: '100%'}}>
          <div>
            <label>Straße*</label>
            <input  value={this.state.strasse} onChange={(e)=>this.setState({strasse: e.target.value})} style={{width:'350px'}} required/>
          </div>
          <div>
            <label>Hausnummer*</label>
            <input  value={this.state.hausNummer} onChange={(e)=>this.setState({hausNummer: e.target.value})}  style={{width:'130px'}} required/>
          </div>
        </div>
        <br/>
        <div className="line" style={{display: 'flex', flexDirection:'row', justifyContent:'space-between', width: '100%'}}>
          <div>
            <label>PLZ*</label>
            <input value={this.state.plz} onChange={(e)=>this.setState({plz: e.target.value})} style={{width:'200px'}} required/>
          </div>
          <div>
            <label>Stadt*</label>
            <input  value={this.state.stadt} onChange={(e)=>this.setState({stadt: e.target.value})}  style={{width:'280px'}} required />
          </div>
        </div>
        <br/>
        <br/>
       
        
      
        <label>Card Details</label>
        <CardElement
            onBlur={handleBlur}
            onChange={handleChange}
            onFocus={handleFocus}
            onReady={this.handleReady}
            {...createOptions(this.props.fontSize)}
          />
        {(this.state.teamNumber > 0 && this.state.strasse && this.state.hausNummer && this.state.plz && this.state.stadt && this.state.ready )&&<button >Pay {this.state.customer.teamNumber * this.state.INITIAL_PRICE }€ </button>}
      </form>
    );
  }
}
const CardForm = injectStripe(_CardForm);

export default class PaymentForm extends React.Component {
  render() {
    return (
      <div>
        <StripeProvider apiKey="pk_test_gsi7psKKygJDd3aO27kSEkVw">
          <Elements>
            <CardForm fontSize={'16px'} email={this.props.match.params.email} />
          </Elements>
        </StripeProvider>
      </div>
    );
  }
}
