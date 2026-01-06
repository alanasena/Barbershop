import React from 'react'
import './ErrorMsg.css'
import PropTypes from 'prop-types';


const ErrorMsg = ({info}) => {

    return (
        <div className='error-msg'>
           <i className="fa fa-exclamation-circle" aria-hidden="true"></i>
           <span>{info}</span>
        </div>
    )
}

ErrorMsg.propTypes = {
    info: PropTypes.string.isRequired,
};


export default ErrorMsg
