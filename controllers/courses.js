const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const QueryApi = require('../utils/queryApi')

const Course = require('../models/Courses')

exports.getCourses = catchAsync(async (req, res, next) => {
   let query 
   
   if(req.params.id) {
     query = Course.find({_id: req.params.id})
   }else {
     query = new QueryApi(Course.find(), req.query).filter().limitFields().sort().pagination().query
   }

   const courses = await query

   res.status(200).json({
    status: 'success',
    results: courses.length,
    data: {
        data: courses
    }
   })
})
