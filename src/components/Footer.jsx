import { Mail, MessageCircle, Share2 } from 'lucide-react';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div>
            <h3>Algs Cubed</h3>
            <p>Master the cube, one algorithm at a time.</p>
          </div>
          <div className="social-links">
            <a href="#" className="social-icon"><MessageCircle size={24} /></a>
            <a href="#" className="social-icon"><Share2 size={24} /></a>
            <a href="#" className="social-icon"><Mail size={24} /></a>
          </div>
        </div>
        <div style={{ marginTop: '2rem', textAlign: 'center', opacity: 0.5, fontSize: '0.875rem' }}>
          &copy; {new Date().getFullYear()} Algs Cubed. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
