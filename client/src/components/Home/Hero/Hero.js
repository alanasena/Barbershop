import React from 'react'
import './Hero.css'
import { Link } from 'react-router-dom'
 

const Hero = () => {
    return (
        <div className='hero' id='hero-navigate'>
            <div className='hero-text'>
                <h1 className='hero-h1'>Cortes incriveis para voce</h1>
                <div className='hero-para-div'>
                    <p className='hero-para'>
                        A barbearia abriu em 1989. Somos especializados em
                        cortes masculinos e barba. Veja nossos servicos abaixo!
                        Obrigado por escolher a gente!
                    </p>
                </div>
                <Link to='/appointment'>
                    <button className='hero-btn'>Agendar agora</button>
                </Link>
            </div>
        </div>
    )
}

export default Hero
