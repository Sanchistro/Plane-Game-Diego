import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Matrix4, Quaternion, Vector3, Box3 } from 'three';
import { updatePlaneAxis, useControls } from './controls'; // Import the hook and function here

const x = new Vector3(1, 0, 0);
const y = new Vector3(0, 1, 0);
const z = new Vector3(0, 0, 1);
export const planePosition = new Vector3(0, 3.3, 0);

const delayedRotMatrix = new Matrix4();
const delayedQuaternion = new Quaternion();
export const resetPlanePosition = () => {
  planePosition.set(0, 3.3, 0);
};

export function Airplane({ landscapeObjects, onCrash, collectedDucks, isGameOver, ...props }) {
  const { nodes, materials } = useGLTF('assets/models/Nave.glb');
  const groupRef = useRef();
  const controls = useControls(); // Use the hook here

  // Function to detect collision with landscape objects
  const detectCollision = (landscapeObjects, planePos) => {
    const planeBoundingBox = new Box3().setFromCenterAndSize(
      planePos,
      new Vector3(0.2, 0.2, 0.2)
    );

    if (!landscapeObjects || landscapeObjects.length === 0) {
      return false;
    }

    for (const obj of landscapeObjects) {
      if (obj) { // Ensure object is not null
        const boundingBox = new Box3().setFromObject(obj);
        if (boundingBox.intersectsBox(planeBoundingBox)) {
          return true; 
        }
      }
    }
    return false;
  };

  useFrame(({ camera }) => {
    if (isGameOver) return; // Stop updating if the game is over

    // Update the plane axis using the controls
    updatePlaneAxis(x, y, z, planePosition, camera, controls);

    const rotMatrix = new Matrix4().makeBasis(x, y, z);
    const matrix = new Matrix4()
      .multiply(new Matrix4().makeTranslation(planePosition.x, planePosition.y, planePosition.z))
      .multiply(rotMatrix);

    groupRef.current.matrixAutoUpdate = false;
    groupRef.current.matrix.copy(matrix);
    groupRef.current.matrixWorldNeedsUpdate = true;

    // Check for collisions
    if (detectCollision(landscapeObjects, planePosition)) {
      onCrash();
    }

    // Camera interpolation logic
    const quaternionA = new Quaternion().copy(delayedQuaternion);
    const quaternionB = new Quaternion();
    quaternionB.setFromRotationMatrix(rotMatrix);

    const interpolationFactor = 0.175;
    const interpolatedQuaternion = new Quaternion().copy(quaternionA);
    interpolatedQuaternion.slerp(quaternionB, interpolationFactor);
    delayedQuaternion.copy(interpolatedQuaternion);

    delayedRotMatrix.identity();
    delayedRotMatrix.makeRotationFromQuaternion(delayedQuaternion);

    const cameraMatrix = new Matrix4()
      .multiply(new Matrix4().makeTranslation(planePosition.x, planePosition.y, planePosition.z))
      .multiply(delayedRotMatrix)
      .multiply(new Matrix4().makeRotationX(-0.2))
      .multiply(new Matrix4().makeTranslation(0, 0.015, 0.3));

    camera.matrixAutoUpdate = false;
    camera.matrix.copy(cameraMatrix);
    camera.matrixWorldNeedsUpdate = true;
  });

  return (
    <group ref={groupRef}>
      <group {...props} scale={0.0002} rotation-y={Math.PI} dispose={null}>
        <mesh geometry={nodes?.Node?.geometry} material={materials?.MAIN} /> {/* Ensure nodes and materials are loaded */}
      </group>
    </group>
  );
}

useGLTF.preload('assets/models/Nave.glb');
