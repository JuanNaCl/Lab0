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
}) => {
    const [empresas, setEmpresas] = useState<{ value: number; label: string }[]>([]);

    useEffect(() => {
        const fetchEmpresas = async () => {
            const { data, error } = await supabase
                .from('Empresa')
                .select('*');
            if (error) {
                console.error('Error fetching empresas:', error);
            }else if (data?.length === 0) {
                console.error('No Company found');
            }else {
                const formattedOptions = data!.map((company) => ({
                    value: company.id!,
                    label: `${company.nombre}`,
                }));
                setEmpresas(formattedOptions);
            }
        };

        fetchEmpresas();
    }, []);

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-6">Información de Trabajo</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormSelect
                    label="Empresa ofertante"
                    name="id_empresa"
                    value={empresas.find((option) => option.value === data.id_empresa)}
                    options={empresas}
                    onChange={onChange}
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
