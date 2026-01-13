import React, {useState, useEffect} from 'react'
import './UserProfile.css'
import Navbar from '../Home/Navbar/Navbar'
import profileImg  from '../../assets/profile-img.jpg'
import {Link} from 'react-router-dom'
import axiosInstance from '../../utils/axiosConfig'
import {getCookie, setCookie, setCookieInMins, deleteCookie} from '../../cookies'


const UserProfile = (props) => {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')

    const [updatedName, setUpdatedName] = useState('')
    const [updatedEmail, setUpdatedEmail] = useState('')
    const [updatedPhone, setUpdatedPhone] = useState('')

    const [time, setTime] = useState('Vazio')
    const [date, setDate] = useState('')
    const [day, setDay] = useState('')
    const [appointment, setAppointment] = useState(null)
    const [canRate, setCanRate] = useState(false)



    useEffect(() =>{
        getProfile(getCookie('id'))
        console.log('upload user profile')
    },[])



    const getProfile = async (userID) =>{
        try {
            const profileResponse = await axiosInstance.get('/profiledata')
            let {error, email, name, phone } = profileResponse.data 
            if(error){
                console.log(error)
            }
            else{
                setName(name)
                setEmail(email)
                setPhone(phone || '')
                setCookie('phone', phone || '' ,2)
                console.log(profileResponse.data)
            }

            const appointmentResponse = await axiosInstance.get('/userappointment')
            console.log(appointmentResponse.data)

            let {error: appError, day, time, date, _id, barberId, isRated, timeInMS } = appointmentResponse.data 
            if(appError){
                console.log(appError)
            }
            else{
                setTime(time)
                setDate(date)
                setDay(day)
                setAppointment({ _id, barberId, isRated, timeInMS })
                
                // Verificar se pode avaliar (agendamento já passou e não foi avaliado)
                if (timeInMS && barberId && !isRated) {
                    const appointmentDate = new Date(timeInMS)
                    const now = new Date()
                    if (appointmentDate <= now) {
                        setCanRate(true)
                    }
                }
            }
        } catch (err) {
            console.error('Erro ao buscar dados do perfil:', err)
        }
    }

    const updateProfile = async () =>{

        if(updatedName === '' && updatedEmail ==='' && updatedPhone ===''){ 
            alert('Todos os campos estão vazios')
        }
        else{

            let obj = {}
            if(updatedName) obj.name = updatedName
            if(updatedEmail) obj.email = updatedEmail
            if(updatedPhone) obj.phone = updatedPhone
    
            try {
                const response = await axiosInstance.post('/updateprofile', obj)
                let {error, message} = response.data

                if(error){
                    alert('Erro ao atualizar perfil: '+error)
                }
                else{
                    if(updatedEmail){
                        setEmail(updatedEmail)
                    }
                    if(updatedPhone){
                        setPhone(updatedPhone)
                        setCookie('phone', updatedPhone ,2)
                    }
                    if(updatedName){
                        setCookie('name', updatedName ,2)
                        setName(updatedName)
                    }
                    alert(message || 'Dados atualizados com sucesso!')
                    setUpdatedName('')
                    setUpdatedEmail('')
                    setUpdatedPhone('')
                    console.log('server res: ', response.data)
                }
            } catch (err) {
                const errorMsg = err.response?.data?.error || 'Erro ao atualizar perfil'
                alert('Erro ao atualizar perfil: ' + errorMsg)
            }
        }
    }


    const changeAppointment = () =>{
        console.log('change appointment')

        if(time === 'Vazio'){
            alert('Você não tem agendamento')
        }else{
            setCookieInMins('change', true, 1)
            props.history.push({ pathname: '/appointment' });
        }
    }

    const cancelAppointment = async() => {
        try {
            let response = await axiosInstance.post('/cancelappointment')
            console.log(response.data)
            let {error, message} = response.data
            if(error){
                alert(error)
            }
            else{
                alert(message || 'Agendamento cancelado com sucesso')
                setTime('Vazio')
                setDate('')
                setDay('')
            }
        } catch (err) {
            const errorMsg = err.response?.data?.error || 'Erro ao cancelar agendamento'
            alert(errorMsg)
        }
    }

    const deleteAcc = async() =>{
        if(!window.confirm('Tem certeza que deseja deletar sua conta? Esta ação não pode ser desfeita.')) {
            return
        }
        
        try {
            let response = await axiosInstance.post('/deleteacc')
            let {error, message} = response.data
            if(error){
                alert(error)
            }
            else{
                deleteCookie('id')
                deleteCookie('admin')
                deleteCookie('status')
                deleteCookie('name')
                deleteCookie('token')
                deleteCookie('phone')

                alert(message || 'Conta deletada com sucesso')
                window.location.replace('/')
            }
        } catch (err) {
            const errorMsg = err.response?.data?.error || 'Erro ao deletar conta'
            alert(errorMsg)
        }
    }

    return (
        <div>
            <Navbar/>
            <div className='user-profile-container'>
                <div className='user-profile-left'>
                    <h2>Bem-vindo</h2>
                    <img className='profile-img' src={profileImg} alt=""/>
                    <h2>Bom Dia</h2>

                    <ul>
                        <li className='profile-make-appointment'>
                            <i className="fa fa-plus" aria-hidden="true"></i>
                            <Link className='link-make-appo' to='/appointment'>
                                FAZER AGENDAMENTO
                            </Link>
                        </li>
                        <li>
                            <i className="fa fa-user" aria-hidden="true"></i>
                            <a href='#user-profile-info'>INFORMAÇÕES PESSOAIS</a>
                        </li>
                        <li>
                            <i className="fa fa-pencil mr-right-i" aria-hidden="true"></i>
                            <a href='#user-profile-updateinfo'>ATUALIZAR INFO</a>
                        </li>
                        <li>
                            <i className="fa fa-trash" aria-hidden="true"></i>
                            <a href='#user-profile-delete-acc'>EXCLUIR CONTA</a>
                        </li>
                    </ul>

                </div>

                <div className='user-profile-right'>
           
                    <div id='user-profile-info' className='user-profile-box'>
                        <div>
                            <h1>Informações do Perfil</h1>
                            <div className='profile-underline'></div>
                        </div>
                        
                        <div className='user-profile-info-div'>
                            <div>
                                <p>Nome:</p>
                                <span>{name}</span>
                            </div>
                            <div>
                                <p>E-mail:</p>
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
                                    <p>Você tem agendamento para:</p>
                                    <div>
                                        <button onClick={changeAppointment} id='profile-btn-change'>Alterar</button>
                                        <button onClick={cancelAppointment} className='profile-btn-color-red'>Cancelar</button>
                                    </div>
                                    {canRate && appointment && appointment.barberId && (
                                        <div style={{marginTop: '15px'}}>
                                            <Link to='/rating' className='rate-barber-btn'>
                                                ⭐ Avaliar Barbeiro
                                            </Link>
                                        </div>
                                    )}
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
                            <h1>Atualizar Informações</h1>
                            <div className='profile-underline'></div>
                        </div>
                        

                        <p>Nome:</p>
                        <input type="text" placeholder='nome...'
                        onChange={(e) => setUpdatedName(e.target.value)}
                        />
                        <p>E-mail:</p>
                        <input type="text" placeholder='e-mail...'
                        onChange={(e) => setUpdatedEmail(e.target.value)}

                        />
                        <p>Telefone:</p>
                        <input type="text" placeholder='telefone...'
                        onChange={(e) => setUpdatedPhone(e.target.value)}
                        />
                        <br/>
                        <button onClick={updateProfile} className='profile-update-btn'>Atualizar</button>

                    </div>

                    <div id='user-profile-delete-acc' className='user-profile-box'>
                        <div className='profile-mr-bottom'>
                            <h1>Excluir Conta</h1>
                            <div className='profile-underline'></div>
                        </div>
                        <p>
                            Ao excluir sua conta, todos os seus dados e agendamentos serão permanentemente removidos.
                            Esta ação não pode ser desfeita. Tem certeza que deseja continuar?
                        </p>
                        <button onClick={deleteAcc}  id='profile-delete-btn'>Excluir</button>

                    </div>
                </div>
            </div>      
        </div>
    )
}

export default UserProfile