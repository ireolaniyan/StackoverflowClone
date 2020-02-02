const passport = require('passport')
const localStrategy = require('passport-local').Strategy
const UserModel = require('../app/models/user.model')

// Passport middleware to handle User signup
passport.use('signup', new localStrategy({
	passReqToCallBack: true,
	firstNameField: 'first_name',
	lastNameField: 'last_name',
	emailField: 'email',
	passwordField: 'password'
}, async (req, first_name, last_name, email, password, done) => {
	console.log('here');
	try {

		//Save the user's information to the database
		const user = await UserModel.create({ first_name, last_name, email, password })
		return done(null, user)

	} catch (error) {
		console.log(error);

		// return done(error)
	}
}))

// Passport middleware to handle User signin
passport.use('login', new localStrategy({
	emailField: 'email',
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

module.exports = passport