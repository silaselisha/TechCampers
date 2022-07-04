const mongoose = require('mongoose')
const slugify = require('slugify')
const geocoder = require('../utils/geocoder')

const bootcampSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: [true, 'Provide a bootcamps\' name!'],
        maxLength: [50, 'Bottcapm\'s name should be less than 50 characters!']
    },
    description: {
        type: String,
        required: [true, 'Provide a description about the bootcamp to be published!'],
        maxLength: [500, 'Description should be less than 500 chracters!']
    },
    website: {
        type: String, 
        match: [
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
            'Please provide a valid url address for the bootcamp! It can start with either http or https'
        ]
    },
    phone: {
        type: String, 
        maxLength: [20, 'Phone number should not exceed more than 20 characters!']
    },
    email : {
        type: String, 
        match: [
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email address!'
        ]
    },
    address: {
        type: String
    }, 
    location: {
        type: {
            type: String,
            enum: ['point']
        },
        coordinates: {
            type: [Number],
            index: '2dsphere'
        },
        state: String,
        zipCode: String,
        city: String,
        street: String,
        country: String,
        formattedAddress: String,
    },
    careers: {
        type: ['String'],
        enum: [
            'Software Engineering',
            'Data Science',
            'Machine Learning',
            'Game Development',
            'UI/UX Design',
            'Project Management',
            'Business',
            'Web Development',
            'Mobile Development',
            'Others'
        ]
    },
    housing: {
        type: Boolean,
        default: false
    },
    jobAssistance: {
        type: Boolean,
        default: true
    },
    jobGuarantee: {
        type: Boolean,
        default: true
    },
    acceptGi: {
        type: Boolean,
        default: true
    },
    slug: String,
    averageCost: Number,
    photo: {
        type: String,
        default: 'no-photo.jpeg'
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    }
}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
})

// HOOKS
bootcampSchema.pre('save', function(next) {
    this.slug = slugify(this.name, {lower: true})
    next()
})

bootcampSchema.pre('save', async function(next) {
    const loc = await geocoder.geocode(this.address)
    const {latitude, longitude, city, stateCode, streetName, countryCode, zipcode, formattedAddress} = loc[0]

    this.location = {
        type: 'Point',
        coordinates: [longitude, latitude],
        formattedAddress: formattedAddress,
        country: countryCode,
        city,
        street: streetName,
        zipCode: zipcode,
        state: stateCode
    }

    this.address = undefined
    next()
})

bootcampSchema.pre('remove', async function(next) {
    await this.model('Course').deleteMany({bootcamp: this._id})
    next()
})

bootcampSchema.virtual('courses', {
    ref: 'Course',
    localField: '_id',
    foreignField: 'bootcamp',
    justOne: false
})

const Bootcamp = mongoose.model('Bootcamp', bootcampSchema)
module.exports = Bootcamp