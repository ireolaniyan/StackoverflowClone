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
			message: error.message || "An error occurred while retrieving questions."
		})
	}
}

exports.getAllQuestions = async (req, res) => {
	try {
		const questions = await Question.find()

		res.status(200).send(questions)

	} catch (error) {
		res.status(500).send({
			message: error.message || "An error occurred while retrieving questions."
		})
	}
}

exports.findOneQuestion = async (req, res) => {
	try {
		const question = await Question.findById(req.params.question_id)

		if (!question) {
			return res.status(400).send({
				message: "Question not found with id " + req.params.question_id
			})
		}

		res.status(200).send(question)
	} catch (error) {
		if (error.kind === 'ObjectId') {
			return res.status(400).send({
				message: "Question not found with id " + req.params.question_id
			})
		}
		return res.status(500).send({
			message: "Error retrieving question with id " + req.params.question_id
		})
	}
}

exports.voteQuestion = async (req, res) => {
	try {
		const question = await Question.findById(req.params.question_id)

		if (!question) {
			return res.status(404).send({
				message: "Question not found with id " + req.params.question_id
			})
		}

		// Validate Request
		if (!req.body.status) {
			return res.status(400).send({
				message: "Question content can not be empty"
			})
		}

		if (req.body.status == 1) {
			question.upvote = question.upvote + 1
		} else {
			question.downvote = question.downvote + 1
		}

		await question.save()

		res.status(200).send(question)

	} catch (error) {
		console.log('error ', error);

		if (error.kind === 'ObjectId') {
			return res.status(404).send({
				message: "Question not found with id " + req.params.question_id
			})
		}
		return res.status(500).send({
			message: "Error updating question with id " + req.params.question_id
		})
	}
}