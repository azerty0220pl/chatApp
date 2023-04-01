require('dotenv').config();
const mongoose = require('mongoose');

Schema = mongoose.Schema;
    
userSchema = new Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    profilePhoto: {type: Buffer},
    about: {type: String}
});

chatSchema = new Schema({
    user1: {type: String, required: true},
    user2: {type: String, required: true},
    messages1: [{type: String}],
    date1: [{type: Date, default: new Date}],
    messages2: [{type: String}],
    date2: [{type: Date, default: new Date}]
});

User = mongoose.model("User", userSchema);
Chat = mongoose.model("Chat", chatSchema);

module.exports = {
    connect: function() {
        return mongoose.connect(process.env['MONGO_URI'], { useNewUrlParser: true, useUnifiedTopology: true })
    },
    newUser: function(username, password, photo, about) {
        User.find({username: username}).then((doc) => {
            if(!doc){
                let user = new User({username: username, password: password, profilePhoto: photo, about: about});
                user.save().then((doc) => {
                    return {status: "success", username: doc.username};
                }).catch((err) => {
                    return {status: "error", message: err, code: "001"};
                });
            } else
                return {status: "error", message: "User already exists", code: "002"};
        });
    },
    sendMessage: function(from, to, message) {
        User.findOne({username: from}).then((sen) => {
            if(sen) {
                User.findOne({username: to}).then((rec) => {
                    if(rec) {
                        Chat.findOne({$or: [{user1: sec.username, user2: ren.username}, {user1: ren.username, user2: sec.username}]}).exec().then((chat) => {
                            if(!chat) {
                                let x = new Chat({user1: sen.username, user2: rec.username, messages1: [message], date1: [new Date], messages2: [], date2: []});
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
    },
    getUser: function(username, db) {
        console.log(User);
        console.log(User.findOne({username: username}));
        console.log(User.findOne({username: username}).exec());
        User.findOne({username: username}).then((us) => {
            return {status: "success", user: us};
        }).catch((err) => {
            console.log("catch");
            return {status: "error", message: err, code: '011'};
        });
        return {status: "error", message: "who knows", code: '011'};
    },
    getChat: function(username, contact) {
        Chat.findOne({$or: [{user1: username, user2: contact}, {user1: contact, user2: username}]}).then((chat) => {
            return {status: "success", chat: chat};
        }).catch((err) => {
            return {status: "error", message: err, code: '012'};
        });
        return {status: "error", message: "chat not found", code: '011'};
    },
    getAllChats: function(username) {
        Chat.find({$or: [{user1: username}, {user2: username}]}).then((chats) => {
            return {status: "success", chats: chats};
        }).catch((err) => {
            return {status: "error", message: err, code: '013'};
        });
        return {status: "error", message: "chats not found", code: '011'};
    }
}