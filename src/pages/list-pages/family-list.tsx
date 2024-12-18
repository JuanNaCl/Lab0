import { useEffect, useState } from 'react';
import { Table, Column, HeaderCell, Cell } from 'rsuite-table';
import 'rsuite-table/dist/css/rsuite-table.css';
import supabase from '../../components/common/supabaseClient';
import { IconButton } from 'rsuite';
import EditIcon from '@rsuite/icons/Edit';
import TrashIcon from '@rsuite/icons/Trash';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const FamilyListPage = () => {
    const [familias, setFamilias] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFamilias = async () => {
            const { data, error } = await supabase
                .from('Familia')
                .select(`
                    id,
                    nombre_familia,
                    es_cdf,
                    fecha_registro,
                    Persona: id_persona (primer_nombre, segundo_nombre, primer_apellido, segundo_apellido)
                `);

            if (error) {
                console.error('Error fetching families:', error);
                toast.error('Error al cargar la tabla Familia');
            } else {
                console.log('Fetched families:', data);
                setFamilias(data);
            }
        };

        fetchFamilias();
    }, []);

    const handleDelete = async (id: unknown) => {
        const { error } = await supabase
            .from('Familia')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting family:', error);
            toast.error('Error al eliminar la familia');
        } else {
            setFamilias(familias.filter(family => family.id !== id));
            toast.success('Familia eliminada correctamente');
        }
    };

    return (
        <div className="min-h-screen bg-emerald-50">
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold">Familias</h1>
                        <button
                            onClick={() => navigate('/family-forms')}
                            className="flex items-center space-x-2 px-6 py-2 bg-emerald-500 text-white rounded-lg transition-all duration-200 transform hover:bg-emerald-600 hover:scale-105"
                        >
                            Crear
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <Table data={familias} autoHeight shouldUpdateScroll>
                            <Column width={300} align="center" resizable>
                                <HeaderCell>Nombre Familia</HeaderCell>
                                <Cell dataKey="nombre_familia" />
                            </Column>

                            <Column width={300} align="center" resizable>
                                <HeaderCell>Nombre del Poseedor</HeaderCell>
                                <Cell>
                                    {rowData => rowData.Persona
                                        ? `${rowData.Persona.primer_nombre} ${rowData.Persona.segundo_nombre || ''} ${rowData.Persona.primer_apellido} ${rowData.Persona.segundo_apellido}`
                                        : 'Sin datos'}
                                </Cell>
                            </Column>

                            <Column width={200} align="center" resizable>
                                <HeaderCell>Fecha Registro</HeaderCell>
                                <Cell>
                                    {rowData => rowData.fecha_registro?.split('T')[0] || 'Sin fecha'}
                                </Cell>
                            </Column>

                            <Column width={200} align="center" resizable>
                                <HeaderCell>Cabeza de Familia</HeaderCell>
                                <Cell>
                                    {rowData => rowData.es_cdf ? 'Sí' : 'No'}
                                </Cell>
                            </Column>

                            <Column width={150} align="center" resizable>
                                <HeaderCell>Acciones</HeaderCell>
                                <Cell>
                                    {rowData => (
                                        <span>
                                            <IconButton
                                                icon={<EditIcon style={{ color: 'green' }} />}
                                                appearance="primary"
                                                size="xs"
                                                onClick={() => navigate(`/family-forms?edit=${rowData.id}`)}
                                                className="mr-2"
                                            />
                                            <IconButton
                                                icon={<TrashIcon style={{ color: 'red' }} />}
                                                appearance="subtle"
                                                size="xs"
                                                onClick={() => handleDelete(rowData.id)}
                                            />
                                        </span>
                                    )}
                                </Cell>
                            </Column>
                        </Table>
                    </div>
                </div>
            </main>
            <ToastContainer />
        </div>
    );
};

export default FamilyListPage;
