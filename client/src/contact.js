import React from "react";
import Axios from 'axios';

class Contact extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            write: ''
        }

        this.handleWrite = this.handleWrite.bind(this);
    }

    handleWrite(e) {
        this.setState({write: e.target.value});
    }

    render() {
        return (
            <div className="d-flex flex-column">
                <div>
                    <h2>{this.props.username}</h2>
                    <button className="btn btn-danger rounded-pill" onClick={this.props.logout}>LogOut</button>
                </div>
                <div className="d-flex">
                    <input type="text" className="form-control" onChange={this.handleWrite} />
                    <button className="btn btn-primary rounded-pill" onClick={this.props.changeChat(this.state.write)}>Write</button>
                </div>
                <div>
                {
                    this.props.chats.array.forEach(chat => {
                        let name = chat.user1 === this.props.username ? chat.user2 : chat.user1;
                        return <button className="btn" value={name} onClick={this.props.changeChat} />
                    })
                }
                </div>
            </div>
        );
    }
}

export default Contact;