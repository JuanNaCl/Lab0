import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import Personal from './pages/forms-pages/personal';
import PersonalListPage from './pages/list-pages/personal-list';
import VehiclePage from './pages/forms-pages/vehiculo';
import TrabajoPage from './pages/forms-pages/trabajo';
import WorkListPage from './pages/list-pages/trabajo-list';

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/personal-forms" element={<Personal />} />
      <Route path="/personal-list" element={<PersonalListPage />} />
      <Route path="/work-forms" element={<TrabajoPage />} />
      <Route path="/work-list" element={<WorkListPage />} />
      <Route path="/vehiculo-forms" element={<VehiclePage />} />
      {/* Add routes for other sections */}
    </Routes>
  </Router>
);

export default AppRoutes;
