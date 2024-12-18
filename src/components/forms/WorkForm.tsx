import React, { useEffect, useState } from 'react';
import { Trabajo, Empresa } from '../../types';
import supabase from '../common/supabaseClient';
import { FormInput } from '../common/FormInput';
import { FormSelect } from '../common/FormSelect';

interface WorkFormProps {
    data: Trabajo;
    errors: Record<string, string>;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    activeSection: string;
}

export const WorkForm: React.FC<WorkFormProps> = ({
    data,
    errors,
    onChange,
    activeSection,
}) => {
    const [empresas, setEmpresas] = useState<Empresa[]>([]);

    useEffect(() => {
        const fetchEmpresas = async () => {
            const { data, error } = await supabase
                .from('Empresa')
                .select('*');
            if (error) {
                console.error('Error fetching empresas:', error);
            } else {
                setEmpresas(data);
            }
        };

        fetchEmpresas();
    }, []);

    if (activeSection !== 'work') return null;

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-6">Información de Trabajo</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormSelect
                    label="Empresa ofertante"
                    name="id_empresa"
                    value={data.id_empresa}
                    onChange={onChange}
                    options={empresas.map(empresa => ({
                        value: empresa.id!,
                        label: empresa.nombre,
                    }))}
                    error={errors.id_empresa}
                    required
                />
                <FormInput
                    label="Nombre del Trabajo"
                    type="text"
                    name="nombre"
                    value={data.nombre}
                    onChange={onChange}
                    error={errors.nombre}
                    required
                />
                <FormInput
                    label="Media Salarial"
                    type="number"
                    name="media_salarial"
                    value={data.media_salarial}
                    onChange={onChange}
                    error={errors.media_salarial}
                    required
                />
            </div>
        </div>
    );
};
