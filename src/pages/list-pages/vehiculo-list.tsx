import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Column, HeaderCell, Cell } from 'rsuite-table';
import 'rsuite-table/dist/css/rsuite-table.css';
import supabase from '../../components/common/supabaseClient';
import { Vehiculo } from '../../types';
import { IconButton } from 'rsuite';
import EditIcon from '@rsuite/icons/Edit';
import TrashIcon from '@rsuite/icons/Trash';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Navbar } from '../../components/common/NavbarNueva';

const VehiclesListPage = () => {
    const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
    const navigate = useNavigate();
    const tipoVehiculo: Record<number, string> = {
        1: 'Carro',
        2: 'Camion',
        3: 'Moto',
    };

    useEffect(() => {
        const fetchVehiculos = async () => {
            const { data, error } = await supabase
                .from('Vehiculo')
                .select('*');

            if (error) {
                console.error('Error fetching Vehiculo:', error);
            } else {
                const vehiculosConTipo = data.map(vehiculo => ({
                    ...vehiculo,
                    tipo: tipoVehiculo[vehiculo.tipo] || 'Desconocido',
                }));
                setVehiculos(vehiculosConTipo);
            }
        };

        fetchVehiculos();
    }, []);

    const handleDelete = async (id: number) => {
        const { error } = await supabase
            .from('Vehiculo')
            .delete()
            .eq('id', id);
        if (error) {
            console.error('Error deleting Vehiculo:', error);
        } else {
            setVehiculos(vehiculos.filter(Vehiculo => Vehiculo.id !== id));
        }
    };

    return (
        <div className="min-h-screen bg-emerald-50">
            <Navbar activeSection={"vehiculo"} />
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold">Vehiculos</h1>
                        <button
                            onClick={() => navigate('/vehiculo-forms')}
                            className="flex items-center space-x-2 px-6 py-2 bg-emerald-500 text-white rounded-lg transition-all duration-200 transform hover:bg-emerald-600 hover:scale-105"
                        >
                            Crear
                        </button>
                    </div>
                    {/* Contenedor responsivo */}
                    <div className="overflow-x-auto">
                        <Table data={vehiculos} autoHeight shouldUpdateScroll>
                            <Column width={200} flexGrow={1} align="center" resizable>
                                <HeaderCell><b>Placa</b></HeaderCell>
                                <Cell dataKey="placa" />
                            </Column>

                            <Column width={200} flexGrow={1} align="center" resizable>
                                <HeaderCell><b>Marca</b></HeaderCell>
                                <Cell dataKey="marca" />
                            </Column>

                            <Column width={200} flexGrow={1} align="center" resizable>
                                <HeaderCell><b>Color</b></HeaderCell>
                                <Cell dataKey="color" />
                            </Column>

                            <Column width={200} flexGrow={1} align="center" resizable>
                                <HeaderCell><b>Tipo</b></HeaderCell>
                                <Cell dataKey="tipo" />
                            </Column>

                            <Column width={200} flexGrow={1} align="center" resizable>
                                <HeaderCell><b>Acciones</b></HeaderCell>
                                <Cell>
                                    {rowData => (
                                        <span>
                                            <IconButton
                                                icon={<EditIcon style={{ color: 'green' }} />}
                                                appearance="primary"
                                                size="xs"
                                                onClick={() => navigate(`/vehiculo-forms?edit=${rowData.id}`)}
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

export default VehiclesListPage;
