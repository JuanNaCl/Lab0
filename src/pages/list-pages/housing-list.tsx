import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Column, HeaderCell, Cell } from 'rsuite-table';
import 'rsuite-table/dist/css/rsuite-table.css';
import supabase from '../../components/common/supabaseClient';
import { Vivienda } from '../../types';
import { IconButton } from 'rsuite';
import EditIcon from '@rsuite/icons/Edit';
import TrashIcon from '@rsuite/icons/Trash';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const HousingListPage = () => {
    const [viviendas, setViviendas] = useState<Vivienda[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchViviendas = async () => {
            const { data, error } = await supabase
                .from('Vivienda')
                .select('*,Municipio(*)');

            if (error) {
                console.error('Error fetching housing:', error);
            } else {
                setViviendas(data);
            }
        };

        fetchViviendas();
    }, []);

    const handleDelete = async (id: number) => {
        console.log('started deletion');
        const { error : errorPersonaVivienda } = await supabase
            .from('Persona_Vivienda')
            .delete()
            .eq('id_vivienda', id);
        if (errorPersonaVivienda) {
            console.error('Error deleting housing relations:', errorPersonaVivienda);
            toast.error(
              <>
                Error al eliminar las relaciones de vivienda.
              </>, {
              position: "top-right",
              autoClose: 2500,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            })
        }
        const { error } = await supabase
            .from('Vivienda')
            .delete()
            .eq('id', id);
            
        if (error) {
            console.error('Error deleting housing:', error);
            toast.error(
              <>
                Error al eliminar la vivienda.
              </>, {
              position: "top-right",
              autoClose: 2500,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            })
        } else {
            setViviendas(viviendas.filter(Vivienda => Vivienda.id !== id));
            toast.success("Vivienda eliminada correctamente");
        }
    };

    return (
        <div className="min-h-screen bg-emerald-50">
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold">Viviendas</h1>
                        <button
                            onClick={() => navigate('/housing-forms')}
                            className="flex items-center space-x-2 px-6 py-2 bg-emerald-500 text-white rounded-lg transition-all duration-200 transform hover:bg-emerald-600 hover:scale-105"
                        >
                            Crear
                        </button>
                    </div>
                    {/* Contenedor responsivo */}
                    <div className="overflow-x-auto">
                        <Table data={viviendas} autoHeight shouldUpdateScroll>
                            <Column width={400} flexGrow={1} align="center" resizable>
                                <HeaderCell>Dirección</HeaderCell>
                                <Cell>
                                    {rowData => (
                                    <>
                                        {rowData.direccion}, {rowData.barrio}
                                    </>
                                    )}
                                </Cell>
                            </Column>
                            <Column width={200} flexGrow={1} align="center" resizable>
                                <HeaderCell>Ubicación</HeaderCell>
                                <Cell>{rowData => `${rowData.Municipio.nombre_municipio??""}`}</Cell>
                            </Column>

                            <Column width={200} flexGrow={1} align="center" resizable>
                                <HeaderCell>Estrato</HeaderCell>
                                <Cell dataKey="estrato" />
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
                                                onClick={() => navigate(`/housing-forms?edit=${rowData.id}`)}
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
export default HousingListPage;