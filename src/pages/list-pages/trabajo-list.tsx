import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Column, HeaderCell, Cell } from 'rsuite-table';
import 'rsuite-table/dist/css/rsuite-table.css';
import supabase from '../../components/common/supabaseClient';
import { Trabajo, Empresa } from '../../types';
import { IconButton } from 'rsuite';
import EditIcon from '@rsuite/icons/Edit';
import TrashIcon from '@rsuite/icons/Trash';
import UserInfoIcon from '@rsuite/icons/UserInfo';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Navbar } from '../../components/common/NavbarNueva';

const WorkListPage = () => {
    const [trabajos, setTrabajos] = useState<Trabajo[]>([]);
    const [empresas, setEmpresas] = useState<Empresa[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTrabajos = async () => {
            const { data, error } = await supabase
                .from('Trabajo')
                .select('*');
            if (error) {
                console.error('Error fetching trabajos:', error);
            } else {
                setTrabajos(data);
            }
        };

        const fetchEmpresas = async () => {
            const { data, error } = await supabase
                .from('Empresa')
                .select('*');
            if (error) {
                console.error('Error fetching empresas:', error);
            } else {
                setEmpresas(data);
            }
        };

        fetchTrabajos();
        fetchEmpresas();
    }, []);

    const handleDelete = async (id: number) => {
        try {
            // Eliminar registros en la tabla Persona_Trabajo
            const { error: deletePersonaTrabajoError } = await supabase
                .from('Persona_Trabajo')
                .delete()
                .eq('id_trabajo', id);
            if (deletePersonaTrabajoError) {
                throw deletePersonaTrabajoError;
            }
    
            // Eliminar el trabajo
            const { error: deleteTrabajoError } = await supabase
                .from('Trabajo')
                .delete()
                .eq('id', id);
            if (deleteTrabajoError) {
                throw deleteTrabajoError;
            }
    
            // Actualizar el estado local
            setTrabajos(trabajos.filter(trabajo => trabajo.id !== id));
            toast.success('Trabajo y Aplicaciones asociadas eliminadas correctamente', {
                position: "top-right",
                autoClose: 2250,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } catch (error) {
            console.error('Error deleting trabajo:', error);
            toast.error(
                <>
                    Error al eliminar el Trabajo.
                </>, {
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

    const getEmpresaNombre = (empresaId: number) => {
        const empresa = empresas.find(e => e.id === empresaId);
        return empresa ? empresa.nombre : 'Desconocida';
    };

    return (
        <div className="min-h-screen bg-emerald-50">
            <Navbar activeSection={"work"} />
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold">Trabajos</h1>
                        <button
                            onClick={() => navigate('/work-forms')}
                            className="flex items-center space-x-2 px-6 py-2 bg-emerald-500 text-white rounded-lg transition-all duration-200 transform hover:bg-emerald-600 hover:scale-105"
                        >
                            Crear
                        </button>
                    </div>
                    <div className='overflow-x-auto'>
                        <Table data={trabajos} autoHeight shouldUpdateScroll>
                            <Column width={200} flexGrow={1} align="center" resizable>
                                <HeaderCell><b>ID</b></HeaderCell>
                                <Cell dataKey="id" />
                            </Column>

                            <Column width={200} flexGrow={1} align="center" resizable>
                                <HeaderCell><b>Nombre</b></HeaderCell>
                                <Cell dataKey="nombre" />
                            </Column>

                            <Column width={200} flexGrow={1} align="center" resizable>
                                <HeaderCell><b>Media Salarial</b></HeaderCell>
                                <Cell dataKey="media_salarial" />
                            </Column>

                            <Column width={200} flexGrow={1} align="center" resizable>
                                <HeaderCell><b>Empresa Ofertante</b></HeaderCell>
                                <Cell>
                                    {rowData => getEmpresaNombre(rowData.id_empresa)}
                                </Cell>
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
                                                onClick={() => navigate(`/work-forms?edit=${rowData.id}`)}
                                                className="mr-2"
                                            />
                                            <IconButton
                                                icon={<TrashIcon style={{ color: 'red' }} />}
                                                appearance="subtle"
                                                size="xs"
                                                onClick={() => handleDelete(rowData.id)}
                                                className='mr-2'
                                            />
                                            <IconButton
                                                icon={<UserInfoIcon style={{ color: 'blue' }} />}
                                                appearance="primary"
                                                size="xs"
                                                onClick={() => navigate(`/work-apply?apply=${rowData.id}`)}
                                            >
                                                <span className="text-blue-800 ml-1">Aplicar</span>
                                            </IconButton>
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

export default WorkListPage;
