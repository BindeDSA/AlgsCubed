import { Link, useLocation } from 'react-router-dom';
import { Box } from 'lucide-react';

function Navbar() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="brand">
          <Box className="brand-icon" size={28} />
          Algorithms Cubed
        </Link>
        <div className="nav-links">
          <Link to="/" className={`nav-link ${isActive('/')}`}>Home</Link>
          <Link to="/shop" className={`nav-link ${isActive('/shop')}`}>Shop</Link>
          <Link to="/portal" className={`nav-link ${isActive('/portal')}`}>Portal</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
