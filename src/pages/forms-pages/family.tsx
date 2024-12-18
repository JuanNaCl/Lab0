import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FamilyForm } from '../../components/forms/FamilyForm';
import { validateForm } from '../../utils/validation';
import { Save } from 'lucide-react';
import { Familia } from '../../types';
import supabase from '../../components/common/supabaseClient';
import { Popup } from '../../components/common/popUp';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

        const validationErrors = validateForm(formData, 'families');
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setIsSubmitting(false);
            return;
        }

        try {
            await new Promise(resolve => setTimeout(resolve, 1000)); 
            console.log('Form data ready for submission:', formData);
        
            const id_persona = parseInt(formData.id_persona!.toString(), 10); 
            const es_cdf = formData.es_cdf ? true : false; // Asegura que es un booleano
        
            let data, error;

            if (editId) {
                ({ data, error } = await supabase
                .from('Familia')
                .update({
                    nombre_familia: formData.nombre_familia,
                    id_persona: id_persona,
                    es_cdf: es_cdf,
                })
                .eq('id', editId)
                .select());
            } else {
                ({ data, error } = await supabase
                .from('Familia')
                .insert([{
                    nombre_familia: formData.nombre_familia,
                    id_persona: formData.id_persona,
                    es_cdf: formData.es_cdf,
                }])
                .select());
            }

            if (error) {
                console.error('Error saving family data:', error);
                setPopupMessage('Error al guardar datos de la familia');
            } else {
                setPopupMessage('Datos de la familia guardados exitosamente');
                setShowPopup(true);
                setFormData({} as Familia);

                toast.success('Operación exitosa. Redirigiendo...', {
                    position: 'top-right',
                    autoClose: 3000,
                });

                setTimeout(() => {
                    navigate('/family-list');
                }, 3000);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setPopupMessage('Ocurrió un error al guardar');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-indigo-50">
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
            <Popup message={popupMessage} show={showPopup} onClose={() => setShowPopup(false)} />
        </div>
    );
};

export default FamilyPage;
