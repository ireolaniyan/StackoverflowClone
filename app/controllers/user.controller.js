const User = require('../models/user.model.js')

exports.create = async (req, res) => {
	// Create a new user
	try {
		const user = new User(req.body)
		await user.save()
		const token = await user.generateAuthToken()
		res.status(201).send({
			success: true,
			data: user,
			message: "Successfully Created User"
		})
	} catch (error) {
		res.status(400).send({
			success: false,
			data: error,
			message: "An Unexpected Error Occured"
		})
	}
}

exports.signin = async (req, res) => {
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

exports.profile = (req, res) => {
	try {
		res.send(req.user)
	} catch (error) {
		res.status(400).send(error)
	}
}
