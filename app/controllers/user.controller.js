const { dbModels } = require("../../config/database.config")

const User = dbModels.user

const Joi = require('joi')

exports.create = async (req, res) => {
	// Create a new user
	try {
		const { first_name, last_name, email, password } = req.body

		const schema = Joi.object().keys({
			first_name: Joi.string().required(),
			last_name: Joi.string().required(),
			email: Joi.string().email({ minDomainAtoms: 2 }).required(),
			password: Joi.string().alphanum().min(6).max(16).required()
		})

		const validation = Joi.validate(req.body, schema)
		if (validation.error !== null) {
			return res.status(400).send({
				success: false,
				message: validation.error.details[0].message
			})
		}

		const duplicateMail = await User.findOne({ email })
		if (duplicateMail)
			return res.status(400).send({
				success: false,
				message: "Email Already Exists"
			})

		const user = await User.create({ first_name, last_name, email, password })
		await user.generateAuthToken()

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
		await user.generateAuthToken()

		res.status(200).send({
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
