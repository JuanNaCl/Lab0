import React, { useEffect, useState } from 'react';
import { Departamento } from '../../types';
import supabase from '../common/supabaseClient';
import { FormSelect } from '../common/FormSelect';

interface DepartamentFormProps {
    departamentoData: Departamento;
    errors: Record<string, string>;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export const DepartamentForm: React.FC<DepartamentFormProps> = ({
    departamentoData,
    errors,
    onChange,
}) => {


    const [personaOptions, setPersonaOptions] = useState<{ value: number, label: string }[]>([]);
    const [nameDepartamentos, setNameDepartamentos] = useState<{ value: number, label: string }[]>([]);

    const fetchDepartamentos = async () => {
        let { data: Departamentos, error } = await supabase
            .from('Departamento')
            .select('*')
            .is('id_gobernador', null);
    
        if (error) {
            console.error("Error fetching Departamentos:", error);
        } else if (Departamentos?.length === 0) {
            console.error("No Departamentos found");
        }
    
        // Añadir el departamento actual a la lista si no está presente
        if (departamentoData.id) {
            const departamentoActual = await supabase
                .from('Departamento')
                .select('*')
                .eq('id', departamentoData.id)
                .single();
    
            if (departamentoActual.data && 
                !Departamentos?.some(d => d.id === departamentoActual.data.id)) {
                Departamentos?.push(departamentoActual.data);
            }
        }
    
        // Formatear las opciones
        const formattedOptions = Departamentos!.map(departamento => ({
            value: departamento.id,
            label: `(${departamento.codigo_departamento}) ${departamento.nombre_departamento}`,
        }));
    
        setNameDepartamentos(formattedOptions);
    };
    

    const fetchPersonas = async () => {
        // Primero, obtenemos los Departamentos que tienen un gobernador
        const { data: DepartamentosConGobernador, error: DepartamentoError } = await supabase
            .from('Departamento')
            .select('id, id_gobernador')
            .not('id_gobernador', 'is', null);
        
        if (DepartamentoError) {
            console.error(DepartamentoError);
        } else if (DepartamentosConGobernador?.length === 0) {
            console.log("No Departamentos found");
        }
        
        // Extraemos los ids de los gobernadores
        const gobernadorIds = DepartamentosConGobernador!.map(Departamento => parseInt(Departamento.id_gobernador));
        
        // Luego, obtenemos todas las personas
        const { data: todasPersonas, error: todasPersonasError } = await supabase
            .from('Persona')
            .select('*');
        
        if (todasPersonasError) {
            console.error("Error fetching all Personas:", todasPersonasError);
        } else if (todasPersonas?.length === 0) {
            console.error("No Personas found");
        }
        
        // Añadimos la persona con el id actual de gobernador si no está en gobernadorIds
        if (departamentoData.id_gobernador && !gobernadorIds.includes(departamentoData.id_gobernador)) {
            gobernadorIds.push(departamentoData.id_gobernador);
        }
        
        // Filtramos para obtener solo las personas que no son gobernadores o la persona que tiene el id actual de gobernador
        const personasFiltradas = todasPersonas!.filter(persona => 
            !gobernadorIds.includes(persona.id!) || persona.id === departamentoData.id_gobernador);
        
        const formattedOptions = personasFiltradas!.map(persona => ({
            value: persona.id!,
            label: `(${persona.cedula}) ${persona.primer_nombre} ${persona.segundo_nombre ?? ''} ${persona.primer_apellido} ${persona.segundo_apellido}`,
        }));
        
        setPersonaOptions(formattedOptions);
    };
    

    useEffect(() => {
        fetchDepartamentos();
        fetchPersonas();
    }, [departamentoData]); 
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
                        value={nameDepartamentos.find((option) =>
                            option.value === departamentoData.id || option.value === departamentoData.nombre_departamento?.value
                        )}
                        onChange={onChange}
                        error={errors.nombre_departamento}
                        required
                    />
                    <FormSelect
                        label="Nombre del gobernador"
                        options={personaOptions}
                        name="id_gobernador"
                        value={personaOptions.find((option) => option.value === departamentoData.id_gobernador)}
                        onChange={onChange}
                        error={errors.id_gobernador}
                        required
                    />
                </div>
            </div>
        </div>
    );
};