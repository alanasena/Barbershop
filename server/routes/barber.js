const router = require('express').Router();
const Barber = require('../models/Barber');
const { auth, adminAuth } = require('../middleware/auth');

// Listar todos os barbeiros ativos (público)
router.get('/barbers', async (req, res) => {
    try {
        console.log('Rota /barbers chamada');
        const barbers = await Barber.find({ isActive: true })
            .select('_id name email phone specialties averageRating totalRatings');
        console.log(`Barbeiros encontrados: ${barbers.length}`);
        if (barbers.length === 0) {
            console.log('⚠️ Nenhum barbeiro ativo encontrado no banco de dados');
        }
        res.json(barbers);
    } catch (error) {
        console.error('Erro ao buscar barbeiros:', error);
        res.status(500).json({ error: 'Erro ao buscar barbeiros' });
    }
});

// Buscar um barbeiro específico
router.get('/barbers/:id', async (req, res) => {
    try {
        const barber = await Barber.findById(req.params.id)
            .select('name email phone specialties averageRating totalRatings');
        if (!barber) {
            return res.status(404).json({ error: 'Barbeiro não encontrado' });
        }
        res.json(barber);
    } catch (error) {
        console.error('Erro ao buscar barbeiro:', error);
        res.status(500).json({ error: 'Erro ao buscar barbeiro' });
    }
});

// Criar barbeiro (apenas admin)
router.post('/barbers', adminAuth, async (req, res) => {
    try {
        const { name, email, phone, specialties } = req.body;
        
        const barberExists = await Barber.findOne({ email });
        if (barberExists) {
            return res.status(400).json({ error: 'Barbeiro já cadastrado com este email' });
        }

        const barber = new Barber({ name, email, phone, specialties });
        await barber.save();
        
        res.status(201).json({ message: 'Barbeiro cadastrado com sucesso!', barber });
    } catch (error) {
        console.error('Erro ao criar barbeiro:', error);
        res.status(500).json({ error: 'Erro ao criar barbeiro' });
    }
});

// Buscar todos os barbeiros (admin - inclui inativos)
router.get('/admin/barbers', adminAuth, async (req, res) => {
    try {
        const barbers = await Barber.find()
            .select('name email phone specialties averageRating totalRatings isActive');
        res.json(barbers);
    } catch (error) {
        console.error('Erro ao buscar barbeiros:', error);
        res.status(500).json({ error: 'Erro ao buscar barbeiros' });
    }
});

// Atualizar barbeiro (admin)
router.put('/barbers/:id', adminAuth, async (req, res) => {
    try {
        const { name, email, phone, specialties, isActive } = req.body;
        const barber = await Barber.findById(req.params.id);
        
        if (!barber) {
            return res.status(404).json({ error: 'Barbeiro não encontrado' });
        }

        // Verificar se o email já existe em outro barbeiro
        if (email && email !== barber.email) {
            const emailExists = await Barber.findOne({ email });
            if (emailExists) {
                return res.status(400).json({ error: 'Email já cadastrado para outro barbeiro' });
            }
        }

        if (name) barber.name = name;
        if (email) barber.email = email;
        if (phone !== undefined) barber.phone = phone;
        if (specialties) barber.specialties = specialties;
        if (isActive !== undefined) barber.isActive = isActive;

        await barber.save();
        res.json({ message: 'Barbeiro atualizado com sucesso!', barber });
    } catch (error) {
        console.error('Erro ao atualizar barbeiro:', error);
        res.status(500).json({ error: 'Erro ao atualizar barbeiro' });
    }
});

// Deletar barbeiro (admin)
router.delete('/barbers/:id', adminAuth, async (req, res) => {
    try {
        const barber = await Barber.findById(req.params.id);
        
        if (!barber) {
            return res.status(404).json({ error: 'Barbeiro não encontrado' });
        }

        // Verificar se há agendamentos futuros
        const Appointment = require('../models/Appointment');
        const futureAppointments = await Appointment.find({
            barberId: req.params.id,
            timeInMS: { $gte: Date.now() }
        });

        if (futureAppointments.length > 0) {
            // Desativar ao invés de deletar
            barber.isActive = false;
            await barber.save();
            return res.json({ message: 'Barbeiro desativado (possui agendamentos futuros)', barber });
        }

        await Barber.deleteOne({ _id: req.params.id });
        res.json({ message: 'Barbeiro deletado com sucesso!' });
    } catch (error) {
        console.error('Erro ao deletar barbeiro:', error);
        res.status(500).json({ error: 'Erro ao deletar barbeiro' });
    }
});

// Buscar avaliações de um barbeiro
router.get('/barbers/:id/ratings', async (req, res) => {
    try {
        const Rating = require('../models/Rating');
        const ratings = await Rating.find({ barberId: req.params.id })
            .populate('userId', 'name')
            .sort({ date: -1 })
            .limit(50);
        
        res.json(ratings);
    } catch (error) {
        console.error('Erro ao buscar avaliações:', error);
        res.status(500).json({ error: 'Erro ao buscar avaliações' });
    }
});

module.exports = router;
