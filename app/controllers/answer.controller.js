const Answer = require('../models/answer.model.js')
const Question = require('../models/question.model.js')

exports.create = async (req, res) => {
	try {
		const user = req.user
		const question = await Question.findById(req.params.question_id)

		if (!question) {
			return res.status(400).send({
				message: "Question not found with id " + req.params.question_id
			})
		}

		const answer = new Answer(req.body)

		answer.user_id = user._id
		answer.question = question

		question.answers.push(answer)
		await question.save()

		res.status(201).send({ answer })
	} catch (error) {
		console.log('error ', error);

		res.status(400).send(error)
	}
}

exports.getAllAnswers = async (req, res) => {
	try {
		const answers = await Answer.find()

		res.status(200).send(answers)

	} catch (error) {
		res.status(500).send({
			message: error.message || "An error occurred while retrieving answers."
		})
	}
}
