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
    id_poseedor: number;
    nombre: string;
    monto: number;
    fecha: string;
    razon: string;
    nota: string;
    imagen: string;
}

export interface Vivienda extends BaseEntity {
    id_municipio: number;
    direccion: string;
    barrio: string;
    pisos: number;
    area_construida: number;
    area_total: number;
    habitaciones: number;
    baños: number;
    estrato: number;
    tipo: string;
}

export interface Municipio extends BaseEntity {
    id_alcalde: number;
    nombre_municipio: string;
    id_departamento: number;
    codigo_municipio: number;
    area_total: number;
    habitantes_censo_2023: number;
}

export interface Departamento extends BaseEntity {
    id_gobernador: number;
    nombre_departamento: string;
}

export interface Trabajo extends BaseEntity {
    nombre: string;
    media_salarial: number;
}

export interface Empresa extends BaseEntity {
    nombre: string;
    id_departamento_constitucion: number;
}
