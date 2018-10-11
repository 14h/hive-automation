import React, { Component } from 'react';

// import axios from 'axios';
// import https from 'https';
import './App.css';
import { Table, Icon, Button } from 'antd';
import 'antd/dist/antd.css';


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
        title: <Button>Approve</Button>,
        key: 'action2',
        width: 70,
        render: (text, record) => (
            <Button>Approve</Button>
        ),
      }, {
        title: <Button type="danger" shape="circle" icon="delete" onClick={()=>{
                  this.state.selectedRows.forEach(selectedEmail=>this.delete(selectedEmail))
                  
                }}/>,
        key: 'action3',
        width: 50,
        render: (text, record) => (
          <span>
            <Button type="danger" shape="circle" icon="delete" onClick={(e)=>{
                let selectedEmail = e.target.parentElement.parentElement.parentElement.children[2].textContent;
                this.delete(selectedEmail)
              }}/>
          </span>
        ),
      }]
    }
    this.getJSONData = this.getJSONData.bind(this);
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







  delete(email){

    // this.setState((state) => {
    //   return {data: state.data.filter(entry => entry.email !== email) };
    // });


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
  componentWillMount(){
    console.log("called")
    this.getJSONData();
  }

  render() {
    const state = this.state;

    this.getJSONData();


    return (
      <div>
        <Table {...this.state} columns={this.state.columns} scroll={{ y: '90vh' }} dataSource={state.hasData ? this.state.data : null} />
      </div>
    );
  }
}


class App extends Component {
  
  render() {
    return (
      <div className="App">
        <DataTable />
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

export default App;
