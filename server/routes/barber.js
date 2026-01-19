const router = require('express').Router()
const Users = require('../models/User')

// Lista barbeiros cadastrados no sistema.
// Neste projeto, consideramos barbeiros como usuarios com email @barbearia.com
router.get('/barbers', async (req, res) => {
    try {
        const barbers = await Users.find({ email: /@barbearia\.com$/i })
            .select('name email')
            .sort({ name: 1 })

        if (!barbers.length) {
            return res.send([])
        }

        const response = barbers.map((barber) => ({
            id: barber._id,
            name: barber.name,
            email: barber.email
        }))

        res.send(response)
    } catch (error) {
        console.error('Erro ao listar barbeiros:', error)
        res.status(500).send({ error: 'Erro ao listar barbeiros' })
    }
})

module.exports = router
