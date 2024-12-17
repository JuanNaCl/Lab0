import React, { useEffect, useState } from 'react';
import { FormInput } from '../common/FormInput';
import { Municipio } from '../../types';
import supabase from '../common/supabaseClient';
import { FormSelect } from '../common/FormSelect';

interface LocationFormProps {
    municipioData: Municipio;
    errors: Record<string, string>;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    activeSection: string;
}

export const LocationForm: React.FC<LocationFormProps> = ({
    municipioData,
    errors,
    onChange,
}) => {
    const [personaOptions, setPersonaOptions] = useState<{ value: number, label: string }[]>([]);
    const [nameMunicipios, setNameMunicipios] = useState<{ value: number, label: string }[]>([]);

    const fetchMunicipios = async () => {
        let { data: municipiosSinAlcalde, error: municipioError } = await supabase
            .from('Municipio')
            .select('*')
            .is('id_alcalde', null);
    
        if (municipioError) {
            console.error("Error fetching Municipios:", municipioError);
            return;
        }
    
        // Añadir el municipio actual a la lista si no está presente
        if (municipioData.id) {
            const municipioActual = await supabase
                .from('Municipio')
                .select('*')
                .eq('id', municipioData.id)
                .single();
    
            if (municipioActual.data && 
                !municipiosSinAlcalde?.some(m => m.id === municipioActual.data.id)) {
                municipiosSinAlcalde?.push(municipioActual.data);
            }
        }
    
        // Formatear las opciones
        const formattedOptions = municipiosSinAlcalde!.map(municipio => ({
            value: municipio.id,
            label: `(${municipio.codigo_municipio}) ${municipio.nombre_municipio}`,
        }));
    
        setNameMunicipios(formattedOptions);
    };
    

    const fetchPersonas = async () => {
    
        let { data: municipiosConAlcalde, error: municipioError } = await supabase
            .from('Municipio')
            .select('id, id_alcalde')
            .not('id_alcalde', 'is', null);
    
        if (municipioError) {
            console.error(municipioError);
        } else if (municipiosConAlcalde?.length === 0) {
            console.log("No municipios found");
        }
    
        const alcaldesIds = municipiosConAlcalde!.map(municipio => parseInt(municipio.id_alcalde));
    
        let { data: todasPersonas, error: todasPersonasError } = await supabase
            .from('Persona')
            .select('*');
    
        if (todasPersonasError) {
            console.error("Error fetching all Personas:", todasPersonasError);
        } else if (todasPersonas?.length === 0) {
            console.error("No Personas found");
        }
    
        if (municipioData.id_alcalde && !alcaldesIds.includes(municipioData.id_alcalde)) {
            alcaldesIds.push(municipioData.id_alcalde);
        }
    
        const personasFiltradas = todasPersonas!.filter(persona => !alcaldesIds.includes(persona.id!) || persona.id === municipioData.id_alcalde);
    
        const formattedOptions = personasFiltradas!.map(persona => ({
            value: persona.id!,
            label: `(${persona.cedula}) ${persona.primer_nombre} ${persona.segundo_nombre ?? ''} ${persona.primer_apellido} ${persona.segundo_apellido}`,
        }));

        setPersonaOptions(formattedOptions);
    };

    useEffect(() => {
        fetchMunicipios();
        fetchPersonas();
    }, [municipioData]);
    
    return (
        <div className="space-y-8">
            <div>
                <div className="flex items-center mb-6 justify-between">
                    <h2 className="text-2xl font-semibold text-emerald-800">Información del Municipio</h2>
                    <button
                        type="button"
                        className="px-4 py-2 text-emerald-800 rounded"
                        onClick={() => {
                            fetchMunicipios();
                            fetchPersonas();
                        }}>
                        Actualizar
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormSelect
                    label="Nombre del Municipio"
                    options={nameMunicipios}
                    name="nombre_municipio"
                    value={nameMunicipios.find((option) =>
                        option.value === municipioData.id || option.value === municipioData.nombre_municipio?.value
                    )}
                    onChange={onChange}
                    error={errors.nombre_municipio}
                    required
                />
                    <FormSelect
                        label="Nombre del alcalde"
                        options={personaOptions}
                        name="id_alcalde"
                        value={personaOptions.find((option) => option.value === municipioData.id_alcalde)}
                        onChange={onChange}
                        error={errors.id_alcalde}
                        required
                    />
                    <FormInput
                        label="Área Total (KM²)"
                        type="number"
                        name="area_total"
                        value={municipioData.area_total}
                        onChange={onChange}
                        error={errors.area_total}
                        required
                    />
                    <FormInput
                        label="Habitantes Censo 2023"
                        type="number"
                        name="habitantes_censo_2023"
                        value={municipioData.habitantes_censo_2023}
                        onChange={onChange}
                        error={errors.habitantes_censo_2023}
                        required
                    />
                </div>
            </div>
        </div>
    );
};
