export const validateForm = (data: any) => {
    const errors: Record<string, string> = {};

    // Required fields validation
    const requiredFields = {
        primer_nombre: 'Primer nombre es requerido',
        primer_apellido: 'Primer apellido es requerido',
        fecha_nacimiento: 'Fecha de nacimiento es requerida',
        sexo: 'Sexo es requerido',
        email: 'Email es requerido',
        celular: 'Celular es requerido',
        salario: 'Salario es requerido',
    };

    Object.entries(requiredFields).forEach(([field, message]) => {
        if (!data[field]) {
            errors[field] = message;
        }
    });

    // Email validation
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errors.email = 'Email inválido';
    }

    // Numeric validations
    if (data.celular && (isNaN(data.celular) || data.celular < 0)) {
        errors.celular = 'Celular debe ser un número positivo';
    }

    if (data.salario && (isNaN(data.salario) || data.salario < 0)) {
        errors.salario = 'Salario debe ser un número positivo';
    }

    // Date validation
    if (data.fecha_nacimiento) {
        const birthDate = new Date(data.fecha_nacimiento);
        const today = new Date();
        if (birthDate > today) {
            errors.fecha_nacimiento = 'Fecha de nacimiento no puede ser futura';
        }
    }

    return errors;
};