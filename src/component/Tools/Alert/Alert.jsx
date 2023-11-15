import React from 'react'
import './Alert.css';

const Alert = (props) => {
  return (
    <div className={`alertContainer ${props.show ? 'show' : ''}`}>
      <div className="alert">{props.content}</div>
    </div>
  );
}

export default Alert