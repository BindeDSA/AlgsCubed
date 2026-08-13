import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';

function Login() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Hardcoded password for MVP
    if (password === 'rubik123') {
      localStorage.setItem('auth', 'true');
      navigate('/portal');
    } else {
      setError('Invalid password');
    }
  };

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <div className="glass-panel" style={{ padding: '3rem', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <div style={{ color: 'var(--cyber-blue)', marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
          <Lock size={48} />
        </div>
        <h2 style={{ marginBottom: '2rem' }}>Portal Access</h2>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input 
            type="password" 
            placeholder="Enter Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ 
              padding: '0.75rem', 
              borderRadius: '8px', 
              border: '1px solid var(--glass-border)',
              background: 'transparent',
              color: 'var(--text-light)',
              outline: 'none'
            }} 
          />
          {error && <div style={{ color: 'var(--crimson-red)', fontSize: '0.875rem' }}>{error}</div>}
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Login</button>
        </form>
        <p style={{ marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-color)' }}>
          Hint: try 'rubik123'
        </p>
      </div>
    </div>
  );
}

export default Login;
