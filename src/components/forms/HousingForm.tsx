import React from 'react';
import { FormInput } from '../common/FormInput';
import { Vivienda } from '../../types';

interface HousingFormProps {
    data: Vivienda;
    errors: Record<string, string>;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    activeSection: string;
}

export const HousingForm: React.FC<HousingFormProps> = ({
    data,
    errors,
    onChange,
    activeSection,
}) => {
    if (activeSection !== 'housing') return null;

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-6">Información de Vivienda</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>
        </div>
    );
};