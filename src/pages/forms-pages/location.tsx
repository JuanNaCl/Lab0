import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { validateForm } from '../../utils/validation';
import { Municipio } from '../../types';
import supabase from '../../components/common/supabaseClient';
import { Popup } from '../../components/common/popUp';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LocationForm } from '../../components/forms/LocationForm';


const LocationPage = () => {
    const [formData, setFormData] = useState<Municipio>({} as Municipio);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [searchParams] = useSearchParams();
    const editId = searchParams.get('edit');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMunicipioById = async (id: string) => {
            const { data, error } = await supabase
                .from('Municipio')
                .select('*')
                .eq('id', id)
                .single();
            if (error) {
                console.error('Error fetching Municipio:', error);
            } else {
                setFormData(data);
            }
        };

        if (editId) {
            fetchMunicipioById(editId);
        }
    }, [editId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        console.log('Form data:', formData);

        const validationErrors = validateForm(formData, 'location');

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            console.error('Form validation errors:', validationErrors);
            setIsSubmitting(false);
            return;
        }

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            let data, error;

            // Normalizar los valores del formulario
            const normalizedFormData = {
                id_alcalde: formData.id_alcalde?.value || formData.id_alcalde, // Tomamos `value` si es un objeto, de lo contrario, el valor directo
                area_total: formData.area_total,
                habitantes_censo_2023: formData.habitantes_censo_2023,
                nombre_municipio: formData.nombre_municipio?.value || formData.id, // Tomamos `value` si es un objeto, de lo contrario, el valor directo
            };
            
            console.log('Es una edición', formData);
            console.log('Form data normalized:', normalizedFormData);
            
            ({ data, error } = await supabase
                .from('Municipio')
                .update({
                    id_alcalde: normalizedFormData.id_alcalde,
                    area_total: normalizedFormData.area_total,
                    habitantes_censo_2023: normalizedFormData.habitantes_censo_2023,
                })
                .eq('id', normalizedFormData.nombre_municipio)
                .select());
            
            if (error) {
                console.error("Error updating Municipio:", error);
            } else {
                console.log("Updated Municipio data:", data);
            }
            

            if (error) {
                console.error('Error inserting municipio data:', error);
                setPopupMessage('Error al guardar datos del municipio');
            } else {
                console.log('Municipio data inserted successfully:', data);
                setPopupMessage('Datos del municipio guardados exitosamente');
                setFormData({} as Municipio); // Reset form data
                setShowPopup(true);
                if (editId) {
                    console.log('es una edicion y se redirige');
                    setShowPopup(false);
                    toast.success(
                        <>
                            Actualización Exitosa.<br />Sera redirigido en breve.
                        </>, {
                        position: "top-right",
                        autoClose: 3500,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    setTimeout(() => {
                        navigate('/location-list');
                    }, 1000); // Delay to allow the toast to be visible
                }
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setPopupMessage('Ocurrió un error al guardar');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-emerald-50">
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <LocationForm
                            activeSection='vehicles'
                            municipioData={formData}
                            errors={errors}
                            onChange={handleChange}
                        />
                        <div className="mt-6 flex justify-end">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`flex items-center space-x-2 px-6 py-2 bg-emerald-500 text-white rounded-lg transition-all duration-200 transform ${isSubmitting ? 'opacity-75 cursor-not-allowed' : 'hover:bg-emerald-600 hover:scale-105'}`}
                            >
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
};

export default LocationPage;
