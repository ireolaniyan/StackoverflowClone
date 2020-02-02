const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const Schema = mongoose.Schema

const UserSchema = new Schema({
	first_name: String,
	last_name: String,
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true
	}
})

UserSchema.pre('save', async function (next) {
	const user = this
	const hash = await bcrypt.hash(user.password, 10)
	user.password = hash
	next()
})

UserSchema.methods.isValidPassword = async function (password) {
	const user = this
	const comparePasswords = await bcrypt.compare(password, user.password)
	return comparePasswords
}

const UserModel = mongoose.model('User', UserSchema)

module.exports = UserModel