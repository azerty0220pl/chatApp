require('dotenv').config();
const mongoose = require('mongoose');

class dbMan {
    constructor() {
        this.Schema = mongoose.Schema;

        this.userSchema = new this.Schema({
            username: {type: String, required: true, unique: true},
            password: {type: String, required: true}
        });
        
        this.chatSchema = new this.Schema({
            user1: {type: String, required: true},
            user2: {type: String, required: true},
            messages: [{type: String}]
        });
        
        this.User = mongoose.model("User", this.userSchema);
        this.Chat = mongoose.model("Chat", this.chatSchema);
    }

    connect() {
        return mongoose.connect(process.env['MONGO_URI'], { useNewUrlParser: true, useUnifiedTopology: true });
    }

    async newUser(username, password) {
        let res = null;
        await this.User.findOne({username: username}).then(async (doc) => {
            if(!doc){
                let user = new this.User({username: username, password: password});
                await user.save().then((x) => {
                    res = {status: "success", username: user.username};
                }).catch((err) => {
                    res = {status: "error", message: err, code: "001"};
                });
            } else {
                res = {status: "error", message: "User already exists " + doc, code: "002"};
            }
        }).catch(err => {
            res = {status: "error", message: err, code: "003"};
        });
        return res;
    }

    async sendMessage(from, to, message) {
        let res = null;
        await this.User.findOne({username: from}).then(async (sen) => {
            if(sen) {
                await this.User.findOne({username: to}).then(async (rec) => {
                    if(rec) {
                        await this.Chat.findOne({$or: [{user1: sec.username, user2: ren.username}, {user1: ren.username, user2: sec.username}]}).then(async (chat) => {
                            if(!chat) {
                                let x = new this.Chat({user1: sen.username, user2: rec.username, messages: [JSON.stringify({"sender": sen.username, "message": message, "date": new Date()})]});
                                await x.save().then((doc) => {
                                    res = {status: "success"};
                                }).catch((err) => {
                                    res = {status: "error", message: err, code: "004"};
                                });
                            } else {
                                chat.messages.push(JSON.stringify({"sender": sen.username, "message": message, "date": new Date()}));
                                await chat.save().then((doc) => {
                                    res = {status: "success"};
                                }).catch((err) => {
                                    res = {status: "error", message: err, code: "005"};
                                });
                            }
                        }).catch((err) => {
                            res = {status: "error", message: err, code: "007"};
                        });
                    } else
                        res = {status: "error", message: "Receiver does not exist.", code: "008"};
                }).catch((err) => {
                    res = {status: "error", message: err, code: "009"};
                });
            } else
                res = {status: "error", message: "Sender does not exist.", code: "010"};
        }).catch((err) => {
            res = {status: "error", message: err, code: "011"};
        });
        return res;
    }

    async getUser(username) {
        let res = null;
        await this.User.findOne({username: username}).then((us) => {
            res = {status: "success", user: us};
        }).catch((err) => {
            res = {status: "error", message: err, code: '012'};
        });
        return res;
    }

    async getChat(username, contact) {
        let res = null;
        await this.Chat.findOne({$or: [{user1: username, user2: contact}, {user1: contact, user2: username}]}).then((chat) => {
            res = {status: "success", chat: chat};
        }).catch((err) => {
            res = {status: "error", message: err, code: '013'};
        });
        return res;
    }

    async getAllChats(username) {
        let res = null;
        await this.Chat.find({$or: [{user1: username}, {user2: username}]}).then((chats) => {
            res =  {status: "success", chats: chats};
        }).catch((err) => {
            res = {status: "error", message: err, code: '014'};
        });
        return res;
    }
}

module.exports.dbMan = dbMan;