import React from 'react';
import { FormInput } from './FormInput';
import { PersonalInfo } from '../types';

interface ContactFormProps {
    data: PersonalInfo;
    errors: Record<string, string>;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    activeSection: string;
}

export const ContactForm: React.FC<ContactFormProps> = ({
    data,
    errors,
    onChange,
    activeSection,
}) => {
    if (activeSection !== 'contact') return null;

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-6">Información de Contacto</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                    label="Email"
                    type="email"
                    name="email"
                    value={data.email}
                    onChange={onChange}
                    error={errors.email}
                    required
                />
                <FormInput
                    label="Celular"
                    type="number"
                    name="celular"
                    value={data.celular}
                    onChange={onChange}
                    error={errors.celular}
                    required
                />
            </div>
        </div>
    );
};
