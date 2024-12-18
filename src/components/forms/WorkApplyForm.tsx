import React, { useEffect, useState } from 'react';
import { Trabajo, PersonalInfo, Aplicacion } from '../../types';
import supabase from '../common/supabaseClient';
import { FormSelect } from '../common/FormSelect';

interface WorkApplyFormProps {
    data: Aplicacion;
    errors: Record<string, string>;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    applyId: string;
}

export const WorkApplyForm: React.FC<WorkApplyFormProps> = ({
    data,
    errors,
    onChange,
    applyId,
}) => {
    // NO BORRAR FETCH TRABAJOS, NO SE USA PERO SE ROMPE SI SE BORRA
    const [trabajos, setTrabajos] = useState<Trabajo[]>([]);
    const [personas, setPersonas] = useState<PersonalInfo[]>([]);

    useEffect(() => {
        const fetchTrabajos = async () => {
            const { data, error } = await supabase
                .from('Trabajo')
                .select('*')
                .eq('Empresa.id', 'empresa_id');
            if (error) {
                console.error('Error fetching trabajos:', error);
            } else {
                setTrabajos(data);
            }
        };

        const fetchPersonas = async () => {
            const { data: personasData, error: personasError } = await supabase
                .from('Persona')
                .select('*');
            if (personasError) {
                console.error('Error fetching personas:', personasError);
            } else {
                const { data: aplicacionesData, error: aplicacionesError } = await supabase
                    .from('Persona_Trabajo')
                    .select('*')
                    .eq('id_trabajo', applyId);
                if (aplicacionesError) {
                    console.error('Error fetching aplicaciones:', aplicacionesError);
                } else {
                    const appliedPersonIds = aplicacionesData.map(aplicacion => aplicacion.id_persona);
                    const filteredPersonas = personasData.filter(persona => !appliedPersonIds.includes(persona.id));
                    setPersonas(filteredPersonas);
                }
            }
        };

        // fetchTrabajos();
        fetchPersonas();
    }, [applyId]);

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-6">Aplicación de Trabajo</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormSelect
                    label="Persona"
                    name="id_persona"
                    value={data.id_persona}
                    onChange={onChange}
                    options={personas.map(persona => ({
                        value: persona.id!,
                        label: `(${persona.cedula}) ${persona.primer_nombre} ${persona.primer_apellido}`,
                    }))}
                    error={errors.id_persona}
                    required
                />
            </div>
        </div>
    );
};
