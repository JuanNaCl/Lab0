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
    activeSection,
}) => {


    const [personaOptions, setPersonaOptions] = useState<{ value: number, label: string }[]>([]);
    useEffect(() => {
        if (activeSection === 'location') {
            fetchPersonas();
        }
    }, [activeSection]);

    const [nameMunicipios, setNameMunicipios] = useState<{ value: number, label: string }[]>([]);
    useEffect(() => {
        if (activeSection === 'location') {
            fetchMunicipios();
        }
    }, [activeSection]);

    const fetchMunicipios = async () => {
        let { data: Municipio, error } = await supabase
            .from('Municipio')
            .select('*')
            .is('id_alcalde', null);
        if (error) {
            console.error("Error fetching Personas:", error);
        } else if (Municipio?.length === 0) {
            console.error("No Personas found");
        } else {
            const formattedOptions = Municipio!.map(Municipio => ({
                value: Municipio.id!, label: `(${Municipio.codigo_municipio}) ${Municipio.nombre_municipio}`,
            })); setNameMunicipios(formattedOptions);

        }
    };

    const fetchPersonas = async () => {
        // Primero, obtenemos los municipios que tienen alcaldes
        let { data: municipiosConAlcalde, error: municipioError } = await supabase
            .from('Municipio')
            .select('id, id_alcalde')
            .not('id_alcalde', 'is', null);

        if (municipioError) {
            console.error(municipioError);
        } else if (municipiosConAlcalde?.length === 0) {
            console.log("No municipios found");
        }
        // Extraemos los ids de los alcaldes
        const alcaldesIds = municipiosConAlcalde!.map(municipio => parseInt(municipio.id_alcalde));
        // Luego, obtenemos las personas que no son alcaldes
        let { data: personas, error: personaError } = await supabase
            .from('Persona')
            .select('*')
            .not('id', 'in', `(${alcaldesIds.join(',')})`);
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

    if (activeSection !== 'location') return null;

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
                        value={municipioData.nombre_municipio}
                        onChange={onChange}
                        error={errors.nombre_municipio}
                        required
                    />
                    <FormSelect
                        label="Nombre del alcalde"
                        options={personaOptions}
                        name="id_alcalde"
                        value={municipioData.id_alcalde}
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