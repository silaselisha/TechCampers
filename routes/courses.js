const express = require('express')
const { getCourses, getCourse, updateCourse, deleteCourse, createCourse} = require('../controllers/courses')
const { protect, restrictTo} = require('../controllers/authentication/auth')

const router = express.Router({mergeParams: true})


router.route('/')
    .get(getCourses)
    .post(protect, restrictTo('admin', 'publisher'), createCourse)

router.route('/:id')
    .get(getCourse)
    .put(protect, restrictTo('admin', 'publisher'), updateCourse)
    .delete(protect, restrictTo('admin', 'publisher'), deleteCourse)

module.exports = router