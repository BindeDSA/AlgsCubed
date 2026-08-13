import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

function Navbar() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="brand" onClick={closeMenu}>
          <img src={`${import.meta.env.BASE_URL}Logo.svg`} alt="Algs Cubed Logo" className="brand-icon" style={{ height: '56px', width: 'auto', margin: '-1rem 0' }} />
          Algs Cubed
        </Link>
        <div className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <span className={`bar ${isMenuOpen ? 'open' : ''}`}></span>
          <span className={`bar ${isMenuOpen ? 'open' : ''}`}></span>
          <span className={`bar ${isMenuOpen ? 'open' : ''}`}></span>
        </div>
        <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
          <Link to="/" className={`nav-link ${isActive('/')}`} onClick={closeMenu}>Home</Link>
          <Link to="/services" className={`nav-link ${isActive('/services')}`} onClick={closeMenu}>Workshops</Link>
          <Link to="/portal" className={`nav-link ${isActive('/portal')}`} onClick={closeMenu}>Portal</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
