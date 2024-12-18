import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import Personal from './pages/forms-pages/personal';
import PersonalListPage from './pages/list-pages/personal-list';
import VehiclePage from './pages/forms-pages/vehiculo';
import TrabajoPage from './pages/forms-pages/trabajo';
import WorkListPage from './pages/list-pages/trabajo-list';
import VehiclesListPage from './pages/list-pages/vehiculo-list';
import LocationListPage from './pages/list-pages/location-list';
import LocationPage from './pages/forms-pages/location';
import HousingListPage from './pages/list-pages/housing-list';
import HousingPage from './pages/forms-pages/housing';
import CompanyListPage from './pages/list-pages/company-list';
import CompanyPage from './pages/forms-pages/company';

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/personal-forms" element={<Personal />} />
      <Route path="/personal-list" element={<PersonalListPage />} />
      <Route path="/work-forms" element={<TrabajoPage />} />
      <Route path="/work-list" element={<WorkListPage />} />
      <Route path="/vehiculo-forms" element={<VehiclePage />} />
      <Route path="/vehiculo-list" element={<VehiclesListPage />} />
      <Route path="/location-forms" element={<LocationPage />} />
      <Route path="/location-list" element={<LocationListPage />} />
      <Route path="/housing-forms" element={<HousingPage />} />
      <Route path="/company-forms" element={<CompanyPage />} />
      <Route path="/company-list" element={<CompanyListPage />} />
      <Route path="/housing-list" element={<HousingListPage />} />
      {/* Add routes for other sections */}
    </Routes>
  </Router>
);

export default AppRoutes;
