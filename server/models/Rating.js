const mongoose = require('mongoose')

const ratingSchema = new mongoose.Schema({
    appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'appointments',
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    barberId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'barbers',
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
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
})

// Índice para evitar múltiplas avaliações do mesmo agendamento
ratingSchema.index({ appointmentId: 1 }, { unique: true })

module.exports = mongoose.model('ratings', ratingSchema)
