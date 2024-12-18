import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Column, HeaderCell, Cell } from 'rsuite-table';
import 'rsuite-table/dist/css/rsuite-table.css';
import supabase from '../../components/common/supabaseClient';
import { Familia } from '../../types';
import { IconButton } from 'rsuite';
import EditIcon from '@rsuite/icons/Edit';
import TrashIcon from '@rsuite/icons/Trash';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FamilyListPage = () => {
    const [familias, setFamilias] = useState<Familia[]>([]);
    const navigate = useNavigate();

    // Fetch data from Supabase
    useEffect(() => {
        const fetchFamilias = async () => {
            const { data, error } = await supabase
                .from('Familia')
                .select("*");

            if (error) {
                console.error('Error fetching Familias:', error);
            } else {
                const formattedData = data.map((familia) => ({
                    ...familia,
                    persona_nombre: `${familia.Persona.primer_nombre} ${familia.Persona.segundo_nombre ?? ''} ${familia.Persona.primer_apellido} ${familia.Persona.segundo_apellido ?? ''}`.trim(),
                }));
                setFamilias(formattedData);
            }
        };

        fetchFamilias();
    }, []);

    // Delete a family record
    const handleDelete = async (id: number) => {
        const { error } = await supabase
            .from('Familia')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting Familia:', error);
        } else {
            setFamilias(familias.filter(familia => familia.id !== id));
        }
    };

    return (
        <div className="min-h-screen bg-indigo-50">
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
                    {/* Contenedor responsivo */}
                    <div className="overflow-x-auto">
                        <Table data={familias} autoHeight shouldUpdateScroll>
                            <Column width={200} flexGrow={1} align="center" resizable>
                                <HeaderCell>Nombre Familia</HeaderCell>
                                <Cell dataKey="nombre_familia" />
                            </Column>

                            <Column width={300} flexGrow={1} align="center" resizable>
                                <HeaderCell>Cabeza de Familia</HeaderCell>
                                <Cell dataKey="persona_nombre" />
                            </Column>

                            <Column width={150} flexGrow={1} align="center" resizable>
                                <HeaderCell>Es Cabeza</HeaderCell>
                                <Cell>
                                    {rowData => (rowData.es_cdf ? 'Sí' : 'No')}
                                </Cell>
                            </Column>

                            <Column width={200} flexGrow={1} align="center" resizable>
                                <HeaderCell>Fecha Registro</HeaderCell>
                                <Cell>
                                    {rowData => new Date(rowData.fecha_registro).toLocaleDateString()}
                                </Cell>
                            </Column>

                            <Column width={200} flexGrow={1} align="center" resizable>
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
