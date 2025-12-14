// Reglas para cada campo del formulario Cambiar Clave
export const cambiarClaveRules: Record<
    string,
    { required?: boolean; min?: number; label: string }
> = {
    correo: { required: true, min: 5, label: "El correo" },
    contrasenaActual: { required: true, min: 1, label: "La contraseña actual" },
    nuevaContrasena: { required: true, min: 8, label: "La nueva contraseña" },
    confirmarContrasena: { required: true, min: 8, label: "La confirmación" },
};

// Función genérica 
// Regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*[\W_]).{8,}$/;

export const validateCambiarClave = (payload: any, rules: any): string[] => {
    const errors: string[] = [];

    for (const field in rules) {
        const value = payload[field];
        const { required, min, label } = rules[field];

        // Obligatorio
        if (required && (!value || value.toString().trim() === "")) {
            errors.push(`${label} es obligatorio.`);
            continue;
        }

        // Mínimo de caracteres
        if (min && value && value.toString().trim().length < min) {
            errors.push(`${label} debe tener al menos ${min} caracteres.`);
            continue;
        }

        // Validación específica de correo
        if (field === "correo" && value && !emailRegex.test(value)) {
            errors.push("El correo debe tener un formato válido (ej: usuario@correo.com).");
            continue;
        }

        // Validación de contraseña segura
        if (
            (field === "nuevaContrasena" || field === "confirmarContrasena") &&
            value &&
            !passwordRegex.test(value)
        ) {
            errors.push(
                "La contraseña debe tener mínimo 8 caracteres, una mayúscula y un carácter especial."
            );
            continue;
        }
    }

    // Confirmación de contraseña
    if (
        payload?.nuevaContrasena &&
        payload?.confirmarContrasena &&
        payload.nuevaContrasena !== payload.confirmarContrasena
    ) {
        errors.push("La confirmación no coincide con la nueva contraseña.");
    }

    return errors;
};
