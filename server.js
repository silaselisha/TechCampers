const dotenv = require('dotenv')
const colors = require('colors/safe')

process.on('uncaughtException', (err) => {
    console.log(err.name, err.message)
    process.exit(1)
})

dotenv.config({path: './config/config.env'})
const mongoose = require('mongoose')


const app = require('./index')

const port = process.env.PORT || 4000
const localhost = '127.0.0.1'

const databseURI = process.env.DATABASE_URI.replace('<password>', process.env.DATABASE_PASSWORD)

mongoose.connect(databseURI, {})
    .then(({ connections }) => {
        console.log(colors.green.inverse(`Database connected on port ${connections[0].port}`))
    })
    .catch(err => {
        console.log(err.message)
    })


const server = app.listen(port, () => {
    console.log(`http://${localhost}:${port}`)
})

process.on('unhandledRejection', (err) => {
    server.close(() => {
         console.log(err.name, err.message)
        process.exit(1)
    })
})