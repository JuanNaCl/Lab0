import React from 'react';
import Select from 'react-select';  // Importa la librería react-select

interface FormSelectProps {
    label: string;
    name: string;
    value: any;
    options: Array<{ value: number, label: string }>;
    onChange: (selectedOption: any) => void;
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
    const customStyles = {
        control: (provided: any) => ({
            ...provided,
            borderColor: error ? 'red' : '#50C878', // Color emerald en hex
            '&:hover': { borderColor: '#50C878' } // Color emerald en hex
        }),
        option: (provided: any, state: any) => ({
            ...provided,
            backgroundColor: state.isSelected ? '#50C878' : provided.backgroundColor, // Color emerald en hex
            '&:hover': { backgroundColor: '#50C878' } // Color emerald en hex
        })
    };
    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-emerald-700 mb-1">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <Select
                name={name}
                value={value}
                onChange={
                    (selectedOption: any) => onChange({
                        target: { name, value: selectedOption }
                    })
                }
                options={options}
                styles={customStyles}
                classNamePrefix={error ? 'border-red-500 focus:ring-red-200' : 'border-emerald-300 focus:ring-emerald-200 focus:border-emerald-500'}
                isSearchable={true}  // Permite la búsqueda
            />
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
    );
};
