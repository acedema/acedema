'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';

export default function AcedemaLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [cargando, setCargando] = useState(true);

    useEffect(() => {
        // Verifica si se trabaja en localhost
        const isLocalhost =
            typeof window !== 'undefined' &&
            (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

        // Si estoy en localhost, omite la validacion y deja ver las paginas 
        if (isLocalhost) {
            setCargando(false);
            return;
        }

        // Si no, aplica la validacion normal
        if (!isAuthenticated()) {
            router.push('/login');
        } else {
            setCargando(false);
        }
    }, []);

    if (cargando) return null; // o un loader

    return <>{children}</>;
}