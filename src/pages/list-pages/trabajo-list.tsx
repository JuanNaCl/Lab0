import React, { useEffect, useState } from 'react';
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
        const { error } = await supabase
            .from('Trabajo')
            .delete()
            .eq('id', id);
        if (error) {
            console.error('Error deleting trabajo:', error);
            toast.error(
                <>
                    Error al eliminar el Trabajo.<br />Este trabajo está siendo referenciado en otra tabla.
                </>, {
                position: "top-right",
                autoClose: 2500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } else {
            setTrabajos(trabajos.filter(trabajo => trabajo.id !== id));
            toast.success('Trabajo eliminado correctamente', {
                position: "top-right",
                autoClose: 2500,
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
                    <Table data={trabajos} autoHeight>
                        <Column flexGrow={1} align="center" fixed>
                            <HeaderCell>ID</HeaderCell>
                            <Cell dataKey="id" />
                        </Column>

                        <Column flexGrow={1} align="center">
                            <HeaderCell>Nombre</HeaderCell>
                            <Cell dataKey="nombre" />
                        </Column>

                        <Column flexGrow={1} align="center">
                            <HeaderCell>Media Salarial</HeaderCell>
                            <Cell dataKey="media_salarial" />
                        </Column>

                        <Column flexGrow={1} align="center">
                            <HeaderCell>Empresa Ofertante</HeaderCell>
                            <Cell>
                                {rowData => getEmpresaNombre(rowData.id_empresa)}
                            </Cell>
                        </Column>

                        <Column flexGrow={1} align="center">
                            <HeaderCell>Acciones</HeaderCell>
                            <Cell>
                                {rowData => (
                                    <span>
                                        <IconButton
                                            icon={<EditIcon style={{ color: 'green' }} />}
                                            appearance="primary"
                                            size="xs"
                                            onClick={() => navigate(`/work-forms?edit=${rowData.id}`)}
                                            className="mr-4"
                                        />
                                        <IconButton
                                            icon={<TrashIcon style={{ color: 'red' }} />}
                                            appearance="subtle"
                                            size="xs"
                                            onClick={() => handleDelete(rowData.id)}
                                            className='mr-4'
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
            </main>
            <ToastContainer />
        </div>
    );
};

export default WorkListPage;
