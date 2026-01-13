import React, { useState } from 'react'
import './BarberRow.css'
import axiosInstance from '../../../../utils/axiosConfig'

const BarberRow = ({ barber, onEdit, onDelete, onToggleActive }) => {
    const [showRatings, setShowRatings] = useState(false)
    const [ratings, setRatings] = useState([])
    const [loadingRatings, setLoadingRatings] = useState(false)

    const fetchRatings = async () => {
        if (showRatings) {
            setShowRatings(false)
            return
        }

        setLoadingRatings(true)
        try {
            const response = await axiosInstance.get(`/api/barbers/${barber._id}/ratings`)
            setRatings(response.data)
            setShowRatings(true)
        } catch (error) {
            console.error('Erro ao buscar avaliações:', error)
            alert('Erro ao carregar avaliações')
        } finally {
            setLoadingRatings(false)
        }
    }

    return (
        <>
            <tr className={`table-row ${!barber.isActive ? 'inactive' : ''}`}>
                <td>{barber.name}</td>
                <td>{barber.email}</td>
                <td>{barber.phone || 'Vazio'}</td>
                <td>
                    {barber.specialties && barber.specialties.length > 0
                        ? barber.specialties.join(', ')
                        : 'Nenhuma'}
                </td>
                <td>
                    <div className='rating-cell'>
                        {barber.averageRating > 0 ? (
                            <>
                                <span className='rating-stars'>⭐ {barber.averageRating.toFixed(1)}</span>
                                <span className='rating-count'>({barber.totalRatings})</span>
                            </>
                        ) : (
                            <span className='no-rating'>Sem avaliações</span>
                        )}
                    </div>
                </td>
                <td>
                    <span className={`status-badge ${barber.isActive ? 'active' : 'inactive'}`}>
                        {barber.isActive ? 'Ativo' : 'Inativo'}
                    </span>
                </td>
                <td className='bg-action-white'>
                    <div className='action-buttons'>
                        <button
                            onClick={() => fetchRatings()}
                            className='btn-icon btn-blue-color'
                            title='Ver avaliações'
                        >
                            <i className="fa fa-star" aria-hidden="true"></i>
                        </button>
                        <button
                            onClick={() => onEdit(barber)}
                            className='btn-icon btn-blue-color'
                            title='Editar'
                        >
                            <i className="fa fa-pencil" aria-hidden="true"></i>
                        </button>
                        <button
                            onClick={() => onToggleActive(barber)}
                            className={`btn-icon ${barber.isActive ? 'btn-orange-color' : 'btn-green-color'}`}
                            title={barber.isActive ? 'Desativar' : 'Ativar'}
                        >
                            <i className={`fa fa-${barber.isActive ? 'ban' : 'check'}`} aria-hidden="true"></i>
                        </button>
                        <button
                            onClick={() => onDelete(barber._id)}
                            className='btn-icon btn-red-color'
                            title='Deletar'
                        >
                            <i className="fa fa-trash" aria-hidden="true"></i>
                        </button>
                    </div>
                </td>
            </tr>
            {showRatings && (
                <tr className='ratings-row'>
                    <td colSpan='7'>
                        <div className='ratings-container'>
                            <h4>Avaliações de {barber.name}</h4>
                            {loadingRatings ? (
                                <p>Carregando...</p>
                            ) : ratings.length > 0 ? (
                                <div className='ratings-list'>
                                    {ratings.map((rating) => (
                                        <div key={rating._id} className='rating-item'>
                                            <div className='rating-header'>
                                                <span className='rating-user'>{rating.userId?.name || 'Usuário'}</span>
                                                <span className='rating-date'>
                                                    {new Date(rating.date).toLocaleDateString('pt-BR')}
                                                </span>
                                                <span className='rating-stars'>
                                                    {'⭐'.repeat(rating.rating)}
                                                </span>
                                            </div>
                                            {rating.comment && (
                                                <p className='rating-comment'>{rating.comment}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>Nenhuma avaliação ainda.</p>
                            )}
                        </div>
                    </td>
                </tr>
            )}
        </>
    )
}

export default BarberRow
