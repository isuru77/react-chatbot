import React, {Component} from 'react'
import ReactDOM, {render} from 'react-dom'
import {Launcher} from '../../src'
import messageHistory from './messageHistory';
import TestArea from './TestArea';
import Header from './Header';
import Footer from './Footer';
import monsterImgUrl from "./../assets/monster.png";
import Highlight from "react-highlight.js";
import './../assets/styles'



class Demo extends Component {

  constructor() {
    super();
    this.state = {
      messageList: messageHistory,
      newMessagesCount: 0,
      isOpen: false
    };
  }

  _onMessageWasSent(message) {
    var url = 'http://localhost:5000/';

    fetch(url, {
      method: 'POST', // or 'PUT'
      body: JSON.stringify(message), // data can be `string` or {object}!
      headers:{
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
    .then(response =>  this._sendMessage(JSON.stringify(response)))
    .catch(error => console.error('Error:', error));
    this.setState({
      messageList: [...this.state.messageList, message]
    });
    // fetch('http://localhost:5000/')
    //   .then(response => response.json())
    //   .then(data => this._sendMessage(data));
  }

  _onFilesSelected(fileList) {
    const objectURL = window.URL.createObjectURL(fileList[0]);
    this.setState({
      messageList: [...this.state.messageList, {
        type: 'file', author: "me",
        data: {
          url: objectURL,
          fileName: fileList[0].name
        }
      }]
    })
  }

  _sendMessage(text) {
    if (text.length > 0) {
      const newMessagesCount = this.state.isOpen ? this.state.newMessagesCount : this.state.newMessagesCount + 1
      this.setState({
        newMessagesCount: newMessagesCount,
        messageList: [...this.state.messageList, {
          author: 'them',
          type: 'text',
          data: { text }
        }]
      })
    }
  }

  _handleClick() {
    this.setState({
      isOpen: !this.state.isOpen,
      newMessagesCount: 0
    })
  }

  render() {
    return <div>
      <Header />
      <TestArea
        // onMessage={this._sendMessage.bind(this)}
      />
      <Launcher
        agentProfile={{
          teamName: 'Prodoscore Chatbot',
          imageUrl: 'demo\\assets\\prod.png'
        }}
        onMessageWasSent={this._onMessageWasSent.bind(this)}
        onFilesSelected={this._onFilesSelected.bind(this)}
        onMessage={this._sendMessage.bind(this)}
        messageList={this.state.messageList}
        newMessagesCount={this.state.newMessagesCount}
        handleClick={this._handleClick.bind(this)}
        isOpen={this.state.isOpen}
        showEmoji
      />
      <img className="demo-monster-img" src={monsterImgUrl} />
      <Footer />
    </div>
  }
}

render(<Demo/>, document.querySelector('#demo'))
