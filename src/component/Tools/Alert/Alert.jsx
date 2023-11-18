import React from 'react'
import './Alert.css';
import alertIcon from '../../../assets/alert_icon.png';

const Alert = (props) => {
  return (
    <div className={`alertContainer ${props.show ? 'show' : ''}`}>
      <img src={alertIcon} className='icon' />
      <div className="alert">{props.content}</div>
    </div>
  );
}

export default Alert