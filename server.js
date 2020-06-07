require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const { initDb } = require('./config/database.config.js')

const app = express()

// parse requests of content-type - application/x-www-form-urlencoded and application/json
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

initDb()

const router = require('./routes/routes.js')

app.use(express.json())
app.use(router)

app.get('/', (req, res) => {
	res.json({ "message": "Welcome to Stack Overflow" })
})

const port = (process.env.NODE_ENV === 'test') ? process.env.NODE_PORT_TEST : process.env.NODE_PORT
const server = app.listen(port, () => {
	console.log(`Server is listening on port ${port}`);
})

// Export server for test
module.exports = server