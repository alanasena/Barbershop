import React, {useState, useEffect} from 'react'
import {setCookie} from '../../cookies'
import './Login.css'
import logo from '../../assets/logo.png'
import { Link } from 'react-router-dom'
import axios from 'axios'
import ErrorMsg from '../ErrorMsg/ErrorMsg'
import loadingIcon from '../../assets/loading_icon.gif'
import Navbar from '../Home/Navbar/Navbar'
import API_URL from '../../config/api'


const Login = (props) => {
    const [email, setEmail] = useState('eli@gmail.com')
    const [pass, setPass] = useState('123')
    const [error, setError] = useState('')

    useEffect(()=>{
        console.log('Login Rendered')

        
    },[])

    const handleLogin = async () => {
        let loading = document.querySelector('.login-loading')
        loading.style.display = 'block'
        
        let userData = {}
        userData.email = email
        userData.pass = pass

        let response = await axios.post(`${API_URL}/login`, userData)
        let {id, status, error, name, admin, phone} = response.data
        if(error){
            loading.style.display = 'none'
            console.log(error)
            setError(error)
            setTimeout( ()=>{
                setError('')
            },6000)
        }else{
            
            loading.style.display = 'none'
            setCookie('id', id ,2)
            setCookie('status', status ,2)
            setCookie('name', name ,2)
            setCookie('admin', admin ,2)
            const isBarber = email.toLowerCase().includes('@barbearia.com')
            setCookie('barber', isBarber ? 'true' : 'false', 2)
            setCookie('email', email ,2)
            setCookie('phone', phone ,2)

            if(admin || isBarber)
                props.history.push({ pathname: '/admin' });
            else
                props.history.push({ pathname: '/appointment' });
            console.log('login succeed')

            if (isBarber) {
                try {
                    const response = await axios.get(`${API_URL}/barbers`)
                    const payload = response.data && response.data.value ? response.data.value : response.data
                    const list = Array.isArray(payload) ? payload : []
                    const barber = list.find((item) => item.email === email)
                    if (barber) {
                        setCookie('barberName', barber.name, 2)
                        setCookie('barberEmail', barber.email, 2)
                    } else {
                        setCookie('barberName', name, 2)
                        setCookie('barberEmail', email, 2)
                    }
                } catch (err) {
                    console.error('Erro ao buscar barbeiros:', err)
                    setCookie('barberName', name, 2)
                    setCookie('barberEmail', email, 2)
                }
            }
        }
    }

    const loginByPress = (e) =>{
        if(e.key === 'Enter')
            handleLogin()
      }

    return (
        <div className='register'>
            <Navbar/>
            <div className='login-container'>
                <div className='register-form'>
                    <div className='register-info'>
                        <h1>Entrar</h1>
                        <img src={logo} alt=''></img>
                    </div>
                    <div className='form-container'> 
                    {error !== '' ?  <ErrorMsg info={error}/>
                        
                        : ''}
                        <p>Email:</p>
                        <input type="text" 
                            placeholder='Email...'
                            className='form-container-input'
                            name='email'
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <p>Senha:</p>
                        <input type="password"
                            placeholder='Senha...'
                            className='form-container-input'
                            name='password'
                            onChange={(e) => setPass(e.target.value)}
                            onKeyPress={(e) => loginByPress(e)}
                        />
                        <div className='reg-btn-div'>
                            <button onClick={handleLogin} className='reg-submit'>Entrar</button>
                        </div> 
                        <div className='new-account-login'>
                            <Link to='/register' className='new-account-link'>
                                Nao tem conta?
                            </Link> 
                        </div>
                        <div className='login-div'>
                            <img className='login-loading' src={loadingIcon} alt=""/>
                        </div>         
                    </div>
                </div>
                <div className='register-img'></div>
            </div>  
        </div>
    )
}

export default Login
