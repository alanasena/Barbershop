import React from 'react';
import PropTypes from 'prop-types';
import './TableData.css';

const TableData = ({ appointments }) => {
  return (
    <td>
      {appointments[0] ? (
        <span className="td-color">
          <span className="td-flex-icons">
            <i className="fa fa-user" aria-hidden="true"></i>
            {appointments[0].name.charAt(0).toUpperCase() +
              appointments[0].name.slice(1)}
          </span>

          <span className="td-flex-icons">
            <i className="fa fa-phone" aria-hidden="true"></i>
            <a href={`tel:${appointments[0].phone}`}>
              {appointments[0].phone}
            </a>
          </span>
        </span>
      ) : (
        <span className="td-empty">Empty</span>
      )}
    </td>
  );
};

TableData.propTypes = {
  appointments: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      phone: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default TableData;
