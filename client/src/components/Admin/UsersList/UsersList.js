import React, {useEffect, useState} from 'react'
import './UsersList.css'
import axiosInstance from '../../../utils/axiosConfig'
import UserRow from './UserRow/UserRow'

const UserList = () => {
    const [users, setUsers] = useState([])

    useEffect(()=>{
        console.log('user list rendred')
        axiosInstance.get('/getusers').then((response) => {
            let {error} = response.data
            if(error){
                console.log(error)
            }
            else{
                console.log('all the users: ',response.data)
                setUsers(response.data)
            }
        }).catch(err => {
            console.error('Erro ao buscar usuários:', err)
        })
    },[])

    const deleteUser = async(id) => {
        if(!window.confirm('Tem certeza que deseja deletar este usuário?')) {
            return
        }

        console.log('deleting user: ', id)

        try {
            let response = await axiosInstance.post('/deleteacc', {id:id})
            let {error, message} = response.data
            if(error){
                alert(error)
            }
            else{
                alert(message || 'Usuário deletado com sucesso')
                // Atualizar lista removendo o usuário deletado
                setUsers(users.filter(user => user._id !== id))
            }
        } catch (err) {
            const errorMsg = err.response?.data?.error || 'Erro ao deletar usuário'
            alert(errorMsg)
        }
    }


    return (
        <div className='user-list'>
            <h1>Lista de Usuários</h1>
            <table>
                <thead>
                    <tr className='table-header'>
                        <th>Nome</th>
                        <th>E-mail</th>
                        <th>Telefone</th>
                        <th>Ação</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => <UserRow deleteUser={deleteUser} user={user}/>)}
                </tbody>
            </table>    
        </div>
    )
}

export default UserList
