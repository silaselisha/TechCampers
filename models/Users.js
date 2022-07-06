const crypto = require('crypto')
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
        enum: {
            values: ['user', 'publisher'],
            message: 'roles should either be users or publishers'
        },
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
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
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

userSchema.pre('save', function(next) {
    if(!this.isModified('password') || this.isNew) {
        return next()
    }

    this.passwordChangedAt = Date.now() - 1000
    next()
})

userSchema.methods.comparePasswords = async function(candidatePass, userPass) {
    return await bcrypt.compare(candidatePass, userPass)
}

userSchema.methods.tokenExpiration = function(jwtIat) {
    if(this.passwordChangedAt) {
        const timeMs = parseInt(this.passwordChangedAt.getTime() / 1000, 10)
        
        return jwtIat < timeMs
    }
    return false
}

userSchema.methods.createResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex')

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000

    console.log({resetToken}, this.passwordResetToken, this.passwordResetTokenExpires)
    return resetToken
}

const User = mongoose.model('User', userSchema)
module.exports = User