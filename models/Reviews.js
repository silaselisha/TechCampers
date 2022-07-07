const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Provide a title for your review'],
        maxLength: 80,
        trim: true
    },
    review: {
        type: String,
        required: [true, 'Provide your review'],
        maxLength: 500
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, 'Provide a rating of 1 to 5']
    },
    bootcamp: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bootcamp',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
})

reviewSchema.index({bootcamp: 1, user: 1}, {unique: true})

reviewSchema.statics.calculateRatingsAverage = async function(bootcampId){
    const pipeline = await this.aggregate([
        {
            $match: {
                bootcamp: bootcampId
            }
        }, 
        {
            $group: {
                _id: '$bootcamp',
                ratingsAverage: {$avg: '$rating'}
            }
        }
    ])

    try {
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
            ratingsAverage: pipeline[0].ratingsAverage 
        })
    }catch(err) {
        console.log(err.message)
    }
}

reviewSchema.post('save', async function() {
    this.constructor.calculateRatingsAverage(this.bootcamp)
})

reviewSchema.pre('remove', async function() {
    this.constructor.calculateRatingsAverage(this.bootcamp)
})

const Review = mongoose.model('Review', reviewSchema)
module.exports = Review