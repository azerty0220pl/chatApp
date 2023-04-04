import React from "react";

class Chat extends React.Component {
    constructor(props){
        super(props);
        
        let chat = null;
        this.props.chats.array.forEach(c => {
            if(c.user1 === this.props.curName || c.user2 === this.props.curName)
                chat = c;
        });

        this.state = {
            name: this.props.curName,
            chat: chat,
            message: chat.messages.map(m => {
                return JSON.parse(m);
            }).sort((a, b) => {
                if(a.date > b.date)
                    return 1;
                else 
                    return -1;
            })
        }

        this.send = this.send.bind(this);
        this.updateMsg = this.updateMsg.bind(this);
    }

    send(e) {
        this.props.sendMessage(this.state.message);
        this.setState({message: ''});
    }

    updateMsg(e){
        this.setState({message: msg})
    }

    render() {
        return (
            <div className="d-flex align-items-between w-75">
                <div>
                    <h1>{this.props.curName}</h1>
                </div>
                <div>
                    {
                        this.state.chat.isNull() ? <p className="text-center">No messages</p> :
                            this.chat.messages1.map((m) => {
                                return <div className={m.sender === this.props.username ? "bg-primary" : "bg-secondary"}><h6>{m.message}</h6><p>{m.date}</p></div>;
                            })
                    }
                </div>
                <div className="d-flex w-100">
                    <input type="text" className="form-control" onChange={this.updateMsg} />
                    <button className="btn btn-primary rounded-pill mx-1" onClick={this.send}>Send</button>
                </div>
            </div>
        );
    }
}

export default Chat;