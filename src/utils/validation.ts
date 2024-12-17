export const validateForm = (data: any, section: string) => {
    const errors: Record<string, string> = {};
    switch (section) {
        case 'personal':
            const personalRequiredFields = {
                primer_nombre: 'Primer nombre es requerido',
                primer_apellido: 'Primer apellido es requerido',
                fecha_nacimiento: 'Fecha de nacimiento es requerida',
                sexo: 'Sexo es requerido',
                email: 'Email es requerido',
                celular: 'Celular es requerido',
                salario: 'Salario es requerido',
                cedula: 'Cedula es requerida',
            };

            Object.entries(personalRequiredFields).forEach(([field, message]) => {
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
            else if (data.celular && data.celular.toString().length !== 10) {
                errors.celular = 'Celular debe tener 10 dígitos';
            }

            if (data.cedula && (isNaN(data.cedula) || data.cedula < 0)) {
                errors.cedula = 'Cedula invalida';
            }
            else if (data.cedula && data.cedula.toString().length < 6) {
                errors.cedula = 'La cedula tiene como minimo 6 digitos';
            }
            else if (data.cedula && data.cedula.toString().length > 10) {
                errors.cedula = 'La cedula tiene como maximo 10 digitos';
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
            break;

        case 'vehicles':
            const vehicleRequiredFields = {
                nombre: 'Nombre es requerido',
                marca: 'Marca es requerida',
                tipo: 'Tipo es requerido',
                color: 'Color es requerido',
                placa: 'Placa es requerida',
            };

            Object.entries(vehicleRequiredFields).forEach(([field, message]) => {
                if (!data[field]) {
                    errors[field] = message;
                }
            });

            // Optional: Validate valor_nuevo if it exists
            if (data.valor_nuevo && (isNaN(data.valor_nuevo) || data.valor_nuevo < 0)) {
                errors.valor_nuevo = 'Valor nuevo debe ser un número positivo';
            }
            break;

        case 'company':
            const companyRequiredFields = {
                nombre: 'Nombre de la empresa es requerido',
            };

            Object.entries(companyRequiredFields).forEach(([field, message]) => {
                if (!data[field]) {
                    errors[field] = message;
                }
            });

            // Validación de longitud del nombre
            if (data.nombre && data.nombre.length < 2) {
                errors.nombre = 'El nombre de la empresa debe tener al menos 2 caracteres';
            }
            break;

        case 'fines':
            const fineRequiredFields = {
                nombre: 'Nombre es requerido',
                monto: 'Monto es requerido',
                fecha: 'Fecha es requerida',
                razon: 'Razón es requerida',
            };

            Object.entries(fineRequiredFields).forEach(([field, message]) => {
                if (!data[field]) {
                    errors[field] = message;
                }
            });

            // Validación de monto
            if (data.monto && (isNaN(data.monto) || data.monto <= 0)) {
                errors.monto = 'El monto debe ser un número positivo';
            }

            // Validación de fecha
            if (data.fecha) {
                const inputDate = new Date(data.fecha);
                const today = new Date();

                if (inputDate > today) {
                    errors.fecha = 'La fecha no puede ser futura';
                }
            }
            break;

        case 'housing':
            const housingRequiredFields = {
                direccion: 'Dirección es requerida',
                barrio: 'Barrio es requerido',
                pisos: 'Número de pisos es requerido',
                area_construida: 'Área construida es requerida',
                area_total: 'Área total es requerida',
                habitaciones: 'Número de habitaciones es requerido',
                baños: 'Número de baños es requerido',
                estrato: 'Estrato es requerido',
            };

            Object.entries(housingRequiredFields).forEach(([field, message]) => {
                if (!data[field]) {
                    errors[field] = message;
                }
            });

            // Validaciones numéricas
            const numericFields = [
                'pisos', 'area_construida', 'area_total',
                'habitaciones', 'baños', 'estrato'
            ];

            numericFields.forEach(field => {
                if (data[field] && (isNaN(data[field]) || data[field] < 0)) {
                    errors[field] = `El valor de ${field.replace('_', ' ')} debe ser un número positivo`;
                }
            });

            // Validación de área
            if (data.area_construida && data.area_total &&
                parseFloat(data.area_construida) > parseFloat(data.area_total)) {
                errors.area_construida = 'El área construida no puede ser mayor al área total';
            }

            // Validación de estrato
            if (data.estrato && (data.estrato < 1 || data.estrato > 6)) {
                errors.estrato = 'El estrato debe estar entre 1 y 6';
            }
            break;

        case 'location':
            const municipioRequiredFields = {
                area_total: 'Área total es requerida',
                habitantes_censo_2023: 'Habitantes del censo es requerido',
            };

            // Validar campos de municipio
            Object.entries(municipioRequiredFields).forEach(([field, message]) => {
                if (!data[field]) {
                    errors[field] = message;
                }
            });

            // Validaciones numéricas
            const locationNumericFields = [
                'area_total',
                'habitantes_censo_2023',
            ];

            locationNumericFields.forEach(field => {
                if (data[field] && (isNaN(data[field]) || data[field] <= 0)) {
                    errors[field] = `El valor de ${field.replace(/_/g, ' ')} debe ser un número positivo`;
                }
            });
            break;

        case 'departament':
            const departamentoRequiredFields = {
                nombre_departamento: 'Nombre del departamento es requerido',
                id_gobernador: 'Gobernador del departamento es requerido',
            };
            // Validar campos de departamento
            Object.entries(departamentoRequiredFields).forEach(([field, message]) => {
                if (!data.hasOwnProperty(field) || !data[field]) {
                    errors[field] = message;
                }
            });
            break;

        case 'work':
            const workRequiredFields = {
                nombre: 'Nombre del trabajo es requerido',
                media_salarial: 'La media salarial del trabajo es requerida',
            };
            // Validar campos de departamento
            Object.entries(workRequiredFields).forEach(([field, message]) => {
                if (!data.hasOwnProperty(field) || !data[field]) {
                    errors[field] = message;
                }
            });
            const worknumericFields = [
                'media_salarial',
            ];

            worknumericFields.forEach(field => {
                if (data[field] && (isNaN(data[field]) || data[field] < 0)) {
                    errors[field] = `El valor de ${field.replace('_', ' ')} debe ser un número positivo`;
                }
                if (data.media_salarial && (data.media_salarial > 2000000000)) {
                    errors.media_salarial = 'El valor maximo es de 2 mil millones';
                }
            });

            break;
        case 'ticket':
            const ticketRequiredFields = {
                id_vehiculo: 'Vehículo es requerido',
                id_poseedor: 'Poseedor es requerido',
                monto: 'Monto es requerido',
                fecha: 'Fecha es requerida',
                razon: 'Razón es requerida',
            };
            
            Object.entries(ticketRequiredFields).forEach(([field, message]) => {
                if (!data[field]) {
                    errors[field] = message;
                }
            });
            
            // Validación de monto
            if (data.monto && (isNaN(data.monto) || data.monto <= 0)) {
                errors.monto = 'El monto debe ser un número positivo';
            }
            
            // Validación de fecha
            if (data.fecha) {
                const inputDate = new Date(data.fecha);
                const today = new Date();
            
                if (inputDate > today) {
                    errors.fecha = 'La fecha no puede ser futura';
                }
            }
            break;
            
        default:
            break;
    }

    return errors;
};
