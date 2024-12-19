import React, { useEffect, useState } from 'react';
import { FormInput } from '../common/FormInput';
import { Vivienda, Persona_Vivienda } from '../../types';
import { FormSelect } from '../common/FormSelect';
import supabase from '../common/supabaseClient';

interface HousingFormProps {
    dataVivienda: Vivienda;
    dataPersonaVivienda:Persona_Vivienda;
    errors: Record<string, string>;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    activeSection: string;
}

export const HousingForm: React.FC<HousingFormProps> = ({
    dataVivienda,
    dataPersonaVivienda,
    errors,
    onChange,
    activeSection,
}) => {
    const [personaOptions, setPersonaOptions] = useState<{ value: number, label: string }[]>([]);
    const [municipioOptions, setMunicipioOptions] = useState<{ value: number, label: string }[]>([]);

    // #region ~~~~~~~~~~~~~~~~~~~~ Persona Fetch ~~~~~~~~~~~~~~~~~~~

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
                value: persona.id!, label: `${persona.primer_nombre} ${persona.segundo_nombre ?? ''} ${persona.primer_apellido} ${persona.segundo_apellido ?? ''}`,
            })); setPersonaOptions(formattedOptions);
        }
    };
    // #endregion
    // #region ~~~~~~~~~~~~~~~~~~~~ Municipio Fetch ~~~~~~~~~~~~~~~~~~~~
    const fetchMunicipios = async () => {
        const { data: Municipio, error } = await supabase
        .from('Municipio')
        .select('*');
        
        console.log(Municipio)
        if (error) {
            console.error("Error fetching Municipios:", error);
        } else if (Municipio?.length === 0) {
            console.error("No Municipios found");
        } else {
            const formattedOptions = Municipio!.map(municipio => ({
                value: municipio.id!, label: `${municipio.nombre_municipio}`, // (${municipio.Departamento.nombre_departamento})
            })
            
        ); 
        setMunicipioOptions(formattedOptions);
        }
        
    };
    
    // #endregion
    useEffect(() => {
        console.log('pre fetch',municipioOptions);
        if (activeSection === 'housing') {
            fetchMunicipios();
            fetchPersonas()
        }
        
        console.log('post fetch', municipioOptions);
    }, [activeSection]);
    
    if (activeSection !== 'housing') return null;

    
    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-6">Información de Vivienda</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormSelect
                    label="Propietario"
                    // type="text"
                    name="id_persona"
                    value={dataPersonaVivienda.id_persona}
                    options={personaOptions}
                    onChange={onChange}
                    error={errors.id_persona}
                    required
                />
                <FormSelect
                    label="Municipios"
                    // type="text"
                    name="id_municipio"
                    value={dataVivienda.id_municipio}
                    options={municipioOptions}
                    onChange={onChange}
                    error={errors.id_municipio}
                    required
                />
                <FormInput
                    label="Dirección"
                    type="text"
                    name="direccion"
                    value={dataVivienda.direccion}
                    onChange={onChange}
                    error={errors.direccion}
                    required
                />
                <FormInput
                    label="Barrio"
                    type="text"
                    name="barrio"
                    value={dataVivienda.barrio}
                    onChange={onChange}
                    error={errors.barrio}
                    required
                />
                <FormInput
                    label="Pisos"
                    type="number"
                    name="pisos"
                    value={dataVivienda.pisos}
                    onChange={onChange}
                    error={errors.pisos}
                    required
                />
                <FormInput
                    label="Área Construida (m²)"
                    type="number"
                    name="area_construida"
                    value={dataVivienda.area_construida}
                    onChange={onChange}
                    error={errors.area_construida}
                    required
                />
                <FormInput
                    label="Área Total (m²)"
                    type="number"
                    name="area_total"
                    value={dataVivienda.area_total}
                    onChange={onChange}
                    error={errors.area_total}
                    required
                />
                <FormInput
                    label="Habitaciones"
                    type="number"
                    name="habitaciones"
                    value={dataVivienda.habitaciones}
                    onChange={onChange}
                    error={errors.habitaciones}
                    required
                />
                <FormInput
                    label="Baños"
                    type="number"
                    name="baños"
                    value={dataVivienda.baños}
                    onChange={onChange}
                    error={errors.baños}
                    required
                />
                <FormInput
                    label="Estrato"
                    type="number"
                    name="estrato"
                    value={dataVivienda.estrato}
                    onChange={onChange}
                    error={errors.estrato}
                    required
                />
                <FormSelect
                    label="Tipo"
                    // type="text"
                    name="tipo"
                    value={dataVivienda.tipo}
                    options={[{ value: 1, label: 'Casa' }, { value: 2, label: 'Apartamento' }, { value: 3, label: 'Apartaestudio' }]}
                    onChange={onChange}
                    error={errors.tipo}
                    required
                />
            </div>
        </div>
    );
};