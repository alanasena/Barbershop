import React from 'react'
import beardShave from '../../../assets/beard_shave.jpg'
import hair_cut from '../../../assets/hair_cut.jpg'
import pic3 from '../../../assets/pic3.jpg'
import logo from '../../../assets/logo.png'
// import ScrollAnimation from 'react-animate-on-scroll';
// import "animate.css/animate.min.css";



import './Services.css'

const Services = () => {
    return (
        <div className='services' id='what-we-do'>

            <div className='services-container'>

                <div className='services-info'>
                    <img src={logo} alt=''></img>
                    <h1>O Que Fazemos?</h1>
                    <p className='mr-bottom services-para'>Oferecemos serviços de alta qualidade para cuidar da sua aparência</p>
                    <p className='mr-bottom services-para'>com profissionais experientes e técnicas modernas.</p>
                </div>

                <div className='services-grid'>
                    <div className='services-box'>
                        <img src={hair_cut} alt=''></img>
                        <h2>Estilos de Corte</h2>
                        <p className='mr-bottom services-para'>Diversos estilos de corte de cabelo</p>
                        <p className='mr-bottom services-para'>personalizados para cada cliente.</p>
                    </div>
                    <div className='services-box'>
                        <img src={beardShave} alt=''></img>
                        <h2>Barba</h2>
                        <p className='mr-bottom services-para'>Aparar e modelar sua barba</p>
                        <p className='mr-bottom services-para'>com técnicas profissionais.</p>
                    </div>
                  
                    <div className='services-box'>
                        <img src={pic3} alt=''></img>
                        <h2>Barba Quente</h2>
                        <p className='mr-bottom services-para'>Barba tradicional com toalha quente</p>
                        <p className='mr-bottom services-para'>para uma experiência relaxante.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Services
