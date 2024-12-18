import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { HousingForm } from '../../components/forms/HousingForm';
import { validateForm } from '../../utils/validation';
import { Save } from 'lucide-react';
import { Vivienda, Persona_Vivienda } from '../../types';
import supabase from '../../components/common/supabaseClient';
import { Popup } from '../../components/common/popUp';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const HousingPage = () => {
    const [viviendaFormData, setViviendaFormData] = useState<Vivienda>({} as Vivienda);
    const [personaViviendaFormData, setPersonaViviendaFormData] = useState<Persona_Vivienda>({} as Persona_Vivienda);
    //const [formData, setFormData] = useState<Vivienda>({} as Vivienda);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [searchParams] = useSearchParams();
    const editId = searchParams.get('edit');
    const navigate = useNavigate();

    useEffect(() => { // EDITAR
        const fetchHousingById = async (id: string) => {
            const { data, error } = await supabase
                .from('Vivienda')
                .select('*')
                .eq('id', id)
                .single();
            if (error) {
                console.error('Error fetching vivienda:', error);
            } else {
                setViviendaFormData(data);
            }
        };
        const fetchDueñoVivienda = async (id: string) => {
            const { data, error } = await supabase
                .from('Persona_Vivienda')
                .select('*')
                .eq('id_vivienda', id)
                .is("es_dueño", true) // solo debería ser uno
                .single();
            if (error) {
                console.error('Error fetching dueño de vivienda:', error);
            } else {
                setPersonaViviendaFormData(data);
            }
        };
        
        if (editId) {
            fetchHousingById(editId);
            fetchDueñoVivienda(editId);
        }
    }, [editId]);

    const viviendaFields = [ "id_municipio", "direccion", "barrio", "pisos", "area_construida",
                             "area_total", "habitaciones", "baños", "estrato", "tipo",];
    const personaViviendaFields = [ "id_persona", "id_vivienda","es_dueño", ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        //console.log(name, value);
        if (viviendaFields.includes(name)){
            setViviendaFormData(prev => ({
                ...prev,
                [name]: value,
            })); 
        }
        if (personaViviendaFields.includes(name)){
        setPersonaViviendaFormData(prev => ({
                ...prev,
                [name]: value,
            }));
        }
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const validationErrors = validateForm(viviendaFormData, 'housing');
        // AGREGAR VALIDATION ERROR PERSONA_VIVIENDA

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setIsSubmitting(false);
            return;
        }

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log('Housing data ready for submission:', viviendaFormData);
            console.log('Owner data ready for submission:', personaViviendaFormData);
            let data, error;
            if (editId) {
                // Update existing record
                console.log('es una edicion');
                ({ data, error } = await supabase
                    .from('Vivienda')
                    .update({
                        id_municipio: viviendaFormData.id_municipio.value,
                        direccion: viviendaFormData.direccion,
                        barrio: viviendaFormData.barrio,
                        pisos: viviendaFormData.pisos,
                        area_construida: viviendaFormData.area_construida,
                        area_total: viviendaFormData.area_total,
                        habitaciones: viviendaFormData.habitaciones,
                        baños: viviendaFormData.baños,
                        estrato: viviendaFormData.estrato,
                        tipo: viviendaFormData.tipo.value,
                    })
                    .eq('id', editId)
                    .select());
                    
                console.log('Owner selected:', personaViviendaFormData.id_persona);
                const { data: personaViviendaData, error: personaViviendError } = await supabase 
                    .from('Persona_Vivienda')
                    .update({
                        id_persona: parseInt(personaViviendaFormData.id_persona.value),
                        id_vivienda: parseInt(editId),
                        es_dueño: true,
                    })
                    .eq('id_vivienda', editId)
                    .select();
                    if (personaViviendError){
                        console.log('Error actualizando la relación Persona_Vivienda: ',personaViviendError)
                    }
                    console.log("persona vivienda relacion: ",personaViviendaFormData.id_persona);
                    console.log("id vivienda relacion: ",editId);
                    console.log("objeto subido: ",personaViviendaData);
                    
            } else {
                console.log('Submitting housing info:');
                const { data: viviendaData, error: viviendaError } = await supabase
                    .from('Vivienda')
                    .insert({
                        id_municipio: parseInt(viviendaFormData.id_municipio.value),
                        direccion: viviendaFormData.direccion,
                        barrio: viviendaFormData.barrio,
                        pisos: viviendaFormData.pisos,
                        area_construida: viviendaFormData.area_construida,
                        area_total: viviendaFormData.area_total,
                        habitaciones: viviendaFormData.habitaciones,
                        baños: viviendaFormData.baños,
                        estrato: viviendaFormData.estrato,
                        tipo: viviendaFormData.tipo.value,
                    })
                    .select().single();
                    if (viviendaError) {
                        console.error('Error inserting housing data:', viviendaError);
                        setPopupMessage('Error al guardar datos de la vivienda'); 
                    }
                    //console.log(personaViviendaFormData);
                    //({ data, error } = await supabase
                const { data: personaViviendaData, error: personaViviendError } = await supabase 
                    .from('Persona_Vivienda')
                    .insert({
                            id_persona: personaViviendaFormData.id_persona.value,
                            id_vivienda: viviendaData.id,
                            es_dueño: true,
                        })      
                        .select().single();
                    if (personaViviendError){
                        console.log('Error actualizando la relación Persona_Vivienda: ',personaViviendError)
                    }
                    console.log(personaViviendaData);
            }

            if (error) {
                console.error('Error inserting housing data:', error);
                setPopupMessage('Error al guardar datos de la vivienda');
            } else {
                console.log('Housing data inserted successfully:', data);
                setPopupMessage('Datos de la vivienda guardados exitosamente');
                setPersonaViviendaFormData({} as Persona_Vivienda); // Reset form data
                setViviendaFormData({} as Vivienda); // Reset form data
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
                        navigate('/housing-list');
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
                        <HousingForm
                            activeSection='housing'
                            dataVivienda={viviendaFormData}
                            dataPersonaVivienda={personaViviendaFormData}
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
                    navigate(0);
                }
                }
            />
            <ToastContainer />
        </div>
    );
};

export default HousingPage;
