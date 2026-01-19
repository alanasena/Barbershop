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
                    <h1>O que fazemos</h1>
                    <p className='mr-bottom services-para'>Oferecemos servicos completos de barbearia com qualidade e atencao.</p>
                    <p className='mr-bottom services-para'>Agende seu horario e venha cuidar do visual.</p>
                </div>

                <div className='services-grid'>
                    <div className='services-box'>
                        <img src={hair_cut} alt=''></img>
                        <h2>Cortes de cabelo</h2>
                        <p className='mr-bottom services-para'>Cortes classicos e modernos para todos os estilos.</p>
                        <p className='mr-bottom services-para'>Atendimento personalizado.</p>
                    </div>
                    <div className='services-box'>
                        <img src={beardShave} alt=''></img>
                        <h2>Barba</h2>
                        <p className='mr-bottom services-para'>Acabamento e desenho de barba com precisao.</p>
                        <p className='mr-bottom services-para'>Produtos de qualidade.</p>
                    </div>
                  
                    <div className='services-box'>
                        <img src={pic3} alt=''></img>
                        <h2>Barbear completo</h2>
                        <p className='mr-bottom services-para'>Experiencia tradicional com toalha quente.</p>
                        <p className='mr-bottom services-para'>Conforto e cuidado.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Services
