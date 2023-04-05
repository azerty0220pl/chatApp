import React from "react";
import Axios from 'axios';

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            rePassword: '',
            error: false,
            passEq: true
        };
        this.handleRegister = this.handleRegister.bind(this);
        this.onUserChange = this.onUserChange.bind(this);
        this.onPassChange = this.onPassChange.bind(this);
        this.onRePassChange = this.onRePassChange.bind(this);
    }

    onUserChange (e) {
        this.setState({username: e.target.value});
    }

    onPassChange (e) {
        this.setState({
            password: e.target.value,
            passEq: e.target.value === this.state.rePassword
        });
    }

    onRePassChange (e) {
        this.setState({
            rePassword: e.target.value,
            passEq: e.target.value === this.state.password
        });
    }

    async handleRegister (e) {
        console.log("handleLogin");
        let user = this.state.username;
        let password = this.state.password;
        
        e.target.className = "btn btn-success w-50 my-2 disabled"

        if(this.state.password === this.state.rePassword) {
            await Axios({
                method: 'POST',
                headers: {
                  'Access-Control-Allow-Origin': 'https://azerty0220pl.github.io'
                },
                withCredentials: true,
                data: "username=" + encodeURI(user) + "&password=" + encodeURI(password),
                url: 'https://chatapp-api-6dvw.onrender.com/login'
            }).then(res => {
                if(res.data.status === "success") {
                    this.setState({
                        username: '',
                        password: '',
                        rePassword: '',
                        error: false
                    });
                    console.log('success', res.data.user);
                } else {
                    this.setState({error: true});
                    console.log('error', res.data.message);
                }
            }).catch(err => {
                console.log(err);
            });
        }

        e.target.className = "btn btn-success w-50 my-2"
    }
    render() {
        return (
            <div className="d-flex flex-column align-items-center">
                <h3 className="text-center">Register:</h3>
                <div className="d-flex flex-column align-items-center">
                    <div>
                        <label className="form-label" htmlFor="newUsername">Username:</label>
                        <input type="text" id="newUsername" className="form-control" onChange={this.onUserChange} />
                        <p className={"form-text" + (this.state.error ? " text-danger" : "")}>Must be unique</p>
                    </div>
                    <div>
                        <label className="form-label" htmlFor="newPassword">Password:</label>
                        <input type="password" id="newPassword" className="form-control" onChange={this.onPassChange} />
                        <p className="form-text">Should be a strong one</p>
                    </div>
                    <div>
                        <label className="form-label" htmlFor="passwordRep">Repeat password:</label>
                        <input type="password" id="passwordRep" className="form-control" onChange={this.onRePassChange} />
                        <p className="form-text text-danger">{this.state.passEq ? '' : 'Password must match'}</p>
                    </div>
                    <button onClick={this.handleRegister} className="btn btn-success w-50 my-2">Register</button>
                </div>
            </div>
        );
    }
}

export default Register;