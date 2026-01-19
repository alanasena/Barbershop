import React, {useEffect, useState} from 'react'
import './UsersList.css'
import axios from 'axios'
import UserRow from './UserRow/UserRow'
import API_URL from '../../../config/api'

const UserList = () => {
    const [users, setUsers] = useState([])

    useEffect(()=>{
        console.log('user list rendred')
        axios.get(`${API_URL}/getusers`).then((response) => {

        
            let {error} = response.data
            if(error){
                console.log(error)
            }
            else{
                console.log('all the users: ',response.data)
                setUsers(response.data)
            }
        })
    },[])

    const deleteUser = async(id) => {

        console.log('deleting user: ', id)

        let response = await axios.post(`${API_URL}/deleteacc`, {id:id})
        let {error} = response.data
        if(error){
            alert(error)
        }
        else{
            alert(response.data)
        }
    }


    return (
        <div className='user-list'>
            <h1>Users List</h1>
            <table>
                <thead>
                    <tr className='table-header'>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Action</th>
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
