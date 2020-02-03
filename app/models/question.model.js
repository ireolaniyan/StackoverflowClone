const mongoose = require('mongoose')

const Schema = mongoose.Schema

const QuestionSchema = new Schema({
	user_id: String,
	title: String,
	content: String,
	upvote: Number,
	downvote: Number
})

const QuestionModel = mongoose.model('Question', QuestionSchema)

module.exports = QuestionModel