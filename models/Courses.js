const mongoose = require('mongoose')
const Bootcamp = require('./Bootcamps')

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Provide a name for the course'],
        trim: true,
        maxLength: [50, 'Title should be less than 50 characters']
    },
    description: {
        type: String,
        required: [true, 'Provide a description for the course'],
        maxLength: [500, 'Description for the course should be less than 500 characters']
    },
    weeks: {
        type: String,
        required: [true, 'Provide the course duration in weeks']
    },
    tuition: {
        type: Number, 
        required: ['Provide the tuition cost for the course']
    },
    minimumSkill: {
        type: String, 
        required: [true, 'Provide the prequiste skills to the course'],
        enum: ['beginner', 'intermediate', 'advanced']
    },
    schoolarhipsAvailable: {
        type: Boolean,
        default: false
    },
    bootcamp: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'course should belong to atleast one bootcamp'],
        ref: Bootcamp
    }
})

const Course = mongoose.model('Course', courseSchema)
module.exports = Course