import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/about" element={<div>About</div>} />
      <Route path="/contact" element={<div>Contact</div>} />
    </Routes>
  );
};

export default App;
