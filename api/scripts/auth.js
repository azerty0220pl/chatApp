const passport = require('passport');
const LocalStrategy = require('passport-local');
const dbMan = require('./databaseMan.js');

module.exports = {
    auth: function(db) {
        passport.serializeUser((user, done) => {
            done(null, user._id);
        });

        passport.deserializeUser((id, done) => {
            done(null, dbMan.getUser(id).user);
        });

        passport.use(new LocalStrategy((username, password, done) => {
            console.log("localStrategy");
            let user = dbMan.getUser(username, db);
            console.log(user);
            if(user.status == 'error')
                return done(user.message);
            if (!user.user)
                return done(null, false);
            if (password != user.password)
                return done(null, false);
            return done(null, user);
        }));
    }
}