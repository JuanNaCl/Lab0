import React, { useEffect, useState } from 'react';
import { FormInput } from '../common/FormInput';
import { FormSelect } from '../common/FormSelect';
import { Comparendo } from '../../types';
import supabase from '../common/supabaseClient';

interface TicketFormProps {
    data: Comparendo;
    errors: Record<string, string>;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    activeSection: string;
}

export const TicketForm: React.FC<TicketFormProps> = ({
    data,
    errors,
    onChange,
}) => {
    const [vehicles, setVehicles] = useState<{ value: number; label: string }[]>([]);
    const [people, setPeople] = useState<{ value: number; label: string }[]>([]);


    const fetchVehicles = async () => {
        let { data: Vehiculo, error } = await supabase
        .from('Vehiculo')
        .select('id, nombre');
        if (error) {
            console.error('Error al obtener vehículos:', error);
        } else if (Vehiculo?.length === 0) {
            console.error('No Vehicles found');
        }
        else {
            const formattedOptions = Vehiculo!.map((vehicle) => ({
                value: vehicle.id,
                label: `(${vehicle.nombre})`,
            }));
            setVehicles(formattedOptions)
        }
    };
    // Obtener personas desde Supabase
    const fetchPeople = async () => {
        let { data: Persona, error } = await supabase.from('Persona').select('id, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, cedula');
        if (error) {
            console.error('Error al obtener personas:', error);
        } else {
            const formattedOptions = Persona!.map((persona) => ({
                value: persona.id,
                label: `(${persona.cedula}) ${persona.primer_nombre} ${persona.segundo_nombre ?? ''} ${persona.primer_apellido} ${persona.segundo_apellido ?? ''}`,
            }));
            setPeople(formattedOptions);
        }
    };

    useEffect(() => {
        // Obtener vehículos desde Supabase
        fetchVehicles();
        fetchPeople();
    }, [vehicles, people]);

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-6">Información del Comparendo</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">    
                {/* Vehículo */}
                <FormSelect
                    label="Vehículo"
                    name="id_vehiculo"
                    value={vehicles.find((option) => option.value === data.id_vehiculo)}
                    onChange={onChange}
                    options={vehicles}
                    error={errors.id_vehiculo}
                    required
                />

                {/* Poseedor/Persona */}
                <FormSelect
                    label="Poseedor"
                    name="id_poseedor"
                    value={people.find((option) => option.value === data.id_poseedor)}
                    onChange={onChange}
                    options={people}
                    error={errors.id_poseedor}
                    required
                />

                {/* Monto */}
                <FormInput
                    label="Monto"
                    name="monto"
                    type="number"
                    value={data.monto}
                    onChange={onChange}
                    error={errors.monto}
                    required
                />

                {/* Fecha */}
                <FormInput
                    label="Fecha"
                    name="fecha"
                    type="datetime-local"
                    value={data.fecha}
                    onChange={onChange}
                    error={errors.fecha}
                    required
                />

                {/* Razón */}
                <FormInput
                    label="Razón"
                    name="razon"
                    type="text"
                    value={data.razon}
                    onChange={onChange}
                    error={errors.razon}
                    required
                />

                {/* Nota */}
                <FormInput
                    label="Nota"
                    name="nota"
                    type="text"
                    value={data.nota}
                    onChange={onChange}
                    error={errors.nota}
                />
            </div>
        </div>
    );
};
