import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { WorkForm } from '../../components/forms/WorkForm';
import { validateForm } from '../../utils/validation';
import { Trabajo } from '../../types';
import supabase from '../../components/common/supabaseClient';
import { Popup } from '../../components/common/popUp';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Save } from 'lucide-react';
import { Navbar } from '../../components/common/NavbarNueva';

const TrabajoPage = () => {
    const [formData, setFormData] = useState<Trabajo>({} as Trabajo);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [searchParams] = useSearchParams();
    const editId = searchParams.get('edit');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTrabajo = async (id: string) => {
            const { data, error } = await supabase
                .from('Trabajo')
                .select('*')
                .eq('id', id)
                .single();
            if (error) {
                console.error('Error fetching trabajo:', error);
            } else {
                setFormData(data);
            }
        };

        if (editId) {
            fetchTrabajo(editId);
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

        const validationErrors = validateForm(formData, 'work');
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setIsSubmitting(false);
            return;
        }

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log('Form data ready for submission:', formData);

            let data, error;
            if (editId) {
                // Update existing record
                ({ data, error } = await supabase
                    .from('Trabajo')
                    .update([{
                        nombre: formData.nombre,
                        media_salarial: formData.media_salarial,
                        id_empresa: parseInt(formData.id_empresa.value),
                    }])
                    .eq('id', editId)
                    .select());
            } else {
                // Insert new record
                ({ data, error } = await supabase
                    .from('Trabajo')
                    .insert([{
                        nombre: formData.nombre,
                        media_salarial: formData.media_salarial,
                        id_empresa: parseInt(formData.id_empresa.value),
                    }])
                    .select());
            }

            if (error) {
                console.error('Error saving trabajo info:', error);
                setPopupMessage('Error al guardar datos del trabajo');
            } else {
                console.log('Trabajo info saved successfully:', data);
                setPopupMessage('Datos del trabajo guardados exitosamente');
                setFormData({} as Trabajo); // Reset form data if not editing
                setShowPopup(true);

                if (editId) {
                    setShowPopup(false);
                    toast.success(
                        <>
                            Actualización Exitosa.<br />Sera redirigido en breve.
                        </>, {
                        position: "top-right",
                        autoClose: 1800,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    setTimeout(() => {
                        navigate('/work-list');
                    }, 1850); // Delay to allow the toast to be visible
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
            <Navbar activeSection={"work"} />
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <WorkForm
                            activeSection='work'
                            data={formData}
                            errors={errors}
                            onChange={handleChange}
                        />
                        <div className="mt-6 flex justify-end">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`flex items-center space-x-2 px-6 py-2 bg-emerald-500 text-white rounded-lg 
                                    transition-all duration-200 transform ${isSubmitting ? 'opacity-75 cursor-not-allowed' : 'hover:bg-emerald-600 hover:scale-105'}`}
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
                    setShowPopup(false);
                    navigate(0);
                }}
            />
            <ToastContainer />
        </div>
    );
};

export default TrabajoPage;
