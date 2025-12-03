'use client';

import Image from 'next/image';
import styles from './CardCurso.module.css';
import { FaPen, FaTrash } from 'react-icons/fa';

export type Modalidad = 'Individual' | 'Grupal';

export type Curso = {
    id: string;
    nombre: string;
    modalidad: Modalidad;
    imageUrl: string;
    imageAlt?: string;
};

type Props = {
    curso: Curso;
    onEdit: (curso: Curso) => void;
    onDelete: (id: string) => void;
    className?: string;
};

export default function CardCurso({ curso, onEdit, onDelete, className }: Props) {
    const { id, nombre, modalidad, imageUrl, imageAlt } = curso;
    const modalidadText = modalidad;

    return (
        <article className={`${styles.card} ${className ?? ''}`}>
            {/* Imagen */}
            <div className={styles.imageBox} >
                <div className={styles.imageInner}>
                    <Image
                        src={imageUrl}
                        alt={imageAlt ?? nombre}
                        fill
                        className={styles.image}
                        sizes="(max-width: 768px) 160px, 180px"
                        priority={false}
                    />
                </div>
            </div>

            {/* Contenido */}
            <div className={styles.content}>
                <h3 className={styles.title}>{nombre}</h3>
                <p className={styles.subtitle}>{modalidadText}</p>

                {/* Acciones inferiores */}
                <div className={styles.actions}>
                    <button
                        type="button"
                        className={`${styles.roundBtn} ${styles.edit} ${styles.tooltip}`}
                        onClick={() => onEdit(curso)}
                        aria-label="Editar curso"
                        data-tooltip="Editar "
                    >
                        <FaPen />
                    </button>
                    <button
                        type="button"
                        className={`${styles.roundBtn} ${styles.delete} ${styles.tooltip}`}
                        onClick={() => onDelete(id)}
                        aria-label="Eliminar curso"
                        data-tooltip="Eliminar "
                    >
                        <FaTrash />
                    </button>
                </div>
            </div>
        </article>
    );
}