import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { VehicleForm } from '../../components/forms/VehicleForm';
import { validateForm } from '../../utils/validation';
import { Save } from 'lucide-react';
import { Vehiculo } from '../../types';
import supabase from '../../components/common/supabaseClient';
import { Popup } from '../../components/common/popUp';
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Navbar } from '../../components/common/NavbarNueva';


const VehiclePage = () => {
    const [formData, setFormData] = useState<Vehiculo>({} as Vehiculo);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [searchParams] = useSearchParams();
    const editId = searchParams.get('edit');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchVehicleById = async (id: string) => {
            const { data, error } = await supabase
                .from('Vehiculo')
                .select('*')
                .eq('id', id)
                .single();
            if (error) {
                console.error('Error fetching vehiculo:', error);
            } else {
                setFormData(data);
            }
        };

        if (editId) {
            fetchVehicleById(editId);
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

        const validationErrors = validateForm(formData, 'vehicles');

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setIsSubmitting(false);
            return;
        }

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log('Form data ready for submission:', formData);

            const valor_nuevo = formData.valor_nuevo ? parseInt(formData.valor_nuevo.toString(), 10) : null;
            let data, error;
            if (editId) {
                // Update existing record
                console.log('es una edicion');
                ({ data, error } = await supabase
                    .from('Vehiculo')
                    .update({
                        nombre: formData.nombre,
                        marca: formData.marca,
                        tipo: formData.tipo.value,
                        color: formData.color,
                        valor_nuevo: valor_nuevo,
                        placa: formData.placa,
                    })
                    .eq('id', editId)
                    .select());
            } else {
                ({ data, error } = await supabase
                    .from('Vehiculo')
                    .insert([{
                        id_dueño: formData.id_dueño.value,
                        nombre: formData.nombre,
                        marca: formData.marca,
                        tipo: formData.tipo.value,
                        color: formData.color,
                        valor_nuevo: valor_nuevo,
                        placa: formData.placa,
                    }])
                    .select());
            }

            if (error) {
                console.error('Error inserting vehicle data:', error);
                setPopupMessage('Error al guardar datos del vehículo');
            } else {
                console.log('Vehicle data inserted successfully:', data);
                setPopupMessage('Datos del vehículo guardados exitosamente');
                setFormData({} as Vehiculo); // Reset form data
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
                        navigate(-1);
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
            <Navbar activeSection={"vehiculo"} />
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <VehicleForm
                            activeSection='vehicles'
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
                    navigate(-1);
                }
                }
            />
            <ToastContainer />
        </div>
    );
};

export default VehiclePage;
