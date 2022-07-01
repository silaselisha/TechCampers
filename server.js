const dotenv = require('dotenv')
dotenv.config({path: './config/config.env'})
const mongoose = require('mongoose')


const app = require('./index')

const port = process.env.PORT || 4000
const localhost = '127.0.0.1'

const databseURI = process.env.DATABASE_URI.replace('<password>', process.env.DATABASE_PASSWORD)

mongoose.connect(databseURI, {})
    .then(({ connections }) => {
        console.log(`Database connected on port ${connections[0].port}`)
    })
    .catch(err => {
        console.log(err.message)
    })


app.listen(port, () => {
    console.log(`http://${localhost}:${port}`)
})