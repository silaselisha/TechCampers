const catchAsync = require('../utils/catchAsync')

exports.getBootcamps = catchAsync(async (req, res, next) => {
    res.status(200).json({
        status: 'success',
        results: 0, 
        data: {

        }
    })
})

exports.getBootcamp = catchAsync(async (req, res, next) => {
    res.status(200).json({
        status: 'success',
        data: {

        }
    })
})

exports.createBootcamp = catchAsync(async (req, res, next) => {
    res.status(201).json({
        status: 'success',
        data: {

        }
    })
})

exports.updateBootcamp = catchAsync(async (req, res, next) => {
    res.status(200).json({
        status: 'success',
        data: {

        }
    })
})

exports.deleteBootcamp = catchAsync(async (req, res, next) => {
    res.status(204).json({
        status: 'success',
        data: {

        }
    })
})