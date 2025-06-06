"use client"; // Required for components that use client-side hooks like useRef, useEffect, useFrame

import React from 'react';
import MatrixBackground from '../../../components/backgrounds/MatrixBackground'; // Adjust path as needed

const MatrixPage: React.FC = () => {
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <MatrixBackground />
      {/* You can add other page content here if needed, it will render on top of the background */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        color: 'white',
        textAlign: 'center',
        zIndex: 1, // Ensure it's above the background canvas
      }}>
        <h1>Matrix Background Page</h1>
        <p>The digital rain effect should be running in the background.</p>
      </div>
    </div>
  );
};

export default MatrixPage;
