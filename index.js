const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const bootcampsRouter = require('./routes/bootcamp')

const app = express()
app.use(cors())

if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

app.use('/api/v1/bootcamps', bootcampsRouter)

module.exports = app