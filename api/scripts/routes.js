const passport = require('passport');
const bcrypt = require('bcrypt');

module.exports = {
    routes: function (app, db) {

        app.route('/login').post(passport.authenticate('local', { failureRedirect: "/failedLogin" }), (req, res) => {
            console.log("/login")
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
            console.log('`' + doc + '`');
            res.json({"status": "error", "message": "Failed authentication", "code": "104"});
        })

        app.route('/chats').get(ensureAuthenticated, (req, res) => {
            db.getAllChats(req.user.username).then(x => {
                res.json(x);
            }).catch(err => {
                res.json({"status": "error", "message": err, "code": "105"});
            });
        })

        app.use((req, res, next) => {
            res.status(404).type('text').send('Not Found');
        });
    }
};

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.json({"status": "error", "message": "No user authenticated", "code": "106"});
    return next();
};