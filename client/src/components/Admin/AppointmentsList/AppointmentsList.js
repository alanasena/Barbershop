import React, {useEffect, useState} from 'react'
import './AppointmentsList.css'
import Row from './Row/Row'
import axios from 'axios'
import {getSundays, makeDate} from '../../../time'
import {Link} from 'react-router-dom'
import { getCookie } from '../../../cookies'
import API_URL from '../../../config/api'

const AppointmentsList = () => {
    const [thisSunday, setThisSunday] = useState('this')
    const [lastSunday, setLastSunday] = useState('last')
    const [appointments, setAppointments] = useState([])

    useEffect(()=>{
        console.log('Appointments list rendred')

        let sundays = getSundays()
        setThisSunday(makeDate(sundays.sunday))
        setLastSunday(makeDate(sundays.nextSunday))

        axios.get(`${API_URL}/getappointments`).then((response)=>{
            console.log(response.data)

            let {error} = response.data
            if(error){
                console.log(error)
            }
            else{
                let newAppointments = response.data.filter((obj)=>{
                    if( obj.timeInMS > sundays.sunday && obj.timeInMS < sundays.nextSunday)return true
                    else return false  
                })
                const isBarber = getCookie('barber') === 'true'
                if (isBarber) {
                    const barberEmail = getCookie('barberEmail')
                    const barberName = getCookie('barberName')
                    newAppointments = newAppointments.filter((appointment) => {
                        if (barberEmail && appointment.barberEmail === barberEmail) return true
                        if (barberName && appointment.barberName === barberName) return true
                        return false
                    })
                }
                console.log('newAppointments: ',newAppointments)
                setAppointments(newAppointments)
            }
        })
    },[])


    return (
        <div className='appointments-list'>
            <div>
                <h1>Painel de Controle</h1>
                <div className='admin-profile-links-container'>
                    <Link to='/' className='admin-profile-link'>
                        Inicio 
                    </Link>
                    /
                    <Link to='/profile' className='admin-profile-link'>
                        Perfil 
                    </Link>
                </div>
            </div>
            
            <h3>Os agendamentos estao entre {`${thisSunday} e ${lastSunday}`}</h3>
        
            <table>
                <thead>
                    <tr className='table-header'>
                        <td id='td-white'></td>
                        <th>Domingo</th>
                        <th>Segunda</th>
                        <th>Terca</th>
                        <th>Quarta</th>
                        <th>Quinta</th>
                        <th>Sexta</th>
                    </tr>
                </thead>
                <tbody>
                    <Row appointments={appointments.filter(obj=> obj.time === '10:00')}
                    time='10:00' />
                    <Row appointments={appointments.filter(obj=> obj.time === '10:30')}
                    time='10:30' />
                    <Row appointments={appointments.filter(obj=> obj.time === '11:00')}
                    time='11:00' />
                    <Row appointments={appointments.filter(obj=> obj.time === '11:30')}
                    time='11:30' />
                    <Row appointments={appointments.filter(obj=> obj.time === '12:00')}
                    time='12:00' />
                    <Row appointments={appointments.filter(obj=> obj.time === '12:30')}
                    time='12:30' />
                    <Row appointments={appointments.filter(obj=> obj.time === '13:00')}
                    time='13:00' />
                    <Row appointments={appointments.filter(obj=> obj.time === '13:30')}
                    time='13:30' />
                    <Row appointments={appointments.filter(obj=> obj.time === '14:00')}
                    time='14:00' />
                    <Row appointments={appointments.filter(obj=> obj.time === '14:30')}
                    time='14:30' />
                    <Row appointments={appointments.filter(obj=> obj.time === '15:00')}
                    time='15:00' />
                    <Row appointments={appointments.filter(obj=> obj.time === '15:30')}
                    time='15:30' />
                </tbody>
            </table>   
        </div>
    )
}

export default AppointmentsList

