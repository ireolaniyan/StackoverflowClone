const express = require('express')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const User = require('../app/models/user.model')
const auth = require('../middleware/auth.js')

const router = express.Router()

const users = require('../app/controllers/user.controller.js')
const questions = require('../app/controllers/question.controller.js')

router.post('/signup', users.create);
router.post('/signin', users.signin);
router.get('/users/me', auth, users.profile);

router.post('/ask-question', auth, questions.create)
router.get('/fetch-user-questions', auth, questions.getUserQuestions)
router.get('/fetch-all-questions', questions.getAllQuestions)
router.get('/question/:question_id', questions.findOneQuestion)
router.put('/vote-question/:question_id', auth, questions.voteQuestion)
module.exports = router