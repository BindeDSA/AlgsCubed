import { useNavigate } from 'react-router-dom';
import { LogOut, Play, Edit3, Share2 } from 'lucide-react';

function SimulationsPortal() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('auth');
    navigate('/login');
  };

  return (
    <div className="container" style={{ padding: '4rem 2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem' }}>Simulations Portal</h1>
        <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.5rem 1rem', borderColor: 'var(--crimson-red)', color: 'var(--crimson-red)' }}>
          <LogOut size={18} /> Logout
        </button>
      </div>
      
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', minHeight: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--cyber-blue)' }}>
        <h2 style={{ color: 'var(--cyber-blue)', marginBottom: '1rem' }}>3D Viewer Space</h2>
        <p style={{ color: 'var(--text-color)', textAlign: 'center', maxWidth: '500px' }}>
          This area will host the interactive 3D Rubik's Cube simulator where you can record and playback algorithms with visual annotations.
        </p>
        <div style={{ marginTop: '2rem', width: '150px', height: '150px', border: '2px dashed var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px' }}>
          [ 3D Canvas ]
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
        <button className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', border: 'none', color: 'var(--pure-white)', textAlign: 'left' }}>
          <div style={{ color: 'var(--neon-green)' }}><Play size={24} /></div>
          <div>
            <h4 style={{ margin: 0 }}>Play Sequence</h4>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-color)' }}>Load an algorithm</span>
          </div>
        </button>
        <button className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', border: 'none', color: 'var(--pure-white)', textAlign: 'left' }}>
          <div style={{ color: 'var(--bright-orange)' }}><Edit3 size={24} /></div>
          <div>
            <h4 style={{ margin: 0 }}>Edit Moves</h4>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-color)' }}>Create new sequence</span>
          </div>
        </button>
        <button className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', border: 'none', color: 'var(--pure-white)', textAlign: 'left' }}>
          <div style={{ color: 'var(--cyber-blue)' }}><Share2 size={24} /></div>
          <div>
            <h4 style={{ margin: 0 }}>Share Link</h4>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-color)' }}>Generate student URL</span>
          </div>
        </button>
      </div>
    </div>
  );
}

export default SimulationsPortal;
