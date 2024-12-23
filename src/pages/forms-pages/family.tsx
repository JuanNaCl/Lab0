import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FamilyForm } from '../../components/forms/FamilyForm';
import { validateForm } from '../../utils/validation';
import { Save } from 'lucide-react';
import { Familia } from '../../types';
import supabase from '../../components/common/supabaseClient';
import { Popup } from '../../components/common/popUp';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Navbar } from '../../components/common/NavbarNueva';

const FamilyPage = () => {
    const [formData, setFormData] = useState<Familia>({} as Familia);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [searchParams] = useSearchParams();
    const editId = searchParams.get('edit');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFamilyById = async (id: string) => {
            const { data, error } = await supabase
                .from('Familia')
                .select('*')
                .eq('id', id)
                .single();
            if (error) {
                console.error('Error fetching familia:', error);
            } else {
                setFormData(data);
            }
        };

        if (editId) {
            fetchFamilyById(editId);
        }
    }, [editId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        }));

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    // Envío del formulario
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const validationErrors = validateForm(formData, 'family');
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setIsSubmitting(false);
            return;
        }

        try {
            await new Promise(resolve => setTimeout(resolve, 1000)); 
            console.log('Form data ready for submission:', formData);
        
            const es_cdf = formData.es_cdf ? true : false; // Asegura que es un booleano
        
            let data, error;

            if (editId) {
                ({ data, error } = await supabase
                .from('Familia')
                .update({
                    nombre_familia: formData.nombre_familia,
                    id_persona: formData.id_persona.value,
                    es_cdf: formData.es_cdf? formData.es_cdf : false,
                })
                .eq('id', editId)
                .select());
            } else {
                ({ data, error } = await supabase
                .from('Familia')
                .insert([{
                    nombre_familia: formData.nombre_familia,
                    id_persona: formData.id_persona.value || formData.id_persona,
                    es_cdf: formData.es_cdf? formData.es_cdf : false,
                }])
                .select());
            }

            if (error) {
                console.error('Error saving family data:', error);
                setPopupMessage('Error al guardar datos de la familia');
            } else {
                setPopupMessage('Datos de la familia guardados con éxito');
                setPopupMessage('Familia guardada exitosamente.');
                setFormData({} as Familia);
                setShowPopup(true);

                if (editId) {
                    console.log('es una edicion y se redirige');
                    setShowPopup(false);
                    toast.success(
                        <>
                            Actualización Exitosa.<br />Sera redirigido en breve.
                        </>, {
                        position: "top-right",
                        autoClose: 1600,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    setTimeout(() => {
                    navigate('/family-list');
                    }, 2000); 
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
            <Navbar activeSection={"family"} />
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h1 className="text-2xl font-bold mb-6">
                        {editId ? 'Editar Familia' : 'Crear Familia'}
                    </h1>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <FamilyForm
                            activeSection="families"
                            data={formData}
                            errors={errors}
                            onChange={handleChange}
                        />
                        <div className="mt-6 flex justify-end">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`flex items-center space-x-2 px-6 py-2 bg-emerald-500 text-white rounded-lg 
                                    transition-all duration-200 transform ${
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
            <Popup 
            message={popupMessage} 
            show={showPopup} 
            onClose={() => {
                setShowPopup(false)
                navigate(-1);
                }
            }
            />
            <ToastContainer />
        </div>
    );
};

export default FamilyPage;
