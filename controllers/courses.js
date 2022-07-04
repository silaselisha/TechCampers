const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const QueryApi = require('../utils/queryApi')

const Course = require('../models/Courses')
const Bootcamp = require('../models/Bootcamps')

exports.getCourses = catchAsync(async (req, res, next) => {
  let query 
  query = new QueryApi(Course.find(), req.query).filter().limitFields().sort().pagination().query
   

  const courses = await query.populate({
  path: 'bootcamp',
  select: 'name description website careers '
  })

  res.status(200).json({
  status: 'success',
  results: courses.length,
  data: {
      data: courses
  }
  })
})

exports.getCourse = catchAsync(async (req, res, next) => {
  const id = req.params.id

  const course = await Course.findById(id).populate({
    path: 'bootcamp',
    select: 'name description website careers' 
  })

  if(!course) {
      return next(new AppError(404, 'Invalid data!'))
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: course
    }
  })

})

exports.createCourse = catchAsync(async (req, res, next) => {
  const id = req.params.id
  const data = req.body



  const bootcamp = await Bootcamp.findById(id)
  if(!bootcamp) {
    return next(new AppError(404, 'Invalid data!'))
  }

  data.bootcamp = id
  const course = await Course.create(data)

  if(!course) {
    return next(new AppError(404, 'Invalid data!'))
  }

  res.status(201).json({
    status: 'success',
    data: {
      data: course
    }
  })
})

exports.updateCourse = catchAsync(async (req, res, next) => {
  const data = req.body
  const id = req.params.id
  const course = await Course.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true
  })

  if(!course) {
    return next(new AppError(4040, 'Invalid data!'))
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: course
    }
  })
})

exports.deleteCourse= catchAsync(async (req, res, next) => {
  const id = req.params.id
  
  const course = await Course.findById(id)

  if(!course){
    return next(new AppError(4040, 'Invalid data!'))
  }


  course.remove()
  res.status(204).json({
    status: 'success',
    data: null
  })
})