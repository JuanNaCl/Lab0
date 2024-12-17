import React, { useEffect, useState } from 'react';
import { Departamento } from '../../types';
import supabase from '../common/supabaseClient';
import { FormSelect } from '../common/FormSelect';

interface DepartamentFormProps {
    departamentoData: Departamento;
    errors: Record<string, string>;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    activeSection: string;
}

export const DepartamentForm: React.FC<DepartamentFormProps> = ({
    departamentoData,
    errors,
    onChange,
    activeSection,
}) => {


    const [personaOptions, setPersonaOptions] = useState<{ value: number, label: string }[]>([]);
    const [nameDepartamentos, setNameDepartamentos] = useState<{ value: number, label: string }[]>([]);
    useEffect(() => {
        if (activeSection === 'departament') {
            fetchDepartamentos();
            fetchPersonas()
        }
    }, [activeSection]);

    

    const fetchDepartamentos = async () => {
        const { data: Departamentos, error } = await supabase
            .from('Departamento')
            .select('*')
            .is('id_gobernador', null);
        if (error) {
            console.error("Error fetching Departamento:", error);
        } else if (Departamentos?.length === 0) {
            console.error("No Departamento found");
        } else {
            const formattedOptions = Departamentos!.map(Departamento => ({
                value: Departamento.id!, label: `(${Departamento.codigo_departamento}) ${Departamento.nombre_departamento}`,
            })); setNameDepartamentos(formattedOptions);
        }
    };

    const fetchPersonas = async () => {
        // Primero, obtenemos los Departamentos que tienen alcaldes
        const { data: DepartamentosConGobernador, error: DepartamentoError } = await supabase
            .from('Departamento')
            .select('id, id_gobernador')
            .not('id_gobernador', 'is', null);

        if (DepartamentoError) {
            console.error(DepartamentoError);
        } else if (DepartamentosConGobernador?.length === 0) {
            console.log("No Departamentos found");
        }
        // Extraemos los ids de los alcaldes
        const gobernadorIds = DepartamentosConGobernador!.map(Departamento => parseInt(Departamento.id_gobernador));
        // Luego, obtenemos las personas que no son alcaldes
        let { data: personas, error: personaError } = await supabase
            .from('Persona')
            .select('*')
            .not('id', 'in', `(${gobernadorIds.join(',')})`);
        if (personaError) {
            console.error("Error fetching Personas:", personaError);
        } else if (personas?.length === 0) {
            console.error("No Personas found");
        } else {
            const formattedOptions = personas!.map(persona => ({
                value: persona.id!, label: `(${persona.cedula}) ${persona.primer_nombre} ${persona.segundo_nombre ?? ''} ${persona.primer_apellido} ${persona.segundo_apellido}`,
            })); setPersonaOptions(formattedOptions);
        }
    };

    if (activeSection !== 'departament') return null;
    return (
        <div className="space-y-8">
            <div>
            <div className="flex items-center mb-6 justify-between">
                    <h2 className="text-2xl font-semibold text-emerald-800">Información del Departamento</h2>
                    <button
                        type="button"
                        className="px-4 py-2 text-emerald-800 rounded"
                        onClick={() => {
                            fetchDepartamentos();
                            fetchPersonas();
                        }}>
                        Actualizar
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormSelect
                        label="Nombre del departamento"
                        options={nameDepartamentos}
                        name="nombre_departamento"
                        value={departamentoData.nombre_departamento}
                        onChange={onChange}
                        error={errors.nombre_departamento}
                        required
                    />
                    <FormSelect
                        label="Nombre del gobernador"
                        options={personaOptions}
                        name="id_gobernador"
                        value={departamentoData.id_gobernador}
                        onChange={onChange}
                        error={errors.id_gobernador}
                        required
                    />
                </div>
            </div>
        </div>
    );
};