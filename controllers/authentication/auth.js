const { promisify } = require('util')
const jwt = require('jsonwebtoken')
const catchAsync = require('../../utils/catchAsync')
const AppError = require('../../utils/appError')
const User = require('../../models/Users')

const generateToken = (id) => {
    return jwt.sign({id: id}, process.env.JWT_PRIVATE_KEY, {
        expiresIn: process.env.JWT_TOKEN_EXPIRES_IN
    })
}

const sendTokenAndCookie = (user, statusCode, req, res) => {
    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true
    }

    const token = generateToken(user._id)
    if(process.env.NODE_ENV === 'production') {
        options.secure = true
    }

    user.password = undefined
    res.status(statusCode).cookie('token', token, options).json({
        status: 'success',
        token,
        data: {
            data: user
        }
    })
}

exports.signup = catchAsync(async (req, res, next) => {
    const {name, email, password,  confirmPassword, passwordChangedAt} = req.body

    const user = await User.create({
        name,
        email,
        password,
        confirmPassword,
        passwordChangedAt
    })

    sendTokenAndCookie(user, 201, req, res)
})

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body

    if(!email || !password) {
        return next(new AppError(400, 'Provide user email or password'))
    }

    const user = await User.findOne({email: email}).select('+password')

    if(!user || !(await user.comparePasswords(password, user.password))) {
        return next(new AppError(401, 'Provide valid user email or password! Register if you don\'t have an account.'))
    }

   sendTokenAndCookie(user, 200, req, res)
})

exports.protect = catchAsync(async  (req, res, next) => {
    let token

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1]
    }

    if(!token) {
        return next(new AppError(401, 'Unauthorized to accesses this resource'))
    }

    const decode = await promisify(jwt.verify)(token, process.env.JWT_PRIVATE_KEY)

    const user = await User.findById(decode.id)
    if(!user) {
        return next(new AppError(401, 'Unauthorized to access this resource'))
    }

    if(user.tokenExpiration(decode.iat)) {
        return next(new AppError(403, 'Password was recently changed'))
    }

    req.user = user
    next()
})