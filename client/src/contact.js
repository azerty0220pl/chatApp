import React from "react";

class Contact extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            write: '',
            chats: this.props.chats
        }

        this.handleWrite = this.handleWrite.bind(this);
        this.changeChat1 = this.changeChat1.bind(this);
        this.changeChat2 = this.changeChat2.bind(this);
    }

    handleWrite(e) {
        this.setState({ write: e.target.value });
    }

    changeChat1(e) {
        this.props.changeChat(this.state.write);
        this.setState({ write: '' });
    }

    changeChat2(name) { 
        this.props.changeChat(name);
    }

    render() {
        return (
            <div className="d-flex flex-column card">
                <ul className="list-group list-group-flush">
                    <li className="list-group-item d-flex flex-row justify-content-between align-items-center">
                        <h3 className="m-0">{this.props.username}</h3>
                        <button className="btn btn-danger rounded-circle" onClick={this.props.logout}>x</button>
                    </li>
                    <li  className="list-group-item d-flex flex-row justify-content-between align-items-center">
                        <input type="text" className="form-control" onChange={this.handleWrite} value={this.state.write} onKeyUp={e => { if (e.key === 'Enter') this.changeChat1()}} />
                        <button className="btn btn-primary rounded-pill mx-1" onClick={this.changeChat1}>+</button>
                    </li>
                    <li className="list-group-item">
                        <ul className="list-group list-group-flush overflow-auto">
                            {
                                this.props.chats.length > 0 ? this.props.chats.map((chat, index) => {
                                    let name = chat.user1 === this.props.username ? chat.user2 : chat.user1;
                                    return <li className="list-group-item" key={index}><button className="w-100 btn" onClick={() => {this.changeChat2(name)}}>{name}</button></li>
                                }) : <li className="list-group-item">No contacts</li>
                            }
                        </ul>
                    </li>
                </ul>
            </div>
        );
    }
}

export default Contact;