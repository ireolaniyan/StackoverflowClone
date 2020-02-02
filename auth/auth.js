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

// Passport middleware to handle User signin
passport.use('login', new localStrategy({
	usernameField: 'email',
	passwordField: 'password'
}, async (email, password, done) => {
	try {
		// Find the user associated with the email
		const user = await UserModel.findOne({ email })

		if (!user) {
			return done(null, false, { message: 'User not found' })
		}

		// Validate password and make sure it matches with the corresponding hash stored in the database
		const validateUser = await user.isValidPassword(password)
		if (!validateUser) {
			return done(null, false, { message: 'Incorrect Password' })
		}

		//Send the user information to the next middleware
		return done(null, user, { message: 'Logged in Successfully' })

	} catch (error) {
		return done(error)
	}
}))