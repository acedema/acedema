export interface ReqRegistrarPersona {
  persona: {
    numCedula: number;
    fechaNacimiento: string;
    primerNombre: string;
    segundoNombre: string;
    correo: string;
    direccion: string;
    telefono1: number;
    telefono2: number;
    fechaRegistro: string;
    idRol: number;
    puesto: string;
    cedulaResponsable: number | null;
  };
}

export interface MatriculaData {
  nombre: string;
  edad: number;
  email: string;
  telefono: string;
  instrumento: string;
  experiencia: string;
}

/** Respuesta de registrarPersona */
export interface ResRegistrarPersona {
  resultado: boolean;
  listaDeErrores: string[];
}
