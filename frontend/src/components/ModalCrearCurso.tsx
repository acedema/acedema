'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './ModalCurso.module.css';
import { courseRules, validate } from "@/lib/cursovalidaciones";

export type Modalidad = 'Individual' | 'Grupal';

export type CourseInput = {
    id?: string;
    nombre: string;
    profesor: string;
    instrumento: string;
    modalidad: Modalidad;
    imagenUrl: string;
};

type Props = {
    open: boolean;
    onClose: () => void;
    onSubmit: (payload: CourseInput) => void;
};

export default function ModalCrearCurso({ open, onClose, onSubmit }: Props) {
    const dialogRef = useRef<HTMLDialogElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [openModalidad, setOpenModalidad] = useState(false);
    const [error, setError] = useState<string | null>(null);


    const [form, setForm] = useState<CourseInput>({
        id: undefined,
        nombre: '',
        profesor: '',
        instrumento: '',
        modalidad: 'Individual',
        imagenUrl: '',
    });

    // abrir/cerrar <dialog>
    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;
        if (open && !dialog.open) dialog.showModal();
        if (!open && dialog.open) dialog.close();
    }, [open]);

    const handleCancel = () => onClose();

    const handleChange =
        (field: keyof CourseInput) =>
            (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
                setForm(prev => ({ ...prev, [field]: e.target.value }));
            };

    const handlePickFile = () => {
        fileInputRef.current?.click();
    };

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const objectUrl = URL.createObjectURL(file);
        setForm(prev => ({ ...prev, imagenUrl: objectUrl }));
    };

    const handleSubmit = () => {
        const errors = validate(form, courseRules);

        if (errors.length > 0) {
            setError(errors[0]);   // mostrar error dentro del modal
            return;                // NO cerrar
        }

        // Si todo está bien
        onSubmit(form);
        onClose();

        // limpiar formulario
        setForm({
            id: undefined,
            nombre: '',
            profesor: '',
            instrumento: '',
            modalidad: 'Individual',
            imagenUrl: '',
        });

        setError(null);
    };

    const handleSelectModalidad = (op: Modalidad) => {
        setForm(prev => ({ ...prev, modalidad: op }));
        setOpenModalidad(false); 
    };

    return (
        <dialog
            ref={dialogRef}
            className={styles.dialog}
            onCancel={handleCancel}
            aria-labelledby="create-curso-title"
            aria-modal="true"
        >
            <form method="dialog" className={styles.container} onSubmit={handleSubmit} noValidate>
                <header className={styles.header}>
                    <h2 id="create-curso-title" className={styles.heading}>
                        Nuevo curso
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

                {error && (
                    <div className={styles.modalError}>
                        {error}
                    </div>
                )}

                <section className={styles.body}>
                    {/* Columna izquierda: campos */}
                    <div className={styles.formCol}>
                        <label className={styles.label}>
                            Nombre
                            <input
                                className={styles.input}
                                value={form.nombre}
                                onChange={handleChange('nombre')}
                                placeholder="Ej. Curso de guitarra"
                                
                            />
                        </label>

                        <label className={styles.label}>
                            Profesor
                            <input
                                className={styles.input}
                                value={form.profesor}
                                onChange={handleChange('profesor')}
                                placeholder="Ej. Juan Pérez"
                                
                            />
                        </label>

                        <label className={styles.label}>
                            Instrumento
                            <input
                                className={styles.input}
                                value={form.instrumento}
                                onChange={handleChange('instrumento')}
                                placeholder="Ej. Guitarra"
                                
                            />
                        </label>

                        <div className={styles.fieldGroup}>
                            <span className={styles.label}>Modalidad</span>

                            <div className={styles.customSelect}>
                                <button
                                    type="button"
                                    className={styles.customSelectButton}
                                    onClick={() => setOpenModalidad(prev => !prev)}
                                >
                                    <span>{form.modalidad}</span>
                                    <span className={styles.arrow}>▾</span>
                                </button>

                                {openModalidad && (
                                    <div className={styles.customSelectMenu}>
                                        {(['Individual', 'Grupal'] as Modalidad[]).map(op => (
                                            <button
                                                key={op}
                                                type="button"
                                                className={`${styles.customSelectItem} ${
                                                    form.modalidad === op ? styles.selectedItem : ''
                                                }`}
                                                onClick={() => handleSelectModalidad(op)}
                                            >
                                                <span>{op}</span>
                                                {form.modalidad === op && (
                                                    <span className={styles.checkIcon}>✔</span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        <label className={styles.label}>
                            Imagen (URL)
                            <input
                                className={styles.input}
                                value={form.imagenUrl}
                                onChange={handleChange('imagenUrl')}
                                placeholder="https://..."
                            />
                        </label>

                        <div className={styles.inline}>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className={styles.hiddenFile}
                                onChange={handleFile}
                            />
                            <button
                                type="button"
                                className={styles.secondaryBtn}
                                onClick={handlePickFile}
                            >
                                Agregar
                            </button>
                        </div>
                    </div>

                    {/* Columna derecha: vista previa */}
                    <div className={styles.previewCol}>
                        <p className={styles.previewLabel}>Vista previa</p>
                        <div className={styles.previewBox}>
                            {form.imagenUrl ? (
                                <img
                                    src={form.imagenUrl}
                                    alt="Vista previa"
                                    className={styles.previewImg}
                                />
                            ) : (
                                <div className={styles.previewPlaceholder}>
                                    <span className={styles.placeholderIcon}>🖼️</span>
                                </div>
                            )}
                        </div>
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
