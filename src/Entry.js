import React, { Component } from 'react';

export default class Entry extends Component {
  
  render() {
    return (
      <div className="Entry">
       <div className="name">
        {this.props.entry.name}
       </div>
       <div className="email">
        {this.props.entry.email}
       </div>
       <div className="why">
        {this.props.entry.why}
       </div>
      </div>
    );
  }
}


