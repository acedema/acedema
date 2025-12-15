/**
 * ¿Qué hace?
 * -Define un componente Modal genérico reutilizable.
 * -Renderiza un backdrop, un contenedor de modal, título, botón de cerrar y el contenido interno.
 * -Permite cerrar con Escape y también haciendo click fuera del modal.
 *
 * ¿Para qué parte del sistema se usa?
 * - Es un componente UI de apoyo para el frontend, usado cuando se necesitan modales.
 * - Puede reutilizarse en otras secciones: pagos, confirmaciones, formularios rápidos, etc.
 * 
 * Está para centralizar el comportamiento estándar de un modal (bloquear scroll, cerrar con Escape, cerrar al hacer click en backdrop) en un solo lugar.
 */
'use client';

import { useEffect } from 'react';
import styles from './Modal.module.css';

type Props = {
    open: boolean;
    title?: string;
    children: React.ReactNode;
    onClose: () => void;
};

export default function Modal({ open, title, children, onClose }: Props) {
    // Si el modal está abierto:
    // escucha Escape para cerrae, bloquea scroll del body y limpia todo al cerrar/desmontar.
    useEffect(() => {
        if (!open) return;

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        document.addEventListener('keydown', onKeyDown);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', onKeyDown);
            document.body.style.overflow = '';
        };
    }, [open, onClose]);

    if (!open) return null;

    return (
        // Click en backdrop cierra el modal.
        // Click dentro del modal NO debe cerrarlo, por eso se detiene la propagación.
        <div className={styles.backdrop} onMouseDown={onClose} role="dialog" aria-modal="true">
            <div className={styles.modal} onMouseDown={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2 className={styles.title}>{title ?? 'Modal'}</h2>
                    <button className={styles.close} onClick={onClose} aria-label="Cerrar">
                        ✕
                    </button>
                </div>
                <div className={styles.content}>{children}</div>
            </div>
        </div>
    );
}
