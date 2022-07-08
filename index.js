const path = require('path')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const cookieParse = require('cookie-parser')
const hpp = require('hpp')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const rateLimit = require('express-rate-limit')
const fileUpload = require('express-fileupload')

const bootcampsRouter = require('./routes/bootcamp')
const coursesRouter = require('./routes/courses')
const usersRouter = require('./routes/users')
const reviewsRouter = require('./routes/reviews')

const globalErrorHandler = require('./controllers/error/error')
const AppError = require('./utils/appError')

const app = express()
app.use(helmet())
app.use(hpp())
app.use(mongoSanitize())
app.use(cookieParse())
app.use(fileUpload())
app.use(cors())
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())

const limiter = rateLimit({
    windowMs: 15 * 60 * 100,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false
})

app.use(limiter)

if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

app.use('/api/v1/bootcamps', bootcampsRouter)
app.use('/api/v1/users', usersRouter)
app.use('/api/v1/courses', coursesRouter)
app.use('/api/v1/reviews', reviewsRouter)

app.all('*', (req, res, next) => {
    next(new AppError(404, `Cannot find ${req.originalUrl}`))
})

app.use(globalErrorHandler)
module.exports = app