require('dotenv').config();
const mongoose = require('mongoose');

class dbMan {
    constructor() {
        this.Schema = mongoose.Schema;

        this.userSchema = new this.Schema({
            username: {type: String, required: true, unique: true},
            password: {type: String, required: true},
            profilePhoto: {type: Buffer},
            about: {type: String}
        });
        
        this.chatSchema = new this.Schema({
            user1: {type: String, required: true},
            user2: {type: String, required: true},
            messages1: [{type: String}],
            date1: [{type: Date, default: new Date}],
            messages2: [{type: String}],
            date2: [{type: Date, default: new Date}]
        });
        
        this.User = mongoose.model("User", this.userSchema);
        this.Chat = mongoose.model("Chat", this.chatSchema);
    }

    connect() {
        return mongoose.connect(process.env['MONGO_URI'], { useNewUrlParser: true, useUnifiedTopology: true });
    }

    newUser(username, password, photo, about) {
        this.User.find({username: username}).then((doc) => {
            if(!doc){
                let user = new this.User({username: username, password: password, profilePhoto: photo, about: about});
                user.save().then((doc) => {
                    return {status: "success", username: doc.username};
                }).catch((err) => {
                    return {status: "error", message: err, code: "001"};
                });
            } else
                return {status: "error", message: "User already exists", code: "002"};
        });
    }

    sendMessage(from, to, message) {
        this.User.findOne({username: from}).then((sen) => {
            if(sen) {
                this.User.findOne({username: to}).then((rec) => {
                    if(rec) {
                        this.Chat.findOne({$or: [{user1: sec.username, user2: ren.username}, {user1: ren.username, user2: sec.username}]}).exec().then((chat) => {
                            if(!chat) {
                                let x = new this.Chat({user1: sen.username, user2: rec.username, messages1: [message], date1: [new Date], messages2: [], date2: []});
                                x.save().then((doc) => {
                                    return {status: "success"};
                                }).catch((err) => {
                                    return {status: "error", message: err, code: "003"};
                                });
                            } else {
                                if(sen.username == chat.user1) {
                                    chat.messages1.push(message);
                                    chat.date1.push(new Date);
                                    chat.save().then((doc) => {
                                        return {status: "success"};
                                    }).catch((err) => {
                                        return {status: "error", message: err, code: "004"};
                                    });
                                } else {
                                    chat.messages2.push(message);
                                    chat.date2.push(new Date);
                                    chat.save().then((doc) => {
                                        return {status: "success"};
                                    }).catch((err) => {
                                        res.json({"status": "error", "message": err, "code": "005"});
                                    });
                                }
                            }
                        }).catch((err) => {
                            return {status: "error", message: err, code: "006"};
                        });
                    } else
                        return {status: "error", message: "Receiver does not exist.", code: "007"};
                }).catch((err) => {
                    return {status: "error", message: err, code: "008"};
                });
            } else
                return {status: "error", message: "Sender does not exist.", code: "009"};
        }).catch((err) => {
            return {status: "error", message: err, code: "010"};
        });
    }

    getUser(username) {
        console.log("getUser")
        let x = null;
        this.User.findOne({username: username}).then((us) => {
            console.log("then");
            let res = {status: "success", user: us};
            console.log(res);
            x = res;
        }).catch((err) => {
            console.log("catch");
            x = {status: "error", message: err, code: '011'};
        });
        console.log("after promise")
        while(!x){}
        return x;
    }

    getChat(username, contact) {
        this.Chat.findOne({$or: [{user1: username, user2: contact}, {user1: contact, user2: username}]}).then((chat) => {
            return {status: "success", chat: chat};
        }).catch((err) => {
            return {status: "error", message: err, code: '012'};
        });
    }

    getAllChats(username) {
        this.Chat.find({$or: [{user1: username}, {user2: username}]}).then((chats) => {
            return {status: "success", chats: chats};
        }).catch((err) => {
            return {status: "error", message: err, code: '013'};
        });
    }
}

module.exports.dbMan = dbMan;