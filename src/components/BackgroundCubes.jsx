import React from 'react';

const RubiksCubeSVG = ({ style }) => (
  <svg viewBox="0 0 64 64" width="80" height="80" style={{ position: 'absolute', opacity: 0.1, zIndex: -1, pointerEvents: 'none', ...style }} xmlns="http://www.w3.org/2000/svg">
    <g stroke="#333" strokeWidth="2">
      <rect x="2" y="2" width="18" height="18" fill="#ff5900" />
      <rect x="22" y="2" width="18" height="18" fill="#ffd500" />
      <rect x="42" y="2" width="18" height="18" fill="#ffffff" />
      
      <rect x="2" y="22" width="18" height="18" fill="#009e60" />
      <rect x="22" y="22" width="18" height="18" fill="#0051ba" />
      <rect x="42" y="22" width="18" height="18" fill="#c41e3a" />
      
      <rect x="2" y="42" width="18" height="18" fill="#ffffff" />
      <rect x="22" y="42" width="18" height="18" fill="#ff5900" />
      <rect x="42" y="42" width="18" height="18" fill="#009e60" />
    </g>
  </svg>
);

export default function BackgroundCubes() {
  const cubes = [
    { top: '10%', left: '5%', transform: 'rotate(15deg)' },
    { top: '25%', left: '85%', transform: 'rotate(-20deg) scale(1.2)' },
    { top: '60%', left: '10%', transform: 'rotate(45deg) scale(0.8)' },
    { top: '75%', left: '80%', transform: 'rotate(-10deg) scale(1.1)' },
    { top: '40%', left: '50%', transform: 'rotate(30deg) scale(0.9)' },
    { top: '90%', left: '30%', transform: 'rotate(-5deg)' },
  ];

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: -1, overflow: 'hidden' }}>
      {cubes.map((style, i) => (
        <RubiksCubeSVG key={i} style={style} />
      ))}
    </div>
  );
}
