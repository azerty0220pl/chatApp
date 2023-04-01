import React from "react";
import bcrypt from 'bcryptjs-react';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            error: false
        };
        this.handleLogin = this.handleLogin.bind(this);
        this.onUserChange = this.onUserChange.bind(this);
        this.onPassChange = this.onPassChange.bind(this);
    }

    onUserChange (e) {
        this.setState({username: e.target.value});
    }

    onPassChange (e) {
        this.setState({password: e.target.value});
    }

    handleLogin (e) {
        let user = this.state.username;
        let password = this.state.password;
        let hashedPassword = bcrypt.hash(password, parseInt(user + 'randomValuexD' + user));
        
        e.target.className = "btn btn-success w-50 my-2 disabled"

        fetch('https://chatapp-api-6dvw.onrender.com/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: user,
            password: hashedPassword
          }),
        }).then(res => res.json()).then(data => {
            if(data.status === "success") {
                this.setState({error: false});
                console.log('success', data.user);
            } else {
                this.setState({error: true});
                console.log('error', data.message);
            }
        });

        e.target.className = "btn btn-success w-50 my-2"
    }

    render() {
        return (
            <div className="d-flex flex-column justify-content-center">
                <h3 className="text-center">Log in:</h3>
                <div className="d-flex flex-column align-items-center">
                    <div>
                        <label className="form-label" htmlFor="username">Username:</label>
                        <div>
                            <input
                                type="text"
                                id="username"
                                className="form-control"
                                onChange={this.onUserChange} />
                        </div>
                    </div>
                    <div>
                        <label className="form-label" htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            className="form-control"
                            onChange={this.onPassChange} />
                    </div>
                    {this.state.error ? <div className="text-danger">Invalid credentials</div> : <div></div>}
                    <button
                        type="button"
                        className="btn btn-success w-50 my-2"
                        onClick={this.handleLogin}
                    >Log in</button>
                </div>
            </div>
        );
    }
}

export default Login;