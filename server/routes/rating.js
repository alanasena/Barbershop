const router = require('express').Router();
const Rating = require('../models/Rating');
const Appointment = require('../models/Appointment');
const Barber = require('../models/Barber');
const { auth } = require('../middleware/auth');

// Criar avaliação
router.post('/ratings', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const { appointmentId, rating, comment } = req.body;

        // Verificar se o agendamento existe e pertence ao usuário
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({ error: 'Agendamento não encontrado' });
        }

        if (appointment.userID !== userId) {
            return res.status(403).json({ error: 'Você não pode avaliar este agendamento' });
        }

        // Verificar se o agendamento já foi avaliado
        if (appointment.isRated) {
            return res.status(400).json({ error: 'Este agendamento já foi avaliado' });
        }

        // Verificar se já passou da data do agendamento
        const appointmentDate = new Date(appointment.timeInMS);
        if (appointmentDate > new Date()) {
            return res.status(400).json({ error: 'Você só pode avaliar após a data do agendamento' });
        }

        if (!appointment.barberId) {
            return res.status(400).json({ error: 'Este agendamento não possui barbeiro associado' });
        }

        // Criar avaliação
        const newRating = new Rating({
            appointmentId,
            userId,
            barberId: appointment.barberId,
            rating,
            comment
        });

        await newRating.save();

        // Marcar agendamento como avaliado
        appointment.isRated = true;
        await appointment.save();

        // Atualizar média do barbeiro
        const barber = await Barber.findById(appointment.barberId);
        if (barber) {
            const totalRatings = barber.totalRatings + 1;
            const newAverage = ((barber.averageRating * barber.totalRatings) + rating) / totalRatings;
            
            barber.totalRatings = totalRatings;
            barber.averageRating = Math.round(newAverage * 10) / 10; // Arredondar para 1 casa decimal
            await barber.save();
        }

        res.status(201).json({ message: 'Avaliação enviada com sucesso!', rating: newRating });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Este agendamento já foi avaliado' });
        }
        console.error('Erro ao criar avaliação:', error);
        res.status(500).json({ error: 'Erro ao criar avaliação' });
    }
});

// Buscar avaliações do usuário
router.get('/ratings/my', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const ratings = await Rating.find({ userId })
            .populate('barberId', 'name')
            .populate('appointmentId', 'date time')
            .sort({ date: -1 });
        
        res.json(ratings);
    } catch (error) {
        console.error('Erro ao buscar avaliações:', error);
        res.status(500).json({ error: 'Erro ao buscar avaliações' });
    }
});

module.exports = router;
