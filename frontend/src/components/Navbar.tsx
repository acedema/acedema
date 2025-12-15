/**
 * Componente Navbar principal del sistema.
 *
 * ¿Qué hace?
 * Renderiza la barra de navegación principal del sitio, adaptándose
 * al estado de autenticación del usuario, su rol y al tamaño de pantalla
 * (desktop y móvil). Maneja menús desplegables, navegación responsiva
 * y acciones de sesión.
 *
 * Se utiliza en todas las páginas públicas y privadas del sistema,
 * incluyendo el sitio informativo y el módulo interno de ACEDEMA,
 * permitiendo navegar entre secciones y acceder al perfil del usuario.
 */
'use client';

import styles from './Navbar.module.css';
import { useEffect, useState, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getAuth, logout } from '@/lib/auth';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    const [auth, setAuth] = useState<ReturnType<typeof getAuth>>(null);
    const [accountOpen, setAccountOpen] = useState(false);
    const accountRef = useRef<HTMLDivElement | null>(null);

    // Estado de autenticación del usuario (token, datos y rol)
    useEffect(() => {
        setAuth(getAuth()); // cada vez que cambia la ruta, vuelve a leer localStorage
        // Relee la información de autenticación cada vez que cambia la ruta
    }, [pathname]);

    // Detecta el scroll para aplicar estilos dinámicos al navbar
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 8);
        handleScroll();
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Cierra el menú móvil automáticamente al volver a vista desktop
    useEffect(() => {
        const onResize = () => {
            if (window.innerWidth > 992 && open) setOpen(false);
        };
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, [open]);

    // Cierra el menú de cuenta si se hace clic fuera o se presiona Escape
    useEffect(() => {
        const onClickOutside = (e: MouseEvent) => {
            if (!accountRef.current) return;
            if (!accountRef.current.contains(e.target as Node)) {
                setAccountOpen(false);
            }
        };

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setAccountOpen(false);
        };

        document.addEventListener('mousedown', onClickOutside);
        document.addEventListener('keydown', onKeyDown);

        return () => {
            document.removeEventListener('mousedown', onClickOutside);
            document.removeEventListener('keydown', onKeyDown);
        };
    }, []);

    const baseLinks = [
        { href: '/', label: 'Inicio' },
        { href: '/nosotros', label: 'Nosotros' },
        { href: '/matricula', label: 'Matrícula' },
        { href: '/cursos', label: 'Cursos' },
        { href: '/contactenos', label: 'Contáctenos' },
        // { href: '/videos', label: 'Videos' },
        // { href: '/becas', label: 'Becas' },
    ];

    const links = [...baseLinks];

    // si es estudiante, le agregas los links extra
    if (auth?.rol === 'estudiante') {
        links.push({ href: '/acedemaApp/Estudiante/pagos', label: 'Pagos' });
        //links.push({ href: '/acedemaApp/Estudiante/misCursos', label: 'Mis cursos' });
    }
    
    return (
        <nav className={`${styles.navbar} ${scrolled ? styles.scrollednav : ''}`}>
            <div className={styles.container}>
                {/* logo */}
                <div className={styles.logo}>
                    <Link href="/" className={styles.logoContainer}>
                        {/* En desktop se usa el H1 grande; en celular mostramos el logo redondo */}
                        <Image
                            src="/Acedema.jpg"
                            alt="Logo ACEDEMA"
                            width={500}
                            height={500}
                            priority
                        />
                        <h1>ACEDEMA</h1>
                    </Link>
                </div>

                {/* links desktop */}
                <ul className={styles.links}>
                    {links.map((link) => (
                        <li key={link.href} className={styles.linkItem}>
                            <Link href={link.href} className={styles.link}>
                                {link.label}
                            </Link>
                        </li>
                    ))}

                    {/* parte derecha: login o avatar */}
                    {!auth ? (
                        <li className={styles.linkItem}>
                            <Link href="/login" className={styles.link}>Iniciar Sesión</Link>
                        </li>
                    ) : (
                        <li className={styles.linkItem}>
                            <div className={styles.account} ref={accountRef}>
                                <button
                                    type="button"
                                    className={styles.avatarButton}
                                    onClick={() => setAccountOpen((v) => !v)}
                                >
                                    {/* Muestra iniciales del usuario como avatar cuando está autenticado */}

                                    <span className={styles.avatarFallback}>
    {(auth.usuario.primerNombre?.[0] ?? '').toUpperCase()}
      {(auth.usuario.primerApellido?.[0] ?? '').toUpperCase()}
  </span>
                                </button>

                                {accountOpen && (
                                    <div className={styles.dropdown} role="menu">
                                        <Link
                                            href="/acedemaApp/Estudiante/perfil"
                                            className={styles.dropdownItem}
                                            onClick={() => setAccountOpen(false)}
                                        >
                                            Ver mi perfil
                                        </Link>

                                        <button
                                            type="button"
                                            className={`${styles.dropdownItem} ${styles.dropdownDanger}`}
                                            onClick={() => {
                                                setAccountOpen(false);
                                                {/* Cierra sesión y redirige al login */}
                                                logout();
                                                router.replace('/login');
                                            }}
                                        >
                                            Cerrar sesión
                                        </button>
                                    </div>
                                )}
                            </div>
                        </li>
                    )}
                </ul>


                {/* boton hamburguesa  */}
                <button
                    type="button"
                    className={`${styles.menuButton} ${open ? styles.open : ''}`}
                    aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
                    aria-expanded={open}
                    aria-controls="mobile-menu"
                    onClick={() => setOpen((v) => !v)}
                >
                    <span className={styles.hamburger} />
                </button>
            </div>

            {/* menu celular */}
            <div id="mobile-menu" className={`${styles.mobileMenu} ${open ? styles.open : ''}`}>
                {links.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={styles.mobileLink}
                        onClick={() => setOpen(false)}
                    >
                        {link.label}
                    </Link>
                ))}

                {!auth ? (
                    <Link
                        href="/login"
                        className={styles.mobileLink}
                        onClick={() => setOpen(false)}
                    >
                        Iniciar sesión
                    </Link>
                ) : (
                    <>
                        {/* Perfil */}
                        <Link
                            href="/acedemaApp/Estudiante/perfil"
                            className={styles.mobileLink}
                            onClick={() => setOpen(false)}
                        >
                            Mi perfil
                        </Link>

                        {/* Logout */}
                        <button
                            type="button"
                            className={`${styles.mobileLink} ${styles.mobileDanger}`}
                            onClick={() => {
                                setOpen(false);
                                logout();
                                router.replace('/login');
                            }}
                        >
                            Cerrar sesión
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
}