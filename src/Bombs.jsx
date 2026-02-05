import { useState, useEffect } from "react";
import { Vector3, Box3 } from "three";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { planePosition } from "./Airplane"; // Asegúrate de que planePosition esté actualizado

function randomPoint(minX, maxX, minY, maxY, zOffset) {
  return new Vector3(
    Math.random() * (maxX - minX) + minX,
    Math.random() * (maxY - minY) + minY,
    planePosition.z - zOffset
  );
}

export function Bombs({ onGameOver, resetGame, isGameOver, collectedDucks }) {
  const { scene: bombModel } = useGLTF("./public/assets/models/Bomb.glb");
  const [targets, setTargets] = useState([]);

  const bounds = {
    minX: -0.5,
    maxX: 0.5,
    minY: 3,
    maxY: 3.5,
  };

  // Generar bombas
  const generateBombs = () => {
    if (isGameOver) return;
    const newBombs = [];
    const zOffset = 4; // Ajustar según sea necesario

    while (newBombs.length < 1) {
      const newPosition = randomPoint(bounds.minX, bounds.maxX, bounds.minY, bounds.maxY, zOffset);
      newBombs.push({
        center: newPosition,
        direction: new Vector3(Math.random(), Math.random(), Math.random()).normalize(),
        boundingBox: new Box3().setFromCenterAndSize(newPosition, new Vector3(0.025, 0.025, 0.025)) // Caja delimitadora ajustada al tamaño de la bomba
      });
    }
    setTargets(prevTargets => [...prevTargets, ...newBombs]);
  };

  useEffect(() => {
    if (isGameOver) return; // No generar nuevos objetivos si el juego ha terminado

    // Generar un primer patito al inicio
    generateBombs();

    // Establecer un intervalo para generar patitos cada 13 segundos
    const interval = setInterval(() => {
      generateBombs();
    }, 3000); // Cada 13 segundos

    return () => clearInterval(interval); // Limpiar el intervalo cuando el componente se desmonte
  }, [isGameOver]);

  useFrame(() => {
    if (isGameOver) return;

    // Crear una caja delimitadora para el avión
    const planeBoundingBox = new Box3().setFromCenterAndSize(
      planePosition.clone(),
      new Vector3(0.14, 0.14, 0.14)
    );

    targets.forEach((target) => {
      // Comparar la caja delimitadora de la bomba con la del avión
      if (planeBoundingBox.intersectsBox(target.boundingBox)) {
        onGameOver();
      }
    });
  });

  return (
    <>
      {targets.map((target, index) => (
        <primitive
          key={index}
          object={bombModel.clone()}
          position={target.center}
          scale={new Vector3(0.5, 0.5, 0.5)}
        />
      ))}
    </>
  );
}
