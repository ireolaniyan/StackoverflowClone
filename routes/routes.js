const express = require('express')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const User = require('../app/models/user.model')
const auth = require('../middleware/auth.js')

const router = express.Router()

const users = require('../app/controllers/user.controller.js')

router.post('/signup', users.create);
router.post('/signin', users.signin);
router.get('/users/me', auth, users.profile);

module.exports = router