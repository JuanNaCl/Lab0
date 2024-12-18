import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CompanyForm } from '../../components/forms/CompanyForm';
import { validateForm } from '../../utils/validation';
import { Save } from 'lucide-react';
import { Empresa } from '../../types';
import supabase from '../../components/common/supabaseClient';
import { Popup } from '../../components/common/popUp';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const CompanyPage = () => {
    const [formData, setFormData] = useState<Empresa>({} as Empresa);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [searchParams] = useSearchParams();
    const editId = searchParams.get('edit');
    const navigate = useNavigate();

    useEffect(() => { // EDITAR
        const fetchCompanyById = async (id: string) => {
            const { data, error } = await supabase
                .from('Empresa')
                .select('*')
                .eq('id', id)
                .single();
            if (error) {
                console.error('Error fetching empresa:', error);
            } else {
                setFormData(data);
            }
        };
        
        if (editId) {
            fetchCompanyById(editId);
        }
    }, [editId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        //console.log(name, value);
        
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

        const validationErrors = validateForm(formData, 'company');

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setIsSubmitting(false);
            return;
        }

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log('Company data ready for submission:', formData);
            let data, error;
            if (editId) {
                // Update existing record
                console.log('es una edicion');
                
                ({ data, error } = await supabase
                    .from('Empresa')
                    .update({
                        nombre: formData.nombre,
                        id_departamento_constitucion: parseInt(formData.id_departamento_constitucion.value)
                    })
                    .eq('id', editId)
                    .select());                    
                    
            } else {
                console.log('Submitting company info:');
                ({ data, error } = await supabase
                    .from('Empresa')
                    .insert({
                        nombre: formData.nombre,
                        id_departamento_constitucion: parseInt(formData.id_departamento_constitucion.value)
                    })
                    .select().single());
            }

            if (error) {
                console.error('Error inserting company data:', error);
                setPopupMessage('Error al guardar datos de la empresa');
            } else {
                console.log('Housing data inserted successfully:', data);
                setFormData({} as Empresa); // Reset form data
                if (editId) {
                    console.log('es una edicion y se redirige');
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
                        navigate('/company-list');
                    }, 1000); // Delay to allow the toast to be visible
                }
                else{
                    setPopupMessage("Compañía registrada exitosamente");
                    setShowPopup(true);
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
                        <CompanyForm
                            activeSection='company'
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
                    setShowPopup(false)
                    setFormData({} as Empresa); // reset values to blank fields
                    navigate(0);
                }
                }
            />
            <ToastContainer />
        </div>
    );
};

export default CompanyPage;
