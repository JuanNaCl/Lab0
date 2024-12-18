import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Column, HeaderCell, Cell } from 'rsuite-table';
import 'rsuite-table/dist/css/rsuite-table.css';
import supabase from '../../components/common/supabaseClient';
import { PersonalInfo } from '../../types';
import { IconButton } from 'rsuite';
import EditIcon from '@rsuite/icons/Edit';
import TrashIcon from '@rsuite/icons/Trash';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Navbar } from '../../components/common/NavbarNueva';

const PersonalListPage = () => {
  const [personas, setPersonas] = useState<PersonalInfo[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPersonas = async () => {
      const { data, error } = await supabase
        .from('Persona')
        .select('*');
      if (error) {
        console.error('Error fetching personas:', error);
      } else {
        setPersonas(data);
      }
    };

    fetchPersonas();
  }, []);

  const handleDelete = async (id: number) => {
    const { error } = await supabase
      .from('Persona')
      .delete()
      .eq('id', id);
    if (error) {
      console.error('Error deleting persona:', error);
      toast.error(
        <>
          Error al eliminar la Persona.<br />Esta persona está siendo referenciada en otra tabla.
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
      setPersonas(personas.filter(persona => persona.id !== id));
      toast.success('Persona eliminada correctamente', {
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

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  return (
    <div className="min-h-screen bg-emerald-50">
      <Navbar activeSection="personal" />
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Personas</h1>
            <button
              onClick={() => navigate('/personal-forms')}
              className="flex items-center space-x-2 px-6 py-2 bg-emerald-500 text-white rounded-lg transition-all duration-200 transform hover:bg-emerald-600 hover:scale-105"
            >
              Crear
            </button>
          </div>
          <div className='overflow-x-auto'>
            <Table data={personas} autoHeight shouldUpdateScroll>
              <Column width={200} flexGrow={1} align="center" resizable>
                <HeaderCell><b>Cedula</b></HeaderCell>
                <Cell dataKey="cedula" />
              </Column>

              <Column width={200} flexGrow={1} align="center" resizable>
                <HeaderCell><b>Primer Nombre</b></HeaderCell>
                <Cell dataKey="primer_nombre" />
              </Column>

              <Column width={200} flexGrow={1} align="center" resizable>
                <HeaderCell><b>Primer Apellido</b></HeaderCell>
                <Cell dataKey="primer_apellido" />
              </Column>

              <Column width={200} flexGrow={1} align="center" resizable>
                <HeaderCell><b>Fecha de Nacimiento</b></HeaderCell>
                <Cell>
                  {rowData => formatDate(rowData.fecha_nacimiento)}
                </Cell>
              </Column>

              <Column width={200} flexGrow={1} align="center" resizable>
                <HeaderCell><b>Email</b></HeaderCell>
                <Cell dataKey="email" />
              </Column>

              <Column width={200} flexGrow={1} align="center" resizable>
                <HeaderCell><b>Celular</b></HeaderCell>
                <Cell dataKey="celular" />
              </Column>

              <Column width={200} align="center" resizable>
                <HeaderCell><b>Acciones</b></HeaderCell>
                <Cell>
                  {rowData => (
                    <span>
                      <IconButton
                        icon={<EditIcon style={{ color: 'green' }} />}
                        appearance="primary"
                        size="xs"
                        onClick={() => navigate(`/personal-forms?edit=${rowData.id}`)}
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

export default PersonalListPage;
