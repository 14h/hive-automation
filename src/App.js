import React, { Component } from 'react';
import './App.css';
import { Table, Icon, Button } from 'antd';
import 'antd/dist/antd.css';


// for (let i = 1; i <= 50; i++) {
//   data.push({
//     key: i,
//     name: 'John Brown',
//     email: 'kawji@thedive.com',
//     why: `New York No. ${i} Lake Park`,
//     description: `My name is John Brown, I am ${i}2 years old, living2 years old, living in New York No. ${i} Lake Park.`,
//   });
// }

// const expandedRowRender = record => <p>{record.description}</p>;
// const title = () => 'Here is title';
const showHeader = true;
// const footer = () => 'Here is footer';
// const scroll = { y: 240 };
// const pagination = { position: 'bottom' };

// rowSelection object indicates the need for row selection
// const rowSelection = {
//   onChange: (selectedRowKeys, selectedRows) => {
//     console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
//   },
//   getCheckboxProps: record => ({
//     disabled: record.name === 'Disabled User', // Column configuration not to be checked
//     name: record.name,
//   }),
// };

class DataTable extends React.Component {
  state = {
    bordered: true,
    loading: false,
    pagination: false,
    size: 'default',
    title: undefined,
    showHeader,
    selectedRows:[],
    rowSelection: {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
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
        key: 1,
        name: 'John Brown',
        email: 'kawj1i@thedive.com',
        why: `New York No.  Lake Park`,
        description: `My name is John Brown, I am 2 years old, living2 years old, living in New York No. $Lake Park.`,
      },
      {
        key: 2,
        name: 'John Brown',
        email: 'kawji2@thedive.com',
        why: `New York No.  Lake Park`,
        description: `My name is John Brown, I am 2 years old, living2 years old, living in New York No. $Lake Park.`,
        done:true,
      },
      {
        key: 3,
        name: 'John Brown',
        email: 'kawj3i@thedive.com',
        why: `New York No.  Lake Park`,
        description: `My name is John Brown, I am 2 years old, living2 years old, living in New York No. $Lake Park.`,
      },
      {
        key: 4,
        name: 'John Brown12',
        email: 'kawji4@thedive.com',
        why: `New York No.  Lake Park`,
        description: `My name is John Brown, I am 2 years old, living2 years old, living in New York No. $Lake Park.`,
      },
    ],
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
      dataIndex: 'why',
      key: 'why',
      width: 500,
    }, {
      title: 'Warum möchtest du Teil des Hives sein?',
      dataIndex: 'description',
      key: 'description',
      width: 500,
    }, {
      title: <Icon type="check-circle" theme="outlined"  style={{ fontSize: '25px', color: 'transparent' }}  /> ,
      key: 'action1',
      width: 70,
      render: (text, record) => (
          <div>
            {/* {console.log(record)} */}
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
              console.log(selectedEmail)
              this.delete(selectedEmail)
            }}/>
        </span>
      ),
    }]
  }

  delete(email){
    this.setState((state) => {
      return {data: state.data.filter(entry => entry.email !== email) };
    });
  }
  

  render() {
    const state = this.state;
    console.log(this.state)
    // console.log(this.state.rowSelection.getCheckboxProps())

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
      </div>
    );
  }
}

export default App;
