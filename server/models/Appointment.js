const mongoose = require('mongoose')

const newAppointment = new mongoose.Schema({

    userID:{
        type:String,
        required: [true, 'ID do usuário é obrigatório']
    },
    appointmentKey:{
        type:String,
        required: [true, 'Chave do agendamento é obrigatória'],
        unique: true
    },
    name:{
        type:String,
        required: [true, 'Nome é obrigatório']
    },
    date:{
        type:String,
        required: [true, 'Data é obrigatória']
    },
    time:{
        type:String,
        required: [true, 'Hora é obrigatória']
    },   
    phone:{
        type:String,
        trim: true
    },
    day:{
        type:String,
        required: [true, 'Dia da semana é obrigatório']
    },
    timeInMS:{
        type:Number,
        required: [true, 'Timestamp é obrigatório']
    },
    barberId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'barbers',
        required: false
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    isRated: {
        type: Boolean,
        default: false
    }
 })

 module.exports = mongoose.model('appointments', newAppointment)
  // first param its the collection name in mongoDB atals
