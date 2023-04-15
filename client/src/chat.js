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
            <div className="d-flex flex-column justify-content-between w-75 h-100 card">
                <div className="d-flex justify-content-center align-items-center card-header">
                    <h4 className="text-center m-0">{this.props.curName}</h4>
                </div>
                <div className="d-flex flex-column-reverse h-100 overflow-auto">
                    <ul className="list-group list-group-flush">
                        {
                            this.state.chat === null ? <li className="group-list-items text-center">No messages</li> :
                                this.state.message.map((m, index) => {
                                    return <li className="list-group-item" key={index}>
                                            <div className={"w-100 d-flex align-items-center justify-content-" + (m.sender === this.props.username ? "end" : "start")}>
                                                <div style={{"max-width": "75%"}} className={m.sender === this.props.username ? "card bg-primary" : "card bg-light"}>
                                                    <p className="fw-bold text-start mx-2 my-0">{m.message}</p>
                                                    <p className="mx-3 my-0 text-end">{new Date(m.date).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        </li>;
                                })
                        }
                    </ul>
                </div>
                <div className="d-flex jusitfy-content-between card-footer">
                    <input type="text" className="form-control" onChange={this.updateMsg} value={this.state.toSend} onKeyUp={e => { if (e.key === 'Enter') this.send()}} />
                    <button className="btn btn-primary rounded-pill mx-1" onClick={this.send}>Send</button>
                </div>
            </div>
        );
    }
}

export default Chat;