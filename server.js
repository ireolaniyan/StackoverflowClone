const express = require('express')
const bodyParser = require('body-parser')
const UserModel = require('./app/models/user.model.js')

const app = express()

// require('./auth/auth.js')

// parse requests of content-type - application/x-www-form-urlencoded and application/json
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const database = require('./config/database.config.js')
const mongoose = require('mongoose')

mongoose.Promise = global.Promise

mongoose.connect(database.url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
	console.log("Successfully connected to the database 😃");
}).catch(err => {
	console.log('Could not connect to the database. Exiting now...', err)
	process.exit()
})

const router = require('./routes/routes.js')

app.use(express.json())
app.use(router)

app.get('/', (req, res) => {
	res.json({ "message": "Welcome to Stack Overflow" })
})

app.listen(3000, () => {
	console.log('Server is listening on port 3000');
})