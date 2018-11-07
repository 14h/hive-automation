import React from 'react';
import './App.css';
import * as firebase from 'firebase';
import {CardElement, injectStripe, Elements, StripeProvider} from 'react-stripe-elements';
import { Redirect } from "react-router-dom";

const INITIAL_PRICE = 25;

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
const handleReady = () => console.log('[ready]');

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
      teamNumber :    1,
      selection:      1,
      customer:       {name: '',email: '',teamNumber: 0,why1:'',why2:''},
      updated:        false
    }
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  updatePayments = firebase.functions().httpsCallable('updatePayments')
  handleSubmit = (ev) => {
    ev.preventDefault();
    if (this.props.stripe) {
      this.props.stripe
        .createToken()
        .then((payload) => {
          database.ref('/users/'+ this.state.customer.email.replace(/[^a-zA-Z ]/g, '') + '/token/').set(payload.token)
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
      if(snapshot.val().paid){
        this.setState({updated: true})
      }
    })
    
  }
  render() {
    return (
      <form onSubmit={this.handleSubmit} style={{
        width: '500px',
        margin: '0 auto',
      }}>
        {this.state.updated && <Redirect to="/thanks"/>}
        <input name="name" type="text" placeholder={"Name: "+this.state.customer.name} disabled />
        <input name="email" type="text" placeholder={"Email: "+this.state.customer.email} disabled />
        <input  placeholder={this.state.customer.teamNumber + " Team Members"} disabled />
        <input  placeholder={this.state.customer.why1 + " "} disabled />
        <input  placeholder={this.state.customer.why2 + " "} disabled />
        <br/>
        <label>Card Details</label>
        <CardElement
            onBlur={handleBlur}
            onChange={handleChange}
            onFocus={handleFocus}
            onReady={handleReady}
            {...createOptions(this.props.fontSize)}
          />
        {this.state.teamNumber > 0 &&<button>Pay {this.state.customer.teamNumber * INITIAL_PRICE }€ </button>}
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
