const express = require('express')
const router = new express.Router()
const createError = require('http-errors')
const { register, login } = require('../controllers/auth-Controller')

router.post('/register',register )

router.post('/login',login )

module.exports = router