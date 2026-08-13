import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const videos = [
  'Example Solve.mp4',
  'Example Solve 1.mp4',
  'Example Solve 2.mp4',
  'Example solve 3.mp4'
];

export default function VideoCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => setCurrentIndex((i) => (i + 1) % videos.length);
  const prev = () => setCurrentIndex((i) => (i - 1 + videos.length) % videos.length);

  return (
    <div style={{ position: 'relative', width: '80%', margin: '0 auto 2rem auto', borderRadius: '16px', overflow: 'hidden', boxShadow: 'var(--glass-shadow)', aspectRatio: '16/9', background: '#000' }}>
      <video 
        key={videos[currentIndex]} 
        src={`${import.meta.env.BASE_URL}${videos[currentIndex]}`} 
        autoPlay 
        muted 
        loop 
        playsInline 
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
      />
      
      <button onClick={prev} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', padding: '0.5rem', cursor: 'pointer', color: 'white', backdropFilter: 'blur(4px)', transition: 'background 0.3s' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.4)'} onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}>
        <ChevronLeft size={24} />
      </button>
      
      <button onClick={next} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', padding: '0.5rem', cursor: 'pointer', color: 'white', backdropFilter: 'blur(4px)', transition: 'background 0.3s' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.4)'} onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}>
        <ChevronRight size={24} />
      </button>

      <div style={{ position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '0.5rem' }}>
        {videos.map((_, idx) => (
          <div key={idx} style={{ width: '8px', height: '8px', borderRadius: '50%', background: idx === currentIndex ? 'white' : 'rgba(255,255,255,0.5)', transition: 'background 0.3s' }} />
        ))}
      </div>
    </div>
  );
}
