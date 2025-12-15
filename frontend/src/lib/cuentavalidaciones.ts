
// Reglas para cada campo del formulario de crear cuenta
export const cuentaRules: Record<
    string,
    { required?: boolean; min?: number; label: string }
> = {
    numCedula: { required: true, min: 9,label: 'La cédula' },
    fechaNacimiento: { required: true, label: 'La fecha de nacimiento' },
    primerNombre: { required: true, min: 2, label: 'El primer nombre' },
    primerApellido: { required: true, min: 2, label: 'El primer apellido' },
    telefono1: { required: true, min: 8, label: 'El teléfono principal' },
    correo: { required: true, min: 5, label: 'El correo electrónico' },
    idRol: { required: true, label: 'El rol' },
    direccion: { required: true, min: 5, label: 'La dirección' },
    puesto: { required: true, min: 3, label: 'El puesto' },
    //  segundoNombre, segundoApellido y telefono2 no son obligatorios
};

//Funcion que utiliza las reglas
export const validateCuenta = (payload: any, rules: any): string[] => {
    const errors: string[] = [];

    for (const field in rules) {
        const value = payload[field];
        const { required, min, label } = rules[field];

        if (required && (!value || value.toString().trim() === '')) {
            errors.push(`${label} es obligatorio.`);
            continue;
        }

        if (min && value && value.toString().trim().length < min) {
            errors.push(`${label} debe tener al menos ${min} caracteres.`);
        }
    }

    return errors;
};
