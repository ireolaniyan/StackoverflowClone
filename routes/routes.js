const express = require('express')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const User = require('../app/models/user.model')

const router = express.Router()

const users = require('../controllers/user.controller.js');

router.post('/signup', users.create);
router.post('/signin', users.signin);

module.exports = router