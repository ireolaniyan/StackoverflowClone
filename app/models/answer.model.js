const mongoose = require('mongoose')

const Schema = mongoose.Schema

const AnswerSchema = new Schema({
	user_id: String,
	question_id: String,
	answer: String,
	upvote: {
		type: Number,
		default: 0
	},
	downvote: {
		type: Number,
		default: 0
	}
})

const AnswerModel = mongoose.model('Answer', AnswerSchema)

module.exports = AnswerModel