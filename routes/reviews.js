const express = require('express')
const { protect, restrictTo } = require('../controllers/authentication/auth')
const { getReviews, getReview, createReview, updateReview, deleteReview } = require('../controllers/review')

const router = express.Router({ mergeParams: true })

router.route('/')
    .get(getReviews)
    .post(protect, restrictTo('user', 'admin'), createReview)

router.route('/:id')
    .get(getReview)
    .put(protect, restrictTo('user', 'admin'), updateReview)
    .delete(protect, restrictTo('user', 'admin'), deleteReview)

module.exports = router