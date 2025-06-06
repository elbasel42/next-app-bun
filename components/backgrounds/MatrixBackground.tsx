import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const FONT_SIZE = 0.2;
const COLUMN_WIDTH = 0.3;
const ROW_HEIGHT = 0.3;
const RAIN_SPEED = 0.1;

interface FallingCharProps {
  initialPosition: [number, number, number];
  text: string;
}

const FallingChar: React.FC<FallingCharProps> = ({ initialPosition, text }) => {
  const textRef = useRef<THREE.Object3D>(null!); // Changed to Object3D as Text is not a mesh directly
  const [x, y, z] = initialPosition;
  const internalY = useRef(y); // Use a ref to manage Y position internally for reset

  useFrame((state, delta) => {
    if (textRef.current) {
      internalY.current -= RAIN_SPEED * (1 + Math.random() * 0.5);
      if (internalY.current < -10) { // Reset position when it goes off screen
        internalY.current = 10;
      }
      textRef.current.position.y = internalY.current;
    }
  });

  return (
    <Text
      ref={textRef}
      position={[x, y, z]}
      fontSize={FONT_SIZE}
      color="#00ff00"
      anchorX="center"
      anchorY="middle"
      material-transparent={true}
      material-opacity={0.7}
    >
      {text}
    </Text>
  );
};

interface RainColumnProps {
  positionX: number;
  charsCount?: number;
}

const RainColumn: React.FC<RainColumnProps> = ({ positionX, charsCount = 30 }) => {
  const chars = useMemo(() => {
    const arr = [];
    for (let i = 0; i < charsCount; i++) {
      const randomChar = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
      // Stagger initial Y positions
      const initialY = 10 + i * ROW_HEIGHT + Math.random() * 5;
      arr.push({ char: randomChar, initialY });
    }
    return arr;
  }, [charsCount]);

  return (
    <group position={[positionX, 0, 0]}>
      {chars.map((charData, index) => (
        <FallingChar
          key={index}
          initialPosition={[0, charData.initialY, 0]}
          text={charData.char}
        />
      ))}
    </group>
  );
};


const MatrixBackground: React.FC = () => {
  const columns = useMemo(() => {
    // Ensure window is defined (only run on client-side for this calculation)
    if (typeof window === 'undefined') return [];
    const numColumns = Math.floor(window.innerWidth / (COLUMN_WIDTH * 50)); // Approximate calculation
    const arr = [];
    for (let i = 0; i < numColumns; i++) {
      // Distribute columns across the view
      arr.push({ x: (i - numColumns / 2) * COLUMN_WIDTH });
    }
    return arr;
  }, []);

  // Handle case where columns might be empty (e.g. during SSR)
  if (!columns || columns.length === 0) {
    return null; // Or a placeholder/loading state
  }

  return (
    <Canvas style={{ position: 'fixed', top: 0, left: 0, zIndex: -1, background: '#000000' }}
            camera={{ position: [0, 0, 5], fov: 75 }}> {/* Adjusted fov for better text visibility */}
      {/* No need for ambient or point light if Text material is emissive or basic */}
      {columns.map((col, index) => (
        <RainColumn key={index} positionX={col.x} />
      ))}
    </Canvas>
  );
};

export default MatrixBackground;
