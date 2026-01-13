const router = require('express').Router();
const NewAppointment = require('../models/Appointment');
const Users = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');

router.post('/appointment', auth, async (req, res) => {
    try {
        const userID = req.user.id;
        
        // Verificar se já tem agendamento
        const appointmentExists = await NewAppointment.findOne({ userID });
        if (appointmentExists) {
            return res.status(400).json({error: 'Você já possui um agendamento'});
        }

        // Verificar se o horário já está ocupado
        const timeExists = await NewAppointment.findOne({ appointmentKey: req.body.key });
        if (timeExists) {
            return res.status(400).json({error: 'Horário já ocupado, tente outro horário'});
        }

        // Verificar se usuário existe
        const user = await Users.findById(userID);
        if (!user) {
            return res.status(404).json({error: 'Usuário não encontrado'});
        }

        let {key, name, date, time, phone, day, timeInMS, barberId} = req.body;

        const newAppointment = new NewAppointment({   
            userID,
            appointmentKey: key,
            name: name || user.name,
            date,
            time,
            phone,
            day,
            timeInMS,
            barberId: barberId || null
        });

        await newAppointment.save();

        // Atualizar telefone do usuário se fornecido
        if (phone) {
            user.phone = phone;
            await user.save();
        }

        res.status(200).json({ message: 'Agendamento realizado com sucesso!' });
    } catch (error) {
        console.error('Erro ao criar agendamento:', error);
        res.status(500).json({error: 'Erro ao criar agendamento'});
    }
});

router.post('/changeappointment', auth, async (req, res) => {
    try {
        const userID = req.user.id;

        const appointment = await NewAppointment.findOne({ userID });
        if (!appointment) {
            return res.status(404).json({error: 'Agendamento não encontrado'});
        }

        // Verificar se o novo horário já está ocupado
        if (req.body.key && req.body.key !== appointment.appointmentKey) {
            const timeExists = await NewAppointment.findOne({ appointmentKey: req.body.key });
            if (timeExists) {
                return res.status(400).json({error: 'Horário já ocupado, tente outro horário'});
            }
        }

        let {key, date, time, day, timeInMS} = req.body;

        if (key) appointment.appointmentKey = key;
        if (date) appointment.date = date;
        if (time) appointment.time = time;
        if (day) appointment.day = day;
        if (timeInMS) appointment.timeInMS = timeInMS;

        await appointment.save();
        res.status(200).json({ message: 'Agendamento alterado com sucesso!' });
    } catch (error) {
        console.error('Erro ao alterar agendamento:', error);
        res.status(500).json({error: 'Erro ao alterar agendamento'});
    }
});

router.get('/userappointment', auth, async(req, res) => {
    try {
        const userID = req.user.id;

        const appointment = await NewAppointment.findOne({ userID });
        if (!appointment) {
            return res.status(404).json({error: 'Agendamento não encontrado'});
        }

        res.json({
            _id: appointment._id,
            day: appointment.day,
            time: appointment.time,
            date: appointment.date,
            barberId: appointment.barberId || null,
            isRated: appointment.isRated || false,
            isCompleted: appointment.isCompleted || false,
            timeInMS: appointment.timeInMS
        });
    } catch (error) {
        console.error('Erro ao buscar agendamento:', error);
        res.status(500).json({error: 'Erro ao buscar agendamento'});
    }
});

router.get('/getappointments', adminAuth, async(req, res) => {
    try {
        const appointments = await NewAppointment.find();
        
        if (appointments.length === 0) {
            return res.status(404).json({error: 'Nenhum agendamento encontrado'});
        }

        res.json(appointments);
    } catch (error) {
        console.error('Erro ao buscar agendamentos:', error);
        res.status(500).json({error: 'Erro ao buscar agendamentos'});
    }
});

router.post('/cancelappointment', auth, async(req, res) => {
    try {
        const userID = req.user.id;

        const appointment = await NewAppointment.findOne({ userID });
        if (!appointment) {
            return res.status(404).json({error: 'Agendamento não encontrado'});
        }

        await NewAppointment.deleteOne({ _id: appointment._id });
        res.json({ message: 'Agendamento cancelado com sucesso' });
    } catch (error) {
        console.error('Erro ao cancelar agendamento:', error);
        res.status(500).json({error: 'Erro ao cancelar agendamento'});
    }
});

router.get('/getusers', adminAuth, async(req, res) => {
    try {
        const users = await Users.find().select('-password'); // Não retornar senhas
        if (users.length === 0) {
            return res.status(404).json({error: 'Nenhum usuário encontrado'});
        }
        res.json(users);
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        res.status(500).json({error: 'Erro ao buscar usuários'});
    }
});

module.exports = router;
