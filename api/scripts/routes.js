const passport = require('passport');
const bcrypt = require('bcrypt');
const dbMan = require('./databaseMan.js');

module.exports = function (app, myDataBase) {

    app.route('/login').post(passport.authenticate('local', { failWithError: true }), (req, res) => {
        res.json({"status": "success", "user": req.user});
    }, (err, req, res) => {
    res.json({"status": "error", "message": err, "code": "101"});
    });

    app.route('/register').post((req, res, next) => {
        let x = dbMan.newUser(req.body.username, req.body.password, req.body.photo, req.body.about);
        res.json(x);
    });

    app.route('/chats').get(ensureAuthenticated, (req, res) => {
        let x = dbMan.getAllChats(req.user.username);
        res.json(x);
    })

    app.use((req, res, next) => {
        res.status(404).type('text').send('Not Found');
    });
}

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.json({"status": "error", "message": "No user authenticated", "code": "102"});
};