import React from 'react';

const Overlay = ({ onClose, message }) => {
  return (
    <div style={overlayStyle}>
      <h1 style={textStyle}>{message}</h1>
    </div>
  );
};

const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  color: 'white',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 6969,
};

const textStyle = {
  fontSize: '2rem',
  fontWeight: 'bold',
};

export default Overlay;

