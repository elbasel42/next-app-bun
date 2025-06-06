import React, { useMemo, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

interface NeonGridBackgroundProps {
  gridSize?: number;
  gridDivisions?: number;
  gridColor?: THREE.ColorRepresentation;
  glowColor?: THREE.ColorRepresentation;
  cameraPosition?: [number, number, number];
}

const NeonGridBackground: React.FC<NeonGridBackgroundProps> = ({
  gridSize = 100,
  gridDivisions = 100,
  gridColor = 0x00ff00, // Bright green for neon effect
  glowColor = 0x00ff00, // Can be the same or a slightly different hue for more effect
  cameraPosition = [0, 5, 10], // Positioned to look down onto the grid
}) => {
  const grid = useMemo(() => {
    // Create the GridHelper. The colors provided here are the base colors for the lines.
    const helper = new THREE.GridHelper(gridSize, gridDivisions, gridColor, gridColor);

    // To make the lines bloom, their material needs to be bright and ideally not tone-mapped
    // if global tone mapping might reduce their perceived brightness for the bloom pass.
    helper.traverse((child) => {
      if (child instanceof THREE.LineSegments) {
        const material = child.material as THREE.LineBasicMaterial;
        material.color.set(glowColor); // Ensure the line color itself is the bright "glow" color
        material.toneMapped = false; // Crucial for bloom to pick up the raw brightness
        // Opacity can be used if a more subtle grid is desired, but full opacity is fine for bloom.
        // material.transparent = true;
        // material.opacity = 0.8;
      }
    });
    return helper;
  }, [gridSize, gridDivisions, gridColor, glowColor]);


  return (
    <Canvas style={{ position: 'fixed', top: 0, left: 0, zIndex: -1, background: '#000010' }}
            camera={{ position: cameraPosition, fov: 75 }}>
      <primitive object={grid} />
      <EffectComposer disableNormalPass>
        <Bloom
          intensity={1.5} // Increased intensity for a more pronounced glow
          luminanceThreshold={0.1} // Lower threshold to make sure grid lines are picked up
          luminanceSmoothing={0.075} // Adjust smoothing
          mipmapBlur // Better quality blur
          kernelSize={3} // Adjust kernel size for bloom spread if needed (using an enum or number from postprocessing)
        />
      </EffectComposer>
    </Canvas>
  );
};

export default NeonGridBackground;
