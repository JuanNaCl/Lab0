import { Database } from 'lucide-react';

export function Hero() {
    return (
        <header className="min-h-screen flex items-center justify-center bg-gradient-to-b from-emerald-50 to-white">
            <div className="text-center space-y-6 p-8">
                <div className="flex items-center justify-center space-x-4 animate-fade-in">
                    <Database className="w-12 h-12 text-emerald-600 hidden md:block" />
                    <h1 className="text-5xl font-light text-gray-800">Sistema de Registro de Viviendas</h1>
                </div>
                <h2 className="text-xl text-gray-600 max-w-2xl mx-auto font-light animate-fade-in-delay">
                    Sistema para el registro y gestión de información sobre personas y viviendas
                </h2>
                <iframe src="https://charts-dot-glocation-dataviz.uc.r.appspot.com/?id=rzWkLjtytUZZDOMmOiHu" width="900" height="500"></iframe>
            </div>
        </header>
    );
}
