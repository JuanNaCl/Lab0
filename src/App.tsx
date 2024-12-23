import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { PersonalInfoForm } from './components/forms/PersonalInfoForm';
import { VehicleForm } from './components/forms/VehicleForm';
import { TicketForm } from './components/forms/TicketForm';
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
import supabase from './components/common/supabaseClient';
import { Popup } from './components/common/popUp';
import { DepartamentForm } from './components/forms/DepartamentoForm';

function App() {
  const [activeSection, setActiveSection] = useState('personal');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  type FormDataKey = 'personal' | 'vehicle' | 'ticket' | 'housing' | 'municipio' | 'departament' | 'work' | 'company';

  const initialFormData = {
    personal: {} as PersonalInfo,
    vehicle: {} as Vehiculo,
    ticket: {} as Comparendo,
    housing: {} as Vivienda,
    municipio: {} as Municipio,
    departament: {
      id_gobernador: 0,
      nombre_departamento: '',
    } as Departamento,
    work: {} as Trabajo,
    company: {} as Empresa,
  };

  const [formData, setFormData] = useState<Record<FormDataKey, any>>(initialFormData);
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

      console.log('Submitting form data:', formData[activeSection as FormDataKey]);

      let submissionResult = null;
      switch (activeSection) {
        case 'personal':
          console.log('Submitting personal info:');
          break
        case 'vehicles':
          {
          const vehicleData = formData[activeSection as FormDataKey];
          const { data, error } = await supabase
            .from('Vehiculo')
            .insert([{
              id_dueño: parseInt(vehicleData.id_dueño),
              nombre: vehicleData.nombre,
              marca: vehicleData.marca,
              tipo: vehicleData.tipo,
              color: vehicleData.color,
              valor_nuevo: vehicleData.valor_nuevo !== null ? parseInt(vehicleData.valor_nuevo) : null,
              placa: vehicleData.placa,
            }])
            .select();
          
          if (error) {
            console.error('Error inserting vehicle data:', error);
            setPopupMessage('Error al guardar datos del vehículo');
          } else {
            console.log('Vehicle data inserted successfully:', data);
            setPopupMessage('Datos del vehículo guardados exitosamente');
            submissionResult = data;
          }
        }
          break;
        case 'fines':
          console.log('Submitting tickets info:');
          break;
          case 'housing':{
            console.log('Submitting housing info:');
            const housingData = { ...formData[activeSection as FormDataKey] };
            const idDueño = parseInt(housingData.id_dueño);
            const { data: viviendaData, error: viviendaError } = await supabase
            .from('Vivienda')
              .insert([{
                id_municipio: parseInt(housingData.id_municipio),
                direccion: housingData.direccion,
                barrio: housingData.barrio,
                pisos: parseInt(housingData.pisos),
                area_construida: parseInt(housingData.area_construida),
                area_total: parseInt(housingData.area_total),
                habitaciones: parseInt(housingData.habitaciones),
                baños: parseInt(housingData.baños),
                estrato: parseInt(housingData.estrato),
                tipo: housingData.tipo,
              }])
              .select() // Retorna el registro insertado
              .single(); // Asegura que solo retorne un objeto (no un array)
              if (viviendaError) {
                console.error('Error inserting housing data:', viviendaError);
                setPopupMessage('Error al guardar datos de la vivienda');
                break;       
              }
            
            console.log('Housing data inserted successfully:', viviendaData);  
            const { data: personaViviendaData, error: personaViviendaError } = await supabase
            .from('Persona_Vivienda')
              .insert([{
                id_persona: idDueño,
                id_vivienda: viviendaData.id, // Aquí tomamos el id de la vivienda creada
                es_dueño: true, // Es propietario, ya que si se está asignando desde el registro de la casa es porque es el dueño
              }]).select();
  
              if (personaViviendaError) {
                console.error('Error inserting into Persona_Vivienda:', personaViviendaError);
                console.error('Current values: ', personaViviendaData);
                setPopupMessage('Error al asignar propietario a la vivienda');
              } else {
                console.log('Owner assigned successfully.');
                setPopupMessage('Vivienda y propietario registrados exitosamente');
                submissionResult = viviendaData;
              }
            break;
          }  
        case 'location':{ 
            const locationData = formData[activeSection as FormDataKey];
            const { data, error } = await supabase
            .from('Municipio')
            .update({ 
              id_alcalde: locationData.id_alcalde.value,
              area_total:  parseInt(locationData.area_total),
              habitantes_censo_2023:  parseInt(locationData.habitantes_censo_2023),
            })
            .eq('id', locationData.nombre_municipio.value)
            .select()
          
            
            if (error) {
              console.error('Error inserting Municipio data:', error);
              setPopupMessage('Error al guardar datos del Municipio');
            } else {
              console.log('Municipio data inserted successfully:', data);
              setPopupMessage('Datos del Municipio guardados exitosamente');
              submissionResult = data;
            }
          }
          break;

        case 'departament':{
          const deaprtamentoData = formData[activeSection as FormDataKey];
          const { data, error } = await supabase
          .from('Departamento')
          .update({ 
            id_gobernador: deaprtamentoData.id_gobernador.value,
          })
          .eq('id', deaprtamentoData.nombre_departamento.value)
          .select()
        
          
          if (error) {
            console.error('Error inserting departamento data:', error);
            setPopupMessage('Error al guardar datos del departamento');
          } else {
            console.log('departamento data inserted successfully:', data);
            setPopupMessage('Datos del departamento guardados exitosamente');
            submissionResult = data;
          }
        }
        break;
        case 'work':
          console.log('Submitting work info:');
          break;
        case 'company':{
          console.log('Submitting company info:');
          const companyData = formData[activeSection as FormDataKey];
          console.log(companyData);
          console.log(companyData.id_departamento_constitucion);
          const { data: data, error: empresaError } = await supabase
          .from('Empresa')
            .insert([{
              nombre: companyData.nombre,
              id_departamento_constitucion: parseInt(companyData.id_departamento_constitucion.value),
            }])
            .select() // Retorna el registro insertado
            if (empresaError) {
              console.error('Error inserting company data:', empresaError);
              setPopupMessage('Error al guardar datos de la empresa');
              break;       
            }
            else {
              console.log('Company data inserted successfully:', data);
              setPopupMessage('Datos de la empresa guardados exitosamente');
              submissionResult = data;
            }
          }
          break;
          
        // Add similar cases for other form sections
        default:
          break;
      }
  
      if (submissionResult) {
        setShowPopup(true);
        // Reset form data for the current section
        setFormData(prev => ({
          ...prev,
          [activeSection]: initialFormData[activeSection as FormDataKey]
        }));
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setPopupMessage('Ocurrió un error al guardar');
      setShowPopup(true);
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
            <TicketForm
              data={formData.ticket}
              errors={errors}
              onChange={handleChange}
              activeSection={activeSection}
            />
            <HousingForm
              dataVivienda={formData.housing}
              dataPersonaVivienda={formData.housing}
              errors={errors}
              onChange={handleChange}
              activeSection={activeSection}
            />
            <LocationForm
              municipioData={formData.municipio}
              errors={errors}
              onChange={handleChange}
              activeSection={activeSection}
            />
            <DepartamentForm
              departamentoData={formData.departament}
              errors={errors}
              onChange={handleChange}
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
                className={`flex items-center space-x-2 px-6 py-2 bg-emerald-500 text-white rounded-lg transition-all duration-200 transform ${isSubmitting ? 'opacity-75 cursor-not-allowed' : 'hover:bg-emerald-600 hover:scale-105'}`}
              >
                <Save className={`w-5 h-5 ${isSubmitting ? 'animate-spin' : ''}`} />
                <span>{isSubmitting ? 'Guardando...' : 'Guardar'}</span>
              </button>
            </div>
          </form>
        </div>
      </main>

      <Popup
        message={popupMessage}
        show={showPopup}
        onClose={() => setShowPopup(false)}
      />
    </div>
  );
}

export default App;

