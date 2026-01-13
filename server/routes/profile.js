const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const Users = require('../models/User');
const NewAppointment = require('../models/Appointment');
const { auth } = require('../middleware/auth');

router.get('/profiledata', auth, async(req, res) => {
    try {
        const userID = req.user.id;
        
        const user = await Users.findById(userID);
        if (!user) {
            return res.status(404).json({error: 'Usuário não encontrado'});
        }

        res.json({
            email: user.email,
            phone: user.phone || '',
            name: user.name
        });
    } catch (error) {
        console.error('Erro ao buscar dados do perfil:', error);
        res.status(500).json({error: 'Erro ao buscar dados do perfil'});
    }
});

const updateProfileValidation = [
    body('email').optional().isEmail().normalizeEmail().withMessage('Email inválido'),
    body('name').optional().trim().isLength({ min: 1 }).withMessage('Nome não pode estar vazio'),
    body('phone').optional().trim()
];

router.post('/updateprofile', auth, updateProfileValidation, async(req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array()[0].msg });
        }

        const userID = req.user.id;
        let {name, email, phone} = req.body;

        const user = await Users.findById(userID);
        if (!user) {
            return res.status(404).json({error: 'Usuário não encontrado'});
        }

        // Verificar se email já está em uso por outro usuário
        if (email && email !== user.email) {
            const emailExists = await Users.findOne({ email: email.toLowerCase() });
            if (emailExists) {
                return res.status(400).json({error: 'Email já está em uso'});
            }
            user.email = email.toLowerCase();
        }

        if (name && name.trim() !== '') {
            user.name = name.trim();
        }
        
        if (phone && phone.trim() !== '') {
            user.phone = phone.trim();
        }

        await user.save();
        res.json({ message: 'Perfil atualizado com sucesso' });
    } catch (error) {
        console.error('Erro ao atualizar perfil:', error);
        if (error.code === 11000) {
            return res.status(400).json({error: 'Email já está em uso'});
        }
        res.status(500).json({error: 'Erro ao atualizar perfil'});
    }
});

router.post('/deleteacc', auth, async(req, res) => {
    try {
        const userID = req.user.id;

        // Deletar agendamento do usuário se existir
        const appointment = await NewAppointment.findOne({ userID });
        if (appointment) {
            await NewAppointment.deleteOne({ _id: appointment._id });
        }

        // Deletar conta do usuário
        await Users.deleteOne({ _id: userID });

        res.json({ message: 'Conta deletada com sucesso' });
    } catch (error) {
        console.error('Erro ao deletar conta:', error);
        res.status(500).json({error: 'Erro ao deletar conta'});
    }
});

module.exports = router;