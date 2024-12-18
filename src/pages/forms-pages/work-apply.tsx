import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { WorkApplyForm } from '../../components/forms/WorkApplyForm';
import { validateForm } from '../../utils/validation';
import { Aplicacion, Trabajo } from '../../types';
import supabase from '../../components/common/supabaseClient';
import { Popup } from '../../components/common/popUp';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Table, Column, HeaderCell, Cell } from 'rsuite-table';
import { IconButton } from 'rsuite';
import TrashIcon from '@rsuite/icons/Trash';
import { Save } from 'lucide-react';

const WorkApplyPage = () => {
    const [formData, setFormData] = useState<Aplicacion>({} as Aplicacion);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [searchParams] = useSearchParams();
    const applyId = searchParams.get('apply');
    const [aplicaciones, setAplicaciones] = useState<Aplicacion[]>([]);
    const [trabajo, setTrabajo] = useState<Trabajo | null>(null);
    const navigate = useNavigate();
    const fetchAplicaciones = async (id: string) => {
        const { data, error } = await supabase
            .from('Persona_Trabajo')
            .select('*, Persona(*), Trabajo(*)')
            .eq('id_trabajo', id);
        if (error) {
            console.error('Error fetching aplicaciones:', error);
        } else {
            setAplicaciones(data);
        }
    };

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
                setTrabajo(data);
            }
        };

        if (applyId) {
            fetchTrabajo(applyId);
            fetchAplicaciones(applyId);
        }
    }, [applyId]);

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

        const validationErrors = validateForm(formData, 'work-apply');
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setIsSubmitting(false);
            return;
        }

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log('Form data ready for submission:', formData);

            let data, error;
            ({ data, error } = await supabase
                .from('Persona_Trabajo')
                .insert([{
                    id_trabajo: parseInt(applyId!),
                    id_persona: parseInt(formData.id_persona.value!),
                }])
                .select());

            if (error) {
                console.error('Error saving aplicacion info:', error);
                toast.error('Error al guardar datos de la Aplicación', {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            } else {
                console.log('Aplicacion info saved successfully:', data);
                setFormData({} as Aplicacion); // Reset form data
                toast.success('Datos de la Aplicación guardados exitosamente', {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                fetchAplicaciones(applyId!); // Refresh the list of applications
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setPopupMessage('Ocurrió un error al guardar');
        } finally {
            setIsSubmitting(false);
            navigate(0);
        }
    };

    const handleDelete = async (id: number) => {
        const { error } = await supabase
            .from('Persona_Trabajo')
            .delete()
            .eq('id', id);
        if (error) {
            console.error('Error deleting aplicacion:', error);
            toast.error('Error al eliminar la Aplicación', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } else {
            setAplicaciones(aplicaciones.filter(aplicacion => aplicacion.id !== id));
            toast.success('Aplicación eliminada correctamente', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };

    return (
        <div className="min-h-screen bg-emerald-50">
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h1 className="text-2xl font-bold mb-4">Aplicar a Trabajo: {trabajo?.nombre}</h1>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <WorkApplyForm
                            applyId= {applyId!}
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
                <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
                    <h2 className="text-xl font-semibold mb-4">Personas que han Aplicado</h2>
                    <Table data={aplicaciones} autoHeight>
                        <Column flexGrow={1} align="center">
                            <HeaderCell>Nombre</HeaderCell>
                            <Cell>
                                {rowData => `${rowData.Persona.primer_nombre} ${rowData.Persona.primer_apellido}`}
                            </Cell>
                        </Column>
                        <Column flexGrow={1} align="center">
                            <HeaderCell>Apellidos</HeaderCell>
                            <Cell>
                                {rowData => `${rowData.Persona.primer_apellido ?? ''} ${rowData.Persona.segundo_apellido ?? ''}`}
                            </Cell>
                        </Column>
                        <Column flexGrow={1} align="center">
                            <HeaderCell>Cédula de la Persona</HeaderCell>
                            <Cell dataKey="Persona.cedula" />
                        </Column>
                        <Column flexGrow={1} align="center">
                            <HeaderCell>Fecha Aplicacion</HeaderCell>
                            <Cell>
                                {rowData => new Date(rowData.created_at).toLocaleDateString()}
                            </Cell>
                        </Column>
                        <Column flexGrow={1} align="center">
                            <HeaderCell>Acciones</HeaderCell>
                            <Cell>
                                {rowData => (
                                    <IconButton
                                        icon={<TrashIcon style={{ color: 'red' }} />}
                                        appearance="subtle"
                                        size="xs"
                                        onClick={() => handleDelete(rowData.id)}
                                    />
                                )}
                            </Cell>
                        </Column>
                    </Table>
                </div>
            </main>
            <Popup
                message={popupMessage}
                show={showPopup}
                onClose={() => setShowPopup(false)}
            />
            <ToastContainer />
        </div>
    );
};

export default WorkApplyPage;
