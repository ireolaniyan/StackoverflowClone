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
		answer.question_id = req.params.question_id
		await answer.save()

		res.status(201).send({ answer })
	} catch (error) {
		res.status(400).send(error)
	}
}