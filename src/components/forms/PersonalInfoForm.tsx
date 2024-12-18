import React, { useState } from 'react';
import { FormInput } from '../common/FormInput';
import { PersonalInfo } from '../../types';
import { FormSelect } from '../common/FormSelect';

interface PersonalInfoFormProps {
    data: PersonalInfo;
    errors: Record<string, string>;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    activeSection: string;
}


export const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
    data,
    errors,
    onChange,
    activeSection,
}) => {
    if (activeSection !== 'personal') return null;  

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    return (
        <div className="space-y-4 animate-fadeIn">
            <h2 className="text-2xl font-semibold mb-6 text-emerald-800">Información Personal</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                    label="Primer Nombre"
                    type="text"
                    name="primer_nombre"
                    value={data.primer_nombre || ''}
                    onChange={onChange}
                    error={errors.primer_nombre}
                    required
                />
                <FormInput
                    label="Segundo Nombre"
                    type="text"
                    name="segundo_nombre"
                    value={data.segundo_nombre || ''}
                    onChange={onChange}
                    error={errors.segundo_nombre}
                />
                <FormInput
                    label="Primer Apellido"
                    type="text"
                    name="primer_apellido"
                    value={data.primer_apellido || ''}
                    onChange={onChange}
                    error={errors.primer_apellido}
                    required
                />
                <FormInput
                    label="Segundo Apellido"
                    type="text"
                    name="segundo_apellido"
                    value={data.segundo_apellido || ''}
                    onChange={onChange}
                    error={errors.segundo_apellido}
                />
                <FormInput
                    label="Cedula"
                    type="number"
                    name="cedula"
                    value={data.cedula || ''}
                    onChange={onChange}
                    error={errors.cedula}
                    required
                />
                <FormInput
                    label="Fecha de Nacimiento"
                    type="date"
                    name="fecha_nacimiento"
                    value={data.fecha_nacimiento ? formatDate(data.fecha_nacimiento) : ''}
                    onChange={onChange}
                    error={errors.fecha_nacimiento}
                    required
                />
                <FormSelect
                    label="Sexo"
                    name="sexo"
                    value={data.sexo ? { value: data.sexo.value, label: data.sexo.label } : ''}
                    options={[{ value: 1, label: 'Masculino' }, { value: 2, label: 'Femenino' }]}
                    onChange={onChange}
                    error={errors.sexo}
                    required
                />
                <FormInput
                    label="Email"
                    type="email"
                    name="email"
                    value={data.email || ''}
                    onChange={onChange}
                    error={errors.email}
                    required
                />
                <FormInput
                    label="Celular"
                    type="number"
                    name="celular"
                    value={data.celular || ''}
                    onChange={onChange}
                    error={errors.celular}
                    required
                />
                <FormInput
                    label="Salario"
                    type="number"
                    name="salario"
                    value={data.salario || ''}
                    onChange={onChange}
                    error={errors.salario}
                    required
                />
            </div>
        </div>
    );
};
