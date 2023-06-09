import FrontPage from './frontpage.js';
import Logged from './logged.js';
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';
import axios from 'axios';
import React from 'react';
import { io } from 'socket.io-client';

axios.defaults.withCredentials = true;

const socket = io('https://chatapp-api-6dvw.onrender.com', {
  autoConnect: false,
  transports: ['websocket']
});

let connected = false;

socket.on('connect', () => {
  connected = true;
});

socket.on('connect_error', () => {
  connected = false;
});

socket.on('connect_timeout', () => {
  connected = false;
});

const NEW_MESSAGE = 'NEW_MESSAGE';
const CHANGE_CHAT = 'CHANGE_CHAT';
const LOGIN = 'LOGIN';
const LOGOUT = 'LOGOUT';
const RELOAD_CHATS = 'RELOAD_CHATS';
const CHATS = 'CHATS';

const DEFAULT = {
  username: '',
  chats: [],
  curNum: -1,
  curName: '',
  loading: false
};

const sendMessage = (msg) => {
  return {
    type: NEW_MESSAGE,
    message: msg
  };
}

const changeChat = (nm) => {
  return {
    type: CHANGE_CHAT,
    name: nm
  };
}

const login = (username) => {
  return {
    type: LOGIN,
    username: username
  };
}

const logout = () => {
  return {
    type: LOGOUT
  };
}

const reload = () => {
  return {
    type: RELOAD_CHATS
  };
}

const chats = (chats) => {
  return {
    type: CHATS,
    chats: chats
  }
}

const reducer = (state = DEFAULT, action) => {
  let res = null;
  switch (action.type) {
    case LOGIN:
      res = {
        ...state,
        username: action.username,
        loading: true
      };
      socket.connect();
      return res;
    case CHANGE_CHAT:
      return {
        ...state,
        curName: action.name
      };
    case LOGOUT:
      return DEFAULT;
    case NEW_MESSAGE:
      res = { ...state };
      if (connected) {
        socket.emit('message', {
          from: res.username,
          to: res.curName,
          message: action.message
        }, (response) => {
          if (response.status === "error")
            console.log("Not sent, server error");
          else {
            console.log("success");
          }
        });
      } else {
      }
      return res;
    case RELOAD_CHATS:
      res = { ...state };
      res.loading = true;
      return res;
    case CHATS:
      res = {
        ...state,
        loading: false,
        chats: action.chats
      };
      if (res.curNum === -1 && res.chats.length > 0) {
        res.curNum = 0;
        res.curName = res.chats[0].user1 === res.username ? res.chats[0].user2 : res.chats[0].user1;
      }
      return res;
    default:
      return state;
  }
}

const store = createStore(reducer, DEFAULT);

socket.on('message', () => {
  store.dispatch(reload());
})

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chats: this.props.chats,
      curName: this.props.curName,
      curNum: this.props.curNum,
      username: this.props.username,
      changeChat: this.props.changeChat,
      logout: this.props.logout,
      sendMessage: this.props.sendMessage,
      login: this.props.login,
      reload: this.props.reload,
      loading: this.props.loading
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.chats !== this.props.chats || prevProps.username !== this.props.username || prevProps.curName !== this.props.curName || prevProps.curNum !== this.props.curNum || prevProps.loading !== this.props.loading) {
      this.setState({
        chats: this.props.chats,
        curName: this.props.curName,
        curNum: this.props.curNum,
        username: this.props.username,
        changeChat: this.props.changeChat,
        logout: this.props.logout,
        sendMessage: this.props.sendMessage,
        login: this.props.login,
        reload: this.props.reload,
        loading: this.props.loading
      });

      if (this.props.loading) {
        axios.get("https://chatapp-api-6dvw.onrender.com/chats?username=" + this.props.username, {
          withCredentials: true,
          headers: {
            'Access-Control-Allow-Origin': 'https://azerty0220pl.github.io'
          }
        }).then((data) => {
          this.props.loadChats(data.data.chats);
        });
      }
    }
  }

  render() {
    return (
      <div className='container-fluid d-flex flex-column align-items-center justify-content-center w-100 h-100'>
        {
          this.state.username.length === 0 ? <FrontPage login={this.state.login} reload={this.state.reload} />
            : <Logged
              chats={this.state.chats}
              curNum={this.state.curNum}
              curName={this.state.curName}
              username={this.state.username}
              changeChat={this.state.changeChat}
              logout={this.state.logout}
              sendMessage={this.state.sendMessage}
              reload={this.state.reload} />
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    username: state.username,
    chats: state.chats,
    curNum: state.curNum,
    curName: state.curName,
    loading: state.loading
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    login: (username) => {
      return dispatch(login(username));
    },
    changeChat: (user) => {
      return dispatch(changeChat(user));
    },
    logout: () => {
      return dispatch(logout());
    },
    sendMessage: (msg) => {
      return dispatch(sendMessage(msg));
    },
    reload: () => {
      return dispatch(reload());
    },
    loadChats: (c) => {
      return dispatch(chats(c));
    }
  };
};

const Container = connect(mapStateToProps, mapDispatchToProps)(App);

function x() {
  return <Provider store={store}><Container /></Provider>;
}

export default x;
