import React, { Component } from 'react';
// import Entry from './Entry'
import './App.css';
import { Table, Icon, Button } from 'antd';
import 'antd/dist/antd.css';


const columns = [{
  title: 'Name',
  dataIndex: 'name',
  key: 'name',
  width: 170,
  render: text => <div>{text}</div>,
}, {
  title: 'Email',
  dataIndex: 'email',
  key: 'email',
  width: 170,
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
  title: '',
  key: 'action1',
  width: 70,
  render: (text, record) => (
      <div>
        {console.log(record)}
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
  title: '',
  key: 'action3',
  width: 50,
  render: (text, record) => (
    <span>
      <Button type="danger" shape="circle" icon="delete" />
    </span>
  ),
}];

const data = [
  {
    key: 1,
    name: 'John Brown',
    email: 'kawji@thedive.com',
    why: `New York No.  Lake Park`,
    description: `My name is John Brown, I am 2 years old, living2 years old, living in New York No. $Lake Park.`,
  },
  {
    key: 2,
    name: 'John Brown',
    email: 'kawji@thedive.com',
    why: `New York No.  Lake Park`,
    description: `My name is John Brown, I am 2 years old, living2 years old, living in New York No. $Lake Park.`,
    done:true,
  },
  {
    key: 3,
    name: 'John Brown',
    email: 'kawji@thedive.com',
    why: `New York No.  Lake Park`,
    description: `My name is John Brown, I am 2 years old, living2 years old, living in New York No. $Lake Park.`,
  },
  {
    key: 4,
    name: 'John Brown',
    email: 'kawji@thedive.com',
    why: `New York No.  Lake Park`,
    description: `My name is John Brown, I am 2 years old, living2 years old, living in New York No. $Lake Park.`,
  },
];
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

class DataTable extends React.Component {
  state = {
    bordered: true,
    loading: false,
    pagination: false,
    size: 'default',
    title: undefined,
    showHeader,
    rowSelection: {},
    scroll: undefined,
    hasData: true,
  }


  render() {
    const state = this.state;

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
