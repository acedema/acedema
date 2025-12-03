
//Se utilizan para hacer las validaciones de todos los campos obligatorios en modal de creacion y edicion


//Definir las reglas que se usan en la funcion validate
export const courseRules: Record<string, { required?: boolean; min?: number; label: string }> = {
    nombre: { required: true, min: 5, label: 'El nombre del curso' },
    instrumento: { required: true, min: 5, label: 'El instrumento' },
    profesor: { required: true, min: 5, label: 'El profesor/a' },
    modalidad: { required: true, label: 'La modalidad del curso' },
    imagenUrl: { required: true, label: 'La imagen del curso' },
};


//Funcion que utiliza las reglas
export const validate = (payload: any, rules: any): string[] => {
    const errors: string[] = [];

    for (const field in rules) {
        const value = payload[field];
        const { required, min, label } = rules[field];

        if (required && (!value || value.toString().trim() === '')) {
            errors.push(`${label} es obligatorio.`);
            continue;
        }

        if (min && value.toString().trim().length < min) {
            errors.push(`${label} debe tener al menos ${min} caracteres.`);
        }
    }
    return errors;
};