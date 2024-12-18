import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Personal from './pages/forms-pages/personal';
import PersonalListPage from './pages/list-pages/personal-list';
import VehiclePage from './pages/forms-pages/vehiculo';
import TrabajoPage from './pages/forms-pages/trabajo';
import WorkListPage from './pages/list-pages/trabajo-list';
import VehiclesListPage from './pages/list-pages/vehiculo-list';
import LocationListPage from './pages/list-pages/location-list';
import LocationPage from './pages/forms-pages/location';
import TicketPage from './pages/forms-pages/ticket'
import TicketListPage from './pages/list-pages/ticket-list'
import FamilyPage from './pages/forms-pages/family'
import FamilyListPage from './pages/list-pages/family-list'
import WorkApplyPage from './pages/forms-pages/work-apply';
import DepartamentoListPage from './pages/list-pages/departamento';
import DepartamentoPage from './pages/forms-pages/departamento';
import AppNueva from './AppNueva';

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/" element={<AppNueva />} />
      <Route path="/personal-forms" element={<Personal />} />
      <Route path="/personal-list" element={<PersonalListPage />} />
      <Route path="/work-forms" element={<TrabajoPage />} />
      <Route path="/work-list" element={<WorkListPage />} />
      <Route path="/work-apply" element={<WorkApplyPage />} />
      <Route path="/vehiculo-forms" element={<VehiclePage />} />
      <Route path="/vehiculo-list" element={<VehiclesListPage />} />
      <Route path="/location-forms" element={<LocationPage />} />
      <Route path="/location-list" element={<LocationListPage />} />
      <Route path="/departamento-forms" element={<DepartamentoPage />} />
      <Route path="/departamento-list" element={<DepartamentoListPage />} />
      {/* Add routes for other sections */}
      <Route path="/ticket-forms" element={<TicketPage />} />
      <Route path="/ticket-list" element={<TicketListPage />} />
      <Route path="/family-forms" element={<FamilyPage />} />
      <Route path="/family-list" element={<FamilyListPage />} />
    </Routes>
  </Router>
);

export default AppRoutes;
