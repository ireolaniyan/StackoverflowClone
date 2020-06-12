require('dotenv').config()
const mongoose = require('mongoose')

const models = require('../app/models');

const db_url = (process.env.NODE_ENV === 'test') ? 'mongodb://127.0.0.1:27017/stack-overflow-test' : 'mongodb://127.0.0.1:27017/stack-overflow'

mongoose.Promise = global.Promise
let dbConnection
let dbModels = {}

function initDb() {
	mongoose.connect(db_url, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true }).then((db) => {
		dbConnection = db
		console.log("Successfully connected to the database 😃");
	}).catch(err => {
		console.log('Could not connect to the database. Exiting now...', err)
		process.exit()
	})
}

function getDb() {
	return dbConnection
}

dbModels.user = models.UserModel
dbModels.question = models.QuestionModel
dbModels.answer = models.AnswerModel

module.exports = { initDb, getDb, dbModels }