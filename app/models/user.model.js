const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()
// const bcrypt = require('bcrypt-nodejs')

const Schema = mongoose.Schema

const UserSchema = new Schema({
	first_name: String,
	last_name: String,
	email: {
		type: String,
		required: true,
		unique: true,
		lowercase: true,
		validate: value => {
			if (!validator.isEmail(value)) {
				throw new Error({ error: 'Invalid Email address' })
			}
		}
	},
	password: {
		type: String,
		required: true
	},
	tokens: [{
		token: {
			type: String,
			required: true
		}
	}]
})

UserSchema.pre('save', async function (next) {
	const user = this
	if (user.isModified('password')) {
		user.password = await bcrypt.hash(user.password, 8)
	}
	next()
})

UserSchema.methods.generateAuthToken = async function () {

	// Generate an auth token for the user
	const user = this
	const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY)
	user.tokens = user.tokens.concat({ token })
	await user.save()
	return token
}

UserSchema.statics.findByCredentials = async (email, password) => {
	// Search for a user by email and password.
	const user = await UserModel.findOne({ email })

	if (!user) {
		return { status: false, error: 'Invalid login credentials' }
	}

	const isPasswordMatch = await bcrypt.compare(password, user.password)
	if (isPasswordMatch == false) {
		return { status: false, error: 'Email and Password Mismatch' }
	}

	return { status: true, data: user }
}

const UserModel = mongoose.model('User', UserSchema)

module.exports = UserModel