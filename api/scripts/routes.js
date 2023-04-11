const passport = require('passport');
const bcrypt = require('bcrypt');

module.exports = {
    routes: function (app, db) {
        
        app.route('/').get((req, res) => {
            res.cookie('test', 'Hello, World!');
            res.send("hello, world!");
        });

        app.route('/login').post(passport.authenticate('local', { failureRedirect: "/failedLogin", session: true }), (req, res) => {
            res.header('Access-Control-Allow-Origin', 'https://azerty0220pl.github.io');
            res.header('Access-Control-Allow-Credentials', true);
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
            res.cookie('express.sid', req.sessionID);
            res.cookie('test', 'Hello, World!');
            
            console.log("login", req.sessionID);

            res.json({"status": "success", "user": req.user});
        }, (err, req, res) => {
            res.json({"status": "error", "message": err, "code": "101"});
        });

        app.route('/register').post((req, res) => {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if(err) {
                    res.json({"status": "error", "message": err, "code": "102"});
                } else {
                    db.newUser(req.body.username, hash).then(x => {
                        res.json(x);
                    }).catch(err => {
                        res.json({"status": "error", "message": err, "code": "103"});
                    })
                }
            });
        });

        app.route("/failedLogin").get((req, res) => {
            res.json({"status": "error", "message": "Failed authentication", "code": "104"});
        })

        app.route('/chats').get(ensureAuthenticated, (req, res) => {
            db.getAllChats(req.query.username).then(x => {
                res.json(x);
            }).catch(err => {
                res.json({"status": "error", "message": err, "code": "105"});
            });
        });

        app.route('/logout').get((req, res) => {
            req.logout();
            res.json({"status": "success"});
        })

        app.use((req, res, next) => {
            res.status(404).type('text').send('Not Found');
        });
    }
};

function ensureAuthenticated(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'https://azerty0220pl.github.io');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

    console.log("ensure 1", req.headers.cookie);

    if (req.isAuthenticated()) {
        return next();
    }

    console.log("ensure 2", req.sessionID);

    res.json({"status": "error", "message": "No user authenticated", "code": "106"});
};