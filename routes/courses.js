const express = require('express')
const { getCourses } = require('../controllers/courses')
const router = express.Router({mergeParams: true})

router.route('/:id?')
    .get(getCourses)

module.exports = router