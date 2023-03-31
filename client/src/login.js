import React from "react";

class Login extends React.Component {
    render() {
        return (
            <div className="d-flex flex-column justify-content-center">
                <h3 className="text-center">Log in:</h3>
                <form className="d-flex flex-column align-items-center">
                    <div>
                        <label className="form-label" for="username">Username:</label>
                        <input type="text" id="username" className="form-control" />
                    </div>
                    <div>
                        <label className="form-label" for="password">Password:</label>
                        <input type="password" id="password" className="form-control" />
                    </div>
                    <button type="submit" className="btn btn-success w-50 my-2">Log in</button>
                </form>
            </div>
        );
    }
}

export default Login;