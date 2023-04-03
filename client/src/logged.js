import React from "react";
import Chat from "./chat.js"
import Contact from "./contact.js"

class Logged extends React.Component {
    render() {
        return (
            <div id="logged" className="card d-flex flex-row h-75 w-75 justify-content-evenly">
                <Contact />
                <div className="border-end m-1" />
                <Chat />
            </div>
        );
    }
}

export default Logged;