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
    const [email, setEmail] = useState('')
    const [pass, setPass] = useState('')
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

        try {
            let response = await axios.post(`${API_URL}/login`, userData)
            let {id, status, error, name, admin, phone, token} = response.data
            if(error){
                loading.style.display = 'none'
                console.log(error)
                setError(error)
                setTimeout( ()=>{
                    setError('')
                },6000)
            }else{
                loading.style.display = 'none'
                
                console.log('🔑 Dados do login recebidos:', {id, status, name, admin, phone: phone ? 'presente' : 'vazio'});
                console.log('   Admin?', admin, '(tipo:', typeof admin, ')');
                
                setCookie('id', id ,2)
                setCookie('status', status ,2)
                setCookie('name', name ,2)
                
                const adminValue = admin ? 'true' : 'false';
                setCookie('admin', adminValue ,2)
                console.log('   Cookie admin setado como:', adminValue);
                
                setCookie('phone', phone ,2)
                if(token) {
                    setCookie('token', token ,2)
                    console.log('   Token JWT setado');
                }

                if(admin) {
                    console.log('✅ Usuário é ADMIN - Redirecionando para /admin');
                    props.history.push({ pathname: '/admin' });
                } else {
                    console.log('ℹ️ Usuário NÃO é admin - Redirecionando para /appointment');
                    props.history.push({ pathname: '/appointment' });
                }
                console.log('✅ Login bem-sucedido');
            }
        } catch (err) {
            loading.style.display = 'none'
            const errorMsg = err.response?.data?.error || 'Erro ao fazer login. Tente novamente.'
            setError(errorMsg)
            setTimeout( ()=>{
                setError('')
            },6000)
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
                        <p>E-mail:</p>
                        <input type="text" 
                            placeholder='E-mail...'
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
                                Não tem conta?
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
