import React, { useState, useEffect } from "react";
import { Vector3, Box3 } from "three";
import { useFrame } from "@react-three/fiber";
import { useGLTF, Html } from "@react-three/drei";
import { planePosition } from "./Airplane"; // Asegúrate de que planePosition esté actualizado

function randomPoint(minX, maxX, minY, maxY, zOffset) {
  // Generar una posición aleatoria dentro de los límites dados
  const randomPosition = new Vector3(
    Math.random() * (maxX - minX) + minX,
    Math.random() * (maxY - minY) + minY,
    planePosition.z - zOffset // Generar delante del avión
  );

  return randomPosition; // Devuelve la posición aleatoria sin normalizar
}

function isPositionOccupied(newPosition, targets) {
  return targets.some(target => {
    const distance = target.center.distanceTo(newPosition);
    return distance < 0.2; // Verificar si la nueva posición está ocupada (usando un valor fijo)
  });
}

function isInLandscapeBounds(position, bounds) {
  return (
    position.x >= bounds.minX &&
    position.x <= bounds.maxX &&
    position.y >= bounds.minY &&
    position.y <= bounds.maxY
  );
}

export function Targets({ collectedDucks, setCollectedDucks, isGameOver }) {
  const { scene: duckModel } = useGLTF("./public/assets/models/Duck.glb");
  const bounds = {
    minX: -0.5,
    maxX: 0.5,
    minY: 3,
    maxY: 3.5,
  };

  const [targets, setTargets] = useState([]);

  useEffect(() => {
    if (isGameOver) return; // No generar nuevos objetivos si el juego ha terminado

    // Generar un primer patito al inicio
    generateDucks();

    // Establecer un intervalo para generar patitos cada 13 segundos
    const interval = setInterval(() => {
      generateDucks();
    }, 2000); // Cada 1 segundos

    return () => clearInterval(interval); // Limpiar el intervalo cuando el componente se desmonte
  }, [isGameOver]);

  const generateDucks = () => {
    const newDucks = [];
    const zOffset = 4;
    while (newDucks.length < 1) { // Intentar generar 2 patitos cada vez
      const newPosition = randomPoint(bounds.minX, bounds.maxX, bounds.minY, bounds.maxY, zOffset);
      if (!isPositionOccupied(newPosition, targets) && isInLandscapeBounds(newPosition, bounds)) {
        newDucks.push({
          center: newPosition,
          direction: new Vector3(Math.random(), Math.random(), Math.random()).normalize(),
          hit: false,
          boundingBox: new Box3().setFromCenterAndSize(
            newPosition.clone().add(new Vector3(0, 0.08, 0)), // Mover el centro de la hitbox hacia arriba
            new Vector3(0.025, 0.025, 0.025) // Caja delimitadora ajustada al tamaño del patito
          )
        });
      }
    }
    setTargets(prevTargets => [...prevTargets, ...newDucks]);
  };

  useFrame(() => {
    if (isGameOver) return; // No actualizar si el juego ha terminado

    // Crear una caja delimitadora para el avión
    const planeBoundingBox = new Box3().setFromCenterAndSize(
      planePosition.clone(),
      new Vector3(0.17, 0.17, 0.17)
    );

    const updatedTargets = targets.map((target) => {
      if (!target.hit && planeBoundingBox.intersectsBox(target.boundingBox)) {
        target.hit = true;
        setCollectedDucks((prev) => prev + 1); // Aumenta los patitos recogidos
      }
      return target;
    });

    // Solo eliminamos los patitos que ya se han recogido
    setTargets(updatedTargets.filter((target) => !target.hit));
  });

  return (
    <>
      {/* Renderizar los patitos en el escenario */}
      {targets.map((target, index) => (
        <primitive
          key={index}
          object={duckModel.clone()}
          position={target.center}
          scale={new Vector3(0.025, 0.025, 0.025)} // Ajustar la escala para que sean visibles
        />
      ))}
    </>
  );
}
