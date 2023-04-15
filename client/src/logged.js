import React from "react";
import Chat from "./chat.js"
import Contact from "./contact.js"

class Logged extends React.Component {
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
            reload: this.props.reload
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.chats !== this.props.chats || prevProps.username !== this.props.username || prevProps.curName !== this.props.curName || prevProps.curNum !== this.props.curNum) {
            this.setState({
                chats: this.props.chats,
                curName: this.props.curName,
                curNum: this.props.curNum,
                username: this.props.username,
                changeChat: this.props.changeChat,
                logout: this.props.logout,
                sendMessage: this.props.sendMessage,
                reload: this.props.reload
            });
        }
    }

    render() {
        return (
            <div id="logged" className="card d-flex flex-row h-75 w-75 justify-content-evenly">
                <Contact
                    chats={this.state.chats}
                    curNum={this.state.curNum}
                    curName={this.state.curName}
                    username={this.state.username}
                    changeChat={this.state.changeChat}
                    logout={this.state.logout}
                    reload={this.state.reload} />
                <div className="border-end m-1" />
                <Chat
                    chats={this.state.chats}
                    curNum={this.state.curNum}
                    curName={this.state.curName}
                    sendMessage={this.state.sendMessage}
                    username={this.state.username} />
            </div>
        );
    }
}

export default Logged;