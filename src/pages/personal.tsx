import React, { useState } from 'react';
import { PersonalInfoForm } from '../components/forms/PersonalInfoForm';
import { validateForm } from '../utils/validation';
import { PersonalInfo } from '../types';
import supabase from '../components/common/supabaseClient';
import { Popup } from '../components/common/popUp';

const Personal = () => {
    const [formData, setFormData] = useState<PersonalInfo>({} as PersonalInfo);
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

        const validationErrors = validateForm(formData, 'personal');

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setIsSubmitting(false);
            return;
        }

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log('Form data ready for submission:', formData);

            const { data, error } = await supabase
                .from('Persona')
                .insert(
                    [{
                        primer_nombre: formData.primer_nombre,
                        segundo_nombre: formData.segundo_nombre,
                        primer_apellido: formData.primer_apellido,
                        segundo_apellido: formData.segundo_apellido,
                        fecha_nacimiento: formData.fecha_nacimiento,
                        sexo: formData.sexo,
                        email: formData.email,
                        celular: formData.celular,
                        salario: formData.salario,
                    }]
                )
                .select();

            if (error) {
                console.error('Error inserting personal info:', error);
                setPopupMessage('Error al guardar datos personales');
            } else {
                console.log('Personal info inserted successfully:', data);
                setPopupMessage('Datos personales guardados exitosamente');
                setFormData({} as PersonalInfo); // Reset form data
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
                        <PersonalInfoForm
                            activeSection='personal'
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

export default Personal;
