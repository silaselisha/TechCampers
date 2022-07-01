const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const bootcampsRouter = require('./routes/bootcamp')
const globalErrorHandler = require('./controllers/error/error')
const AppError = require('./utils/appError')

const app = express()
app.use(cors())
app.use(express.json())


if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

app.use('/api/v1/bootcamps', bootcampsRouter)

app.all('*', (req, res, next) => {
    next(new AppError(404, `Cannot find ${req.originalUrl}`))
})

app.use(globalErrorHandler)
module.exports = app