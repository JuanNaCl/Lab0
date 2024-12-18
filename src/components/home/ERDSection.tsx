import { GitGraph } from 'lucide-react';
import diagramaER from '../../assets/diagrama_ER.svg'; // Asegúrate de que esta ruta sea correcta

export function ERDSection() {
    return (
        <section className="py-24 scroll-fade">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-center space-x-3 mb-12">
                    <GitGraph className="w-8 h-8 text-emerald-600" />
                    <h2 className="text-3xl font-light text-gray-800">Diagrama Entidad Relación</h2>
                </div>
                <div className="hover:transform hover:scale-102 transition-all duration-300">
                    <img
                        src={diagramaER}
                        alt="Diagrama ER del sistema"
                        className="w-full rounded-xl shadow-lg"
                    />
                </div>
            </div>
        </section>
    );
}
