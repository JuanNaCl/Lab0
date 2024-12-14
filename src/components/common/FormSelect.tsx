import React from 'react';

interface FormSelectProps {
    label: string;
    name: string;
    value: string;
    options: Array<{ value: number, label: string }>;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    error?: string;
    required?: boolean;
}

export const FormSelect: React.FC<FormSelectProps> = ({
    label,
    name,
    value,
    options,
    onChange,
    error,
    required = false,
}) => {
    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-emerald-700 mb-1">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <select
                name={name}
                value={value}
                onChange={onChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${error
                        ? 'border-red-500 focus:ring-red-200'
                        : 'border-emerald-300 focus:ring-emerald-200 focus:border-emerald-500'
                    }`}
            >
                <option value="">Seleccione...</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
    );
};