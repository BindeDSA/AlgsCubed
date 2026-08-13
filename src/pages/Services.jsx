import React from 'react';
import { Users, Lightbulb, Trophy } from 'lucide-react';

function Services() {
  return (
    <div className="services-page" style={{ paddingTop: '100px' }}>
      <section className="container" style={{ padding: '4rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', background: 'linear-gradient(to right, var(--cyber-blue), var(--neon-green))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Our Workshops
          </h1>
          <p style={{ fontSize: '1.25rem', maxWidth: '800px', margin: '0 auto', color: 'var(--text-color)' }}>
            We believe that learning to solve the Rubik's Cube is a journey best shared. Our workshops are designed to bring people together, teaching groups how to conquer the cube step-by-step while sharing in the joy of solving.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', textAlign: 'center' }}>
          <div className="glass-panel" style={{ padding: '3rem 2rem', borderTop: '4px solid var(--neon-green)' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <Users size={48} color="var(--neon-green)" />
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Group Learning</h3>
            <p style={{ color: 'var(--text-color)' }}>
              Learn alongside others in a fun, collaborative environment. Overcoming challenges together makes the final solve that much more rewarding.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '3rem 2rem', borderTop: '4px solid var(--cyber-blue)' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <Lightbulb size={48} color="var(--cyber-blue)" />
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Step-by-Step Method</h3>
            <p style={{ color: 'var(--text-color)' }}>
              We break down the seemingly impossible into simple, memorable algorithms. No prior experience or mathematical genius is required!
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '3rem 2rem', borderTop: '4px solid var(--sun-yellow)' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <Trophy size={48} color="var(--sun-yellow)" />
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>The Joy of Solving</h3>
            <p style={{ color: 'var(--text-color)' }}>
              Experience the incredible satisfaction of clicking that final piece into place. It's a skill you'll carry with you for the rest of your life.
            </p>
          </div>
        </div>
      </section>

      <section style={{ background: 'var(--bg-color-light)', padding: '4rem 2rem', marginTop: '4rem' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Ready to host a workshop?</h2>
          <p style={{ fontSize: '1.125rem', maxWidth: '600px', margin: '0 auto 2rem auto', color: 'var(--text-color)' }}>
            Whether it's for a school, corporate team-building event, or just a group of friends, we bring the cubes and the expertise.
          </p>
          <a href="mailto:contact@algscubed.com" className="btn btn-primary">
            Contact Us to Book
          </a>
        </div>
      </section>
    </div>
  );
}

export default Services;
