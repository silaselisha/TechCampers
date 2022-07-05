const catchAsync = require('../utils/catchAsync')
const AppError  = require('../utils/appError')
const User = require('../models/Users')

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