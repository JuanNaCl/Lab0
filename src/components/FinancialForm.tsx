import React from 'react';
import { FormInput } from './FormInput';
import { PersonalInfo } from '../types';

interface FinancialFormProps {
    data: PersonalInfo;
    errors: Record<string, string>;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    activeSection: string;
}

export const FinancialForm: React.FC<FinancialFormProps> = ({
    data,
    errors,
    onChange,
    activeSection,
}) => {
    if (activeSection !== 'financial') return null;

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-6">Información Financiera</h2>
            <div className="grid grid-cols-1 gap-4">
                <FormInput
                    label="Salario"
                    type="number"
                    name="salario"
                    value={data.salario}
                    onChange={onChange}
                    error={errors.salario}
                    required
                />
            </div>
        </div>
    );
};