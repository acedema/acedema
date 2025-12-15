/**
 * Página inicial del módulo ACEDEMA
 *
 * ¿Qué hace?
 * Determina el rol del usuario autenticado y lo redirige automáticamente
 * a la sección correspondiente del sistema (Administrador, Profesor o Estudiante).
 *
 * Se utiliza como punto de entrada principal al sistema después del login,
 * funcionando como un enrutador por rol.
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { requireAuth, logout } from '@/lib/auth';

export default function AcedemaInicio() {
    const router = useRouter();

    useEffect(() => {
        // Redirección automática según el rol del usuario autenticado
        const check = requireAuth();

        if (!check.ok) {
            logout();
            router.replace('/login');
            return;
        }

        const rol = check.auth.rol;

        if (rol === 'admin') {
            router.replace('/acedemaApp/Administrador');
        } else if (rol === 'profesor') {
            router.replace('/acedemaApp/Profesor');
        } else {
            router.replace('/acedemaApp/Estudiante');
        }
    }, [router]);

    return null;
}