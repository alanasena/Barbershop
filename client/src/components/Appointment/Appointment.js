import React, {useState, useEffect} from 'react'
import './Appointment.css'
import Navbar from '../Home/Navbar/Navbar'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';
import {getCookie, checkCookie} from '../../cookies'
import {fullTime} from '../../time'
import axios from 'axios'
import ErrorMsg from '../ErrorMsg/ErrorMsg'
import API_URL from '../../config/api'

const Appointment = (props) => {
    const [startDate, setStartDate] = useState(new Date())
    const [userTime, setUserTime] = useState('00:00')
    const [userDate, setUserDate] = useState('')
    const [phone, setPhone] = useState('phone...')
    const [dayOfWeek, setDayOfWeek] = useState('')
    const [time, setTime] = useState(0)
    const [error, setError] = useState('')
    const [barbers, setBarbers] = useState([])
    const [selectedBarberEmail, setSelectedBarberEmail] = useState('')
    const [selectedBarberName, setSelectedBarberName] = useState('')

    const options = [
        { value:'10:00',  label:'10:00' },
        { value:'10:30',  label:'10:30' },
        { value:'11:00',  label:'11:00' },
        { value:'11:30',  label:'11:30' },
        { value:'12:00',  label:'12:00' },
        { value:'12:30',  label:'12:30' },
        { value:'13:00',  label:'13:00' },
        { value:'13:30',  label:'13:30' },
        { value:'14:00',  label:'14:00' },
        { value:'14:30',  label:'14:30' },
        { value:'15:00',  label:'15:00' },
        { value:'15:30',  label:'15:30' }];

    const [updatedOptions, setUpdatedOptions] = useState(options)

    useEffect(() =>{
        let p = getCookie('phone')
        if(p !== '')
            setPhone(p)
        let makeAppointment = document.querySelector('#make-btn')
        let changeAppointment = document.querySelector('#change-btn')
        let phoneInput = document.querySelector('#appo-phone')

        if(getCookie('change') !== '' ){
            console.log('have cookie change')
            makeAppointment.style.display = 'none'
            changeAppointment.style.display = 'block'
            phoneInput.style.display = 'none'
        }
        else{
            console.log('notttt have cookie change')
            makeAppointment.style.display = 'block'
            changeAppointment.style.display = 'none'
            phoneInput.style.display = 'block'
        }
        const fetchBarbers = async () => {
            try {
                const response = await axios.get(`${API_URL}/barbers`)
                const payload = response.data && response.data.value ? response.data.value : response.data
                const list = Array.isArray(payload) ? payload : []
                setBarbers(list)
                if (list.length) {
                    setSelectedBarberEmail(list[0].email)
                    setSelectedBarberName(list[0].name)
                }
            } catch (err) {
                console.error('Erro ao buscar barbeiros:', err)
                setBarbers([])
            }
        }

        fetchBarbers()
    },[])

    if(phone.length >= 6 && userTime !== '' && userDate!== '')  {
        let x = document.querySelector('.appointment-data')
        x.classList.add('appointment-data-show')
    }

    const changeAppointment = async() =>{

        let appointmentData = {}
        const obj = fullTime(dayOfWeek)
        appointmentData.userID = getCookie('id')
        appointmentData.key = userDate+userTime
        appointmentData.name = getCookie('name')
        appointmentData.date = userDate
        appointmentData.time = userTime
        appointmentData.day = obj.day
        appointmentData.timeInMS = time
        appointmentData.barberName = selectedBarberName
        appointmentData.barberEmail = selectedBarberEmail

        let response = await axios.post(`${API_URL}/changeappointment`, appointmentData)
        let { error } = response.data
        if(error){
            console.log(error)
            setError(error)
            setTimeout( ()=>{
                setError('')
            },6000)
        }else{
            console.log(response.data)
            alert('change')
        }
       
    }

    const makeAppointment = async() =>{
        let appointmentData = {}
        const obj = fullTime(dayOfWeek)
        appointmentData.userID = getCookie('id')
        appointmentData.key = userDate+userTime
        appointmentData.name = getCookie('name')
        appointmentData.date = userDate
        appointmentData.time = userTime
        appointmentData.phone = phone
        appointmentData.day = obj.day
        appointmentData.timeInMS = time
        appointmentData.barberName = selectedBarberName
        appointmentData.barberEmail = selectedBarberEmail
       
        let response = await axios.post(`${API_URL}/appointment`, appointmentData)
        let { error } = response.data
        if(error){
            setError(error)
            setTimeout( ()=>{
                setError('')
            },6000)
        }else{
            alert(response.data)
            props.history.push({ pathname: '/profile' });
        }
    }
 
    const handleTimeChange = selectedOption => {
        console.log('selectedOption: ',selectedOption)
        setUserTime( selectedOption.value );
        console.log(`time option selected:`, selectedOption.value);


        // const option = options.filter((hour) => {

        //     return hour.value !== selectedOption.value
        // })
        // setUpdatedOptions(option)
      };

    const handleChange = date => {
        console.log(`date option selected:`, date);
  
        let tmp = `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`
        setTime(new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime())
        setUserDate(tmp)
        setStartDate(date)
        setDayOfWeek(date.getDay())
      };

    const handleBarberChange = (event) => {
        const value = event.target.value
        const barber = barbers.find((item) => item.email === value)
        setSelectedBarberEmail(value)
        setSelectedBarberName(barber ? barber.name : '')
    }
    
    return (
        <div>
            <Navbar/>
            <div className='appointment-container'>
                <div className='appointment-form'>
                    <h1>Agendar Horario</h1>
                    <div className='appointment-inner-container'>
                        {error !== '' ?  <ErrorMsg info={error}/>
                        
                        : ''}
                        <p>Selecione a data:<span className='red-astrix'>*</span></p>
                        <DatePicker
                            selected={startDate}
                            onChange={handleChange}
                            withPortal
                            className='date-picker'
                            dateFormat='dd/MM/yyyy'
                            minDate={new Date()}
                        />
                    </div>
                    <div className='appointment-inner-container'>
                        <p>Selecione o horario:<span className='red-astrix'>*</span></p>
                        <Select
                            value={updatedOptions.filter((option) => {
                                return option.value === userTime
                              })}       
                            onChange={handleTimeChange}
                            options={options}
                            className='time-picker' 
                        />
                    </div>
                    <div className='appointment-inner-container'>
                        <p>Selecione o barbeiro:<span className='red-astrix'>*</span></p>
                        <select
                            className='time-picker'
                            value={selectedBarberEmail}
                            onChange={handleBarberChange}
                            disabled={!barbers.length}
                        >
                            {barbers.length === 0 ? (
                                <option value=''>Sem barbeiros cadastrados</option>
                            ) : (
                                barbers.map((barber) => (
                                    <option key={barber.id} value={barber.email}>
                                        {barber.name} ({barber.email})
                                    </option>
                                ))
                            )}
                        </select>
                    </div>

                    <div id='appo-phone' className='appointment-inner-container'>
                        <p>Seu telefone: <span className='red-astrix'>*</span></p>
                        <input type="tel" className='phone-input' placeholder='phone...' 
                        value={phone ? phone : 'phone...'}
                        onChange={(e)=>setPhone(e.target.value)}/>
                    </div>
                    <div id='make-btn' className='appointment-inner-container'>
                        <button onClick={makeAppointment} className='appointment-btn'>Agendar</button>
                    </div>
                    <div id='change-btn' className='appointment-inner-container'>
                        <button onClick={changeAppointment} className='appointment-btn'>Atualizar</button>
                    </div>
                    <div className='appointment-data'>
                        <h3>Agendamento para:</h3>
                        <p>Data:  <span>{userDate}</span></p>
                        <p>Horario: <span>{userTime}</span></p>
                        <p>Barbeiro: <span>{selectedBarberName || 'Nao definido'}</span></p>
                        <p>Telefone: <span>{phone}</span></p>
                    </div>
                </div>
            </div> 
        </div>
    )
}

export default Appointment
