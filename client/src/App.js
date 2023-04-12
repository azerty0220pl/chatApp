import FrontPage from './frontpage.js';
import Logged from './logged.js';
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';
import axios from 'axios';
import React from 'react';
import { io } from 'socket.io-client';

axios.defaults.withCredentials = true;

const socket = io('https://chatapp-api-6dvw.onrender.com', {
  autoConnect: false
});

const NEW_MESSAGE = 'NEW_MESSAGE';
const CHANGE_CHAT = 'CHANGE_CHAT';
const GET = 'GET';
const LOGIN = 'LOGIN';
const LOGOUT = 'LOGOUT';
const RELOAD_CHATS = 'RELOAD_CHATS';

const DEFAULT = {
  username: '',
  chats: [],
  curNum: -1,
  curName: ''
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

const get = () => {
  return {
    type: GET
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

socket.on('message', reload);

const reducer = (state = DEFAULT, action) => {
  let res = null;
  switch (action.type) {
    case LOGIN:
      axios.get("https://chatapp-api-6dvw.onrender.com/chats?username=" + action.username, {
        withCredentials: true,
        headers: {
          'Access-Control-Allow-Origin': 'https://azerty0220pl.github.io/chatApp'
        }
      }).then((data) => {
        let name = ''
        if (data.data.chats.length > 0)
          name = data.data.chats[0].user1 === action.user.username ? data.data.chats[0].user2 : data.data.chats[0].user1;
        res = {
          username: action.username,
          chats: data.data.chats,
          curNum: 0,
          curName: name
        }
        socket.connect('https://chatapp-api-6dvw.onrender.com');
        return res;
      });
      break;
    case CHANGE_CHAT:
      return {
        curName: action.name,
        ...state
      };
      break;
    case LOGOUT:
      axios.get("https://chatapp-api-6dvw.onrender.com/logout", {
        withCredentials: true,
        headers: {
          'Access-Control-Allow-Origin': 'https://azerty0220pl.github.io/chatApp'
        }
      }).then((data) => {
        socket.disconnect();
        return DEFAULT;
      });
      break;
    case NEW_MESSAGE:
      res = { ...state };
      socket.emit('message', {
        from: res.username,
        to: res.curName,
        message: action.message
      })
      return res;
      break;
    case RELOAD_CHATS:
      axios.get("https://chatapp-api-6dvw.onrender.com/chats?username=" + state.username, {
        withCredentials: true,
        headers: {
          'Access-Control-Allow-Origin': 'https://azerty0220pl.github.io'
        }
      }).then((data) => {
        console.log(data);
        let name = ''
        if (data.chats.length > 0)
          name = data.chats[0].user1 === action.user.username ? data.chats[0].user2 : data.chats[0].user1;
        res = {
          ...state,
          chats: data.chats
        }
        return res;
      });
      break;
    default:
      return state;
  }
}

const store = createStore(reducer, DEFAULT);

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='container-fluid d-flex flex-column align-items-center justify-content-center w-100 h-100'>
        {
          this.props.username.length === 0 ? <FrontPage login={this.props.login} />
            : <Logged
              chats={this.props.chats}
              curNum={this.props.curNum}
              curName={this.props.curName}
              username={this.props.username}
              changeChat={this.props.changeChat}
              logout={this.props.logout}
              sendMessage={this.props.sendMessage} />
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
    curName: state.curName
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    login: (username) => {
      return dispatch(login(username));
    },
    changeChat: (e, user) => {
      return dispatch(changeChat(user.isNull() ? e.target.value : user));
    },
    logout: () => {
      return dispatch(logout());
    },
    sendMessage: (e, msg) => {
      return dispatch(sendMessage(msg));
    }
  };
};

const Container = connect(mapStateToProps, mapDispatchToProps)(App);

function x() {
  return <Provider store={store}><Container /></Provider>;
}

export default x;
