const mongoose = require('mongoose')

const Schema = mongoose.Schema

const QuestionSchema = new Schema({
	user_id: String,
	title: String,
	content: String,
	upvote: {
		type: Number,
		default: 0
	},
	downvote: {
		type: Number,
		default: 0
	},
	answers: [{ type: Schema.Types.ObjectId, ref: 'Answer' }]
})

const QuestionModel = mongoose.model('Question', QuestionSchema)

module.exports = QuestionModel