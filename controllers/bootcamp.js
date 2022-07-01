const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const Bootcamp = require('../models/Bootcamps')

exports.getBootcamps = catchAsync(async (req, res, next) => {
    const bootcamps = await Bootcamp.find({})

    res.status(200).json({
        status: 'success',
        results: bootcamps.length, 
        data: {
            data: bootcamps
        }
    })
})

exports.getBootcamp = catchAsync(async (req, res, next) => {
    const id = req.params.id
    const bootcamp = await Bootcamp.findById(id)
    console.log(bootcamp)

    if(!bootcamp) {
        return next(new AppError(404, 'Bootcamp not found!'))
    }

    res.status(200).json({
        status: 'success',
        data: {
            data: bootcamp
        }
    })
})

exports.createBootcamp = catchAsync(async (req, res, next) => {
    const bootcamp = await Bootcamp.create(req.body)

    if(!bootcamp) {
        return next(new AppError(404, 'Please provide valid data!'))
    }

    res.status(201).json({
        status: 'success',
        data: {
            data: bootcamp
        }
    })
})

exports.updateBootcamp = catchAsync(async (req, res, next) => {
    const updateData = req.body
    const id = req.params.id

    const bootcamp = await Bootcamp.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true
    })

    if(!bootcamp) {
        return next(new AppError(404, 'Please provide a valid id and data!'))
    }

    res.status(200).json({
        status: 'success',
        data: {
            data: bootcamp
        }
    })
})

exports.deleteBootcamp = catchAsync(async (req, res, next) => {
    const id = req.params.id

    const bootcamp = await Bootcamp.findByIdAndDelete(id)

    if(!bootcamp) {
        return next(new AppError(404, 'Invalid id! Please provide a valid id.'))
    }

    res.status(204).json({
        status: 'success',
        data: null
    })
})