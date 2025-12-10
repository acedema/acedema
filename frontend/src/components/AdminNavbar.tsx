'use client';

import styles from './Navbar.module.css';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function AdminNavbar() {
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);

    // efecto scroll
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 8);
        handleScroll();
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // cerrar menú si se cambia a desktop
    useEffect(() => {
        const onResize = () => {
            if (window.innerWidth > 992 && open) setOpen(false);
        };
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, [open]);

    const links = [
        { href: '/acedemaApp/Administrador/crearCuenta', label: 'Cuentas' },
        { href: '/acedemaApp/Administrador/crearCuenta', label: 'Cursos' }, //Cambiar a cursos 


    ];

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
                            width={400}
                            height={400}
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
            <div
                id="mobile-menu"
                className={`${styles.mobileMenu} ${open ? styles.open : ''}`}
            >
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
            </div>
        </nav>
    );
}