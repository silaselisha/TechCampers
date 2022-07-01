const dotenv = require('dotenv')
dotenv.config({path: './config/config.env'})

const app = require('./index')

const port = process.env.PORT || 4000
const localhost = '127.0.0.1'

app.listen(port, () => {
    console.log(`http://${localhost}:${port}`)
})