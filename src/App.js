import React from 'react';
import './App.css';
import Dashboard from './Dashboard';
import PaymentForm from './PaymentForm';
import {  Route } from "react-router-dom";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  render() {
    return (
      <div>
        <Route exact path="/dashboard" component={Dashboard} />
        <Route exact path="/payment/:email" component={PaymentForm} />  
      </div>
    );
  }
}