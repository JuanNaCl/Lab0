import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { validateForm } from '../../utils/validation';
import { Departamento } from '../../types';
import supabase from '../../components/common/supabaseClient';
import { Popup } from '../../components/common/popUp';
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DepartamentForm } from '../../components/forms/DepartamentoForm';
import { Navbar } from '../../components/common/NavbarNueva';


const DepartamentoPage = () => {
    const [formData, setFormData] = useState<Departamento>({} as Departamento);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [searchParams] = useSearchParams();
    const editId = searchParams.get('edit');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDepartamentoById = async (id: string) => {
            const { data, error } = await supabase
                .from('Departamento')
                .select('*')
                .eq('id', id)
                .single();
            if (error) {
                console.error('Error fetching Departamento:', error);
            } else {
                setFormData(data);
            }
        };

        if (editId) {
            fetchDepartamentoById(editId);
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

        const validationErrors = validateForm(formData, 'departamento');

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
                id_gobernador: typeof formData.id_gobernador === 'object' ? formData.id_gobernador?.value : formData.id_gobernador, // Tomamos `value` si es un objeto, de lo contrario, el valor directo
                nombre_Departamento: formData.nombre_departamento.value ? formData.nombre_departamento.value : formData.id, // Tomamos `value` si es un objeto, de lo contrario, el valor directo
            };
            
            console.log('Es una edición', formData);
            console.log('Form data normalized:', normalizedFormData);
            
            ({ data, error } = await supabase
                .from('Departamento')
                .update({
                    id_gobernador: normalizedFormData.id_gobernador,
                })
                .eq('id', normalizedFormData.nombre_Departamento)
                .select());
            
            if (error) {
                console.error("Error updating Departamento:", error);
            } else {
                console.log("Updated Departamento data:", data);
            }
            

            if (error) {
                console.error('Error inserting Departamento data:', error);
                setPopupMessage('Error al guardar datos del Departamento');
            } else {
                console.log('Departamento data inserted successfully:', data);
                setPopupMessage('Datos del Departamento guardados exitosamente');
                setFormData({} as Departamento); // Reset form data
                setShowPopup(true);

                if (editId) {
                    setShowPopup(false);
                    console.log('Actualización Exitosa');
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
                        navigate('/departamento-list');
                    }, 2000); // Delay to allow the toast to be visible
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
            <Navbar activeSection={"departamento"} />
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <DepartamentForm
                            departamentoData={formData}
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

export default DepartamentoPage;
