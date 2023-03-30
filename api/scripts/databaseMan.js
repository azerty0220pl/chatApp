require('dotenv').config();
const mongoose = require('mongoose');

const connect = () => mongoose.connect(process.env['MONGO_URI'], { useNewUrlParser: true, useUnifiedTopology: true });

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    profilePhoto: {type: Buffer},
    about: {type: String}
});

const chatSchema = new Schema({
    user1: {type: String, required: true},
    user2: {type: String, required: true},
    messages1: [{type: String}],
    date1: [{type: Date, default: new Date}],
    messages2: [{type: String}],
    date2: [{type: Date, default: new Date}]
});

const User = mongoose.model("User", userSchema);
const Chat = mongoose.model("Chat", chatSchema);

const newUser = (username, password, photo, about) => {
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
}

const sendMessage = (from, to) => {
    User.findOne({username: from}).then((sen) => {
        if(sen) {
            User.findOne({username: to}).then((rec) => {
                if(rec) {
                    Chat.findOne({$or: [{user1: sec.username, user2: ren.username}, {user1: ren.username, user2: sec.username}]}).then((chat) => {
                        if(!chat) {
                            let x = new Chat({user1: sen.username, user2: rec.username, messages1: [req.body.message], date1: [new Date], messages2: [], date2: []});
                            x.save().then((doc) => {
                                return {status: "success"};
                            }).catch((err) => {
                                return {status: "error", message: err, code: "003"};
                            });
                        } else {
                            if(sen.username == chat.user1) {
                                chat.messages1.push(req.body.message);
                                chat.date1.push(new Date);
                                chat.save().then((doc) => {
                                    return {status: "success"};
                                }).catch((err) => {
                                    return {status: "error", message: err, code: "004"};
                                });
                            } else {
                                chat.messages2.push(req.body.message);
                                chat.date2.push(new Date);
                                chat.save().then((doc) => {
                                    return {status: "success"};
                                }).catch((err) => {
                                    res.json({"status": "error", "message": err, "code": "005"});
                                });
                            }
                        }
                    }).catch((err) => {
                        return {status: "error", message: err, code: 006};
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

const getUser = (username) => {
    User.findOne({username: username}).then((us) => {
        return {user: us};
    }).catch((err) => {
        return {status: "error", message: err, code: '011'};
    });
}

const getChat = (username, contact) => {
    Chat.findOne({$or: [{user1: username, user2: contact}, {user1: contact, user2: username}]}).then((chat) => {
        return {chat: chat};
    }).catch((err) => {
        return {status: "error", message: err, code: '012'};
    })
}