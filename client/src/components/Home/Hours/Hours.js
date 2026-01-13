import React ,{useState, useEffect} from 'react'
import './Hours.css'
import { Link } from 'react-router-dom'

import {time} from '../../../time'

const Hours = () => {
    const [day, setDay] = useState(0)

    useEffect(() => {

        let {day} = time()
        setDay(day)
    
    }, [])

    return (
        <div className='hours' id='hours-navigate'>

            <div className='hours-container'>
                <h1>Horário de Funcionamento</h1>
                <div className='hours-flex'>
                    <div className={day === 0 ? `active-day hours-box `:  `not-active-day hours-box ` }>
                        <h2>Dom</h2>
                        <p>10:00 às 15:00</p>
                    </div>
                    <div className={day === 1 ? `active-day hours-box `:  `not-active-day hours-box ` }>
                        <h2>Seg</h2>
                        <p>10:00 às 15:30</p>
                    </div>
                    <div className={day === 2 ? `active-day hours-box `:  `not-active-day hours-box ` }>
                        <h2>Ter</h2>
                        <p>10:00 às 14:30</p>
                    </div>
                    <div className={day === 3 ? `active-day hours-box `:  `not-active-day hours-box ` }>
                        <h2>Qua</h2>
                        <p>10:00 às 14:30</p>
                    </div>
                    <div className={day === 4 ? `active-day hours-box `:  `not-active-day hours-box ` }>
                        <h2>Qui</h2>
                        <p>10:00 às 15:00</p>
                    </div>
                    <div className={day === 5 ? `active-day hours-box `:  `not-active-day hours-box ` }>
                        <h2>Sex</h2>
                        <p>10:00 às 15:30</p>
                    </div>
                    <div className={day === 6 ? `active-day hours-box `:  `not-active-day hours-box ` }>
                        <h2>Fim de Semana</h2>
                        <p className='text-center'>Tenham um ótimo fim de semana!</p>
                    </div>
                </div>
                <div className='hours-btn-div'>
                    <Link to='/appointment'>
                        <button className='hours-btn'>Agendar Agora</button>
                    </Link>
                </div>
            </div>     
        </div>
    )
}

export default Hours
