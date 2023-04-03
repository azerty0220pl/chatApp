import FrontPage from './frontpage.js';
import Logged from './logged.js';
import { createStore } from 'redux';
import { Provider, connect} from 'react-redux';
import axios from 'axios';
import React from 'react';

const NEW_MESSAGE = 'NEW_MESSAGE';
const CHANGE_CHAT = 'CHANGE_CHAT';
const GET = 'GET';
const LOGIN = 'LOGIN';
const LOGOUT = 'LOGOUT';

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

const login = (user) => {
    return {
        type: LOGIN,
        user: user
    };
}
const logout = () => {
    return {
        type: LOGOUT
    };
}

const reducer = async (state = DEFAULT, action) => {
  switch(action.type) {
      case LOGIN:
          let res = null;
          await axios({
              method: "GET",
              url: "https://chatapp-api-6dvw.onrender.com/chats"
          }).then((data) => {
              res = {
                  username: action.user.username,
                  chats: data.chats,
                  curNum: 0,
                  curName: data.chats[0].user1 === action.user.username ? data.chats[0].user2 : data.chats[0].user1
              }
          });
          return res;
  }
}

const store = createStore(reducer, DEFAULT);

class App extends React.Component {
  render() {
    return (
      <div className='container-fluid d-flex flex-column align-items-center justify-content-center w-100 h-100'>
        {
          () => {
            if(this.props.username.length == 0)
              return <FrontPage login={this.props.login} />;
            else
              return <Logged />;
          }
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
      login: () => {
          return dispatch(login());
      }
  };
};

const Container = connect(mapStateToProps, mapDispatchToProps)(App);

export default (<Provider store={store}><Container /></Provider>);
