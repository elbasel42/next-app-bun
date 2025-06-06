"use client"; // Required for components that use client-side hooks and R3F components

import React from 'react';
import NeonGridBackground from '../../../components/backgrounds/NeonGridBackground'; // Adjust path based on your project structure

const NeonGridPage: React.FC = () => {
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <NeonGridBackground
        // Optional: You can customize props here if needed
        // gridSize={120}
        // gridDivisions={120}
        // gridColor={0x00ffff} // Cyan
        // glowColor={0x00ffff}
      />
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        color: 'white', // Ensure text is visible against the potentially dark background
        textAlign: 'center',
        zIndex: 1, // Ensure content is above the background canvas
      }}>
        <h1>Neon Grid Background Page</h1>
        <p>A glowing neon grid should be visible in the background.</p>
        <p>Try customizing props in NeonGridBackground for different effects!</p>
      </div>
    </div>
  );
};

export default NeonGridPage;
