import React, { useEffect, useState } from 'react';
import { FormInput } from '../common/FormInput';
import { FormSelect } from '../common/FormSelect';
import { Familia } from '../../types';
import supabase from '../common/supabaseClient';

interface FamilyFormProps {
    data: Familia;
    errors: Record<string, string>;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    activeSection: string;
}

export const FamilyForm: React.FC<FamilyFormProps> = ({
    data,
    errors,
    onChange,
    }) => {
        const [people, setPeople] = useState<{ value: number; label: string }[]>([]);

    useEffect(() => {
        const fetchPeople = async () => {
            const { data: Persona, error } = await supabase
                .from('Persona')
                .select('id, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido');

            if (error) {
                console.error('Error fetching personas:', error);
            } else{
                const formattedPeople = Persona!.map((persona) => ({
                    value: persona.id,
                    label: `${persona.primer_nombre} ${persona.segundo_nombre ?? ''} ${persona.primer_apellido} ${persona.segundo_apellido ?? ''}`.trim(),
                }));
                setPeople(formattedPeople);
            }
        };

        fetchPeople();
    }, []);

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-6">Información de Familia</h2>
            {/* Nombre familia */}
            <FormInput
                label="Nombre de la Familia"
                name="nombre_familia"
                value={data.nombre_familia}
                onChange={onChange}
                error={errors.nombre_familia}
                required type={''}
            />

            {/* Persona asociada */}
            <FormSelect
                label="Persona"
                name="id_persona"
                value={people.find((option) => option.value === data.id_persona)}
                onChange={onChange}
                options={people}
                error={errors.id_persona}
                required
            />

            {/* Es cabeza de familia */}
            <div className="flex items-center space-x-2">
                <label htmlFor="es_cdf" className="block font-medium text-emerald-500">
                    ¿Es Cabeza de Familia?
                </label>
                <input
                    type="checkbox"
                    id="es_cdf"
                    name="es_cdf"
                    checked={data.es_cdf ? data.es_cdf : false}
                    onChange={(e) => onChange({
                        target: { name: 'es_cdf', value: e.target.checked }
                    } as unknown as React.ChangeEvent<HTMLInputElement>)}
                    className="h-5 w-5 text-emerald-500 border-gray-300 rounded focus:ring-emerald-500"
                />
            </div>
        </div>
    );
};
