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
		console.log("Create User Error => ", error);

		res.status(500).send({
			success: false,
			data: error,
			error: "An Unexpected Error Occured"
		})
	}
}

exports.signin = async (req, res) => {
	//Login a registered user
	try {
		const { email, password } = req.body
		const userData = await User.findByCredentials(email, password)

		if (userData.status == false) {
			return res.status(401).send({
				success: false,
				data: userData.error,
				error: "An Unexpected Error Occured"
			})
		}

		const user = userData.data
		const token = await user.generateAuthToken()

		res.send({
			success: true,
			data: user,
			message: "Sign-In Successful"
		})
	} catch (error) {
		console.log("Sign In Error => ", error);

		res.status(500).send({
			success: false,
			data: error,
			error: "An Unexpected Error Occured"
		})
	}

}

exports.profile = (req, res) => {
	try {
		res.send({
			success: true,
			data: req.user,
			message: "Successfully Fetched Profile"
		})
	} catch (error) {
		console.log("Get Profile Error => ", error);

		res.status(500).send({
			success: false,
			data: error,
			error: "An Unexpected Error Occured"
		})
	}
}
