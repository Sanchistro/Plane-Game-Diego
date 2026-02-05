import { useEffect, useState } from "react";

// Parámetros de control y movimiento
let pitchVelocity = 0;
let planeSpeed = 0.005;

// Definir límites para la posición del avión
const minX = -0.5, maxX = 0.5;
const minY = 3, maxY = 3.6;

// Estado de control
export const useControls = () => {
  const [controls, setControls] = useState({});

  const handleKeyDown = (e) => {
    setControls((prev) => ({ ...prev, [e.key.toLowerCase()]: true }));
  };

  const handleKeyUp = (e) => {
    setControls((prev) => ({ ...prev, [e.key.toLowerCase()]: false }));
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return controls;
};

export function updatePlaneAxis(x, y, z, planePosition, camera, controls) {
  pitchVelocity *= 0.9;

  // Manejar entrada para rotación de cabeceo (pitch)
  if (controls["w"]) {
    pitchVelocity += 0.0007;
  }
  if (controls["s"]) {
    pitchVelocity -= 0.0007;
  }

  // Manejar entrada para movimiento lateral
  if (controls["a"]) {
    planePosition.x -= 0.007;
  }
  if (controls["d"]) {
    planePosition.x += 0.007;
  }

  // Aplicar la rotación de cabeceo a los ejes
  y.applyAxisAngle(x, pitchVelocity);
  z.applyAxisAngle(x, pitchVelocity);

  // Normalizar ejes después de la rotación para evitar distorsión
  x.normalize();
  y.normalize();
  z.normalize();

  // Actualizar la posición del avión basada en la dirección hacia adelante (eje z)
  planePosition.add(z.clone().multiplyScalar(-planeSpeed));

  // Aplicar los límites de posición para mantener el avión dentro de los límites
  planePosition.x = Math.max(minX, Math.min(maxX, planePosition.x));
  planePosition.y = Math.max(minY, Math.min(maxY, planePosition.y));

  // Actualizar el campo de visión de la cámara (opcional)
  camera.fov = 60;
  camera.updateProjectionMatrix();
}
