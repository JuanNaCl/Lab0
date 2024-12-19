import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Column, HeaderCell, Cell } from 'rsuite-table';
import 'rsuite-table/dist/css/rsuite-table.css';
import supabase from '../../components/common/supabaseClient';
import { Comparendo } from '../../types';
import { IconButton } from 'rsuite';
import EditIcon from '@rsuite/icons/Edit';
import TrashIcon from '@rsuite/icons/Trash';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Navbar } from '../../components/common/NavbarNueva';

const TicketListPage = () => {
    const [tickets, setTickets] = useState<Comparendo[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTickets = async () => {
            const { data, error } = await supabase
                .from('Comparendo')
                .select(`*, Persona: id_poseedor (primer_nombre, segundo_nombre, primer_apellido, segundo_apellido)`);

            if (error) {
                console.error('Error fetching tickets:', error);
                toast.error('Error al cargar los comparendos');
            } else {
                // Mapear para construir el nombre completo del poseedor
                const ticketsConPoseedor = data.map(ticket => ({
                    ...ticket,
                    nombre: ticket.Persona
                        ? `${ticket.Persona.primer_nombre} ${ticket.Persona.segundo_nombre || ''} ${ticket.Persona.primer_apellido} ${ticket.Persona.segundo_apellido || ''}`
                        : 'Desconocido',
                }));
                setTickets(ticketsConPoseedor);
            }
        };

        fetchTickets();
    }, []);

    const handleDelete = async (id: number) => {
        const { error } = await supabase
            .from('Comparendo')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting ticket:', error);
            toast.error('Error al eliminar el comparendo');
        } else {
            setTickets(tickets.filter(ticket => ticket.id !== id));
            toast.success('Comparendo eliminado correctamente');
        }
    };

    return (
        <div className="min-h-screen bg-emerald-50">
            <Navbar activeSection={"fines"} />
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold">Comparendos</h1>
                        <button
                            onClick={() => navigate('/ticket-forms')}
                            className="flex items-center space-x-2 px-6 py-2 bg-emerald-500 text-white rounded-lg transition-all duration-200 transform hover:bg-emerald-600 hover:scale-105"
                        >
                            Crear
                        </button>
                    </div>
                    {/* Contenedor responsivo */}
                    <div className="overflow-x-auto">
                        <Table data={tickets} autoHeight shouldUpdateScroll>
                            <Column width={200}  align="center" resizable>
                                <HeaderCell>Fecha</HeaderCell>
                                <Cell dataKey="fecha" />
                            </Column>

                            <Column width={100} align="center" resizable>
                                <HeaderCell>Monto (COP)</HeaderCell>
                                <Cell>{rowData => `${rowData.monto}`}</Cell>
                            </Column>

                            <Column width={250} align="center" resizable>
                                <HeaderCell>Razón</HeaderCell>
                                <Cell dataKey="razon" />
                            </Column>

                            <Column width={300} align="center" resizable>
                                <HeaderCell>Poseedor</HeaderCell>
                                <Cell dataKey="nombre" />
                            </Column>

                            <Column width={200}  align="center" resizable>
                                <HeaderCell>Nota</HeaderCell>
                                <Cell dataKey="nota" />
                            </Column>

                            <Column width={200}  align="center" resizable>
                                <HeaderCell>Acciones</HeaderCell>
                                <Cell>
                                    {rowData => (
                                        <span>
                                            <IconButton
                                                icon={<EditIcon style={{ color: 'green' }} />}
                                                appearance="primary"
                                                size="xs"
                                                onClick={() => navigate(`/ticket-forms?edit=${rowData.id}`)}
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

export default TicketListPage;
