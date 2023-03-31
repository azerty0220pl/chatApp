const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');
const dbMan = require('./databaseMan.js');

module.exports = {
    auth: function() {
        passport.serializeUser((user, done) => {
            done(null, user._id);
        });

        passport.deserializeUser((id, done) => {
            done(null, dbMan.getUser(id).user);
        });

        passport.use(new LocalStrategy((username, password, done) => {
            let user = dbMan.getUser(username);
            if(user.status == 'error')
                return done(user.message);
            if (!user)
                return done(null, false);
            if (!bcrypt.compareSync(password, user.password))
                return done(null, false);
            return done(null, user);
        }));
    }
}