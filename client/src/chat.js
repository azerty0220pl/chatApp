import React from "react";

class Chat extends React.Component {
    render() {
        return (
            <div className="d-flex align-items-end w-75">
                <div className="d-flex w-100">
                    <input type="text" className="form-control" />
                    <button className="btn btn-primary rounded-pill mx-1">Send</button>
                </div>
            </div>
        );
    }
}

export default Chat;