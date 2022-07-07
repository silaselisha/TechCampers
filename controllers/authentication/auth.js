const { promisify } = require('util')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const catchAsync = require('../../utils/catchAsync')
const AppError = require('../../utils/appError')
const User = require('../../models/Users')
const sendEmail = require('../../utils/email')

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
        token
    })
}

exports.signup = catchAsync(async (req, res, next) => {
    const { name, email, password,  confirmPassword, passwordChangedAt, role } = req.body

    const user = await User.create({
        name,
        email,
        password,
        confirmPassword,
        role,
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

exports.restrictTo = (...roles) => {
    return catchAsync(async (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return next(new AppError(401, 'Unauthorized to access this resource'))
        }
        next()
    })
}

exports.forgotPassword = catchAsync(async (req, res, next) => {
    const { email } = req.body

    const user = await User.findOne({email: email})
    if(!user) {
        return next(new AppError(404, 'User not found!'))
    }

    const resetToken = user.createResetToken()
    await user.save({
        validateBeforeSave: false
    })

    const message = `Use the following URL to reset your password if you had requested for a password reset. ${req.protocol}//${req.get('host')}/api/v1/users/reset-password/${resetToken} The link will expire after 10 minutes.`

    try {
        sendEmail({
            email: user.email,
            subject: 'Password reset',
            message
        })

    } catch(err) {
        user.passwordResetToken = undefined
        user.passwordResetTokenExpires = undefined
        user.save({
            validateBeforeSave: false
        })

        return next(new AppError(500, 'Email unsuccessfully sent'))
    }

    res.status(200).json({
        status: 'success',
        message: 'Password reset token successfuly sent.'
    })
})

exports.resetPassword = catchAsync(async (req, res,next) => {
    const resetToken = req.params.token
    const { password, confirmPassword } = req.body

    const encryptedResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')

    const user = await User.findOne({passwordResetToken: encryptedResetToken, passwordResetTokenExpires: {$gt: Date.now()}}).select('+password')

    if(!user) {
        return next(new AppError(400, 'Invalid token, try again.'))
    }

    user.password = password
    user.confirmPassword = confirmPassword
    user.passwordResetToken = undefined
    user.passwordResetTokenExpires = undefined
    await user.save()

    sendTokenAndCookie(user, 200, req, res)
})

exports.updatePassword = catchAsync(async (req, res, next) => {
    const userId = req.user._id
    const { currentPassword, password, confirmPassword } = req.body
 
    const user = await User.findById(userId).select('+password')

    if(!await user.comparePasswords(currentPassword, user.password)) {
        return next(new AppError(401, 'Invalid data, passwords don\'t match'))
    }

    user.password = password
    user.confirmPassword = confirmPassword

    await user.save()

    sendTokenAndCookie(user, 200, req, res)
})