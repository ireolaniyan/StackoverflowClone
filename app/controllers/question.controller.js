const Question = require('../models/question.model.js')


exports.create = async (req, res) => {
	try {
		const question = new Question(req.body)
		const user = req.user

		question.user_id = user._id
		await question.save()

		res.status(201).send({ question })
	} catch (error) {
		res.status(400).send(error)
	}
}

exports.getUserQuestions = async (req, res) => {
	try {
		const user = req.user

		const questions = await Question.find({ user_id: user._id })

		res.status(200).send(questions)

	} catch (error) {
		res.status(500).send({
			message: err.message || "An error occurred while retrieving questions."
		})
	}
}

exports.getAllQuestions = async (req, res) => {
	try {
		const questions = await Question.find()

		res.status(200).send(questions)

	} catch (error) {
		res.status(500).send({
			message: err.message || "An error occurred while retrieving questions."
		})
	}
}