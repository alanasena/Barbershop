import React, {useState, useEffect} from 'react'
import './Appointment.css'
import Navbar from '../Home/Navbar/Navbar'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';
import {getCookie, checkCookie} from '../../cookies'
import {fullTime} from '../../time'
import axiosInstance from '../../utils/axiosConfig'
import ErrorMsg from '../ErrorMsg/ErrorMsg'

const Appointment = (props) => {
    const [startDate, setStartDate] = useState(new Date())
    const [userTime, setUserTime] = useState('00:00')
    const [userDate, setUserDate] = useState('')
    const [phone, setPhone] = useState('telefone...')
    const [dayOfWeek, setDayOfWeek] = useState('')
    const [time, setTime] = useState(0)
    const [error, setError] = useState('')
    const [barbers, setBarbers] = useState([])
    const [selectedBarber, setSelectedBarber] = useState(null)

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
    },[])

    useEffect(() => {
        const fetchBarbers = async () => {
            try {
                console.log('Buscando barbeiros...');
                const response = await axiosInstance.get('/api/barbers');
                console.log('Resposta da API barbeiros:', response.data);
                console.log('Status:', response.status);
                
                if (response.data && Array.isArray(response.data) && response.data.length > 0) {
                    // Ordenar por avaliação (maior primeiro) e depois por nome
                    const sortedBarbers = response.data.sort((a, b) => {
                        if (b.averageRating !== a.averageRating) {
                            return b.averageRating - a.averageRating;
                        }
                        return a.name.localeCompare(b.name);
                    });
                    setBarbers(sortedBarbers);
                    console.log('✅ Barbeiros carregados:', sortedBarbers.length);
                    sortedBarbers.forEach((b, i) => console.log(`   ${i+1}. ${b.name}`));
                } else {
                    console.warn('⚠️ Nenhum barbeiro encontrado ou resposta inválida:', response.data);
                    setBarbers([]);
                }
            } catch (error) {
                console.error('❌ Erro ao buscar barbeiros:', error);
                console.error('Status:', error.response?.status);
                console.error('Mensagem:', error.response?.data || error.message);
                console.error('URL completa:', error.config?.url);
                setError('Erro ao carregar lista de barbeiros. Verifique o console para mais detalhes.');
                setBarbers([]);
            }
        };
        fetchBarbers();
    }, [])

    if(phone.length >= 6 && userTime !== '' && userDate!== '')  {
        let x = document.querySelector('.appointment-data')
        x.classList.add('appointment-data-show')
    }

    const changeAppointment = async() =>{

        let appointmentData = {}
        const obj = fullTime(dayOfWeek)
        appointmentData.key = userDate+userTime
        appointmentData.date = userDate
        appointmentData.time = userTime
        appointmentData.day = obj.day
        appointmentData.timeInMS = time

        try {
            let response = await axiosInstance.post('/changeappointment', appointmentData)
            let { error, message } = response.data
            if(error){
                console.log(error)
                setError(error)
                setTimeout( ()=>{
                    setError('')
                },6000)
            }else{
                console.log(message)
                alert(message || 'Agendamento alterado com sucesso!')
                props.history.push({ pathname: '/profile' });
            }
        } catch (err) {
            const errorMsg = err.response?.data?.error || 'Erro ao alterar agendamento'
            setError(errorMsg)
            setTimeout( ()=>{
                setError('')
            },6000)
        }
       
    }

    const makeAppointment = async() =>{
        if (!selectedBarber) {
            setError('Por favor, selecione um barbeiro')
            setTimeout( ()=>{
                setError('')
            },6000)
            return
        }

        let appointmentData = {}
        const obj = fullTime(dayOfWeek)
        appointmentData.key = userDate+userTime
        appointmentData.name = getCookie('name')
        appointmentData.date = userDate
        appointmentData.time = userTime
        appointmentData.phone = phone
        appointmentData.day = obj.day
        appointmentData.timeInMS = time
        appointmentData.barberId = selectedBarber.value
       
        try {
            let response = await axiosInstance.post('/appointment', appointmentData)
            let { error, message } = response.data
            if(error){
                setError(error)
                setTimeout( ()=>{
                    setError('')
                },6000)
            }else{
                alert(message || 'Agendamento realizado com sucesso!')
                props.history.push({ pathname: '/profile' });
            }
        } catch (err) {
            const errorMsg = err.response?.data?.error || 'Erro ao criar agendamento'
            setError(errorMsg)
            setTimeout( ()=>{
                setError('')
            },6000)
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
    
    return (
        <div>
            <Navbar/>
            <div className='appointment-container'>
                <div className='appointment-form'>
                    <h1>Fazer Agendamento</h1>
                    <div className='appointment-inner-container'>
                        {error !== '' ?  <ErrorMsg info={error}/>
                        
                        : ''}
                        <p>Escolha a data:<span className='red-astrix'>*</span></p>
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
                        <p>Escolha o horário:<span className='red-astrix'>*</span></p>
                        <Select
                            value={updatedOptions.filter((option) => {
                                return option.value === userTime
                              })}       
                            onChange={handleTimeChange}
                            options={options}
                            className='time-picker' 
                        />
                    </div>

                    <div id='appo-phone' className='appointment-inner-container'>
                        <p>Vamos entrar em contato: <span className='red-astrix'>*</span></p>
                        <input type="tel" className='phone-input' placeholder='telefone...' 
                        value={phone ? phone : 'telefone...'}
                        onChange={(e)=>setPhone(e.target.value)}/>
                    </div>
                    <div id='appo-barber' className='appointment-inner-container' style={{display: getCookie('change') !== '' ? 'none' : 'block'}}>
                        <p>Selecione o barbeiro:<span className='red-astrix'>*</span></p>
                        {barbers.length > 0 ? (
                            <Select
                                value={selectedBarber}
                                onChange={(option) => {
                                    console.log('Barbeiro selecionado:', option);
                                    setSelectedBarber(option);
                                }}
                                options={barbers.map(barber => ({
                                    value: barber._id,
                                    label: `${barber.name}${barber.averageRating > 0 ? ` ⭐ ${barber.averageRating.toFixed(1)}` : ''}`
                                }))}
                                className='barber-picker'
                                placeholder="Selecione um barbeiro"
                                isSearchable
                                noOptionsMessage={() => "Nenhum barbeiro disponível"}
                            />
                        ) : (
                            <div style={{padding: '10px', background: '#fff3cd', borderRadius: '5px', color: '#856404'}}>
                                Carregando barbeiros...
                            </div>
                        )}
                        {barbers.length === 0 && (
                            <p style={{fontSize: '12px', color: '#999', marginTop: '5px'}}>
                                Se não aparecer nenhum barbeiro, verifique se há barbeiros cadastrados no sistema.
                            </p>
                        )}
                    </div>
                    <div id='make-btn' className='appointment-inner-container'>
                        <button onClick={makeAppointment} className='appointment-btn'>Enviar</button>
                    </div>
                    <div id='change-btn' className='appointment-inner-container'>
                        <button onClick={changeAppointment} className='appointment-btn'>Atualizar</button>
                    </div>
                    <div className='appointment-data'>
                        <h3>Agendamento será feito para:</h3>
                        <p>Data:  <span>{userDate}</span></p>
                        <p>Hora: <span>{userTime}</span></p>
                        <p>Telefone: <span>{phone}</span></p>
                        {selectedBarber && <p>Barbeiro: <span>{selectedBarber.label}</span></p>}
                    </div>
                </div>
            </div> 
        </div>
    )
}

export default Appointment
