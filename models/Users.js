const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Provide a user name'],
        maxLength: 30,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Provide a user email'],
        unique: true,
        validate: [validator.isEmail, 'Provide a valid email']
    },
    role: {
        type: String,
        enum: ['user', 'publisher', 'admin'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Provide a password'],
        minLength: 8,
        select: false
    },
    confirmPassword: {
        type: String,
        required: [true, 'confirm your user password'],
        validate: {
            validator: function(value) {
                return value === this.password
            },
            message: 'Passwords don\'t match'
        }
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})


userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next()

    this.password = await bcrypt.hash(this.password, 12)
    this.confirmPassword = undefined

    next()
})

userSchema.methods.comparePasswords = async function(candidatePass, userPass) {
    return await bcrypt.compare(candidatePass, userPass)
}

const User = mongoose.model('User', userSchema)
module.exports = User