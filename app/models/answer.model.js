const mongoose = require('mongoose')

const Schema = mongoose.Schema

const AnswerSchema = new Schema({
	user_id: String,
	question_id: String,
	answer: String,
	upvote: Number,
	downvote: Number
})

const AnswerModel = mongoose.model('Answer', AnswerSchema)

module.exports = AnswerModel