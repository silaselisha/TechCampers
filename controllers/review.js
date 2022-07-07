const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const Review = require('../models/Reviews')
const Bootcamp = require('../models/Bootcamps')
const QueryApi = require('../utils/queryApi')

exports.getReviews = catchAsync(async (req, res, next) => {
    const bootcampId = req.params.id

    const bootcamp = await Bootcamp.findById(bootcampId)

    if(!bootcamp){
        return next(new AppError(404, 'A resource with that id dose not exist'))
    }

    const reviews = await Review.find({bootcamp: bootcampId})

    if(!reviews) {
        return next(new AppError(404, 'Reviews with that id do not exist'))
    }

    res.status(200).json({
        status: 'success',
        results: reviews.length,
        data: {
            data: reviews
        }
    })
})

exports.getReview = catchAsync(async (req, res, next) => {
    const reviewId = req.params.id

    const query = new QueryApi(Review.findById(reviewId), req.query).query

    const review = await query.populate({
        'path': 'bootcamp',
        'select': 'name'
    }).populate({
        'path': 'user',
        'select': 'name'
    })
    if(!review) {
        return next(new AppError(404, 'Review with that id dose not exist'))
    }

    res.status(200).json({
        status: 'success',
        data: {
            data: review
        }
    })
})

exports.createReview = catchAsync(async (req, res, next) => {
    const bootcampId = req.params.id
    const userId = req.user._id
    const bootcamp = await Bootcamp.findById(bootcampId)

    if(!bootcamp) {
        return next(new AppError(404, 'Bootcamp with such an id was not found'))
    }

    req.body.bootcamp = bootcampId
    req.body.user = userId
  
    const review = await Review.create(req.body)


    console.log(req.user.role)
    res.status(201).json({
        status: 'success',
        data: {
            data: review
        }
    })
})

exports.updateReview = catchAsync(async (req, res, next) => {
    const reviewId = req.params.id
    const userId = req.user._id

    let review = await Review.findById(reviewId)
    if(!review) {
        return next(new AppError(404, 'Review was not found'))
    }
    
    if(userId.toString() !== review.user.toString()){
        return next(new AppError(401, 'You are not authorized to update this review'))
    }

    review = await Review.findByIdAndUpdate(reviewId, req.body, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        status: 'success',
        data: {
            data: review
        }
    })
})

exports.deleteReview = catchAsync(async (req, res, next) => {
    const reviewId = req.params.id
    const userId = req.user._id

    let review = await Review.findById(reviewId)
    if(!review) {
        return next(new AppError(404, 'Review was not found'))
    }

    if(userId.toString() !== review.user.toString()){
        return next(new AppError(401, 'You are not authorized to delete this review'))
    }

    await review.remove()

    res.status(200).json({
        status: 'success',
        data: null
    })
})