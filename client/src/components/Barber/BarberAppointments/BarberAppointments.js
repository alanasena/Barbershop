import React, { useEffect, useState } from 'react';
import './BarberAppointments.css';
import Navbar from '../../Home/Navbar/Navbar';
import axiosInstance from '../../../utils/axiosConfig';

const BarberAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/barber/appointments');
            console.log('Agendamentos do barbeiro:', response.data);
            setAppointments(response.data || []);
            setError('');
        } catch (err) {
            console.error('Erro ao buscar agendamentos:', err);
            setError(err.response?.data?.error || 'Erro ao carregar agendamentos');
            setAppointments([]);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return dateString || 'N/A';
    };

    const getDayName = (dayNumber) => {
        const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
        return days[parseInt(dayNumber)] || dayNumber;
    };

    const getStatusBadge = (isCompleted, isRated, timeInMS) => {
        const now = Date.now();
        if (isRated) {
            return <span className="status-badge rated">Avaliado</span>;
        }
        if (isCompleted || timeInMS < now) {
            return <span className="status-badge completed">Concluído</span>;
        }
        return <span className="status-badge pending">Agendado</span>;
    };

    return (
        <div>
            <Navbar />
            <div className="barber-appointments-container">
                <div className="barber-appointments-content">
                    <h1>Meus Agendamentos</h1>
                    
                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <div className="loading-message">Carregando agendamentos...</div>
                    ) : appointments.length === 0 ? (
                        <div className="no-appointments">
                            <p>Você ainda não possui agendamentos.</p>
                        </div>
                    ) : (
                        <>
                            <p className="appointments-count">
                                Total de agendamentos: {appointments.length}
                            </p>
                            
                            <div className="appointments-table-container">
                                <table className="barber-appointments-table">
                                    <thead>
                                        <tr>
                                            <th>Data</th>
                                            <th>Dia da Semana</th>
                                            <th>Horário</th>
                                            <th>Cliente</th>
                                            <th>Email</th>
                                            <th>Telefone</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {appointments.map((appointment) => (
                                            <tr key={appointment._id}>
                                                <td>{formatDate(appointment.date)}</td>
                                                <td>{getDayName(appointment.day)}</td>
                                                <td>{appointment.time}</td>
                                                <td>{appointment.name}</td>
                                                <td>{appointment.email}</td>
                                                <td>
                                                    {appointment.phone && appointment.phone !== 'N/A' ? (
                                                        <a href={`tel:${appointment.phone}`}>
                                                            {appointment.phone}
                                                        </a>
                                                    ) : (
                                                        'N/A'
                                                    )}
                                                </td>
                                                <td>
                                                    {getStatusBadge(
                                                        appointment.isCompleted,
                                                        appointment.isRated,
                                                        appointment.timeInMS
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BarberAppointments;
