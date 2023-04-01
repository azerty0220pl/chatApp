const passport = require('passport');

module.exports = {
    routes: function (app, db) {

        app.route('/login').post(passport.authenticate('local', { failRedirect: "/failedLogin" }), (req, res) => {
            console.log("/login")
            res.json({"status": "success", "user": req.user});
        }, (err, req, res) => {
            res.json({"status": "error", "message": err, "code": "101"});
        });

        app.route('/register').post((req, res) => {
            db.newUser(req.body.username, req.body.password, req.body.photo, req.body.about).then(x => {
                res.json(x);
            }).catch(err => {
                res.json({"status": "error", "message": err, "code": "102"});
            })
        });

        app.route("/failedLogin").get((req, res) => {
            res.json({"status": "error", "message": "Couldn't log in", "code": "103"});
        })

        app.route('/chats').get(ensureAuthenticated, (req, res) => {
            db.getAllChats(req.user.username).then(x => {
                res.json(x);
            }).catch(err => {
                res.json({"status": "error", "message": err, "code": "104"});
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
    res.json({"status": "error", "message": "No user authenticated", "code": "105"});
    return next();
};