import React, { useEffect, useState } from 'react';
import { FormInput } from '../common/FormInput';
import { Vehiculo } from '../../types';
import { FormSelect } from '../common/FormSelect';
import supabase from '../common/supabaseClient';

interface VehicleFormProps {
    data: Vehiculo;
    errors: Record<string, string>;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    activeSection: string;
}

export const VehicleForm: React.FC<VehicleFormProps> = ({
    data,
    errors,
    onChange,
    activeSection,
}) => {
    const [personaOptions, setPersonaOptions] = useState<{ value: number; label: string }[]>([]);

    const tipoOptions = [
        { value: 1, label: 'Carro' },
        { value: 2, label: 'Camion' },
        { value: 3, label: 'Moto' },
    ];

    // Cargar personas
    useEffect(() => {
        if (activeSection === 'vehicles') {
            fetchPersonas();
        }
    }, []);

    const fetchPersonas = async () => {
        const { data: Persona, error } = await supabase
            .from('Persona')
            .select('*');
        if (error) {
            console.error('Error fetching Personas:', error);
        } else if (Persona?.length === 0) {
            console.error('No Personas found');
        } else {
            const formattedOptions = Persona!.map((persona) => ({
                value: persona.id!,
                label: `(${persona.cedula}) ${persona.primer_nombre} ${persona.segundo_nombre ?? ''} ${persona.primer_apellido} ${persona.segundo_apellido}`,
            }));
            setPersonaOptions(formattedOptions);
        }
    };

    // Buscar la opción seleccionada para el campo "tipo"
    const selectedTipoOption = tipoOptions.find((option) => option.value === Number(data.tipo));

    return (
        <div className="space-y-4">
            <div className="flex items-center mb-6 justify-between">
                <h2 className="text-2xl font-semibold text-emerald-800">Información del Vehículo</h2>
                <button
                    type="button"
                    className="px-4 py-2 text-emerald-800 rounded"
                    onClick={fetchPersonas}
                >
                    Actualizar
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormSelect
                    label="Nombre a quien pertenece"
                    name="id_dueño"
                    value={personaOptions.find((option) => option.value === data.id_dueño)}
                    options={personaOptions}
                    onChange={onChange}
                    error={errors.id_dueño}
                    required
                />
                <FormInput
                    label="Nombre carro"
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
                <FormSelect
                    label="Tipo"
                    name="tipo"
                    value={selectedTipoOption} // Setea la opción seleccionada correctamente
                    options={tipoOptions}
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
