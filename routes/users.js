const express = require('express')
const { signup, login, protect, forgotPassword, resetPassword, updatePassword, restrictTo } = require('../controllers/authentication/auth')
const { getAllUsers, getUser, updateMe, deleteMe } = require('../controllers/users')
const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)
router.post('/forgot-password', forgotPassword)
router.patch('/reset-password/:token', resetPassword)
router.patch('/update-password', protect, updatePassword)
router.patch('/update-me', protect, updateMe)
router.delete('/delete-me', protect, deleteMe)

router.route('/')
    .get(protect, restrictTo('admin'), getAllUsers)

router.route('/:id')
    .get(protect, restrictTo('admin'), getUser)
  

module.exports = router