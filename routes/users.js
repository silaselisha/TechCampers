const express = require('express')
const { signup, login, forgotPassword } = require('../controllers/authentication/auth')
const { getAllUsers, getUser } = require('../controllers/users')
const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)
router.post('/forgot-password', forgotPassword)

router.route('/')
    .get(getAllUsers)

router.route('/:id')
    .get(getUser)
    .put()
    .delete()

module.exports = router