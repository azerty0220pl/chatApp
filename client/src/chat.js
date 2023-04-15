import React from "react";

class Chat extends React.Component {
    constructor(props) {
        super(props);

        let chat = null;
        if (this.props.chats.length > 0) {
            this.props.chats.forEach(c => {
                if (c.user1 === this.props.curName || c.user2 === this.props.curName)
                    chat = c;
            });
        }

        let message = null;
        if (chat !== null)
            message = chat.messages.map(m => {
                return JSON.parse(m);
            }).sort((a, b) => {
                if (a.date > b.date)
                    return 1;
                else
                    return -1;
            });
        this.state = {
            name: this.props.curName,
            chat: chat,
            message: message,
            toSend: ''
        }

        this.send = this.send.bind(this);
        this.updateMsg = this.updateMsg.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState){
        if(nextState.toSend !== this.state.toSend) {
            return false;
        }
        return true;
    }

    componentDidUpdate(prevProps) {
        if (this.props.chats !== prevProps.chats || this.props.curName !== prevProps.curName) {
            let chat = null;
            if (this.props.chats.length > 0) {
                this.props.chats.forEach(c => {
                    if (c.user1 === this.props.curName || c.user2 === this.props.curName)
                        chat = c;
                });
            }

            let message = null;
            if (chat !== null)
                message = chat.messages.map(m => {
                    return JSON.parse(m);
                }).sort((a, b) => {
                    if (a.date > b.date)
                        return 1;
                    else
                        return -1;
                });
            this.setState({
                name: this.props.curName,
                chat: chat,
                message: message
            });
        }
    }

    send(e) {
        this.props.sendMessage(this.state.toSend);
        this.setState({ toSend: '' });
    }

    updateMsg(e) {
        this.setState({ toSend: e.target.value })
    }

    render() {
        return (
            <div className="d-flex align-items-between w-75">
                <div>
                    <h1>{this.props.curName}</h1>
                </div>
                <div>
                    <ul>
                        {
                            this.state.chat === null ? <p className="text-center">No messages</p> :
                                this.state.message.map((m, index) => {
                                    return <li key={index}><div className={m.sender === this.props.username ? "bg-primary" : "bg-secondary"}><h6>{m.message}</h6><p>{m.date}</p></div></li>;
                                })
                        }
                    </ul>
                </div>
                <div className="d-flex w-100">
                    <input type="text" className="form-control" onChange={this.updateMsg} value={this.state.toSend} />
                    <button className="btn btn-primary rounded-pill mx-1" onClick={this.send}>Send</button>
                </div>
            </div>
        );
    }
}

export default Chat;