'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FaPlus, FaEye, FaPen, FaTrash } from 'react-icons/fa';
import styles from './CardGrupo.module.css';

export type Modalidad = 'Individual' | 'Grupal';

export type Curso = {
    id: string;
    nombre: string;
    modalidad: Modalidad;
    imageUrl: string;
    imageAlt?: string;
};

export type Grupo = {
    id: string;
    nombre: string;
    edades: string;
    nivel: string;        
    duracion: string;     
    horario: string;
    cupoMaximo: string;   
};


type Props = {
    curso: Curso;
    grupos: Grupo[];
    onAddGrupo: (curso: Curso) => void;
    onEditGrupo: (grupo: Grupo) => void;
    onDeleteGrupo: (grupoId: string) => void;
    className?: string;
};

export default function CardGrupo({curso, grupos, onAddGrupo, onEditGrupo, onDeleteGrupo, className,}: Props) {
    
    const { nombre, modalidad, imageUrl, imageAlt } = curso;
    const modalidadText = modalidad;
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = () => {
        setIsOpen(prev => !prev);
    };

    return (
        <article className={`${styles.card} ${className ?? ''}`}>
            {/* Imagen */}
            <div className={styles.imageBox}>
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

                {/* Acciones principales (Agregar grupo / Ver grupos) */}
                <div className={styles.actions}>
                    <button
                        type="button"
                        className={`${styles.roundBtn} ${styles.add} ${styles.tooltip}`}
                        onClick={() => onAddGrupo(curso)}
                        aria-label="Agregar "
                        data-tooltip="Agregar"
                    >
                        <FaPlus />
                    </button>

                    <button
                        type="button"
                        className={`${styles.roundBtn} ${styles.view} ${styles.tooltip}`}
                        onClick={handleToggle}
                        aria-label={isOpen ? 'Ocultar ' : 'Ver '}
                        data-tooltip={isOpen ? 'Ocultar ' : 'Ver '}
                    >
                        <FaEye />
                    </button>
                </div>

                {/* Acordeon con los grupos del curso */}
                <div
                    className={
                        isOpen
                            ? `${styles.groupsWrapper} ${styles.groupsWrapperOpen}`
                            : styles.groupsWrapper
                    }
                >
                    <div className={styles.groupsList}>
                        {grupos.length === 0 ? (
                            <span className={styles.groupName}>
                                No hay grupos.
                            </span>
                        ) : (
                            grupos.map(grupo => (
                                <div key={grupo.id} className={styles.groupRow}>
                                    <span className={styles.groupName}>{grupo.nombre}</span>
                                    <div className={styles.groupActions}>
                                        <button
                                            type="button"
                                            className={`${styles.roundBtn} ${styles.smallBtn} ${styles.edit}`}
                                            onClick={() => onEditGrupo(grupo)}
                                        >
                                            <FaPen />
                                        </button>
                                        <button
                                            type="button"
                                            className={`${styles.roundBtn} ${styles.smallBtn} ${styles.delete} `}
                                            onClick={() => onDeleteGrupo(grupo.id)}
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </article>
    );
}
