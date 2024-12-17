import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import Personal from './pages/forms-pages/personal';
import PersonalListPage from './pages/list-pages/personal-list';
import VehiclePage from './pages/forms-pages/vehiculo';
import VehiclesListPage from './pages/list-pages/vehiculo-list';
import LocationListPage from './pages/list-pages/location-list';
import LocationPage from './pages/forms-pages/location';

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/personal-forms" element={<Personal />} />
      <Route path="/personal-list" element={<PersonalListPage />} />
      <Route path="/vehiculo-forms" element={<VehiclePage />} />
      <Route path="/vehiculo-list" element={<VehiclesListPage />} />
      <Route path="/location-forms" element={<LocationPage />} />
      <Route path="/location-list" element={<LocationListPage />} />
      {/* Add routes for other sections */}
    </Routes>
  </Router>
);

export default AppRoutes;
