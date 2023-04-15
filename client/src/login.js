import React from "react";
import Axios from 'axios';

Axios.defaults.withCredentials = true;

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

    onUserChange(e) {
        this.setState({ username: e.target.value });
    }

    onPassChange(e) {
        this.setState({ password: e.target.value });
    }

    async handleLogin(e) {
        let user = this.state.username;
        let password = this.state.password;

        e.target.className = "btn btn-success w-50 my-2 disabled";
        console.log("handle login");
        await Axios({
            method: 'POST',
            withCredentials: true,
            headers: {
                'Access-Control-Allow-Origin': 'https://azerty0220pl.github.io'
            },
            data: "username=" + encodeURI(user) + "&password=" + encodeURI(password),
            url: 'https://chatapp-api-6dvw.onrender.com/login'
        }).then(res => {
            console.log(res);
            if (res.data.status === "success") {
                this.props.login(this.state.username);
                this.setState({
                    username: '',
                    password: '',
                    error: false
                });

                this.props.reload();
                console.log('success', res.data.user);
            } else {
                this.setState({ error: true });
                console.log('error', res.data.message);
            }
        }).catch(err => {
            console.log(err);
        });

        e.target.className = "btn btn-success w-50 my-2";
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
                                onChange={this.onUserChange}
                                value={this.state.username} />
                        </div>
                    </div>
                    <div>
                        <label className="form-label" htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            className="form-control"
                            onChange={this.onPassChange}
                            value={this.state.password} />
                    </div>
                    <p className="form-text text-danger">{this.state.error ? "Invalid credentials" : ""}</p>
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