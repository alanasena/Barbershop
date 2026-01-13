import React, {useEffect, useState} from 'react'
import './BarbersList.css'
import axiosInstance from '../../../utils/axiosConfig'
import BarberRow from './BarberRow/BarberRow'

const BarbersList = () => {
    const [barbers, setBarbers] = useState([])
    const [showForm, setShowForm] = useState(false)
    const [editingBarber, setEditingBarber] = useState(null)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        specialties: ''
    })

    useEffect(() => {
        fetchBarbers()
    }, [])

    const fetchBarbers = async () => {
        try {
            const response = await axiosInstance.get('/api/admin/barbers')
            setBarbers(response.data)
        } catch (error) {
            console.error('Erro ao buscar barbeiros:', error)
            alert('Erro ao carregar barbeiros')
        }
    }

    const handleAdd = () => {
        setEditingBarber(null)
        setFormData({ name: '', email: '', phone: '', specialties: '' })
        setShowForm(true)
    }

    const handleEdit = (barber) => {
        setEditingBarber(barber)
        setFormData({
            name: barber.name,
            email: barber.email,
            phone: barber.phone || '',
            specialties: barber.specialties ? barber.specialties.join(', ') : ''
        })
        setShowForm(true)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        try {
            const data = {
                ...formData,
                specialties: formData.specialties.split(',').map(s => s.trim()).filter(s => s)
            }

            if (editingBarber) {
                await axiosInstance.put(`/api/barbers/${editingBarber._id}`, data)
                alert('Barbeiro atualizado com sucesso!')
            } else {
                await axiosInstance.post('/api/barbers', data)
                alert('Barbeiro cadastrado com sucesso!')
            }

            setShowForm(false)
            fetchBarbers()
        } catch (error) {
            const errorMsg = error.response?.data?.error || 'Erro ao salvar barbeiro'
            alert(errorMsg)
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Tem certeza que deseja deletar/desativar este barbeiro?')) {
            return
        }

        try {
            await axiosInstance.delete(`/api/barbers/${id}`)
            alert('Barbeiro deletado/desativado com sucesso!')
            fetchBarbers()
        } catch (error) {
            const errorMsg = error.response?.data?.error || 'Erro ao deletar barbeiro'
            alert(errorMsg)
        }
    }

    const toggleActive = async (barber) => {
        try {
            await axiosInstance.put(`/api/barbers/${barber._id}`, {
                isActive: !barber.isActive
            })
            fetchBarbers()
        } catch (error) {
            alert('Erro ao atualizar status do barbeiro')
        }
    }

    return (
        <div className='barbers-list'>
            <div className='barbers-header'>
                <h1>Lista de Barbeiros</h1>
                <button onClick={handleAdd} className='add-barber-btn'>
                    + Adicionar Barbeiro
                </button>
            </div>

            {showForm && (
                <div className='barber-form-modal'>
                    <div className='barber-form-content'>
                        <h2>{editingBarber ? 'Editar Barbeiro' : 'Novo Barbeiro'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className='form-group'>
                                <label>Nome: <span className='red-astrix'>*</span></label>
                                <input
                                    type='text'
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    required
                                />
                            </div>
                            <div className='form-group'>
                                <label>Email: <span className='red-astrix'>*</span></label>
                                <input
                                    type='email'
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    required
                                />
                            </div>
                            <div className='form-group'>
                                <label>Telefone:</label>
                                <input
                                    type='tel'
                                    value={formData.phone}
                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                />
                            </div>
                            <div className='form-group'>
                                <label>Especialidades (separadas por vírgula):</label>
                                <input
                                    type='text'
                                    value={formData.specialties}
                                    onChange={(e) => setFormData({...formData, specialties: e.target.value})}
                                    placeholder='Ex: Corte masculino, Barba, Degradê'
                                />
                            </div>
                            <div className='form-buttons'>
                                <button type='submit' className='submit-btn'>
                                    {editingBarber ? 'Atualizar' : 'Cadastrar'}
                                </button>
                                <button type='button' onClick={() => setShowForm(false)} className='cancel-btn'>
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <table>
                <thead>
                    <tr className='table-header'>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Telefone</th>
                        <th>Especialidades</th>
                        <th>Avaliação</th>
                        <th>Status</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {barbers.map((barber) => (
                        <BarberRow
                            key={barber._id}
                            barber={barber}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onToggleActive={toggleActive}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default BarbersList
