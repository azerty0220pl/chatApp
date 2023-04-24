import React from "react";
import Login from './login.js'
import Register from './register.js'


class FrontPage extends React.Component {
    render () {
        return (
            <div className="card">
                <h1 className="text-center m-4">Welcome to chatApp!</h1>
                <p className="text-center mb-5 mx-3">A chat application created by Szymon Kokot with node, express, react and bootstrap.</p>
                <div className="d-flex row justify-content-evenly m-3 row-cols-1 row-cols-sm-3">
                    <Login login={this.props.login} reload={this.props.reload} />
                    <Register />
                </div>
            </div>
        );
    }
}

export default FrontPage;