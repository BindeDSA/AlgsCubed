import { ArrowRight, Box } from 'lucide-react';
import { Link } from 'react-router-dom';

function Landing() {
  return (
    <div className="landing">
      <section className="hero container" style={{ padding: '6rem 2rem', textAlign: 'center' }}>
        <div style={{ width: '100%', marginBottom: '2rem', borderRadius: '16px', overflow: 'hidden', boxShadow: 'var(--glass-shadow)' }}><video src="/Example Solve.mp4" autoPlay muted loop playsInline style={{ width: '100%', display: 'block' }}></video></div>
        <h1 style={{ fontSize: '4rem', marginBottom: '1.5rem', background: 'linear-gradient(to right, var(--cyber-blue), var(--neon-green))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Master The Cube
        </h1>
        <p style={{ fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto 2rem auto', color: 'var(--text-color)' }}>
          Welcome to Algorithms Cubed. We host in person workshops on Rubik's Cubes, teaching the beginners method and helping cubers improve their times and understanding. We also sell cubes set up by professional Rubik's Cube solvers.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link to="/shop" className="btn btn-primary">
            Visit Shop <ArrowRight size={20} />
          </Link>
          <a href="#services" className="btn btn-outline">
            Our Workshops
          </a>
        </div>
      </section>

      <section id="services" className="container" style={{ padding: '4rem 2rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '2.5rem' }}>What We Do</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <div className="glass-panel" style={{ padding: '2rem', borderTop: '4px solid var(--neon-green)' }}>
            <h3 style={{ color: 'var(--pure-white)' }}>Beginner Workshops</h3>
            <p style={{ color: 'var(--text-color)', marginTop: '1rem' }}>Learn the layer-by-layer method. Perfect for absolute beginners who want to solve their first cube.</p>
          </div>
          <div className="glass-panel" style={{ padding: '2rem', borderTop: '4px solid var(--bright-orange)' }}>
            <h3 style={{ color: 'var(--pure-white)' }}>Advanced Speedcubing</h3>
            <p style={{ color: 'var(--text-color)', marginTop: '1rem' }}>Master the CFOP method to drop your times under 20 seconds. F2L, OLL, and PLL mastery.</p>
          </div>
          <div className="glass-panel" style={{ padding: '2rem', borderTop: '4px solid var(--crimson-red)' }}>
            <h3 style={{ color: 'var(--pure-white)' }}>Private Coaching</h3>
            <p style={{ color: 'var(--text-color)', marginTop: '1rem' }}>1-on-1 sessions tailored to your specific weaknesses, including look-ahead and finger tricks.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Landing;
