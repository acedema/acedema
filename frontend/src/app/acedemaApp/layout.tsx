/**
 * Layout principal protegido del módulo ACEDEMA
 *
 * ¿Qué hace?
 * Verifica si el usuario está autenticado antes de permitir el acceso
 * a cualquier página dentro del módulo acedemaApp.
 * Si el usuario no está autenticado o su sesión es inválida,
 * se cierra la sesión y se redirige al login.
 *
 * Se utiliza como layout raíz de todas las vistas internas del sistema
 * (Administrador, Profesor y Estudiante), asegurando que solo usuarios autenticados puedan acceder a ellas.
 * Existe para centralizar la validación de autenticación en un solo lugar, evitando repetir la lógica de protección en cada página.
 */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { requireAuth, logout } from '@/lib/auth';

export default function AcedemaLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        //Verifica la autenticación del usuario al cargar el layout
        const check = requireAuth();

        if (!check.ok) {
            logout();
            router.replace('/login');
            return;
        }
//Estado que evita renderizar la vista hasta confirmar la autenticación
        setCargando(false);
    }, [router]);

    if (cargando) return null;
    return <>{children}</>;
}
