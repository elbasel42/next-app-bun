"use client"; // Required for components that use client-side hooks and R3F components

import React from 'react';
import CyberpunkCityBackground from '../../../components/backgrounds/CyberpunkCityBackground'; // Adjust path as needed

const CyberpunkCityPage: React.FC = () => {
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <CyberpunkCityBackground />
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        color: 'white', // Ensure text is visible
        textAlign: 'center',
        zIndex: 1, // Ensure content is above the background canvas
        padding: '20px',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent backdrop for text
        borderRadius: '8px',
      }}>
        <h1>Cyberpunk City Background</h1>
        <p>A sprawling futuristic cityscape should be visible in the background.</p>
        <p>Look for the glowing lights and atmospheric fog!</p>
      </div>
    </div>
  );
};

export default CyberpunkCityPage;
