const mongoose = require('mongoose')

const newUser = new mongoose.Schema({

    email:{
        type:String,
        required: [true, 'Email é obrigatório'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Email inválido']
    },
    password:{
        type:String,
        required: [true, 'Senha é obrigatória'],
        minlength: [3, 'Senha deve ter no mínimo 3 caracteres']
    },
    name:{
        type:String,
        required: [true, 'Nome é obrigatório'],
        trim: true
    },
    phone:{
        type:String,
        trim: true
    },
    admin:{
        type: Boolean,
        default: false
    }
 })

 module.exports = mongoose.model('users', newUser)
 // first param its the collection name in mongoDB atals
