import React, { useEffect, useState } from 'react';
import { useControls } from './controls'; // Importa los controles del teclado

export function BottomRightComponent() {
  const [controlMode, setControlMode] = useState(null); // Estado para el modo de control
  const controls = useControls(controlMode); // Obtén los controles del teclado

  const handleKeyboardControls = () => {
    setControlMode('keyboard'); // Cambia el estado a teclado
    console.log("Controles de teclado activados");
  };

  const handleCameraControls = () => {
    setControlMode('camera'); // Cambia el estado a cámara
    console.log("Controles de cámara activados");
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px', // Distancia desde la parte inferior
      right: '20px', // Distancia desde la derecha
      backgroundColor: 'rgba(255, 255, 255, 0.8)', // Fondo semitransparente
      padding: '15px', // Espacio interno
      borderRadius: '8px', // Bordes redondeados
      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', // Sombra suave
      zIndex: 1000, // Asegura que se quede al frente de otros elementos
    }}>
      <div id="textContainer">
        <p>Presiona 'W', para ir hacia arriba</p>
        <p>Presiona 'A', para ir hacia la izquierda</p>
        <p>Presiona 'S', para ir hacia abajo</p>
        <p>Presiona 'D', para ir hacia la derecha</p>
      </div>
      <video id="inputVideo" playsInline autoPlay muted style={{ display: 'none', width: '20%', maxWidth: '600px' }}></video>
      <button onClick={handleCameraControls} style={{ margin: '5px', padding: '10px' }}>
        Mostrar Cámara
      </button>
      <button onClick={handleKeyboardControls} style={{ margin: '5px', padding: '10px' }}>
        Jugar con Teclado
      </button>
    </div>
  );
} 