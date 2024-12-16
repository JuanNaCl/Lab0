import React, { useEffect, useState } from 'react';
import { FormInput } from '../common/FormInput';
import { Vivienda, Persona_Vivienda } from '../../types';
import { FormSelect } from '../common/FormSelect';
import supabase from '../common/supabaseClient';

interface HousingFormProps {
    data: Vivienda & Persona_Vivienda;
    errors: Record<string, string>;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    activeSection: string;
}

export const HousingForm: React.FC<HousingFormProps> = ({
    data,
    errors,
    onChange,
    activeSection,
}) => {
    // #region ~~~~~~~~~~~~~~~~~~~~ Persona Fetch ~~~~~~~~~~~~~~~~~~~~
    const [personaOptions, setPersonaOptions] = useState<{ value: number, label: string }[]>([]);
    useEffect(() => { fetchPersonas(); }, []);

    const fetchPersonas = async () => {
        const { data: Persona, error } = await supabase
        .from('Persona')
        .select('*');
        if (error) {
            console.error("Error fetching Personas:", error);
        } else if (Persona?.length === 0) {
            console.error("No Personas found");
        } else {
            const formattedOptions = Persona!.map(persona => ({
                value: persona.id!, label: `${persona.primer_nombre} ${persona.segundo_nombre ?? ''} ${persona.primer_apellido} ${persona.segundo_apellido}`,
            })); setPersonaOptions(formattedOptions);
        }
    };
    // #endregion
    // #region ~~~~~~~~~~~~~~~~~~~~ Municipio Fetch ~~~~~~~~~~~~~~~~~~~~
    const [municipioOptions, setMunicipioOptions] = useState<{ value: number, label: string }[]>([]);
    useEffect(() => { fetchMunicipios(); }, []);

    const fetchMunicipios = async () => {
        const { data: Municipio, error } = await supabase
        .from('Municipio')
        .select('*');
        
        if (error) {
            console.error("Error fetching Municipios:", error);
        } else if (Municipio?.length === 0) {
            console.error("No Municipios found");
        } else {
            const formattedOptions = Municipio!.map(municipio => ({
                value: municipio.id!, label: `${municipio.nombre_municipio}`, // (${municipio.Departamento.nombre_departamento})
            })); setMunicipioOptions(formattedOptions);
        }
    };
    // #endregion


    if (activeSection !== 'housing') return null;

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-6">Información de Vivienda</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormSelect
                    label="Propietario"
                    // type="text"
                    name="id_dueño"
                    value={data.id_persona}
                    options={personaOptions}
                    onChange={onChange}
                    error={errors.id_persona}
                    required
                />
                <FormSelect
                    label="Municipio"
                    // type="text"
                    name="id_municipio"
                    value={String(data.id_municipio)}
                    options={municipioOptions}
                    onChange={onChange}
                    error={errors.id_municipio}
                    required
                />
                <FormInput
                    label="Dirección"
                    type="text"
                    name="direccion"
                    value={data.direccion}
                    onChange={onChange}
                    error={errors.direccion}
                    required
                />
                <FormInput
                    label="Barrio"
                    type="text"
                    name="barrio"
                    value={data.barrio}
                    onChange={onChange}
                    error={errors.barrio}
                    required
                />
                <FormInput
                    label="Pisos"
                    type="number"
                    name="pisos"
                    value={data.pisos}
                    onChange={onChange}
                    error={errors.pisos}
                    required
                />
                <FormInput
                    label="Área Construida (m²)"
                    type="number"
                    name="area_construida"
                    value={data.area_construida}
                    onChange={onChange}
                    error={errors.area_construida}
                    required
                />
                <FormInput
                    label="Área Total (m²)"
                    type="number"
                    name="area_total"
                    value={data.area_total}
                    onChange={onChange}
                    error={errors.area_total}
                    required
                />
                <FormInput
                    label="Habitaciones"
                    type="number"
                    name="habitaciones"
                    value={data.habitaciones}
                    onChange={onChange}
                    error={errors.habitaciones}
                    required
                />
                <FormInput
                    label="Baños"
                    type="number"
                    name="baños"
                    value={data.baños}
                    onChange={onChange}
                    error={errors.baños}
                    required
                />
                <FormInput
                    label="Estrato"
                    type="number"
                    name="estrato"
                    value={data.estrato}
                    onChange={onChange}
                    error={errors.estrato}
                    required
                />
                <FormSelect
                    label="Tipo"
                    // type="text"
                    name="tipo"
                    value={data.tipo}
                    options={[{ value: 1, label: 'Casa' }, { value: 2, label: 'Apartamento' }, { value: 3, label: 'Apartaestudio' }]}
                    onChange={onChange}
                    error={errors.tipo}
                    required
                />
            </div>
        </div>
    );
};