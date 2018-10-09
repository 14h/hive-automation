import React, { Component } from 'react';
import Entry from './Entry'
import './App.css';
import { Table, Icon, Switch, Radio, Form, Divider } from 'antd';
import 'antd/dist/antd.css';

const FormItem = Form.Item;

const columns = [{
  title: 'Name',
  dataIndex: 'name',
  key: 'name',
  width: 150,
  render: text => <div>{text}</div>,
}, {
  title: 'Email',
  dataIndex: 'email',
  key: 'email',
  width: 170,
}, {
  title: 'Address',
  dataIndex: 'address',
  key: 'address',
  width: 500,
}, {
  title: 'description',
  dataIndex: 'description',
  key: 'description',
  width: 500,
}, {
  title: 'Action',
  key: 'action',
  width: 100,
  render: (text, record) => (
    <span>
      
      <a href="javascript:;">Delete</a>
      {/* <Divider type="vertical" /> */}
      
    </span>
  ),
}];

const data = [];
for (let i = 1; i <= 50; i++) {
  data.push({
    key: i,
    name: 'John Brown',
    email: 'kawji@thedive.com',
    address: `New York No. ${i} Lake Park`,
    description: `My name is John Brown, I am ${i}2 years old, living2 years old, living in New York No. ${i} Lake Park.`,
  });
}

const expandedRowRender = record => <p>{record.description}</p>;
const title = () => 'Here is title';
const showHeader = true;
const footer = () => 'Here is footer';
const scroll = { y: 240 };
const pagination = { position: 'bottom' };

class DataTable extends React.Component {
  state = {
    bordered: true,
    loading: false,
    pagination: false,
    size: 'default',
    // expandedRowRender,
    title: undefined,
    showHeader,
    // footer,
    rowSelection: {},
    scroll: undefined,
    hasData: true,
  }


  render() {
    const state = this.state;
    console.log(this.state.rowSelection)
    return (
      <div>
        <Table {...this.state} columns={columns} scroll={{ y: '90vh' }} dataSource={state.hasData ? data : null} />
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
