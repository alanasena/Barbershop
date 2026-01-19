import React, { useEffect, useState } from 'react'
import './FeedbacksList.css'
import axios from 'axios'
import API_URL from '../../../config/api'

const FeedbacksList = () => {
    const [feedbacks, setFeedbacks] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchFeedbacks = async () => {
            setLoading(true)
            try {
                const response = await axios.get(`${API_URL}/ratings`)
                const { error: apiError } = response.data || {}
                if (apiError) {
                    setError(apiError)
                    setFeedbacks([])
                } else {
                    setFeedbacks(response.data || [])
                    setError('')
                }
            } catch (err) {
                console.error('Erro ao buscar feedbacks:', err)
                setError('Erro ao carregar feedbacks')
                setFeedbacks([])
            } finally {
                setLoading(false)
            }
        }

        fetchFeedbacks()
    }, [])

    const formatDateTime = (value) => {
        if (!value) return 'N/A'
        try {
            return new Date(value).toLocaleString('pt-BR')
        } catch (err) {
            return 'N/A'
        }
    }

    return (
        <div className='feedbacks-list'>
            <h1>Feedbacks</h1>
            {error ? <p className='feedbacks-error'>{error}</p> : null}

            {loading ? (
                <p className='feedbacks-loading'>Carregando...</p>
            ) : feedbacks.length === 0 ? (
                <p className='feedbacks-empty'>Nenhum feedback encontrado.</p>
            ) : (
                <table>
                    <thead>
                        <tr className='table-header'>
                            <th>Usuario</th>
                            <th>Email</th>
                            <th>Data</th>
                            <th>Hora</th>
                            <th>Nota</th>
                            <th>Comentario</th>
                            <th>Criado em</th>
                        </tr>
                    </thead>
                    <tbody>
                        {feedbacks.map((item) => (
                            <tr key={item._id}>
                                <td>{item.user?.name || item.appointment?.name || 'N/A'}</td>
                                <td>{item.user?.email || 'N/A'}</td>
                                <td>{item.appointment?.date || 'N/A'}</td>
                                <td>{item.appointment?.time || 'N/A'}</td>
                                <td>{item.rating ?? 'N/A'}</td>
                                <td className='feedbacks-comment'>
                                    {item.comment ? item.comment : 'Sem comentario'}
                                </td>
                                <td>{formatDateTime(item.createdAt)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}

export default FeedbacksList
