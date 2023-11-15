import React from 'react'
import Modal from 'react-modal';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    maxWidth: '600px', // 设置最大宽度
    padding: '20px', // 设置内边距
  },
};

const CustomModal = ({ isOpen, onRequestClose, children }) => {

  
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Custom Modal"
      style={customStyles}
    >
      {children}
    </Modal>
  );
};

export default CustomModal