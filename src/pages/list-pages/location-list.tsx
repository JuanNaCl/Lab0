import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Column, HeaderCell, Cell } from 'rsuite-table';
import 'rsuite-table/dist/css/rsuite-table.css';
import supabase from '../../components/common/supabaseClient';
import { Municipio } from '../../types';
import { IconButton } from 'rsuite';
import EditIcon from '@rsuite/icons/Edit';
import TrashIcon from '@rsuite/icons/Trash';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LocationListPage = () => {
    const [municipios, setMunicipios] = useState<Municipio[]>([]);
    const [personas, setPersonas] = useState<{ id: number; nombre: string }[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchMunicipios();
        fetchPersonas();
    }, []);

    const fetchMunicipios = async () => {
        const { data, error } = await supabase
            .from('Municipio')
            .select('*')
            .not('id_alcalde', 'is', null);

        if (error) {
            console.error("Error fetching Municipios:", error);
        } else {
            setMunicipios(data);
        }
    };

    const fetchPersonas = async () => {
        const { data, error } = await supabase
            .from('Persona')
            .select('id, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido');

        if (error) {
            console.error("Error fetching Personas:", error);
        } else {
            // Mapear las personas para crear un objeto simple con nombre completo
            const mappedPersonas = data.map(persona => ({
                id: persona.id,
                nombre: `${persona.primer_nombre} ${persona.primer_apellido}`.trim()
            }));
            setPersonas(mappedPersonas);
        }
    };

    // Función para obtener el nombre del alcalde por id
    const getNombreAlcalde = (id_alcalde: number) => {
        const alcalde = personas.find(persona => persona.id === id_alcalde);
        return alcalde ? alcalde.nombre : 'N/A';
    };

    const handleDelete = async (id: number) => {
        const { error } = await supabase
            .from('Municipio')
            .update({ 
                id_alcalde: null,
                area_total: null,
                habitantes_censo_2023: null 
            })
            .eq('id', id)
            .select();

        if (error) {
            console.error('Error deleting Municipio:', error);
        } else {
            setMunicipios(municipios.filter(municipio => municipio.id !== id));
        }
    };

    return (
        <div className="min-h-screen bg-emerald-50">
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold">Municipios</h1>
                        <button
                            onClick={() => navigate('/location-forms')}
                            className="flex items-center space-x-2 px-6 py-2 bg-emerald-500 text-white rounded-lg transition-all duration-200 transform hover:bg-emerald-600 hover:scale-105"
                        >
                            Crear
                        </button>
                    </div>
                    {/* Contenedor responsivo */}
                    <div className="overflow-x-auto">
                        <Table data={municipios} autoHeight shouldUpdateScroll>
                            <Column width={200} flexGrow={1} align="center" resizable>
                                <HeaderCell>Codigo DANE</HeaderCell>
                                <Cell dataKey="codigo_municipio" />
                            </Column>

                            <Column width={200} flexGrow={1} align="center" resizable>
                                <HeaderCell>Nombre municipio</HeaderCell>
                                <Cell dataKey="nombre_municipio" />
                            </Column>

                            <Column width={200} flexGrow={1} align="center" resizable>
                                <HeaderCell>Nombre alcalde</HeaderCell>
                                <Cell>
                                    {rowData => getNombreAlcalde(rowData.id_alcalde)}
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
                                                onClick={() => navigate(`/location-forms?edit=${rowData.id}`)}
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

export default LocationListPage;
