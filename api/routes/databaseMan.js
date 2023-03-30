require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env['MONGO_URI'], { useNewUrlParser: true, useUnifiedTopology: true });

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

const newUser = (req, res) => {
    User.find({username: req.body.username}).then((doc) => {
        if(!doc){
            let user = new User({username: req.body.username, password: req.body.password, profilePhoto: req.body.photo, about: req.body.about});
            user.save().then((doc) => {
                res.json({"status": "success", "username": doc.username});
            }).catch((err) => {
                res.json({"status": "error", "message": err, "code": "1"});
            });
        } else
            res.json({"status": "error", "message": "User already exists", "code": "2"})
    });
}
