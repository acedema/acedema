// src/lib/grupovalidaciones.ts

export const grupoRules: Record<
    string,
    { required?: boolean; min?: number; label: string }
> = {
    nombre: {
        required: true,
        min: 3,
        label: 'El nombre del grupo',
    },
    edades: {
        required: true,
        min: 2,
        label: 'Las edades',
    },
    nivel: {
        required: true,
        min: 3,
        label: 'El nivel (principiante/avanzado)',
    },
    duracion: {
        required: true,
        min: 3,
        label: 'La duración de la lección',
    },
    horario: {
        required: true,
        min: 3,
        label: 'El horario',
    },
    cupoMaximo: {
        required: true,
        min: 1,
        label: 'El cupo máximo',
    },
};

// REUTILIZA tu misma función validate de cursos
export { validate } from '@/lib/cursovalidaciones';
