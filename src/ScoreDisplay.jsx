import React from 'react';

export function ScoreDisplay({ score }) {
  return (
    <div style={{
      position: 'fixed', 
      top: '10px', 
      left: '47%', 
      backgroundColor: 'rgba(255, 255, 255, 0.7)', 
      padding: '10px', 
      borderRadius: '5px', 
      zIndex: 1000, 
      fontWeight: 'bold',
      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)' 
    }}>
      Puntuación: {score}
    </div>
  );
}
