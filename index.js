const path = require('path')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const fileUpload = require('express-fileupload')

const bootcampsRouter = require('./routes/bootcamp')
const coursesRouter = require('./routes/courses')

const globalErrorHandler = require('./controllers/error/error')
const AppError = require('./utils/appError')

const app = express()
app.use(fileUpload())
app.use(cors())
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())


if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

app.use('/api/v1/bootcamps', bootcampsRouter)
app.use('/api/v1/courses', coursesRouter)

app.all('*', (req, res, next) => {
    next(new AppError(404, `Cannot find ${req.originalUrl}`))
})

app.use(globalErrorHandler)
module.exports = app