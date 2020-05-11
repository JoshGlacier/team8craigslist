const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt');
const mysqlConnection = require('./connection');


function initialize(passport, getUserByEmail, getUserLogin) {
    const authenticateUser = async function(email, password, done) {
        const user = getUserByEmail(email)
        if(user == null) {
            return done(null, false, { message: 'No user with that email' })
        }
        try {
            if(await bcrypt.compare(password, user.password)) {
                return done(null, user)
            } else {
                return done(null, false, { message: 'Password incorrect'})
            }
        } catch (e) {
            return done(e)
        }
    }
    passport.use(new LocalStrategy({ usernameField: 'email'}, authenticateUser))
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => {
        return done(null, getUserLogin(id))
    })
}

module.exports = initialize