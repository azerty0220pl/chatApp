const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');

module.exports = {
    auth: function(db) {
        passport.serializeUser((user, done) => {
            done(null, user._id);
        });

        passport.deserializeUser((id, done) => {
            done(null, db.getUser(id).user);
        });

        passport.use(new LocalStrategy((username, password, done) => {
            db.getUser(username).then(x => {
                console.log(password, x.user.password);
                if(x.status == 'error')
                    return done(x.message);
                if (!x.user)
                    return done(null, false);
                bcrypt.compare(password, x.user.password, (err, result) => {
                    if(err || !result) {
                        return done(null, false);
                    }
                    return done(null, x.user);
                })
            }).catch(err => {
                return done(null, false);
            });
        }));
    }
}