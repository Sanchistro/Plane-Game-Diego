import React, { useRef, useState, useCallback } from "react";
import { PerspectiveCamera, Environment, Sphere } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { Gradient, LayerMaterial } from "lamina";
import { Landscape } from "./Landscape";
import { Targets } from "./Targets";
import { Airplane } from "./Airplane";
import { Bombs } from "./Bombs";
import { ScoreDisplay } from "./ScoreDisplay";
import { CollisionCard } from "./CollisionCard";
import { Pueblo } from "./Pueblo";
import { BottomRightComponent } from "./BottomRightComponent";

function App() {
  const landscapeObjects = useRef([]);
  const [collectedDucks, setCollectedDucks] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showCollisionCard, setShowCollisionCard] = useState(false);

  const handleCrash = useCallback(() => {
    setGameOver(true);
    setShowCollisionCard(true);
  }, []);

  return (
    <>
      <BottomRightComponent />
      <ScoreDisplay score={collectedDucks} />
      <Canvas>
        <Environment preset="sunset" />
        <Sphere scale={[100, 100, 1000]} rotation-y={Math.PI}>
          <LayerMaterial lighting="physical" transmission={1} side={THREE.BackSide}>
            <Gradient colorA="#357ca1" colorB="white" axes="y" start={0} end={-2} />
          </LayerMaterial>
        </Sphere>
        <PerspectiveCamera makeDefault position={[0, 10, 10]} />

        <Landscape landscapeObjects={landscapeObjects} />
        <Pueblo position={[0, 0, 0]} />
        <Airplane 
          landscapeObjects={landscapeObjects.current} 
          onCrash={handleCrash}
          isGameOver={gameOver}
        />
        <Targets 
          collectedDucks={collectedDucks} 
          setCollectedDucks={setCollectedDucks}
          isGameOver={gameOver}
        />
        <Bombs 
          onGameOver={handleCrash} 
          isGameOver={gameOver}
          collectedDucks={collectedDucks}
        />
      </Canvas>
      {showCollisionCard && <CollisionCard score={collectedDucks} />}
    </>
  );
}

export default App;
