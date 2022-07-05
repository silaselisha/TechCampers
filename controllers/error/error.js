const AppError = require("../../utils/appError")

const handleCastError = (err) => {
    const errorMessage = `Invalid ${err.path}: ${err.value}`
    return new AppError(400, errorMessage)
}

const handleMongoServerError = (err) => {
    const errorMessage = `Duplicate values ${Object.values(err.keyValue)}`
    return new AppError(400, errorMessage)
}

const handleValidationError = (err) => {
    let errorMessage = ``
    const values = Object.values(err.errors)
    const messages = []
    values.forEach(item => {
        messages.push(item.properties.message)
    })
   
    errorMessage = messages.join(', ')
    return new AppError(400, errorMessage)
}

const handleJsonWebTokenError = () => {
    return new AppError(403, 'invalid signature')
}

const handleTokenExpiredError = () => {
    return new AppError(403, 'jwt expired')
}

const sendErrorToDeveloper = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        stack: err.stack,
        error: err
    })
}

const sendErrorToClient = (err, res) => {
    if(err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        })
    }else { 
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong!'
        })
    }
}

const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.status = err.status || 'error'


    if(process.env.NODE_ENV === 'development') {
        sendErrorToDeveloper(err, res)
    }else if (process.env.NODE_ENV === 'production') {
        
        if(err.name === 'CastError') err = handleCastError(err)
        if(err.name === 'MongoServerError') err = handleMongoServerError(err)
        if(err.name === 'ValidationError') err = handleValidationError(err)
        if(err.name === 'JsonWebTokenError') err = handleJsonWebTokenError()
        if(err.name === 'TokenExpiredError') err = handleTokenExpiredError()

        sendErrorToClient(err, res)
    }
}

module.exports = globalErrorHandler