import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { TicketForm } from '../../components/forms/TicketForm';
import { validateForm } from '../../utils/validation';
import { Save } from 'lucide-react';
import { Comparendo } from '../../types';
import supabase from '../../components/common/supabaseClient';
import { Popup } from '../../components/common/popUp';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TicketPage = () => {
    const [formData, setFormData] = useState<Comparendo>({} as Comparendo);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [people, setPeople] = useState<{ id: number; nombre: string }[]>([]);
    const [searchParams] = useSearchParams();
    const editId = searchParams.get('edit');
    const navigate = useNavigate();

    // Fetch de datos de personas
    useEffect(() => {
        const fetchPeople = async () => {
            const { data, error } = await supabase
                .from('Persona')
                .select('id, nombre');
            if (error) {
                console.error('Error fetching people:', error);
            } else {
                setPeople(data);
            }
        };

        fetchPeople();
    }, []);

    // Fetch de ticket si es edición
    useEffect(() => {
        const fetchTicketById = async (id: string) => {
            const { data, error } = await supabase
                .from('Comparendo')
                .select('*')
                .eq('id', id)
                .single();
            if (error) {
                console.error('Error fetching ticket:', error);
            } else {
                setFormData(data);
            }
        };

        if (editId) {
            fetchTicketById(editId);
        }
    }, [editId]);

    // Manejar cambios en el formulario
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));

        // Si se cambia el poseedor, guardar también su nombre
        if (name === 'id_poseedor') {
            const selectedPerson = people.find(person => person.id.toString() === value);
            if (selectedPerson) {
                setFormData(prev => ({
                    ...prev,
                    nombre: selectedPerson.nombre,
                }));
            }
        }

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // Enviar formulario
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const validationErrors = validateForm(formData, 'ticket');
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setIsSubmitting(false);
            return;
        }

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log('Form data ready for submission:', formData);
            const id_vehiculo = parseInt(formData.id_vehiculo!.toString(), 10);
            const id_poseedor = parseInt(formData.id_poseedor!.toString(), 10);
            const monto = formData.monto ? parseInt(formData.monto.toString(), 10) : null;

            let data, error;
            if (editId) {
                // Actualizar comparendo
                ({ data, error } = await supabase
                    .from('Comparendo')
                    .update({
                        id_vehiculo,
                        id_poseedor,
                        nombre: formData.nombre, // Nombre del poseedor
                        monto,
                        fecha: formData.fecha,
                        razon: formData.razon,
                        nota: formData.nota,
                    })
                    .eq('id', editId)
                    .select());
            } else {
                // Nuevo comparendo
                ({ data, error } = await supabase
                    .from('Comparendo')
                    .insert([{
                        id_vehiculo,
                        id_poseedor,
                        nombre: formData.nombre, // Nombre del poseedor
                        monto,
                        fecha: formData.fecha,
                        razon: formData.razon,
                        nota: formData.nota,
                    }])
                    .select());
            }

            if (error) {
                console.error('Error saving ticket:', error);
                setPopupMessage('Error al guardar el comparendo.');
            } else {
                console.log('Ticket saved successfully:', data);
                setPopupMessage('Comparendo guardado exitosamente.');
                setFormData({} as Comparendo);
                setShowPopup(true);

                if (editId) {
                    toast.success('Actualización exitosa. Será redirigido.', { autoClose: 3500 });
                    setTimeout(() => navigate('/ticket-list'), 1000);
                }
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setPopupMessage('Ocurrió un error al guardar el comparendo.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-indigo-50">
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <TicketForm
                            activeSection="tickets"
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
                onClose={() => setShowPopup(false)}
            />
        </div>
    );
};

export default TicketPage;
