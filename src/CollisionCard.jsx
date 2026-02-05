import React from 'react';

const cardStyle = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '10px',
  boxShadow: '0 0 10px rgba(0,0,0,0.5)',
  zIndex: 1001
};

export function CollisionCard({ score }) {
  const handleRestart = () => {
    window.location.reload();
  };

  return (
    <div style={cardStyle}>
      <h2>¡Te has estrellado!</h2>
      <p>Tu puntuación final: {score}</p>
      <button onClick={handleRestart}>Volver a jugar</button>
    </div>
  );
}
