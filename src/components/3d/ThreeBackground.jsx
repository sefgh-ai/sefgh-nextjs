'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, useState, useEffect } from 'react';
import ParticleField from './ParticleField';

export default function ThreeBackground() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 2, 15], fov: 75 }}
        dpr={[1, 2]}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance"
        }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <ParticleField />
        </Suspense>
      </Canvas>
      
      {/* Sci-fi gradient overlays and scan lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Glowing orbs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl animate-pulse" 
             style={{ animationDuration: '3s' }} />
        <div className="absolute bottom-1/3 right-1/4 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl animate-pulse" 
             style={{ animationDuration: '4s', animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-3xl animate-pulse" 
             style={{ animationDuration: '5s', animationDelay: '2s' }} />
        
        {/* Scan lines effect */}
        <div className="absolute inset-0 opacity-5" 
             style={{
               backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #00d9ff 2px, #00d9ff 4px)',
             }} />
        
        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-cyan-500/30" />
        <div className="absolute top-0 right-0 w-32 h-32 border-t-2 border-r-2 border-cyan-500/30" />
        <div className="absolute bottom-0 left-0 w-32 h-32 border-b-2 border-l-2 border-cyan-500/30" />
        <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-cyan-500/30" />
        
        {/* Animated data flow lines */}
        <svg className="absolute inset-0 w-full h-full opacity-20">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00d9ff" stopOpacity="0" />
              <stop offset="50%" stopColor="#00d9ff" stopOpacity="1" />
              <stop offset="100%" stopColor="#00d9ff" stopOpacity="0" />
            </linearGradient>
          </defs>
          <line x1="0" y1="20%" x2="100%" y2="20%" stroke="url(#lineGradient)" strokeWidth="2">
            <animate attributeName="x1" from="-100%" to="200%" dur="8s" repeatCount="indefinite" />
            <animate attributeName="x2" from="0%" to="300%" dur="8s" repeatCount="indefinite" />
          </line>
          <line x1="0" y1="60%" x2="100%" y2="60%" stroke="url(#lineGradient)" strokeWidth="2">
            <animate attributeName="x1" from="-100%" to="200%" dur="6s" repeatCount="indefinite" />
            <animate attributeName="x2" from="0%" to="300%" dur="6s" repeatCount="indefinite" />
          </line>
          <line x1="0" y1="80%" x2="100%" y2="80%" stroke="url(#lineGradient)" strokeWidth="2">
            <animate attributeName="x1" from="-100%" to="200%" dur="10s" repeatCount="indefinite" />
            <animate attributeName="x2" from="0%" to="300%" dur="10s" repeatCount="indefinite" />
          </line>
        </svg>
      </div>
    </div>
  );
}
