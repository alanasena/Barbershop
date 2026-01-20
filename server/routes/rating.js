const router = require('express').Router()
const Rating = require('../models/Rating')
const Appointment = require('../models/Appointment')
const Users = require('../models/User')

router.post('/rating', async (req, res) => {
    try {
        const { appointmentId, userId, rating, comment } = req.body

        if (!appointmentId || !userId || !rating) {
            return res.status(400).send({ error: 'Dados incompletos' })
        }

        const appointment = await Appointment.findById(appointmentId)
        if (!appointment) {
            return res.status(404).send({ error: 'Agendamento nao encontrado' })
        }

        const user = await Users.findById(userId)
        if (!user) {
            return res.status(404).send({ error: 'Usuario nao encontrado' })
        }

        const existingRating = await Rating.findOne({ appointmentId })
        if (existingRating) {
            return res.status(400).send({ error: 'Este agendamento ja foi avaliado' })
        }

        const newRating = new Rating({
            appointmentId,
            userId,
            rating,
            comment: comment || '',
            isManual: false
        })

        await newRating.save()

        appointment.rated = true
        await appointment.save()

        res.status(201).send(newRating)
    } catch (error) {
        console.error('Erro ao criar avaliacao:', error)
        res.status(500).send({ error: 'Erro ao criar avaliacao' })
    }
})

router.post('/rating/manual', async (req, res) => {
    try {
        const { rating, comment, clientName, clientEmail, barberName, barberEmail } = req.body

        if (!rating) {
            return res.status(400).send({ error: 'Nota e obrigatoria' })
        }
        if (!barberName) {
            return res.status(400).send({ error: 'Nome do barbeiro e obrigatorio' })
        }

        const manualRating = new Rating({
            rating,
            comment: comment || '',
            isManual: true,
            clientName: clientName || 'Cliente',
            clientEmail: clientEmail || '',
            barberName,
            barberEmail: barberEmail || ''
        })

        await manualRating.save()

        res.status(201).send(manualRating)
    } catch (error) {
        console.error('Erro ao criar avaliacao manual:', error)
        res.status(500).send({ error: 'Erro ao criar avaliacao manual' })
    }
})

router.get('/ratings', async (req, res) => {
    try {
        const ratings = await Rating.find()
            .sort({ createdAt: -1 })
            .populate('appointmentId')
            .populate('userId')

        if (!ratings[0]) {
            return res.send([])
        }

        const response = ratings.map((item) => ({
            _id: item._id,
            rating: item.rating,
            comment: item.comment,
            createdAt: item.createdAt,
            isManual: item.isManual,
            clientName: item.clientName || null,
            clientEmail: item.clientEmail || null,
            barberName: item.barberName || null,
            barberEmail: item.barberEmail || null,
            user: item.userId ? {
                _id: item.userId._id,
                name: item.userId.name,
                email: item.userId.email,
                phone: item.userId.phone
            } : null,
            appointment: item.appointmentId ? {
                _id: item.appointmentId._id,
                name: item.appointmentId.name,
                date: item.appointmentId.date,
                time: item.appointmentId.time,
                day: item.appointmentId.day
            } : null
        }))

        res.send(response)
    } catch (error) {
        console.error('Erro ao buscar avaliacoes:', error)
        res.status(500).send({ error: 'Erro ao buscar avaliacoes' })
    }
})

module.exports = router
