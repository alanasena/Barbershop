import React, {useState, useEffect} from 'react'
import './UserProfile.css'
import Navbar from '../Home/Navbar/Navbar'
import profileImg  from '../../assets/profile-img.jpg'
import {Link} from 'react-router-dom'
import axios from 'axios'
import {getCookie, setCookie, setCookieInMins, deleteCookie} from '../../cookies'
import API_URL from '../../config/api'


const UserProfile = (props) => {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')

    const [updatedName, setUpdatedName] = useState('')
    const [updatedEmail, setUpdatedEmail] = useState('')
    const [updatedPhone, setUpdatedPhone] = useState('')

    const [time, setTime] = useState('Empty')
    const [date, setDate] = useState('')
    const [day, setDay] = useState('')
    const [appointmentId, setAppointmentId] = useState('')
    const [barberName, setBarberName] = useState('')
    const [barberEmail, setBarberEmail] = useState('')
    const [isCompletedByClient, setIsCompletedByClient] = useState(false)
    const [isRated, setIsRated] = useState(false)
    const [ratingValue, setRatingValue] = useState('5')
    const [ratingComment, setRatingComment] = useState('')
    const [ratingError, setRatingError] = useState('')



    useEffect(() =>{
        getProfile(getCookie('id'))
        console.log('upload user profile')
    },[])



    const getProfile = (userID) =>{
        axios.get(`${API_URL}/profiledata?id=${userID}`).then((response) =>{

            let {error, email, name, phone } = response.data 
            if(error){
                console.log(error)
            }
            else{
                setName(name)
                setEmail(email)
                setPhone(phone)
                setCookie('phone', phone ,2)
                console.log(response.data)
            }
        })

        axios.get(`${API_URL}/userappointment?id=${userID}`).then((response) =>{
            console.log(response.data)

            let {error, id, day, time, date, barberName, barberEmail, isCompletedByClient, rated } = response.data 
            if(error){
                console.log(error)
            }
            else{
                setTime(time)
                setDate(date)
                setDay(day)
                setAppointmentId(id || '')
                setBarberName(barberName || '')
                setBarberEmail(barberEmail || '')
                setIsCompletedByClient(Boolean(isCompletedByClient))
                setIsRated(Boolean(rated))
            }
        })
    }

    const updateProfile = () =>{

        if(updatedName === '' && updatedEmail ==='' && updatedPhone ===''){ 
            alert('all fields are empty')
        }
        else{

            let obj = {}
            obj.name = updatedName
            obj.email = updatedEmail
            obj.phone = updatedPhone
            obj.userID = getCookie('id')
    
            axios.post(`${API_URL}/updateprofile`, obj).then((response) =>{
                let {error} = response.data

                if(error){
                    alert('update profile: '+error)
                }
                else{
                    
                    if(email !=='')
                        setEmail(email)
                    if(phone !==''){
                        setPhone(phone)
                        setCookie('phone', phone ,2)
                    }
                    if(name !==''){
                        setCookie('name', name ,2)
                        setName(name)
                    }
                    alert('data successfully updated!')
                    window.location.reload(false);
                    console.log('server res: ', response.data)
                }
            })
        }
    }


    const changeAppointment = () =>{
        console.log('change appointment')

        if(time === 'Empty'){
            alert('You not have appointment')
        }else{
            setCookieInMins('change', true, 1)
            props.history.push({ pathname: '/appointment' });
        }
    }

    const cancelAppointment = async() => {

        let response = await axios.post(`${API_URL}/cancelappointment`, {id:getCookie('id')})
        console.log(response.data)
        let {error} = response.data
        if(error){
            alert(error)
        }
        else{
            alert('Agendamento cancelado')
            window.location.replace('/profile')
        }
    }

    const resolveAppointmentId = async () => {
        if (appointmentId) return appointmentId
        try {
            const response = await axios.get(`${API_URL}/getappointments`)
            const list = Array.isArray(response.data) ? response.data : []
            const found = list.find((item) => item.userID === getCookie('id'))
            if (found) {
                setAppointmentId(found._id)
                setBarberName(found.barberName || '')
                setBarberEmail(found.barberEmail || '')
                setDay(found.day || day)
                setTime(found.time || time)
                setDate(found.date || date)
                return found._id
            }
        } catch (err) {
            return ''
        }
        return ''
    }

    const confirmServiceCompleted = async () => {
        const id = await resolveAppointmentId()
        if (!id) {
            alert('Agendamento nao encontrado')
            return
        }
        try {
            const response = await axios.post(`${API_URL}/appointment/complete`, { appointmentId: id })
            if (response.data && response.data.error) {
                alert(response.data.error)
            } else {
                setIsCompletedByClient(true)
                setIsRated(false)
            }
        } catch (err) {
            alert('Erro ao confirmar servico')
        }
    }

    const submitRating = async () => {
        const id = await resolveAppointmentId()
        if (!id) {
            setRatingError('Agendamento nao encontrado para avaliar')
            return
        }
        try {
            const payload = {
                appointmentId: id,
                userId: getCookie('id'),
                rating: Number(ratingValue),
                comment: ratingComment
            }
            const response = await axios.post(`${API_URL}/rating`, payload)
            if (response.data && response.data.error) {
                setRatingError(response.data.error)
            } else {
                setIsRated(true)
                setRatingComment('')
                setRatingError('')
                alert('Avaliacao enviada com sucesso!')
            }
        } catch (err) {
            setRatingError('Erro ao enviar avaliacao')
        }
    }

    const deleteAcc = async() =>{
        console.log('id cookie ',getCookie('id'))
        let response = await axios.post(`${API_URL}/deleteacc`, {id:getCookie('id')})
        let {error} = response.data
        if(error){
            alert(error)
        }
        else{

            deleteCookie('id')
            deleteCookie('admin')
            deleteCookie('status')
            deleteCookie('name')

            alert(response.data)
            window.location.replace('/')
        }
    }

    return (
        <div>
            <Navbar/>
            <div className='user-profile-container'>
                <div className='user-profile-left'>
                    <h2>Bem-vindo</h2>
                    <img className='profile-img' src={profileImg} alt=""/>
                    <h2>Bom dia</h2>

                    <ul>
                        <li className='profile-make-appointment'>
                            <i className="fa fa-plus" aria-hidden="true"></i>
                            <Link className='link-make-appo' to='/appointment'>
                                Agendar Horario
                            </Link>
                        </li>
                        <li>
                            <i className="fa fa-user" aria-hidden="true"></i>
                            <a href='#user-profile-info'>Informacoes Pessoais</a>
                        </li>
                        <li>
                            <i className="fa fa-pencil mr-right-i" aria-hidden="true"></i>
                            <a href='#user-profile-updateinfo'>Atualizar Informacoes</a>
                        </li>
                        <li>
                            <i className="fa fa-trash" aria-hidden="true"></i>
                            <a href='#user-profile-delete-acc'>Excluir Conta</a>
                        </li>
                    </ul>

                </div>

                <div className='user-profile-right'>
           
                    <div id='user-profile-info' className='user-profile-box'>
                        <div>
                            <h1>Informacoes do Perfil</h1>
                            <div className='profile-underline'></div>
                        </div>
                        
                        <div className='user-profile-info-div'>
                            <div>
                                <p>Nome:</p>
                                <span>{name}</span>
                            </div>
                            <div>
                                <p>Email:</p>
                                <span>{email}</span>
                            </div>
                            <div>
                                <p>Telefone:</p>
                                <span>{phone}</span>
                            </div>
                        </div>
                        <div className='user-profile-appointment'>
                            <div className='user-profile-appointment-flex'>
                                <div className='user-profile-appointment-btns'>
                                    <p>Voce tem agendamento para:</p>
                                    <button onClick={changeAppointment} id='profile-btn-change'>Alterar</button>
                                    <button onClick={cancelAppointment} className='profile-btn-color-red'>Cancelar</button>
                                    {time !== 'Empty' && !isCompletedByClient ? (
                                        <button
                                            type='button'
                                            onClick={confirmServiceCompleted}
                                            className='profile-btn-color-green profile-btn-full'
                                        >
                                            Confirmar
                                        </button>
                                    ) : null}
                                    {time !== 'Empty' && isCompletedByClient && !isRated ? (
                                        <div className='profile-rating-box'>
                                            {ratingError ? <p className='profile-error'>{ratingError}</p> : null}
                                            <p>Avaliar barbeiro: {barberName || barberEmail || 'Barbeiro'}</p>
                                            <select value={ratingValue} onChange={(e) => setRatingValue(e.target.value)}>
                                                <option value='1'>1</option>
                                                <option value='2'>2</option>
                                                <option value='3'>3</option>
                                                <option value='4'>4</option>
                                                <option value='5'>5</option>
                                            </select>
                                            <textarea
                                                rows='2'
                                                value={ratingComment}
                                                onChange={(e) => setRatingComment(e.target.value)}
                                                placeholder='Comentario (opcional)'
                                            />
                                            <button type='button' onClick={submitRating} className='profile-btn-color-green'>
                                                Enviar avaliacao
                                            </button>
                                        </div>
                                    ) : null}
                                    {time !== 'Empty' && isCompletedByClient && isRated ? (
                                        <p className='profile-rating-done'>Avaliacao enviada.</p>
                                    ) : null}
                                </div>
                                <div className='user-profile-appointment-time'>
                                    <p>{day}</p>
                                    <p>{time}</p>
                                    <p>{date}</p>
                                </div>
                            </div>     
                        </div>
                    </div>


                    <div id='user-profile-updateinfo' className='user-profile-box'>

                        <div className='profile-mr-bottom'>
                            <h1>Atualizar Informacoes</h1>
                            <div className='profile-underline'></div>
                        </div>
                        

                        <p>Nome:</p>
                        <input type="text" placeholder='name...'
                        onChange={(e) => setUpdatedName(e.target.value)}
                        />
                        <p>Email:</p>
                        <input type="text" placeholder='email...'
                        onChange={(e) => setUpdatedEmail(e.target.value)}

                        />
                        <p>Telefone:</p>
                        <input type="text" placeholder='phone...'
                        onChange={(e) => setUpdatedPhone(e.target.value)}
                        />
                        <br/>
                        <button onClick={updateProfile} className='profile-update-btn'>atualizar</button>

                    </div>

                    <div id='user-profile-delete-acc' className='user-profile-box'>
                        <div className='profile-mr-bottom'>
                            <h1>Excluir Conta</h1>
                            <div className='profile-underline'></div>
                        </div>
                        <p>
                            Excluir sua conta removera seus dados e agendamentos.
                            Esta acao nao pode ser desfeita.
                        </p>
                        <button onClick={deleteAcc}  id='profile-delete-btn'>Excluir</button>

                    </div>
                </div>
            </div>      
        </div>
    )
}

export default UserProfile