'use client';

import styles from './Navbar.module.css';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
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
        { href: '/', label: 'Inicio' },
        { href: '/nosotros', label: 'Nosotros' },
        { href: '/matricula', label: 'Matrícula' },
        { href: '/cursos', label: 'Cursos' },
        { href: '/contactenos', label: 'Contáctenos' },
        { href: '/login', label: 'Iniciar Sesión' },
    ];

    return (
        <nav className={`${styles.navbar} ${scrolled ? styles.scrollednav : ''}`}>
            <div className={styles.container}>
                {/* logo */}
                <div className={styles.logo}>
                    <Link href="/" className={styles.logoContainer}>
                        {/* En desktop se usa el H1 grande; en móvil mostramos el logo redondo (vía CSS) */}
                        <Image
                            src="/logo.jpg"
                            alt="Logo ACEDEMA"
                            width={200}
                            height={200}
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

                {/* botón hamburguesa (solo visible en <= 992px por CSS) */}
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

            {/* menú móvil */}
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