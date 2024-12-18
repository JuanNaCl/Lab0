// Base interfaces
export interface BaseEntity {
    id?: number;
}

export interface PersonalInfo extends BaseEntity {
    primer_nombre: string;
    segundo_nombre: string;
    primer_apellido: string;
    segundo_apellido: string;
    fecha_nacimiento: string;
    sexo: {value: number, label: string};
    email: string;
    celular: number;
    salario: number;
    cedula: number;
}

export interface Vehiculo extends BaseEntity {
    id_dueño: any;
    nombre: string;
    marca: string;
    tipo: any;
    color: string;
    valor_nuevo: number;
    placa: string;
}

export interface Comparendo extends BaseEntity {
    id_poseedor: any;
    nombre: string;
    monto: number;
    fecha: string;
    razon: string;
    nota: string;
    id_vehiculo: any;
}

export interface Vivienda extends BaseEntity {
    id_municipio: any;
    direccion: string;
    barrio: string;
    pisos: number;
    area_construida: number;
    area_total: number;
    habitaciones: number;
    baños: number;
    estrato: number;
    tipo: any;
}

export interface Persona_Vivienda extends BaseEntity {
    id_persona: any;
    id_vivienda: number;
    es_dueño: boolean;
} 

export interface Municipio extends BaseEntity {
    id_alcalde: any;
    nombre_municipio: any;
    id_departamento: number;
    codigo_municipio: number;
    area_total: number;
    habitantes_censo_2023: number;
}

export interface Departamento extends BaseEntity {
    id_gobernador: any;
    nombre_departamento: any;
}

export interface Trabajo extends BaseEntity {
    nombre: string;
    media_salarial: number;
    id_empresa: any;
}

export interface Aplicacion extends BaseEntity {
    id_trabajo: any;
    id_persona: any;
}

export interface Empresa extends BaseEntity {
    nombre: string;
    id_departamento_constitucion: any;
}

export interface Familia extends BaseEntity {
    fecha_registro: string;
    id_persona: any;
    nombre_familia: string;
    es_cdf: boolean
}