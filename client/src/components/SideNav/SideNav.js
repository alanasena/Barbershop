import React, {useState, useEffect} from 'react'
import './SideNav.css'
import { Link } from 'react-router-dom';
import {checkCookie, getCookie, deleteCookie} from '../../cookies'
import {time, fullTime} from '../../time'

const SideNav = () => {

    const [day, setDay] = useState('sun')
    const [workTime, setWorkTime] = useState('')
    const [name, setName] = useState('user')


    useEffect(()=>{
        let loginAndReg = document.querySelector('.side-log-reg')
        let helloUser = document.querySelector('.side-logout')
        let controlPanel = document.querySelector('.side-cp')
        let barberPanel = document.querySelector('.side-bp')
        let userProfile = document.querySelector('.side-up')

        let {day} = time()
        console.log(day)
        dayOfWeek(day)
        const userName = getCookie('name')
        if(userName)
            setName(userName)

        const adminCookie = getCookie('admin');
        const barberCookie = getCookie('barber');
        const isAdminUser = adminCookie === 'true' || adminCookie === true || adminCookie === 'True';
        const isBarberUser = barberCookie === 'true' || barberCookie === true || barberCookie === 'True';
        
        if(controlPanel && barberPanel && userProfile){
            if(isAdminUser){
                controlPanel.style.display = 'block'
                barberPanel.style.display = 'none'
                userProfile.style.display = 'block' // Admin também pode ver o perfil
            }
            else if(isBarberUser){
                controlPanel.style.display = 'block' // Barbeiro também vê Painel de Controle
                barberPanel.style.display = 'block' // Barbeiro também vê Meus Agendamentos
                userProfile.style.display = 'block' // Barbeiro também pode ver o perfil
            }
            else{
                controlPanel.style.display = 'none'
                barberPanel.style.display = 'none'
                userProfile.style.display = 'block'
            }
        }
        
        if(checkCookie('status')){
            console.log('user logged')
            if(helloUser) helloUser.style.display = 'flex'
            if(loginAndReg) loginAndReg.style.display = 'none'
        }else{
            console.log('user not logged')
            if(helloUser) helloUser.style.display = 'none'
            if(loginAndReg) loginAndReg.style.display = 'flex'
            if(userProfile) userProfile.style.display = 'none'
            if(controlPanel) controlPanel.style.display = 'none'
            if(barberPanel) barberPanel.style.display = 'none'
        }
    },[])

    const logout = () =>{
        console.log('user logout')
        deleteCookie('name')
        deleteCookie('id')
        deleteCookie('status')
        deleteCookie('admin')
        deleteCookie('barber')
        deleteCookie('barberId')
        deleteCookie('token')
        window.location.replace('/')
    }

    const dayOfWeek = (num) =>{
        let obj = fullTime(num)
        setDay(obj.day)
        setWorkTime(obj.workTime)
    }

    return (
        <div className='side-navbar'>
            <h1 className=''>Olá, {name}!</h1>
            <div className='side-navbar-info'>
                <div className='side-nav-info'>
                    <i className="fa fa-phone" aria-hidden="true"></i>
                    <label> (972) 546643231 </label>
                </div>
                <div className='side-nav-info'>
                    <i className="fa fa-calendar" aria-hidden="true"></i>
                    <label> {day} - {workTime} </label>
                </div>
            </div>
            <ul className='side-navbar-ul'>
                    <li className=''>
                        <i className="fa fa-home" aria-hidden="true"></i>
                        <a href="./#hero-navigate" className='links'>Início</a>
                    </li>
                    <li className=''>
                        <i className="fa fa-camera" aria-hidden="true"></i>
                        <a href="./#what-we-do" className='links'>Serviços</a> 
                    </li>
                    <li className=''>
                        <i className="fa fa-money" aria-hidden="true"></i>
                        <a href="./#hours-navigate" className='links'>Horários</a>
                    </li>
                    <li id='control-panel' className='nav-items'>
                        <Link className='links side-cp' to='/admin'>
                            Painel de Controle
                        </Link>
                    </li>
                    <li id='barber-appointments' className='nav-items'>
                        <Link className='links side-bp' to='/barber/appointments'>
                            Meus Agendamentos
                        </Link>
                    </li>
                    <li id='user-profile' className='nav-items'>
                        <Link className='links side-up' to='/profile'>
                            Perfil do Usuário
                        </Link>
                    </li>
                </ul>
                <div className='side-logout'>       
                    <button className='side-btn' onClick={logout}>Sair</button>
                </div>
                <div className='side-log-reg'>
                    <Link className='side-log-reg-link' to='/login'>
                        Entrar
                    </Link>
                
                    <span className='side-separator'></span>

                    <Link className='side-log-reg-link' to='/register'>
                        Registrar
                    </Link>
                </div>
        </div>
    )
}

export default SideNav
