'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './ModalGrupo.module.css';
import { grupoRules, validate } from '@/lib/grupovalidaciones';
import type { GrupoInput } from './ModalCrearGrupo';

type Props = {
    open: boolean;
    initialData?: GrupoInput;
    onClose: () => void;
    onSubmit: (payload: GrupoInput) => void;
    title?: string;
};

export default function ModalEditarGrupo({open, initialData, onClose, onSubmit, title = 'Editar grupo',}: Props) {
   
    const dialogRef = useRef<HTMLDialogElement | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [openNivel, setOpenNivel] = useState(false);

    
    const [form, setForm] = useState<GrupoInput>({
        id: initialData?.id,
        nombre: initialData?.nombre ?? '',
        edades: initialData?.edades ?? '',
        nivel: initialData?.nivel ?? '',
        duracion: initialData?.duracion ?? '',
        horario: initialData?.horario ?? '',
        cupoMaximo: initialData?.cupoMaximo ?? '',
    });

    useEffect(() => {
        setForm({
            id: initialData?.id,
            nombre: initialData?.nombre ?? '',
            edades: initialData?.edades ?? '',
            nivel: initialData?.nivel ?? '',
            duracion: initialData?.duracion ?? '',
            horario: initialData?.horario ?? '',
            cupoMaximo: initialData?.cupoMaximo ?? '',
        });
    }, [initialData]);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;
        if (open && !dialog.open) dialog.showModal();
        if (!open && dialog.open) dialog.close();
    }, [open]);

    const handleCancel = () => onClose();

    const handleChange =
        (field: keyof GrupoInput) =>
            (e: React.ChangeEvent<HTMLInputElement>) => {
                setForm(prev => ({ ...prev, [field]: e.target.value }));
            };

    const handleSubmit = () => {
        const errors = validate(form, grupoRules);

        if (errors.length > 0) {
            setError(errors[0]);  
            return;                
        }

        onSubmit({
            ...form,
            nombre: form.nombre.trim(),
            edades: form.edades.trim(),
            nivel: form.nivel.trim(),
            duracion: form.duracion.trim(),
            horario: form.horario.trim(),
            cupoMaximo: form.cupoMaximo.trim(),
        });

        onClose();
        setError(null);
    };

    const handleSelectNivel = (nivel: string) => {
        setForm(prev => ({ ...prev, nivel }));
        setOpenNivel(false);
    };


    return (
        <dialog
            ref={dialogRef}
            className={styles.dialog}
            onCancel={handleCancel}
            aria-labelledby="edit-grupo-title"
            aria-modal="true"
        >
            <form
                method="dialog"
                className={styles.container}
                onSubmit={handleSubmit}
                noValidate
            >
                <header className={styles.header}>
                    <h2 id="edit-grupo-title" className={styles.heading}>
                        {title}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className={styles.closeBtn}
                        aria-label="Cerrar"
                        title="Cerrar"
                    >
                        ×
                    </button>
                </header>

                {error && <div className={styles.modalError}>{error}</div>}

                <section className={styles.body}>
                    <div className={styles.field}>
                        <label className={styles.label}>
                            Nombre
                            <input
                                className={styles.input}
                                value={form.nombre}
                                onChange={handleChange('nombre')}
                                placeholder="Ej. Grupo 1 guitarra"
                            />
                        </label>
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>
                            Edades
                            <input
                                className={styles.input}
                                value={form.edades}
                                onChange={handleChange('edades')}
                                placeholder="Ej. 8 - 12 años"
                            />
                        </label>
                    </div>

                    <div className={styles.fieldGroup}>
                        <span className={styles.label}>Nivel</span>

                        <div className={styles.customSelect}>
                            <button
                                type="button"
                                className={styles.customSelectButton}
                                onClick={() => setOpenNivel(prev => !prev)}
                            >
                                <span>{form.nivel || 'Seleccione un nivel'}</span>
                                <span className={styles.arrow}>▾</span>
                            </button>

                            {openNivel && (
                                <div className={styles.customSelectMenu}>
                                    {['Principiante', 'Avanzado'].map((op) => (
                                        <button
                                            key={op}
                                            type="button"
                                            className={`${styles.customSelectItem} ${
                                                form.nivel === op ? styles.selectedItem : ''
                                            }`}
                                            onClick={() => handleSelectNivel(op)}
                                        >
                                            <span>{op}</span>
                                            {form.nivel === op && (
                                                <span className={styles.checkIcon}>✔</span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>


                    <div className={styles.field}>
                        <label className={styles.label}>
                            Duración de la lección
                            <input
                                className={styles.input}
                                value={form.duracion}
                                onChange={handleChange('duracion')}
                                placeholder="Ej. 60 minutos"
                            />
                        </label>
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>
                            Horario
                            <input
                                className={styles.input}
                                value={form.horario}
                                onChange={handleChange('horario')}
                                placeholder="Ej. Lunes 4:00 p.m."
                            />
                        </label>
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>
                            Cupo máximo
                            <input
                                className={styles.input}
                                value={form.cupoMaximo}
                                onChange={handleChange('cupoMaximo')}
                                placeholder="Ej. 10"
                            />
                        </label>
                    </div>

                </section>

                <footer className={styles.footer}>
                    <button
                        type="button"
                        className={styles.cancelBtn}
                        onClick={onClose}
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        className={styles.primaryBtn}
                        onClick={handleSubmit}
                    >
                        Confirmar
                    </button>
                </footer>
            </form>
        </dialog>
    );
}
