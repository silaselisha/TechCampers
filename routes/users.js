const express = require('express')
const { signup, login, forgotPassword, resetPassword } = require('../controllers/authentication/auth')
const { getAllUsers, getUser } = require('../controllers/users')
const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)
router.post('/forgot-password', forgotPassword)
router.patch('/reset-password/:token', resetPassword)

router.route('/')
    .get(getAllUsers)

router.route('/:id')
    .get(getUser)
    .put()
    .delete()

module.exports = router