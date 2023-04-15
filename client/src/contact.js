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
        console.log("state.write", this.state.write);
        this.props.changeChat(this.state.write);
        this.setState({ write: '' });
    }

    changeChat2(name) { 
        this.props.changeChat(name);
    }

    render() {
        console.log("rendering contact")
        return (
            <div className="d-flex flex-column">
                <div className="d-flex flex-row justify-content-between">
                    <h3>{this.props.username}</h3>
                    <button className="btn btn-danger rounded-pill" onClick={this.props.logout}>X</button>
                </div>
                <div className="d-flex flex-row justify-content-between">
                    <input type="text" className="form-control" onChange={this.handleWrite} value={this.state.write} />
                    <button className="btn btn-primary rounded-pill" onClick={this.changeChat1}>Write</button>
                </div>
                <div>
                    <ul className="list-group list-group-flush">
                        {
                            this.props.chats.length > 0 ? this.props.chats.map((chat, index) => {
                                let name = chat.user1 === this.props.username ? chat.user2 : chat.user1;
                                return <li className="list-group-item" key={index}><button className="w-100" onClick={() => {this.changeChat2(name)}}>{name}</button></li>
                            }) : <li className="list-group-item">No contacts</li>
                        }
                    </ul>
                </div>
            </div>
        );
    }
}

export default Contact;