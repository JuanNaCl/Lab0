import { useEffect } from 'react';
import { Home, FileWarning, Target } from 'lucide-react';
import './styles/animations.css';
import { Hero } from './components/home/Hero';
import { InfoSection } from './components/home/InfoSection';
import { ERDSection } from './components/home/ERDSection';
import { Navbar } from './components/common/NavbarNueva';

function App() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.scroll-fade').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar activeSection={""} />
      <Hero />
      <main className="container mx-auto px-6">
        <InfoSection icon={Home} title="Sobre el Proyecto">
          <p className="text-xl text-gray-600 leading-relaxed font-light">
            Este sistema fue desarrollado para implementar un registro de viviendas, personas y familias en un municipio,
            se agregaron caracteristicas como trabajos, vehiculos, gobernadores y alcaldes entre otros.
          </p>
        </InfoSection>

          <InfoSection icon={FileWarning} title="Limitaciones" align="right">
            <div className="grid grid-cols-2 gap-8 text-gray-600">
              <div className="space-y-4">
                <p className="font-light">• Se omite la tabla de censos para un historico</p>
                <p className="font-light">• Se omite quien expide los comparendos</p>
              </div>
              <div className="space-y-4">
                <p className="font-light">• Se omiten validaciones geoespaciales</p>
                <p className="font-light">• Se asume que las familias solo pueden tener una cabeza de familia</p>
              </div>
            </div>
          </InfoSection>

        <InfoSection icon={Target} title="Alcance">
          <div className="grid grid-cols-2 gap-8 text-gray-600">
            <div className="space-y-4">
              <p className="font-light">• Manejo de información de personas</p>
              <p className="font-light">• Manejo de información de vehiculos</p>
              <p className="font-light">• Manejo de información de comparendos</p>
            </div>
            <div className="space-y-4">
              <p className="font-light">• Manejo de información de viviendas</p>
              <p className="font-light">• Manejo de información de departamentos y municipios</p>
              <p className="font-light">• Manejo de información de trabajos y empresas</p>
            </div>
          </div>
        </InfoSection>

        <ERDSection />
      </main>

      <footer className="py-12 mt-24 text-center text-gray-600 font-light">
        <p>© 2024 Sistema de Registro de Viviendas.</p>
      </footer>
    </div>
  );
}

export default App;