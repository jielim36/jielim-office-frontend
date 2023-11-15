import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Modal from 'react-modal';

const root = ReactDOM.createRoot(document.getElementById('root'));
Modal.setAppElement('#root');  // Change '#root' to the actual id of your root element

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);