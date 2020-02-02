const passport = require('passport')
const localStrategy = require('passport-local').Strategy
const UserModel = require('../app/models/user.model.js')

// Passport middleware to handle User signup
passport.use('signup', new localStrategy({
	usernameField: 'email',
	passwordField: 'password'
}, async (first_name, last_name, email, password, done) => {
	try {

		//Save the user's information to the database
		const user = await UserModel.create({ first_name, last_name, email, password })
		return done(null, user)

	} catch (error) {
		done(error)
	}
}))

