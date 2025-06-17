import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import UploadPage from './pages/UploadPage';
import ResultsPage from './pages/ResultsPage';
import OptimizePage from './pages/OptimizePage';

const App = () => (
  <Router>
    <div style={{ fontFamily: 'Segoe UI, sans-serif' }}>
      <Navigation />
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/results/:jobId?" element={<ResultsPage />} />
          <Route path="/optimize" element={<OptimizePage />} />
        </Routes>
      </div>
    </div>
  </Router>
);

const Navigation = () => {
  const { pathname } = useLocation();
  const navItems = [
    { path: '/', label: '🏠 Dashboard' },
    { path: '/upload', label: '📤 Upload' },
    { path: '/results', label: '📈 Results' },
    { path: '/optimize', label: '🛠 Optimize' },
  ];

  return (
    <nav style={{
      padding: '16px 32px',
      backgroundColor: '#f9f9f9',
      borderBottom: '1px solid #ddd',
      marginBottom: 32,
      display: 'flex',
      gap: 24
    }}>
      {navItems.map(({ path, label }) => (
        <Link
          key={path}
          to={path}
          style={{
            textDecoration: 'none',
            fontWeight: pathname === path ? 'bold' : 'normal',
            color: pathname === path ? '#007bff' : '#333',
            borderBottom: pathname === path ? '2px solid #007bff' : 'none',
            paddingBottom: 4
          }}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
};

export default App;
