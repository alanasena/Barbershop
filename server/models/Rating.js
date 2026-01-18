const mongoose = require('mongoose')

const ratingSchema = new mongoose.Schema({
    appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'appointments',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        trim: true,
        maxlength: 500
    }
}, {
    timestamps: true
})

ratingSchema.index({ appointmentId: 1 }, { unique: true })

module.exports = mongoose.model('ratings', ratingSchema)
