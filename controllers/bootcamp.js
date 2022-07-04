const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const Bootcamp = require('../models/Bootcamps')
const QueryApi = require('../utils/queryApi')

const geocoder = require('../utils/geocoder')

exports.getBootcamps = catchAsync(async (req, res, next) => {
    
    const ApiQuery = new QueryApi(Bootcamp.find(), req.query).filter().sort().limitFields().pagination()

    const bootcamps = await ApiQuery.query.populate('courses')
    
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
    const bootcamp = await Bootcamp.findById(id).populate('courses')

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

    const bootcamp = await Bootcamp.findById(id)

    if(!bootcamp) {
        return next(new AppError(404, 'Invalid id! Please provide a valid id.'))
    }

    bootcamp.remove()

    res.status(204).json({
        status: 'success',
        data: null
    })
})

exports.getBootcampWithinRadius = catchAsync(async (req, res, next) => {
    let {zipcode, distance, unit} = req.params

    const loc = await geocoder.geocode(zipcode)
    const longitude = loc[0].longitude
    const latitude = loc[0].latitude

    let earthRadius

    unit === undefined ? unit = 'miles' : unit = unit
    unit === 'miles' ? earthRadius = 3958.5 : unit === 'kms' ? earthRadius = 6371 :6371000

    const radius = distance / earthRadius
    const bootcamps = await Bootcamp.find({
        location: {$geoWithin: {$centerSphere: [[longitude,latitude], radius]}}
    })

    res.status(200).json({
        status: 'success',
        results: bootcamps.length,
        dat: {
            data: bootcamps
        }
    })
})