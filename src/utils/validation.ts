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

            if (data.cedula && (isNaN(data.cedula) || data.cedula <= 0)) {
                errors.cedula = 'Cedula invalida';
            }
            else if (data.cedula && data.cedula.toString().length < 6) {
                errors.cedula = 'La cedula tiene como mínimo 6 digitos';
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
            { const vehicleRequiredFields = {
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

            // Validación de placas
            const placaRegexAuto = /^[A-Z]{3}\d{3}$/; // Autos: Tres letras y tres números
            const placaRegexMoto = /^[A-Z]{3}\d{2}[A-Z]$/; // Motos: Tres letras, dos números y una letra

            if (data.placa) {
                const placa = data.placa.toUpperCase(); // Convertir a mayúsculas
                console.log('Placa ingresada:', data.placa);
                console.log('Validación Auto:', /^[A-Z]{3}\d{3}$/.test(data.placa));
                console.log('Validación Moto:', /^[A-Z]{3}\d{2}[A-Z]$/.test(data.placa));

                if (!placaRegexAuto.test(placa) && !placaRegexMoto.test(placa)) {
                    errors.placa =
                'La placa no es válida. Use "AAA###" para autos o "AAA##A" para motos.';
                }
            }

            // Optional: Validate valor_nuevo if it exists
            if (data.valor_nuevo && (isNaN(data.valor_nuevo) || data.valor_nuevo < 0)) {
                errors.valor_nuevo = 'Valor nuevo debe ser un número positivo';
            }
            break; 
        }

        case 'company':
            const companyRequiredFields = {
                nombre: 'Nombre de la empresa es requerido',
                id_departamento_constitucion : 'Departamento de constitución es requerido'
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
                id_persona: 'Propietario es requerido',
                id_municipio: 'Municipio es requerido',
                direccion: 'Dirección es requerida',
                barrio: 'Barrio es requerido',
                pisos: 'Número de pisos es requerido',
                area_construida: 'Área construida es requerida',
                area_total: 'Área total es requerida',
                habitaciones: 'Número de habitaciones es requerido',
                baños: 'Número de baños es requerido',
                estrato: 'Estrato es requerido',
                tipo: 'Tipo de vivienda es requerido'
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

        case 'work-apply':
            const workApplyRequiredFields = {
                id_persona: 'El nombre de la Persona es requerido',
            };
            // Validar campos de departamento
            Object.entries(workApplyRequiredFields).forEach(([field, message]) => {
                if (!data.hasOwnProperty(field) || !data[field]) {
                    errors[field] = message;
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
        case 'family': {
                const familyRequiredFields = {
                    nombre_familia: 'El nombre de la familia es requerido',
                    id_persona: 'La persona asociada es requerida',
                };
            
                // Validar campos requeridos
                Object.entries(familyRequiredFields).forEach(([field, message]) => {
                    if (!data[field]) {
                        errors[field] = message;
                    }
                });
            
                // Validar longitud mínima para nombre de la familia
                if (data.nombre_familia && data.nombre_familia.trim().length < 3) {
                    errors.nombre_familia = 'El nombre de la familia debe tener al menos 3 caracteres';
                }
                break;
            }
            
            
        default:
            break;
    }

    return errors;
};
