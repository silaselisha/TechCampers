const express = require('express')

const { getBootcamps, getBootcamp, createBootcamp, updateBootcamp, deleteBootcamp, getBootcampWithinRadius, bootcampPhotoUpload } = require('../controllers/bootcamp')

const { protect, restrictTo} = require('../controllers/authentication/auth')

const coursesRouter = require('./courses')
const reviewsRouter = require('./reviews')

const router = express.Router()

router.use('/:id/courses', coursesRouter)
router.use('/:id/reviews', reviewsRouter)

router.route('/')
    .get(getBootcamps)
    .post (protect, restrictTo('admin', 'publisher'), createBootcamp)

router.route('/:id')
    .get(protect, getBootcamp)
    .put(protect, restrictTo('admin', 'publisher'), updateBootcamp)
    .delete(protect, restrictTo('admin'), deleteBootcamp)

router.route('/radius/:zipcode/:distance/:unit?')
    .get(getBootcampWithinRadius)

router.route('/:id/photo')
    .put(protect, restrictTo('admin', 'publisher'), bootcampPhotoUpload)

module.exports = router