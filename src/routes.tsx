import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import Personal from './pages/personal';
import VehiclePage from './pages/vehiculo';

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/personal" element={<Personal />} />
      <Route path="/vehiculo" element={<VehiclePage />} />
      {/* Add routes for other sections */}
    </Routes>
  </Router>
);

export default AppRoutes;
