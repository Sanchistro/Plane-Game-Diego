import React, { useState, useEffect } from 'react';
import { Vector3, Box3 } from 'three';
import { useGLTF } from '@react-three/drei';
import { planePosition } from './Airplane'; // Asegúrate de que planePosition esté actualizado

function randomPoint(minX, maxX, minY, maxY, zOffset) {
  return new Vector3(
    Math.random() * (maxX - minX) + minX,
    Math.random() * (maxY - minY) + minY,
    planePosition.z - zOffset
  );
}

export function Pueblo({ onGameOver, isGameOver }) {
  const { scene: cityModel } = useGLTF('public/assets/models/fondo2.glb');
  const [targets, setTargets] = useState([]);

  const bounds = {
    minX: 0,
    maxX: 0,
    minY: 1,
    maxY: 1,
  };

  // Generar bombas
  const generateBuilding = () => {
    if (isGameOver) return;
    const newBuilding = [];
    const zOffset = 6.5; // Ajustar según sea necesario

    while (newBuilding.length < 1) {
      const newPosition = randomPoint(bounds.minX, bounds.maxX, bounds.minY, bounds.maxY, zOffset);
      newBuilding.push({
        center: newPosition,
        direction: new Vector3(Math.random(), Math.random(), Math.random()).normalize(),
        boundingBox: new Box3().setFromCenterAndSize(newPosition, new Vector3(0.025, 0.025, 0.025)) // Caja delimitadora ajustada al tamaño de la bomba
      });
    }
    setTargets(prevTargets => [...prevTargets, ...newBuilding]);
  };

  useEffect(() => {
    // Generar un primer edificio al inicio
    generateBuilding();

    // Establecer un intervalo para generar edificios cada 6 segundos
    const interval = setInterval(() => {
      generateBuilding();
    }, 5500); // Cada 5.5 segundos

    return () => clearInterval(interval); // Limpiar el intervalo cuando el componente se desmonte
  }, [isGameOver]);

  return (
    <>
      {targets.map((target, index) => (
        <primitive
          key={index}
          rotation-y={1.6}
          object={cityModel.clone()}
          position={target.center}
          scale={new Vector3(0.5, 0.5, 0.5)}
        />
      ))}
    </>
  )
}

useGLTF.preload('public/assets/models/fondo2.glb');
