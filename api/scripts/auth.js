const passport = require('passport');
const LocalStrategy = require('passport-local');

module.exports = {
    auth: function(db) {
        passport.serializeUser((user, done) => {
            done(null, user._id);
        });

        passport.deserializeUser((id, done) => {
            done(null, db.getUser(id).user);
        });

        passport.use(new LocalStrategy((username, password, done) => {
            console.log("localStrategy");
            let x = async () => await db.getUser(username);
            console.log("returned", x);
            if(x.status == 'error')
                return done(x.message);
            if (!x.user)
                return done(null, false);
            if (password != x.password)
                return done(null, false);
            return done(null, user);
        }));
    }
}