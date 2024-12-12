import React from 'react';
import { FormInput } from '../common/FormInput';
import { Trabajo } from '../../types';

interface WorkFormProps {
    data: Trabajo;
    errors: Record<string, string>;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    activeSection: string;
}

export const WorkForm: React.FC<WorkFormProps> = ({
    data,
    errors,
    onChange,
    activeSection,
}) => {
    if (activeSection !== 'work') return null;

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-6">Información de Trabajo</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                    label="Nombre del Trabajo"
                    type="text"
                    name="nombre"
                    value={data.nombre}
                    onChange={onChange}
                    error={errors.nombre}
                    required
                />
                <FormInput
                    label="Media Salarial"
                    type="number"
                    name="media_salarial"
                    value={data.media_salarial}
                    onChange={onChange}
                    error={errors.media_salarial}
                    required
                />
            </div>
        </div>
    );
};