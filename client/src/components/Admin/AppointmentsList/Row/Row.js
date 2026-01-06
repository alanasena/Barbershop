import React from 'react';
import PropTypes from 'prop-types';
import './Row.css';
import TableData from '../TableData/TableData';

const Row = ({ appointments, time }) => {
  console.log('Row rendered');

  return (
    <tr>
      <th className="left-th">{time}</th>
      <TableData appointments={appointments.filter(obj => obj.day === 'Sun')} />
      <TableData appointments={appointments.filter(obj => obj.day === 'Mon')} />
      <TableData appointments={appointments.filter(obj => obj.day === 'Tue')} />
      <TableData appointments={appointments.filter(obj => obj.day === 'Wed')} />
      <TableData appointments={appointments.filter(obj => obj.day === 'Thu')} />
      <TableData appointments={appointments.filter(obj => obj.day === 'Fri')} />
    </tr>
  );
};

Row.propTypes = {
  appointments: PropTypes.arrayOf(
    PropTypes.shape({
      day: PropTypes.string.isRequired,
    })
  ).isRequired,
  time: PropTypes.string.isRequired,
};

export default Row;
