import React from 'react';
import PropTypes from 'prop-types';
import './UserRow.css';

const UserRow = ({ user, deleteUser }) => {
  console.log('user row rendered');

  return (
    <tr className="table-row">
      <td>
        {user.name.charAt(0).toUpperCase() + user.name.slice(1)}
      </td>
      <td>{user.email}</td>
      <td>{user.phone ? user.phone : 'Empty'}</td>
      <td className="bg-action-white">
        <button
          onClick={() => deleteUser(user._id)}
          className="btn-icon btn-red-color"
        >
          <i className="fa fa-trash" aria-hidden="true"></i>
        </button>
      </td>
    </tr>
  );
};

UserRow.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string,
  }).isRequired,
  deleteUser: PropTypes.func.isRequired,
};

export default UserRow;
