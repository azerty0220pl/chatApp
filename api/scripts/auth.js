const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');

module.exports = {
    auth: function(db) {
        passport.serializeUser((user, done) => {
            console.log("serializeUser", user);
            done(null, user);
        });

        passport.deserializeUser((id, done) => {
            console.log("deserialize id", id);
            db.getUser(id).then(doc => {
                console.log("deserialize", doc);
                done(null, doc.user);
            });
        });

        passport.use(new LocalStrategy((username, password, done) => {
            console.log(username, password);
            db.getUser(username).then(x => {
                if(x.status == 'error')
                    return done(x.message);
                if (!x.user)
                    return done(null, false);
                bcrypt.compare(password, x.user.password, (err, result) => {
                    if(err || !result) {
                        return done(null, false);
                    }
                    return done(null, x.user.username);
                })
            }).catch(err => {
                return done(null, false);
            });
        }));
    }
}