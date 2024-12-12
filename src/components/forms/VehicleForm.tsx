import React from 'react';
import { FormInput } from '../common/FormInput';
import { Vehiculo } from '../../types';

interface VehicleFormProps {
    data: Vehiculo;
    errors: Record<string, string>;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    activeSection: string;
}

export const VehicleForm: React.FC<VehicleFormProps> = ({
    data,
    errors,
    onChange,
    activeSection,
}) => {
    if (activeSection !== 'vehicles') return null;

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-6">Información del Vehículo</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                    label="Nombre"
                    type="text"
                    name="nombre"
                    value={data.nombre}
                    onChange={onChange}
                    error={errors.nombre}
                    required
                />
                <FormInput
                    label="Marca"
                    type="text"
                    name="marca"
                    value={data.marca}
                    onChange={onChange}
                    error={errors.marca}
                    required
                />
                <FormInput
                    label="Tipo"
                    type="text"
                    name="tipo"
                    value={data.tipo}
                    onChange={onChange}
                    error={errors.tipo}
                    required
                />
                <FormInput
                    label="Color"
                    type="text"
                    name="color"
                    value={data.color}
                    onChange={onChange}
                    error={errors.color}
                    required
                />
                <FormInput
                    label="Valor Nuevo"
                    type="number"
                    name="valor_nuevo"
                    value={data.valor_nuevo}
                    onChange={onChange}
                    error={errors.valor_nuevo}
                    required
                />
                <FormInput
                    label="Placa"
                    type="text"
                    name="placa"
                    value={data.placa}
                    onChange={onChange}
                    error={errors.placa}
                    required
                />
            </div>
        </div>
    );
};