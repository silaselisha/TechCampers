const express = require('express')
const { signup, login } = require('../controllers/authentication/auth')

const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)

router.route('/')
    .get()

router.route('/:id')
    .get()
    .put()
    .delete()

module.exports = router