import React, { useMemo } from 'react';

const COLORS = ['#ff5900', '#ffd500', '#ffffff', '#009e60', '#0051ba', '#c41e3a'];

const getRandomColors = () => {
  return Array.from({ length: 9 }, () => COLORS[Math.floor(Math.random() * COLORS.length)]);
};

const RubiksCubeSVG = ({ style, colors }) => (
  <svg viewBox="0 0 64 64" width="80" height="80" style={{ position: 'absolute', opacity: 0.1, zIndex: -1, pointerEvents: 'none', ...style }} xmlns="http://www.w3.org/2000/svg">
    <g stroke="#333" strokeWidth="2">
      <rect x="2" y="2" width="18" height="18" fill={colors[0]} />
      <rect x="22" y="2" width="18" height="18" fill={colors[1]} />
      <rect x="42" y="2" width="18" height="18" fill={colors[2]} />
      
      <rect x="2" y="22" width="18" height="18" fill={colors[3]} />
      <rect x="22" y="22" width="18" height="18" fill={colors[4]} />
      <rect x="42" y="22" width="18" height="18" fill={colors[5]} />
      
      <rect x="2" y="42" width="18" height="18" fill={colors[6]} />
      <rect x="22" y="42" width="18" height="18" fill={colors[7]} />
      <rect x="42" y="42" width="18" height="18" fill={colors[8]} />
    </g>
  </svg>
);

export default function BackgroundCubes() {
  const cubes = useMemo(() => [
    { top: '10%', left: '5%', transform: 'rotate(15deg)', colors: getRandomColors() },
    { top: '25%', left: '85%', transform: 'rotate(-20deg) scale(1.2)', colors: getRandomColors() },
    { top: '60%', left: '10%', transform: 'rotate(45deg) scale(0.8)', colors: getRandomColors() },
    { top: '75%', left: '80%', transform: 'rotate(-10deg) scale(1.1)', colors: getRandomColors() },
    { top: '40%', left: '50%', transform: 'rotate(30deg) scale(0.9)', colors: getRandomColors() },
    { top: '90%', left: '30%', transform: 'rotate(-5deg)', colors: getRandomColors() },
  ], []);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: -1, overflow: 'hidden' }}>
      {cubes.map((cube, i) => (
        <RubiksCubeSVG key={i} style={{ top: cube.top, left: cube.left, transform: cube.transform }} colors={cube.colors} />
      ))}
    </div>
  );
}
