import React, { useEffect, useState } from 'react'
import './FeedbacksList.css'
import axios from 'axios'
import { getCookie } from '../../../cookies'
import API_URL from '../../../config/api'

const FeedbacksList = () => {
    const [feedbacks, setFeedbacks] = useState([])
    const [barbers, setBarbers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [newRating, setNewRating] = useState('5')
    const [newComment, setNewComment] = useState('')
    const [newClientName, setNewClientName] = useState('')
    const [newClientEmail, setNewClientEmail] = useState('')
    const [newBarberName, setNewBarberName] = useState('')
    const [newBarberEmail, setNewBarberEmail] = useState('')
    const [creating, setCreating] = useState(false)
    const isBarber = getCookie('barber') === 'true' || (getCookie('email') || '').includes('@barbearia.com')

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

        const fetchBarbers = async () => {
            try {
                const response = await axios.get(`${API_URL}/barbers`)
                const payload = response.data && response.data.value ? response.data.value : response.data
                const list = Array.isArray(payload) ? payload : []
                setBarbers(list)
                if (list.length && !newBarberName) {
                    setNewBarberName(list[0].name)
                    setNewBarberEmail(list[0].email)
                }
            } catch (err) {
                console.error('Erro ao buscar barbeiros:', err)
                setError('Erro ao carregar barbeiros')
                setBarbers([])
            }
        }

        fetchFeedbacks()
        fetchBarbers()
    }, [])

    const handleCreateManual = async () => {
        setCreating(true)
        try {
            const payload = {
                rating: Number(newRating),
                comment: newComment,
                clientName: newClientName,
                clientEmail: newClientEmail,
                barberName: newBarberName,
                barberEmail: newBarberEmail
            }
            const response = await axios.post(`${API_URL}/rating/manual`, payload)
            setFeedbacks((prev) => [response.data, ...prev])
            setNewComment('')
            setNewClientName('')
            setNewClientEmail('')
            setNewBarberName('')
            setNewBarberEmail('')
            setError('')
        } catch (err) {
            console.error('Erro ao criar feedback manual:', err)
            setError('Erro ao criar feedback manual')
        } finally {
            setCreating(false)
        }
    }

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

            {!isBarber && (
                <div className='feedbacks-create'>
                    <h2>Criar feedback manual</h2>
                    <div className='feedbacks-form'>
                        <label>Nome do cliente</label>
                        <input
                            type='text'
                            value={newClientName}
                            onChange={(e) => setNewClientName(e.target.value)}
                            placeholder='Ex: Joao Silva'
                        />
                        <label>Email do cliente</label>
                        <input
                            type='email'
                            value={newClientEmail}
                            onChange={(e) => setNewClientEmail(e.target.value)}
                            placeholder='Ex: joao@email.com'
                        />
                        <label>Nome do barbeiro</label>
                        <select
                            value={newBarberEmail}
                            onChange={(e) => {
                                const value = e.target.value
                                const barber = barbers.find((item) => item.email === value)
                                setNewBarberEmail(value)
                                setNewBarberName(barber ? barber.name : '')
                            }}
                            disabled={!barbers.length}
                        >
                            {barbers.length === 0 ? (
                                <option value=''>Sem barbeiros cadastrados</option>
                            ) : (
                                barbers.map((barber) => (
                                    <option key={barber.id} value={barber.email}>
                                        {barber.name} ({barber.email})
                                    </option>
                                ))
                            )}
                        </select>
                        <label>Nota (1 a 5)</label>
                        <select value={newRating} onChange={(e) => setNewRating(e.target.value)}>
                            <option value='1'>1</option>
                            <option value='2'>2</option>
                            <option value='3'>3</option>
                            <option value='4'>4</option>
                            <option value='5'>5</option>
                        </select>
                        <label>Comentario</label>
                        <textarea
                            rows='3'
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder='Opcional'
                        />
                        <button onClick={handleCreateManual} disabled={creating || !newBarberName.trim()}>
                            {creating ? 'Salvando...' : 'Adicionar feedback'}
                        </button>
                    </div>
                </div>
            )}

            {loading ? (
                <p className='feedbacks-loading'>Carregando...</p>
            ) : feedbacks.length === 0 ? (
                <p className='feedbacks-empty'>Nenhum feedback encontrado.</p>
            ) : (
                <div className='feedbacks-table-wrapper'>
                    <table>
                        <thead>
                            <tr className='table-header'>
                                <th>Usuario</th>
                                <th>Email</th>
                                <th>Barbeiro</th>
                                <th>Data</th>
                                <th>Hora</th>
                                <th>Nota</th>
                                <th>Comentario</th>
                                <th>Criado em</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(isBarber
                                ? feedbacks.filter((item) => {
                                    const barberName = (getCookie('barberName') || '').toLowerCase()
                                    const barberEmail = (getCookie('barberEmail') || getCookie('email') || '').toLowerCase()
                                    const itemName = (item.barberName || '').toLowerCase()
                                    const itemEmail = (item.barberEmail || '').toLowerCase()
                                    if (barberEmail && itemEmail && itemEmail === barberEmail) return true
                                    if (barberName && itemName && (barberName.includes(itemName) || itemName.includes(barberName))) return true
                                    return false
                                })
                                : feedbacks
                            ).map((item) => (
                                <tr key={item._id}>
                                    <td>{item.user?.name || item.clientName || item.appointment?.name || 'N/A'}</td>
                                    <td>{item.user?.email || item.clientEmail || 'N/A'}</td>
                                    <td>{item.barberName || item.barberEmail || 'Nao informado'}</td>
                                    <td>{item.appointment?.date || (item.isManual ? 'Manual' : 'N/A')}</td>
                                    <td>{item.appointment?.time || (item.isManual ? 'Manual' : 'N/A')}</td>
                                    <td>{item.rating ?? 'N/A'}</td>
                                    <td className='feedbacks-comment'>
                                        {item.comment ? item.comment : 'Sem comentario'}
                                    </td>
                                    <td>{formatDateTime(item.createdAt)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

export default FeedbacksList
