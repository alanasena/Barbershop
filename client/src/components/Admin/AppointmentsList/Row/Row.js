import React from 'react'
import './Row.css'
import TableData from '../TableData/TableData'

const Row = ({appointments, time}) => {
    console.log('Row rendred')
    const matchesDay = (values) => (appointment) => values.includes(appointment.day)
 
    return (
  
        <tr>
            <th className='left-th'>{time}</th>
            <TableData appointments={appointments.filter(matchesDay(['Sun', 'Dom']))} />
            <TableData appointments={appointments.filter(matchesDay(['Mon', 'Seg']))} />
            <TableData appointments={appointments.filter(matchesDay(['Tue', 'Ter']))} />
            <TableData appointments={appointments.filter(matchesDay(['Wed', 'Qua']))} />
            <TableData appointments={appointments.filter(matchesDay(['Thu', 'Qui']))} />
            <TableData appointments={appointments.filter(matchesDay(['Fri', 'Sex']))} />
        </tr>
    )
}

export default Row





