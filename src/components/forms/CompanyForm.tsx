import React, { useEffect, useState } from 'react';
import { FormInput } from '../common/FormInput';
import { FormSelect } from '../common/FormSelect';
import { Empresa } from '../../types';
import supabase from '../common/supabaseClient';

interface CompanyFormProps {
  data: Empresa;
  errors: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  activeSection: string;
}

export const CompanyForm: React.FC<CompanyFormProps> = ({
  data,
  errors,
  onChange,
  activeSection,
}) => {
  const [nameDepartamentos, setNameDepartamentos] = useState<{ value: number, label: string }[]>([]);
      useEffect(() => {
          if (activeSection === 'company') {
              fetchDepartamentos();
          }
      }, [activeSection]);

      const fetchDepartamentos = async () => {
        const { data: Departamentos, error } = await supabase
            .from('Departamento')
            .select('*')
        if (error) {
            console.error("Error fetching Departamento:", error);
        } else if (Departamentos?.length === 0) {
            console.error("No Departamento found");
        } else {
            const formattedOptions = Departamentos!.map(Departamento => ({
                value: Departamento.id!, label: `(${Departamento.codigo_departamento}) ${Departamento.nombre_departamento}`,
            })); setNameDepartamentos(formattedOptions);
        }
    };  

  if (activeSection !== 'company') return null;

  return (
    <div className="space-y-8">
                <div>
                <div className="flex items-center mb-6 justify-between">
                        <h2 className="text-2xl font-semibold text-emerald-800">Información de la Empresa</h2>
                        <button
                            type="button"
                            className="px-4 py-2 text-emerald-800 rounded"
                            onClick={() => {
                                fetchDepartamentos();
                            }}>
                            Actualizar
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput
                            label="Nombre de la Empresa"
                            type="text"
                            name="nombre"
                            value={data.nombre}
                            onChange={onChange}
                            error={errors.nombre}
                            required
                        />
                        <FormSelect
                            label="Nombre del departamento donde está constituida la empresa"
                            options={nameDepartamentos}
                            name="id_departamento_constitucion"
                            value={data.id_departamento_constitucion}
                            onChange={onChange}
                            error={errors.id_departamento_constitucion}
                            required
                        />
                    </div>
                </div>
      </div>
    
  );
};