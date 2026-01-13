import React from 'react'
import './UserRow.css'

const UserRow = ({user, deleteUser}) => {
    console.log('user row rendred')

    return (

        <tr className='table-row'>
            <td>{user.name ? (user.name.charAt(0).toUpperCase() + user.name.slice(1)) : <span className='empty-value'>Vazio</span>}</td>
            <td>{user.email || <span className='empty-value'>Vazio</span>}</td>
            <td>{user.phone ? user.phone : <span className='empty-value'>Vazio</span>}</td>
            <td className='bg-action-white'>
                {/* <button onClick={() =>editUser(user._id)} className='btn-icon btn-blue-color'>
                    <i className="fa fa-pencil" aria-hidden="true"></i>
                </button> */}
                <button onClick={() => deleteUser(user._id)} className='btn-icon btn-red-color'>
                    <i className="fa fa-trash" aria-hidden="true"></i>
                </button>
            </td>  
        </tr>           
    )
}

export default UserRow
