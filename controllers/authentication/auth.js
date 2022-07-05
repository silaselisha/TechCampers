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
    const {name, email, password,  confirmPassword} = req.body

    const user = await User.create({
        name,
        email,
        password,
        confirmPassword
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