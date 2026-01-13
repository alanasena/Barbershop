import React, { useState, useEffect } from 'react';
import './Rating.css';
import Navbar from '../Home/Navbar/Navbar';
import axiosInstance from '../../utils/axiosConfig';
import { getCookie } from '../../cookies';

const Rating = (props) => {
    const [appointment, setAppointment] = useState(null);
    const [barber, setBarber] = useState(null);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAppointment = async () => {
            try {
                const response = await axiosInstance.get('/userappointment');
                setAppointment(response.data);
                
                if (response.data.barberId) {
                    try {
                        const barberResponse = await axiosInstance.get(`/api/barbers/${response.data.barberId}`);
                        setBarber(barberResponse.data);
                    } catch (err) {
                        console.error('Erro ao buscar barbeiro:', err);
                        setError('Erro ao carregar informações do barbeiro');
                    }
                } else {
                    setError('Este agendamento não possui barbeiro associado');
                }
            } catch (error) {
                console.error('Erro ao buscar agendamento:', error);
                setError('Erro ao carregar agendamento');
            } finally {
                setLoading(false);
            }
        };
        fetchAppointment();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (rating === 0) {
            setError('Por favor, selecione uma nota');
            return;
        }

        if (!appointment || !appointment._id) {
            setError('Erro: agendamento não encontrado');
            return;
        }

        try {
            const response = await axiosInstance.post('/api/ratings', {
                appointmentId: appointment._id,
                rating,
                comment
            });

            setSuccess('Avaliação enviada com sucesso! Obrigado pelo feedback!');
            setError('');
            setTimeout(() => {
                props.history.push('/profile');
            }, 2500);
        } catch (error) {
            const errorMsg = error.response?.data?.error || 'Erro ao enviar avaliação';
            setError(errorMsg);
            setSuccess('');
        }
    };

    const renderStars = () => {
        return [1, 2, 3, 4, 5].map((star) => (
            <span
                key={star}
                className={`star ${star <= (hoverRating || rating) ? 'filled' : ''}`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
            >
                ⭐
            </span>
        ));
    };

    if (loading) {
        return (
            <div>
                <Navbar />
                <div className='rating-container'>
                    <div className='rating-form'>
                        <p>Carregando...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <div className='rating-container'>
                <div className='rating-form'>
                    <h1>Avaliar Barbeiro</h1>
                    
                    {barber && (
                        <div className='barber-info'>
                            <h2>{barber.name}</h2>
                            <p>Média: ⭐ {barber.averageRating ? barber.averageRating.toFixed(1) : '0.0'} ({barber.totalRatings || 0} avaliações)</p>
                        </div>
                    )}

                    {appointment && (
                        <div className='appointment-info'>
                            <p>Agendamento: {appointment.date} às {appointment.time}</p>
                        </div>
                    )}

                    {error && <div className='error-msg'>{error}</div>}
                    {success && <div className='success-msg'>{success}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className='rating-section'>
                            <label>Nota: <span className='red-astrix'>*</span></label>
                            <div className='stars-container'>
                                {renderStars()}
                                <span className='rating-value'>{rating > 0 ? `${rating}/5` : ''}</span>
                            </div>
                        </div>

                        <div className='comment-section'>
                            <label>Observações (opcional):</label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder='Deixe um comentário sobre o atendimento...'
                                maxLength={500}
                                rows={5}
                                className='comment-textarea'
                            />
                            <span className='char-count'>{comment.length}/500</span>
                        </div>

                        <button type='submit' className='submit-rating-btn'>
                            Enviar Avaliação
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Rating;
