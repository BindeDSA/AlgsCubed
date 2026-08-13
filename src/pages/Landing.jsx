import { ArrowRight, Box } from 'lucide-react';
import { Link } from 'react-router-dom';
import VideoCarousel from '../components/VideoCarousel';

function Landing() {
  return (
    <div className="landing">
      <section className="hero container" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '4rem', marginBottom: '1.5rem', background: 'linear-gradient(to right, var(--cyber-blue), var(--neon-green))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Master The Cube
        </h1>
        <p style={{ fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto 2rem auto', color: 'var(--text-color)' }}>
          Welcome to Algs Cubed. We host in person workshops on Rubik's Cubes, teaching the beginners method and helping cubers improve their times and understanding. We also sell cubes set up by professional Rubik's Cube solvers.
        </p>
        <VideoCarousel />
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          {/* 
          <Link to="/shop" className="btn btn-primary">
            Visit Shop <ArrowRight size={20} />
          </Link>
          */}
          <Link to="/services" className="btn btn-outline">
            Our Workshops
          </Link>
        </div>
      </section>

      <section id="services" className="container" style={{ padding: '4rem 2rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '2.5rem' }}>What We Do</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem', textAlign: 'center' }}>
          <div className="glass-panel" style={{ padding: '2rem', borderTop: '4px solid var(--neon-green)', flex: '1 1 300px', maxWidth: '400px' }}>
            <h3>Beginner Workshops</h3>
            <p style={{ color: 'var(--text-color)', marginTop: '1rem' }}>Learn the layer-by-layer method. Perfect for absolute beginners who want to solve their first cube.</p>
          </div>
          <div className="glass-panel" style={{ padding: '2rem', borderTop: '4px solid var(--bright-orange)', flex: '1 1 300px', maxWidth: '400px' }}>
            <h3>Advanced Speedcubing</h3>
            <p style={{ color: 'var(--text-color)', marginTop: '1rem' }}>Master the CFOP method to drop your times under 20 seconds. F2L, OLL, and PLL mastery.</p>
          </div>
          <div className="glass-panel" style={{ padding: '2rem', borderTop: '4px solid var(--cyber-blue)', flex: '1 1 300px', maxWidth: '400px' }}>
            <h3>Beyond CFOP</h3>
            <p style={{ color: 'var(--text-color)', marginTop: '1rem' }}>Push your limits by learning advanced methods like Roux and ZZ, plus advanced algorithmic sets like ZBLL to reach world-class speeds.</p>
          </div>
          <div className="glass-panel" style={{ padding: '2rem', borderTop: '4px solid var(--crimson-red)', flex: '1 1 300px', maxWidth: '400px' }}>
            <h3>Private Coaching</h3>
            <p style={{ color: 'var(--text-color)', marginTop: '1rem' }}>1-on-1 sessions tailored to your specific weaknesses, including look-ahead and finger tricks.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Landing;
