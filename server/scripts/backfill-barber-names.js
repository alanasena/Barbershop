const dotenv = require('dotenv')
const connectDB = require('../config/db')
const Rating = require('../models/Rating')

dotenv.config({ path: './config/config.env' })

const NAMES = [
    'Carlos',
    'Joao',
    'Marcos',
    'Pedro',
    'Rafael'
]

const run = async () => {
    await connectDB()

    const ratings = await Rating.find({
        $or: [{ barberName: { $exists: false } }, { barberName: '' }, { barberName: null }]
    }).sort({ createdAt: 1 })

    if (!ratings.length) {
        console.log('Nenhum feedback para atualizar.')
        process.exit(0)
    }

    const updates = ratings.map((rating, index) => ({
        updateOne: {
            filter: { _id: rating._id },
            update: { $set: { barberName: NAMES[index % NAMES.length] } }
        }
    }))

    const result = await Rating.bulkWrite(updates)
    console.log(`Feedbacks atualizados: ${result.modifiedCount}`)
    process.exit(0)
}

run().catch((err) => {
    console.error('Erro ao atualizar feedbacks:', err)
    process.exit(1)
})
