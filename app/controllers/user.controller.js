const User = require('../models/user.model.js')

async function create(req, res) {
	// Create a new user
	try {
		const user = new User(req.body)
		await user.save()
		const token = await user.generateAuthToken()
		res.status(201).send({ user, token })
	} catch (error) {
		res.status(400).send(error)
	}
}

async function siginin(req, res) {
	//Login a registered user
	try {
		const { email, password } = req.body
		const userData = await User.findByCredentials(email, password)

		if (userData.status == false) {
			return res.status(401).send({ error: userData.error })
		}

		const user = userData.data
		const token = await user.generateAuthToken()

		res.send({ user, token })
	} catch (error) {
		res.status(400).send(error)
	}

}

module.exports = { create, siginin }