require('dotenv').config()
const mongoose = require('mongoose')

const db_url = (process.env.NODE_ENV === 'test') ? 'mongodb://127.0.0.1:27017/stack-overflow-test' : 'mongodb://127.0.0.1:27017/stack-overflow'

mongoose.Promise = global.Promise
let dbConnection

function initDb() {
	mongoose.connect(db_url, { useNewUrlParser: true, useUnifiedTopology: true }).then((db) => {
		// console.log('db ', db);
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

module.exports = { initDb, getDb }