import React from 'react';
import { FormInput } from './FormInput';
import { PersonalInfo } from '../types';

interface PersonalInfoFormProps {
    data: PersonalInfo;
    errors: Record<string, string>;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    activeSection: string;
}

export const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
    data,
    errors,
    onChange,
    activeSection,
}) => {
    if (activeSection !== 'personal') return null;

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-6">Información Personal</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                    label="Primer Nombre"
                    type="text"
                    name="primer_nombre"
                    value={data.primer_nombre}
                    onChange={onChange}
                    error={errors.primer_nombre}
                    required
                />
                <FormInput
                    label="Segundo Nombre"
                    type="text"
                    name="segundo_nombre"
                    value={data.segundo_nombre}
                    onChange={onChange}
                    error={errors.segundo_nombre}
                />
                <FormInput
                    label="Primer Apellido"
                    type="text"
                    name="primer_apellido"
                    value={data.primer_apellido}
                    onChange={onChange}
                    error={errors.primer_apellido}
                    required
                />
                <FormInput
                    label="Segundo Apellido"
                    type="text"
                    name="segundo_apellido"
                    value={data.segundo_apellido}
                    onChange={onChange}
                    error={errors.segundo_apellido}
                />
                <FormInput
                    label="Fecha de Nacimiento"
                    type="date"
                    name="fecha_nacimiento"
                    value={data.fecha_nacimiento}
                    onChange={onChange}
                    error={errors.fecha_nacimiento}
                    required
                />
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sexo<span className="text-red-500 ml-1">*</span>
                    </label>
                    <select
                        name="sexo"
                        value={data.sexo}
                        onChange={onChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 border-gray-300 focus:ring-blue-200 focus:border-blue-500"
                    >
                        <option value="">Seleccione...</option>
                        <option value="Masculino">Masculino</option>
                        <option value="Femenino">Femenino</option>
                        <option value="Otro">Otro</option>
                    </select>
                    {errors.sexo && <p className="mt-1 text-sm text-red-500">{errors.sexo}</p>}
                </div>
            </div>
        </div>
    );
};