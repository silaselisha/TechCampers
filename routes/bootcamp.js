const express = require('express')

const { getBootcamps, getBootcamp, createBootcamp, updateBootcamp, deleteBootcamp, getBootcampWithinRadius, bootcampPhotoUpload } = require('../controllers/bootcamp')

const { protect } = require('../controllers/authentication/auth')

const coursesRouter = require('./courses')

const router = express.Router()

router.use('/:id/courses', coursesRouter)

router.route('/')
    .get(getBootcamps)
    .post(protect, createBootcamp)

router.route('/:id')
    .get(protect, getBootcamp)
    .put(protect, updateBootcamp)
    .delete(protect, deleteBootcamp)

router.route('/radius/:zipcode/:distance/:unit?')
    .get(getBootcampWithinRadius)

router.route('/:id/photo')
    .put(protect, bootcampPhotoUpload)

module.exports = router