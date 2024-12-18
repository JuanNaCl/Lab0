import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Column, HeaderCell, Cell } from 'rsuite-table';
import 'rsuite-table/dist/css/rsuite-table.css';
import supabase from '../../components/common/supabaseClient';
import { Empresa } from '../../types';
import { IconButton } from 'rsuite';
import EditIcon from '@rsuite/icons/Edit';
import TrashIcon from '@rsuite/icons/Trash';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Navbar } from '../../components/common/NavbarNueva';

const CompaniesListPage = () => {
    const [empresas, setEmpresas] = useState<Empresa[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEmpresas = async () => {
            const { data, error } = await supabase
                .from('Empresa')
                .select('*,Departamento(*)');

            if (error) {
                console.error('Error fetching companies:', error);
            } else {
                setEmpresas(data);
            }
        };
        fetchEmpresas();
    }, []);

    const handleDelete = async (id: number) => {
        const { error } = await supabase
            .from('Empresa')
            .delete()
            .eq('id', id);
        if (error) {
            console.error('Error deleting company:', error);
            toast.error(
              <>
                Error al eliminar la empresa: <br />Elimine los trabajos asociados <br />antes volver a intentar.
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
            setEmpresas(empresas.filter(Empresa => Empresa.id !== id));
            toast.success("Empresa eliminada correctamente");
        }
    };

    return (
        <div className="min-h-screen bg-emerald-50">
            <Navbar activeSection="company" />
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold">Empresas</h1>
                        <button
                            onClick={() => navigate('/company-forms')}
                            className="flex items-center space-x-2 px-6 py-2 bg-emerald-500 text-white rounded-lg transition-all duration-200 transform hover:bg-emerald-600 hover:scale-105"
                        >
                            Crear
                        </button>
                    </div>
                    {/* Contenedor responsivo */}
                    <div className="overflow-x-auto">
                        <Table data={empresas} autoHeight shouldUpdateScroll>
                            <Column width={200} flexGrow={1} align="center" resizable>
                                <HeaderCell>Nombre Empresa</HeaderCell>
                                <Cell dataKey="nombre" />
                            </Column>

                            <Column width={200} flexGrow={1} align="center" resizable>
                                <HeaderCell>Departamento constitución</HeaderCell>
                                {<Cell>{rowData => `${rowData.Departamento.nombre_departamento??""}`}</Cell>}
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
                                                onClick={() => navigate(`/company-forms?edit=${rowData.id}`)}
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

export default CompaniesListPage;
