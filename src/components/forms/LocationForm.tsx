import React from 'react';
import { FormInput } from '../common/FormInput';
import { Municipio, Departamento } from '../../types';

interface LocationFormProps {
    municipioData: Municipio;
    departamentoData: Departamento;
    errors: Record<string, string>;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    activeSection: string;
}

export const LocationForm: React.FC<LocationFormProps> = ({
    municipioData,
    departamentoData,
    errors,
    onChange,
    activeSection,
}) => {
    if (activeSection !== 'location') return null;

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-semibold mb-6">Información del Municipio</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                        label="Nombre del Municipio"
                        type="text"
                        name="nombre_municipio"
                        value={municipioData.nombre_municipio}
                        onChange={onChange}
                        error={errors.nombre_municipio}
                        required
                    />
                    <FormInput
                        label="Código del Municipio"
                        type="number"
                        name="codigo_municipio"
                        value={municipioData.codigo_municipio}
                        onChange={onChange}
                        error={errors.codigo_municipio}
                        required
                    />
                    <FormInput
                        label="Área Total"
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

            <div>
                <h2 className="text-2xl font-semibold mb-6">Información del Departamento</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                        label="Nombre del Departamento"
                        type="text"
                        name="nombre_departamento"
                        value={departamentoData.nombre_departamento}
                        onChange={onChange}
                        error={errors.nombre_departamento}
                        required
                    />
                    <FormInput
                        label="Código del Departamento"
                        type="number"
                        name="codigo_departamento"
                        value={departamentoData.codigo_departamento}
                        onChange={onChange}
                        error={errors.codigo_departamento}
                        required
                    />
                </div>
            </div>
        </div>
    );
};