const mongoose = require('mongoose')

const barberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Nome do barbeiro é obrigatório'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email é obrigatório'],
        unique: true,
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    specialties: {
        type: [String],
        default: []
    },
    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    totalRatings: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: false // Opcional para manter compatibilidade com dados existentes
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('barbers', barberSchema)
