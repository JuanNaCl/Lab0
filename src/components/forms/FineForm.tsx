import React from 'react';
import { FormInput } from '../common/FormInput';
import { Comparendo } from '../../types';

interface FineFormProps {
    data: Comparendo;
    errors: Record<string, string>;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    activeSection: string;
}

export const FineForm: React.FC<FineFormProps> = ({
    data,
    errors,
    onChange,
    activeSection,
}) => {
    if (activeSection !== 'fines') return null;

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-6">Información de Comparendos</h2>
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
                    label="Monto"
                    type="number"
                    name="monto"
                    value={data.monto}
                    onChange={onChange}
                    error={errors.monto}
                    required
                />
                <FormInput
                    label="Fecha"
                    type="datetime-local"
                    name="fecha"
                    value={data.fecha}
                    onChange={onChange}
                    error={errors.fecha}
                    required
                />
                <FormInput
                    label="Razón"
                    type="text"
                    name="razon"
                    value={data.razon}
                    onChange={onChange}
                    error={errors.razon}
                    required
                />
                <FormInput
                    label="Nota"
                    type="text"
                    name="nota"
                    value={data.nota}
                    onChange={onChange}
                    error={errors.nota}
                />
                <FormInput
                    label="Imagen"
                    type="file"
                    name="imagen"
                    value={data.imagen}
                    onChange={onChange}
                    error={errors.imagen}
                    accept="image/*"
                />
            </div>
        </div>
    );
};