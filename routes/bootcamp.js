const express = require('express')
const { route } = require('..')

const { getBootcamps, getBootcamp, createBootcamp, updateBootcamp, deleteBootcamp, getBootcampWithinRadius, bootcampPhotoUpload } = require('../controllers/bootcamp')

const coursesRouter = require('./courses')

const router = express.Router()

router.use('/:id/courses', coursesRouter)

router.route('/')
    .get(getBootcamps)
    .post(createBootcamp)

router.route('/:id')
    .get(getBootcamp)
    .put(updateBootcamp)
    .delete(deleteBootcamp)

router.route('/radius/:zipcode/:distance/:unit?')
    .get(getBootcampWithinRadius)

router.route('/:id/photo')
    .put(bootcampPhotoUpload)

module.exports = router