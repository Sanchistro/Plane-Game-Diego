import React from 'react';
import { useGLTF } from '@react-three/drei';

export function Landscape({ landscapeObjects, ...props }) {
  const { nodes, materials } = useGLTF('public/assets/models/officeDoers.glb');
  return (
    <group scale={5} {...props} dispose={null}>
      <mesh
        ref={(el) => landscapeObjects.current.push(el)} 
        geometry={nodes.suelo.geometry} 
        material={nodes.suelo.material} 
        position={[1.5, -0.01, 0]} 
        scale={[1, 1, 10]} 
      />
    </group>
  );
}

useGLTF.preload('public/assets/models/officeDoers.glb');
