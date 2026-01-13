import React ,{useState, useEffect}from 'react'
import './Register.css'
import logo from '../../assets/logo.png'
import { Link } from 'react-router-dom'
import axios from 'axios';
import ErrorMsg from '../ErrorMsg/ErrorMsg'
import loadingIcon from '../../assets/loading_icon.gif'
import Navbar from '../Home/Navbar/Navbar'
import API_URL from '../../config/api'

const Register = (props) => {
    const [email, setEmail] = useState('')
    const [pass, setPass] = useState('')
    const [confirmPass, setConfirmPass] = useState('')
    const [error, setError] = useState('')

    useEffect( ()=>{
        console.log('register rendered')
    },[])
        
    const handleRegister = async () =>{
        let loading = document.querySelector('.register-loading')
        loading.style.display = 'block'

        let userData = {}
        userData.email = email
        userData.pass = pass
        userData.confirmPass = confirmPass
       
        try {
            let response = await axios.post(`${API_URL}/register`, userData)
            let {error} = response.data
            if(error){
                loading.style.display = 'none'
                console.log(error)
                setError(error)
                setTimeout( ()=>{
                    setError('')
                },6000)
            }
            else{
                loading.style.display = 'none'
                props.history.push({ pathname: '/login' });
                console.log('register succed')
            }
        } catch (err) {
            loading.style.display = 'none'
            const errorMsg = err.response?.data?.error || 'Erro ao registrar. Tente novamente.'
            setError(errorMsg)
            setTimeout( ()=>{
                setError('')
            },6000)
        }
    }

    const registerByPress = (e) =>{
        if(e.key === 'Enter')
            handleRegister()
      }

    
    return (
        <div className='register'>
            <Navbar/>
            <div className='register-container'>
                <div className='register-form'>
                    <div className='register-info'>
                        <h1>Registrar</h1>
                        <img src={logo} alt=''></img>
                    </div>
                    <div className='form-container'> 
                    {error !== '' ?  <ErrorMsg info={error}/>
                        
                        : ''}
                        <p>E-mail:</p>
                        <input type="email" 
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
                        />
                        <p>Confirmar Senha:</p>
                        <input type="password"
                            placeholder='Senha...'
                            className='form-container-input'
                            name='confirmPassword'
                            onChange={(e) => setConfirmPass(e.target.value)}
                            onKeyPress={(e) => registerByPress(e)}
                        /> 
                        <div className='reg-btn-div'>
                            <button onClick={handleRegister} className='reg-submit'>Registrar</button>
                        </div>
                        <div className='new-account-login'>
                            <Link to='/login' className='new-account-link'>
                                Já tem conta? <br/>Entre agora!
                            </Link> 
                        </div> 
                        <div className='login-div'>
                            <img className='register-loading' src={loadingIcon} alt=""/>
                        </div>
                    </div>
                </div>
                <div className='register-img'></div>
            </div>  
        </div>
    )
}

export default Register
