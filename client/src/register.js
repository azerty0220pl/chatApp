import React from "react";

class Register extends React.Component {
    render() {
        return (
            <div className="d-flex flex-column align-items-center">
                <h3 className="text-center">Register:</h3>
                <form className="d-flex flex-column align-items-center">
                    <div>
                        <label className="form-label" for="newUsername">Username:</label>
                        <input type="text" id="newUsername" className="form-control" />
                        <p id="emailHelp" class="form-text">Must be unique</p>
                    </div>
                    <div>
                        <label className="form-label" for="newPassword">Password:</label>
                        <input type="password" id="newPassword" className="form-control" />
                    </div>
                    <div>
                        <label className="form-label" for="passwordRep">Repeat password:</label>
                        <input type="password" id="passwordRep" className="form-control" />
                    </div>
                    <button type="submit" className="btn btn-success w-50 my-2">Register</button>
                </form>
            </div>
        );
    }
}

export default Register;