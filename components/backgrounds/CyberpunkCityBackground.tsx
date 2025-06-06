import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

interface BuildingProps {
  position: [number, number, number];
  size: [number, number, number]; // width, height, depth
  color: THREE.ColorRepresentation;
  emissiveColor?: THREE.ColorRepresentation;
  emissiveIntensity?: number;
}

const Building: React.FC<BuildingProps> = ({ position, size, color, emissiveColor, emissiveIntensity = 1 }) => {
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={color}
        metalness={0.8} // More metallic look
        roughness={0.3} // Slightly reflective
        emissive={emissiveColor}
        emissiveIntensity={emissiveColor ? emissiveIntensity : 0}
      />
    </mesh>
  );
};

const CyberpunkCityBackground: React.FC = () => {
  const buildings = useMemo(() => {
    const city: JSX.Element[] = [];
    const buildingCount = 50; // Number of buildings
    const cityRadius = 20; // How far out buildings can spawn
    const baseBuildingHeight = 5;
    const maxHeightVariance = 15;
    const buildingSizeMin = 0.5;
    const buildingSizeMax = 2.5;

    for (let i = 0; i < buildingCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * cityRadius;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      const width = THREE.MathUtils.randFloat(buildingSizeMin, buildingSizeMax);
      const depth = THREE.MathUtils.randFloat(buildingSizeMin, buildingSizeMax);
      const height = baseBuildingHeight + Math.random() * maxHeightVariance;

      const y = height / 2; // Position center of mesh at half height

      const color = new THREE.Color(0x101020).lerp(new THREE.Color(0x303050), Math.random()); // Dark blues/purples

      let emissiveColor;
      if (Math.random() < 0.2) { // 20% chance of having emissive windows/lights
        emissiveColor = Math.random() < 0.5 ? 0xff00ff : 0x00ffff; // Magenta or Cyan
      }

      city.push(
        <Building
          key={i}
          position={[x, y, z]}
          size={[width, height, depth]}
          color={color}
          emissiveColor={emissiveColor}
          emissiveIntensity={emissiveColor ? THREE.MathUtils.randFloat(0.5, 1.5) : 0}
        />
      );
    }
    return city;
  }, []);

  const groupRef = useRef<THREE.Group>(null!);
  useFrame((state, delta) => {
    // Optional: slowly rotate the city or move the camera
    if (groupRef.current) {
      // groupRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <Canvas style={{ position: 'fixed', top: 0, left: 0, zIndex: -1, background: '#050510' }} // Very dark blue
            camera={{ position: [0, 10, 25], fov: 60 }}> {/* Elevated and looking towards the city */}
      <ambientLight intensity={0.2} color={0x404080} /> {/* Dim blue ambient light */}
      <directionalLight position={[5, 10, 7.5]} intensity={0.4} color={0xffffff} />
      <pointLight position={[-10, 5, -10]} intensity={0.5} color={0xff00ff} distance={50} decay={1.5} /> {/* Magenta accent */}
      <pointLight position={[15, 7, 5]} intensity={0.4} color={0x00ffff} distance={40} decay={1.5} /> {/* Cyan accent */}

      <fog attach="fog" args={[0x050510, 10, 60]} /> {/* Fog for atmosphere */}

      <group ref={groupRef}>
        {buildings}
      </group>

      {/* Optional: Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
        <planeGeometry args={[cityRadius * 3, cityRadius * 3]} />
        <meshStandardMaterial color={0x080810} metalness={0.2} roughness={0.8} />
      </mesh>

      <EffectComposer disableNormalPass>
        <Bloom
          intensity={0.5} // Modest intensity, as there are many light sources
          luminanceThreshold={0.3} // Only brighter parts bloom
          luminanceSmoothing={0.1}
          mipmapBlur
          kernelSize={3} // Enum: KernelSize.HUGE etc. or number
        />
      </EffectComposer>
    </Canvas>
  );
};

export default CyberpunkCityBackground;
