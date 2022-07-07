const catchAsync = require('../utils/catchAsync')
const AppError  = require('../utils/appError')
const User = require('../models/Users')

const filterData = (data, ...dataItems) => {
    const dataObject = {}
    Object.keys(data).forEach(item => {
        if(dataItems.includes(item)) {
            dataObject[item] = data[item]
        }
    })

    return dataObject
}

exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find()

    res.status(200).json({
        status:'success',
        results: users.length,
        data: {
            data: users
        }
    })
})

exports.getUser = catchAsync(async (req, res, next) => {
    const id = req.params.id
    const user = await User.findById(id)

    if(!user) {
        return next(new AppError(404, 'User not found'))
    }

    res.status(200).json({
        status:'success',
        data: {
            data: user
        }
    })
})

exports.updateMe = catchAsync(async (req, res, next) => {
    if(req.body.password || req.body.confirmPassword){
        return next(new AppError(401, '/update-password use this endpoint to update your password'))
    }

    const id = req.user._id
    const data = filterData(req.body, 'name', 'email')
   
    const user = await User.findByIdAndUpdate(id, data, {
        new: true.valueOf,
        runValidators: true
    })

    if(!user) {
        return next(new AppError(400, 'Invalid data update'))
    }

    res.status(200).json({
        status: 'success',
        data: {
            user: user
        }
    })
})

exports.deleteMe = catchAsync(async (req, res, next) => {
    const userId = req.user._id
    await User.findByIdAndUpdate(userId, {active: false}, {
        new: true,
        runValidators: true
    })

    res.status(204).json({
        status: 'success',
        data: null
    })
})