import React from 'react';

interface FormInputProps {
    label: string;
    type: string;
    name: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    required?: boolean;
    accept?: string;
}

export const FormInput: React.FC<FormInputProps> = ({
    label,
    type,
    name,
    value,
    onChange,
    error,
    required = false,
    accept,
}) => {
    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-emerald-700 mb-1">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                accept={accept}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${error
                        ? 'border-red-500 focus:ring-red-200'
                        : 'border-emerald-300 focus:ring-emerald-200 focus:border-emerald-500'
                    }`}
            />
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
    );
};