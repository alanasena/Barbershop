const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const NewUser = require('../models/User');
const Barber = require('../models/Barber');

router.get('/', async (req, res) => {
    res.send('hi from the server')
})

// Validações para registro
const registerValidation = [
    body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
    body('pass').isLength({ min: 3 }).withMessage('Senha deve ter no mínimo 3 caracteres'),
    body('confirmPass').custom((value, { req }) => {
        if (value !== req.body.pass) {
            throw new Error('As senhas não coincidem');
        }
        return true;
    })
];

router.post('/register', registerValidation, async (req, res) => {
    try {
        // Verificar erros de validação
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array()[0].msg });
        }

        let {email, pass, confirmPass} = req.body;

        // Verificar se usuário já existe
        const userExists = await NewUser.findOne({ email: email.toLowerCase() });
        if (userExists) {
            return res.status(400).json({error: 'Usuário já existe'});
        }

        if (pass !== confirmPass) {
            return res.status(400).json({error: 'As senhas não coincidem'});
        }

        // Hash da senha
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(pass, salt);

        // Criar nome de usuário a partir do email
        let username = email.substring(0, email.indexOf('@'));

        // Determinar se é admin (apenas se especificado explicitamente ou email específico)
        // Por padrão, nenhum usuário é admin
        const isAdmin = email.toLowerCase() === 'admin@barbershop.com' || req.body.isAdmin === true;

        const newUser = new NewUser({   
            email: email.toLowerCase(),
            password: hashedPassword,
            name: username,
            admin: isAdmin
        });

        await newUser.save();
        res.status(200).json({ message: 'Registro realizado com sucesso' });
    } catch (error) {
        console.error('Erro no registro:', error);
        if (error.code === 11000) {
            return res.status(400).json({error: 'Email já cadastrado'});
        }
        res.status(500).json({error: 'Erro ao registrar usuário'});
    }
});

// Validações para login
const loginValidation = [
    body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
    body('pass').notEmpty().withMessage('Senha é obrigatória')
];

router.post('/login', loginValidation, async (req, res) => {
    try {
        // Verificar erros de validação
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array()[0].msg });
        }

        let {email, pass} = req.body;
        
        // Buscar usuário
        const user = await NewUser.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({error: 'Usuário não encontrado'});
        }
        
        // Verificar senha
        let validPassword = false;
        
        // Se a senha no banco é hash bcrypt (começa com $2)
        if (user.password.startsWith('$2')) {
            validPassword = await bcrypt.compare(pass, user.password);
        } else {
            // Senha antiga em texto plano - comparar diretamente e migrar
            if (user.password === pass) {
                validPassword = true;
                // Migrar senha para hash bcrypt
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(pass, salt);
                await user.save();
                console.log(`Senha do usuário ${user.email} migrada para bcrypt`);
            }
        }
        
        if (!validPassword) {
            return res.status(401).json({error: 'Senha incorreta'});
        }
        
        // Verificar se o usuário é um barbeiro
        const barber = await Barber.findOne({ userId: user._id });
        const isBarber = !!barber;

        // Gerar token JWT
        const token = jwt.sign(
            { 
                id: user._id, 
                email: user.email, 
                admin: user.admin || false,
                barber: isBarber,
                barberId: isBarber ? barber._id.toString() : null
            },
            process.env.JWT_SECRET || 'fallback_secret_key_change_in_production',
            { expiresIn: '2d' }
        );

        let username = user.name || email.substring(0, email.indexOf('@'));
        let userPhone = user.phone || '';

        res.json({
            id: user._id,
            status: 'logged',
            name: username,
            admin: user.admin || false,
            barber: isBarber,
            barberId: isBarber ? barber._id.toString() : null,
            phone: userPhone,
            token: token
        });
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({error: 'Erro ao fazer login'});
    }
});

module.exports = router;
