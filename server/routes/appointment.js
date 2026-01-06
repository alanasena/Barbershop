const router = require('express').Router()
const NewAppointment = require('../models/Appointment')
const Users = require('../models/User')
const mongoose = require('mongoose')

/**
 * SANITIZE OBJECT ID
 */
const sanitizeString = (value) => {
  if (typeof value === 'string') return value.toString()
  if (value !== undefined && value !== null) return String(value)
  return ''
}

const sanitizeObjectId = (id) => {
  if (typeof id !== 'string') return null
  if (!mongoose.Types.ObjectId.isValid(id)) return null
  return new mongoose.Types.ObjectId(id)
}

/**
 * CREATE APPOINTMENT
 */
router.post('/appointment', async (req, res) => {
  try {
    const { userID, key, name, date, time, phone, day, timeInMS } = req.body

    const safeUserId = sanitizeObjectId(userID)
    if (!safeUserId) {
      return res.status(400).send({ error: 'Invalid user ID' })
    }

    const appointmentExists = await NewAppointment.findOne({ userID: { $eq: safeUserId } })

    if (appointmentExists) {
      return res.status(400).send({ error: 'You already have an appointment' })
    }
    const timeExists = await NewAppointment.findOne({ appointmentKey: { $eq: sanitizeString(key) } })

    if (timeExists) {
      return res.status(400).send({ error: 'Sorry, try another time' })
    }
    const user = await Users.findOne({ _id: { $eq: safeUserId } })

    if (!user) {
      return res.status(404).send({ error: 'User does not exist' })
    }

    const newAppointment = new NewAppointment({
      userID: safeUserId,
      appointmentKey: sanitizeString(key),
      name: sanitizeString(name),
      date: sanitizeString(date),
      time: sanitizeString(time),
      phone: sanitizeString(phone),
      day: sanitizeString(day),
      timeInMS

    })

    await newAppointment.save()

    user.phone = sanitizeString(phone)
    await user.save()

    res.status(201).send('Appointment scheduled successfully')
  } catch (error) {
    console.error(error)
    res.status(500).send({ error: 'Server error' })
  }
})

/**
 * CHANGE APPOINTMENT
 */
router.post('/changeappointment', async (req, res) => {
  try {
    const { userID, key, date, time, day, timeInMS } = req.body

    const safeUserId = sanitizeObjectId(userID)
    if (!safeUserId) {
      return res.status(400).send({ error: 'Invalid user ID' })
    }

    const appointment = await NewAppointment.findOne({
      userID: { $eq: safeUserId }
    })

    if (!appointment) {
      return res.status(404).send({ error: 'Appointment not found' })
    }
    appointment.appointmentKey = sanitizeString(key)
    appointment.date = sanitizeString(date)
    appointment.time = sanitizeString(time)
    appointment.day = sanitizeString(day)
    appointment.timeInMS = sanitizeString(timeInMS)

    await appointment.save()

    res.status(200).send('Appointment changed successfully')
  } catch (error) {
    console.error(error)
    res.status(500).send({ error: 'Server error' })
  }
})

/**
 * GET USER APPOINTMENT
 */
router.get('/userappointment', async (req, res) => {
  try {
    const { id } = req.query

    const safeUserId = sanitizeObjectId(id)
    if (!safeUserId) {
      return res.status(400).send({ error: 'Invalid user ID' })
    }

    const appointment = await NewAppointment.findOne({
      userID: { $eq: safeUserId }
    })

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

/**
 * GET ALL APPOINTMENTS
 */
router.get('/getappointments', async (req, res) => {
  try {
    const appointments = await NewAppointment.find({})

    if (appointments.length === 0) {
      return res.status(404).send({ error: 'No appointments found' })
    }

    res.send(appointments)
  } catch (error) {
    console.error(error)
    res.status(500).send({ error: 'Server error' })
  }
})

/**
 * CANCEL APPOINTMENT
 */
router.post('/cancelappointment', async (req, res) => {
  try {
    const { userID } = req.body

    const safeUserId = sanitizeObjectId(userID)
    if (!safeUserId) {
      return res.status(400).send({ error: 'Invalid user ID' })
    }

    const appointment = await NewAppointment.findOne({
      userID: { $eq: safeUserId }
    })

    if (!appointment) {
      return res.status(404).send({ error: 'Appointment not found' })
    }

    await NewAppointment.deleteOne({
      _id: { $eq: appointment._id }
    })

    res.status(200).send('Appointment canceled successfully')
  } catch (error) {
    console.error(error)
    res.status(500).send({ error: 'Server error' })
  }
})

/**
 * GET USERS
 */
router.get('/getusers', async (req, res) => {
  try {
    const users = await Users.find({})

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
