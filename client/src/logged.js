import React from "react";
import Chat from "./chat.js"
import Contact from "./contact.js"

class Logged extends React.Component {
    render() {
        return (
            <div id="logged" className="card d-flex flex-row h-75 w-75 justify-content-evenly">
                <Contact
                    chats={this.props.chats}
                    curNum={this.props.curNum}
                    curName={this.props.curName}
                    username={this.props.username}
                    changeChat={this.props.changeChat}
                    logout={this.props.logout} />
                <div className="border-end m-1" />
                <Chat />
            </div>
        );
    }
}

export default Logged;