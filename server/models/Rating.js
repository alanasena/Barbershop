const mongoose = require('mongoose')

const ratingSchema = new mongoose.Schema({
    appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'appointments',
        required: false
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: false
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
    },
    isManual: {
        type: Boolean,
        default: false
    },
    clientName: {
        type: String,
        trim: true,
        maxlength: 120
    },
    clientEmail: {
        type: String,
        trim: true,
        maxlength: 120
    }
}, {
    timestamps: true
})

ratingSchema.index({ appointmentId: 1 }, { unique: true, sparse: true })

module.exports = mongoose.model('ratings', ratingSchema)
