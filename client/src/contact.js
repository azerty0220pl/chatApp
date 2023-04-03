import React from "react";
import Axios from 'axios';

class Contact extends React.Component {
    render() {
        return (
            <div className="d-flex flex-column">
                <div className="d-flex">
                    <input type="text" className="form-control" />
                    <button className="btn btn-primary rounded-pill">Write</button>
                </div>
                {
                    () => {
                        Axios({
                            method: 'GET',
                            url: 'https://chatapp-api-6dvw.onrender.com/chats'
                        }).then(res => {
                            if(res.data.status === "success") {
                                res.data.chats.forEach(x => {
                                    if(x.user1 == 'azerty') {
                                        return (<button>{x.user2}</button>);
                                    } else {
                                        return (<button>{x.user1}</button>);
                                    }
                                });
                            } else {
                                this.setState({error: true});
                                return <div />
                            }
                        }).catch(err => {
                            console.log(err);
                            return <div />
                        })
                    }
                }
            </div>
        );
    }
}

export default Contact;