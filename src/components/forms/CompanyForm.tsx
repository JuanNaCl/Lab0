import React from 'react';
import { FormInput } from '../common/FormInput';
import { Empresa } from '../../types';

interface CompanyFormProps {
  data: Empresa;
  errors: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  activeSection: string;
}

export const CompanyForm: React.FC<CompanyFormProps> = ({
  data,
  errors,
  onChange,
  activeSection,
}) => {
  if (activeSection !== 'company') return null;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold mb-6">Información de la Empresa</h2>
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
      </div>
    </div>
  );
};