import React, { useState } from 'react';
import { Popup } from '../../components/common/popUp';
import supabase from '../../components/common/supabaseClient';
import { VehicleForm } from '../../components/forms/VehicleForm';
import { Vehiculo } from '../../types';
import { validateForm } from '../../utils/validation';


const VehiclePage = () => {
    const [formData, setFormData] = useState<Vehiculo>({} as Vehiculo);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');

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

            const id_dueño = parseInt(formData.id_dueño!.toString(), 10);
            const valor_nuevo = formData.valor_nuevo ? parseInt(formData.valor_nuevo.toString(), 10) : null;

            const { data, error } = await supabase
                .from('Vehiculo')
                .insert([{
                    id_dueño: id_dueño,
                    nombre: formData.nombre,
                    marca: formData.marca,
                    tipo: formData.tipo,
                    color: formData.color,
                    valor_nuevo: valor_nuevo,
                    placa: formData.placa,
                }])
                .select();

            if (error) {
                console.error('Error inserting vehicle data:', error);
                setPopupMessage('Error al guardar datos del vehículo');
            } else {
                console.log('Vehicle data inserted successfully:', data);
                setPopupMessage('Datos del vehículo guardados exitosamente');
                setFormData({} as Vehiculo); // Reset form data
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setPopupMessage('Ocurrió un error al guardar');
        } finally {
            setIsSubmitting(false);
            setShowPopup(true);
        }
    };

    return (
        <div className="min-h-screen bg-emerald-50">
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

export default VehiclePage;