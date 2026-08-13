import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Shop from './pages/Shop';
import Login from './pages/Login';
import SimulationsPortal from './pages/SimulationsPortal';
import ProtectedRoute from './components/ProtectedRoute';
import BackgroundCubes from './components/BackgroundCubes';
import Services from './pages/Services';

function App() {
  return (
    <Router>
      <BackgroundCubes />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/services" element={<Services />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/login" element={<Login />} />
          <Route path="/portal" element={
            <ProtectedRoute>
              <SimulationsPortal />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
