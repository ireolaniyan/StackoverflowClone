const Question = require('../models/question.model.js')
const Answer = require('../models/answer.model.js')
const questionIndex = require('../../utils/searchengine.js')

exports.create = async (req, res) => {
	try {
		const question = new Question(req.body)
		const user = req.user

		question.user_id = user._id
		await question.save()

		await questionIndex.createQuestionIndex(question)									// invoke elastic search question index creation

		res.status(201).send({
			success: true,
			data: question,
			message: "Successfully Posted Question"
		})
	} catch (error) {
		console.log("Create Question Error ", error);

		res.status(500).send({
			success: false,
			data: error,
			error: "An Unexpected Error Occured"
		})
	}
}

exports.getUserQuestions = async (req, res) => {
	try {
		const user = req.user

		const questions = await Question.find({ user_id: user._id }).populate('answers')

		res.status(200).send({
			success: true,
			data: questions,
			message: "Successfully Fetched User's Questions"
		})

	} catch (error) {
		console.log("Get User Questions Error => ", error);

		res.status(500).send({
			success: false,
			data: error,
			error: "An Unexpected Error Occured"
		})
	}
}

exports.getAllQuestions = async (req, res) => {
	try {
		const questions = await Question.find().populate('answers')

		res.status(200).send({
			success: true,
			data: questions,
			message: "Successfully Fetched All Questions"
		})

	} catch (error) {
		console.log('Get All Questions Error => ', error);

		res.status(500).send({
			success: false,
			data: error,
			error: "An Unexpected Error Occured"
		})
	}
}

exports.findOneQuestion = async (req, res) => {
	try {
		const question = await Question.findById(req.params.question_id).populate('answers')

		if (!question) {
			return res.status(400).send({
				success: false,
				message: "Question not found with id " + req.params.question_id
			})
		}

		res.status(200).send({
			success: true,
			data: question,
			message: "Successfully Fetched Question"
		})
	} catch (error) {
		console.log('Find One Question Error => ', error);

		if (error.kind === 'ObjectId') {
			return res.status(400).send({
				success: false,
				message: "Question not found with id " + req.params.question_id
			})
		}
		return res.status(500).send({
			success: false,
			message: "Error retrieving question with id " + req.params.question_id
		})
	}
}

exports.voteQuestion = async (req, res) => {
	try {
		const question = await Question.findById(req.params.question_id).populate("answers")

		if (!question) {
			return res.status(404).send({
				success: false,
				message: "Question Not Found With ID " + req.params.question_id
			})
		}

		// Validate Request
		if (req.body.status == undefined || req.body.status == null) {
			return res.status(400).send({
				success: false,
				message: "Question Vote Can Not Be Empty"
			})
		}

		if (req.body.status == 1) {
			question.upvote = question.upvote + 1
		} else if (req.body.status == 0) {
			question.downvote = question.downvote + 1
		}

		await question.save()

		res.status(200).send({
			success: true,
			data: question,
			message: "Successfully Voted Question"
		})

	} catch (error) {
		console.log('Vote Question Error => ', error);

		if (error.kind === 'ObjectId') {
			return res.status(404).send({
				success: false,
				message: "Question not found with id " + req.params.question_id
			})
		}
		return res.status(500).send({
			success: false,
			message: "Error updating question with id " + req.params.question_id
		})
	}
}

exports.searchQuestion = async (req, res) => {
	try {
		const searchText = req.body

		const result = await questionIndex.searchEngine(searchText) || {}

		res.status(200).send({
			success: true,
			data: result.data || "No data returned",
			message: result.message
		})
	} catch (error) {
		console.log("Search Question Error ", error);

		res.status(500).send({
			success: false,
			data: error,
			error: "An Unexpected Error Occured"
		})
	}
}