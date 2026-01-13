import React from 'react'
import './Hero.css'
import { Link } from 'react-router-dom'
 

const Hero = () => {
    return (
        <div className='hero' id='hero-navigate'>
            <div className='hero-text'>
                <h1 className='hero-h1'>Fazemos Cortes Incríveis</h1>
                <div className='hero-para-div'>
                    <p className='hero-para'>
                        A Barbearia foi inaugurada no outono de 1989. Especializamo-nos em
                        cortar cabelos masculinos e fazer a barba. Veja
                        todos os nossos serviços incríveis abaixo! Obrigado por nos escolher!
                    </p>
                </div>
                <Link to='/appointment'>
                    <button className='hero-btn'>Agendar Agora</button>
                </Link>
            </div>
        </div>
    )
}

export default Hero
