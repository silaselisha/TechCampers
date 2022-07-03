const express = require('express')
const { route } = require('..')

const { getBootcamps, getBootcamp, createBootcamp, updateBootcamp, deleteBootcamp, getBootcampWithinRadius } = require('../controllers/bootcamp')

const router = express.Router()

router.route('/')
    .get(getBootcamps)
    .post(createBootcamp)

router.route('/:id')
    .get(getBootcamp)
    .put(updateBootcamp)
    .delete(deleteBootcamp)

router.route('/radius/:zipcode/:distance/:unit?')
    .get(getBootcampWithinRadius)

module.exports = router