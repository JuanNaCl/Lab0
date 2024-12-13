import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { PersonalInfoForm } from './components/forms/PersonalInfoForm';
import { VehicleForm } from './components/forms/VehicleForm';
import { FineForm } from './components/forms/FineForm';
import { HousingForm } from './components/forms/HousingForm';
import { LocationForm } from './components/forms/LocationForm';
import { WorkForm } from './components/forms/WorkForm';
import { CompanyForm } from './components/forms/CompanyForm';
import { Save } from 'lucide-react';
import { validateForm } from './utils/validation';
import { 
  PersonalInfo, Vehiculo, Comparendo, Vivienda, 
  Municipio, Departamento, Trabajo, Empresa 
} from './types';

function App() {
  const [activeSection, setActiveSection] = useState('personal');
  const [isSubmitting, setIsSubmitting] = useState(false);
  type FormDataKey = 'personal' | 'vehicle' | 'fine' | 'housing' | 'municipio' | 'departamento' | 'work' | 'company';

  // Actualiza el estado inicial
  const [formData, setFormData] = useState<Record<FormDataKey, any>>({
    personal: {} as PersonalInfo,
    vehicle: {} as Vehiculo,
    fine: {} as Comparendo,
    housing: {} as Vivienda,
    municipio: {} as Municipio,
    departamento: {} as Departamento,
    work: {} as Trabajo,
    company: {} as Empresa,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [activeSection]: {
        ...prev[activeSection as FormDataKey],
        [name]: value,
      },
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const validationErrors = validateForm(
      formData[activeSection as FormDataKey], 
      activeSection
    );
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }
  
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Form data ready for submission:', formData[activeSection as FormDataKey]);
      // Here you would make the actual API call to your backend
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50">
      <Navbar activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <PersonalInfoForm
              data={formData.personal}
              errors={errors}
              onChange={handleChange}
              activeSection={activeSection}
            />
            <VehicleForm
              data={formData.vehicle}
              errors={errors}
              onChange={handleChange}
              activeSection={activeSection}
            />
            <FineForm
              data={formData.fine}
              errors={errors}
              onChange={handleChange}
              activeSection={activeSection}
            />
            <HousingForm
              data={formData.housing}
              errors={errors}
              onChange={handleChange}
              activeSection={activeSection}
            />
            <LocationForm
              municipioData={formData.municipio}
              departamentoData={formData.departamento}
              errors={errors}
              onChange={handleChange}
              activeSection={activeSection}
            />
            <WorkForm
              data={formData.work}
              errors={errors}
              onChange={handleChange}
              activeSection={activeSection}
            />
            <CompanyForm
              data={formData.company}
              errors={errors}
              onChange={handleChange}
              activeSection={activeSection}
            />

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex items-center space-x-2 px-6 py-2 bg-emerald-500 text-white rounded-lg transition-all duration-200 transform ${
                  isSubmitting ? 'opacity-75 cursor-not-allowed' : 'hover:bg-emerald-600 hover:scale-105'
                }`}
              >
                <Save className={`w-5 h-5 ${isSubmitting ? 'animate-spin' : ''}`} />
                <span>{isSubmitting ? 'Guardando...' : 'Guardar'}</span>
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default App;