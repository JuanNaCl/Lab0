import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UserCircle2, Car, FileWarning, Home, 
  MapPin, Briefcase, Building, ClipboardType, Menu
} from 'lucide-react';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 transform ${
      active
        ? 'bg-emerald-500 text-white scale-105'
        : 'hover:bg-emerald-100 text-emerald-700 hover:scale-105'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

interface NavbarProps {
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Estado para mostrar/ocultar el menú
  const navigate = useNavigate();
  const sections = [
    { id: '', label: 'Inicio', icon: <Home className="w-5 h-5" /> },
    { id: 'personal', label: 'Personal', icon: <UserCircle2 className="w-5 h-5" /> },
    { id: 'vehiculo', label: 'Vehículos', icon: <Car className="w-5 h-5" /> },
    { id: 'fines', label: 'Comparendos', icon: <FileWarning className="w-5 h-5" /> },
    { id: 'housing', label: 'Vivienda', icon: <Home className="w-5 h-5" /> },
    { id: 'location', label: 'Municipio', icon: <MapPin className="w-5 h-5" /> },
    { id: 'departamento', label: 'Departamento', icon: <ClipboardType className="w-5 h-5" /> },
    { id: 'work', label: 'Trabajo', icon: <Briefcase className="w-5 h-5" /> },
    { id: 'company', label: 'Empresa', icon: <Building className="w-5 h-5" /> },
  ];
  return (
    <nav className="bg-white shadow-md p-4 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Botón de hamburguesa */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden text-emerald-700 focus:outline-none"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Menú de navegación */}
        <div
          className={`absolute top-16 left-0 w-full bg-white shadow-lg lg:relative lg:top-0 lg:shadow-none lg:flex lg:items-center lg:w-auto ${
            isMenuOpen ? 'block' : 'hidden'
          }`}
        >
          <div className="flex flex-col lg:flex-row lg:space-x-4 p-4 lg:p-0">
            {sections.map((section) => (
              <NavItem
                key={section.id}
                icon={section.icon}
                label={section.label}
                active={activeSection === section.id}
                onClick={() => {
                  activeSection = section.id;
                  console.log(activeSection)
                  console.log('Changing section to:', section.id);
                  if (section.id === '') {
                    navigate('/');
                  }else{
                    navigate(`/${section.id}-list`);
                  }
                  setIsMenuOpen(false); // Cierra el menú en dispositivos pequeños
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};
