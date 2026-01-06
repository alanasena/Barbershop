const router = require('express').Router()
const NewAppointment = require('../models/Appointment')
const Users = require('../models/User')
const mongoose = require('mongoose')

router.post('/appointment', async (req, res) => {
  try {
    const { userID, key, name, date, time, phone, day, timeInMS } = req.body

    if (!mongoose.Types.ObjectId.isValid(userID)) {
      return res.status(400).send({ error: 'Invalid user ID' })
    }

    const appointmentExists = await NewAppointment.findOne({ userID })
    if (appointmentExists) {
      return res.status(400).send({ error: 'You already have an appointment' })
    }

    const timeExists = await NewAppointment.findOne({ appointmentKey: key })
    if (timeExists) {
      return res.status(400).send({ error: 'Sorry, try another time' })
    }

    const user = await Users.findById(userID)
    if (!user) {
      return res.status(404).send({ error: 'User does not exist' })
    }

    const newAppointment = new NewAppointment({
      userID,
      appointmentKey: key,
      name,
      date,
      time,
      phone,
      day,
      timeInMS
    })

    await newAppointment.save()

    user.phone = phone
    await user.save()

    res.status(201).send('Appointment scheduled successfully')
  } catch (error) {
    console.error(error)
    res.status(500).send({ error: 'Server error' })
  }
})


router.post('/changeappointment', async (req, res) => {
  try {
    const { userID, key, date, time, day, timeInMS } = req.body

    if (!mongoose.Types.ObjectId.isValid(userID)) {
      return res.status(400).send({ error: 'Invalid user ID' })
    }

    const appointment = await NewAppointment.findOne({ userID })
    if (!appointment) {
      return res.status(404).send({ error: 'Appointment not found' })
    }

    appointment.appointmentKey = key
    appointment.date = date
    appointment.time = time
    appointment.day = day
    appointment.timeInMS = timeInMS

    await appointment.save()

    res.status(200).send('Appointment changed successfully')
  } catch (error) {
    console.error(error)
    res.status(500).send({ error: 'Server error' })
  }
})


router.get('/userappointment', async (req, res) => {
  try {
    const { id } = req.query

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({ error: 'Invalid user ID' })
    }

    const appointment = await NewAppointment.findOne({ userID: id })
    if (!appointment) {
      return res.status(404).send({ error: 'Appointment not found' })
    }

    res.send({
      day: appointment.day,
      time: appointment.time,
      date: appointment.date
    })
  } catch (error) {
    console.error(error)
    res.status(500).send({ error: 'Server error' })
  }
})


router.get('/getappointments', async (req, res) => {
  try {
    const appointments = await NewAppointment.find()

    if (appointments.length === 0) {
      return res.status(404).send({ error: 'No appointments found' })
    }

    res.send(appointments)
  } catch (error) {
    console.error(error)
    res.status(500).send({ error: 'Server error' })
  }
})


router.post('/cancelappointment', async (req, res) => {
  try {
    const { userID } = req.body

    if (!mongoose.Types.ObjectId.isValid(userID)) {
      return res.status(400).send({ error: 'Invalid user ID' })
    }

    const appointment = await NewAppointment.findOne({ userID })
    if (!appointment) {
      return res.status(404).send({ error: 'Appointment not found' })
    }

    await NewAppointment.deleteOne({ _id: appointment._id })

    res.status(200).send('Appointment canceled successfully')
  } catch (error) {
    console.error(error)
    res.status(500).send({ error: 'Server error' })
  }
})


router.get('/getusers', async (req, res) => {
  try {
    const users = await Users.find()

    if (users.length === 0) {
      return res.status(404).send({ error: 'No users found' })
    }

    res.send(users)
  } catch (error) {
    console.error(error)
    res.status(500).send({ error: 'Server error' })
  }
})

module.exports = router
