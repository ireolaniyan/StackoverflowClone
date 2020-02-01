const express = require('express')
const bodyParser = require('body-parser')

const app = express()

// parse requests of content-type - application/x-www-form-urlencoded and application/json
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
	res.json({ "message": "Welcome to Stack Overflow" })
})

app.listen(3000, () => {
	console.log('Server is listening on port 3000');
})