const NodeGeocoder = require('node-geocoder')

const options = {
    provider: process.env.PROVIDER,
    apiKey: process.env.GEOCODER_API
}

module.exports = NodeGeocoder(options)