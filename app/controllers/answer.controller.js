const Answer = require('../models/answer.model.js')
const Question = require('../models/question.model.js')

exports.create = async (req, res) => {
	try {
		const user = req.user
		const question = await Question.findById(req.params.question_id)

		if (!question) {
			return res.status(400).send({
				success: false,
				message: "Question not found with id " + req.params.question_id
			})
		}

		const answer = new Answer(req.body)

		answer.user_id = user._id
		answer.question = question

		question.answers.push(answer)
		await question.save()
		await answer.save()

		res.status(201).send({
			success: true,
			data: answer,
			message: "Successfully Posted an Answer"
		})
	} catch (error) {
		console.log('Answer Question Error => ', error);

		res.status(500).send({
			success: false,
			data: error,
			error: "An Unexpected Error Occured"
		})
	}
}

exports.getAllAnswers = async (req, res) => {
	try {
		const answers = await Answer.find()

		res.status(200).send({
			success: true,
			data: answers,
			message: "Successfully Fetched All Posted Answers"
		})

	} catch (error) {
		console.log("Get All Answers Error => ", error);

		res.status(500).send({
			success: false,
			message: error.message || "An Error Occurred While Retrieving Answers."
		})
	}
}
