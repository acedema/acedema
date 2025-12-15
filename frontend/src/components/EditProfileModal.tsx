/**
 * ¿Qué hace?
 * -Define el modal de “Editar perfil” del estudiante/usuario.
 * -Muestra un formulario con los datos principales de la persona y permite modificarlos.
 * -Al enviar, realiza un PUT al backend para actualizar el perfil y notifica al padre con los datos actualizados.
 *
 * Se usa en la sección de Perfil dentro del módulo del Estudiante. y Conecta la interfaz de edición con el endpoint protegido: Persona/actualizarMiPerfil.
 */

'use client';

import { useEffect, useMemo, useState } from 'react';
import Modal from './ModalPerfil';
import styles from './EditProfileModal.module.css';
import { sendData } from '@/lib/api';

type Persona = {
    fechaNacimiento: string;
    primerNombre: string;
    segundoNombre?: string;
    primerApellido: string;
    segundoApellido?: string;
    direccion: string;
    telefono1: string;
    telefono2?: string;
};

type Props = {
    open: boolean;
    persona: Persona;
    onClose: () => void;
    onUpdated?: (updated: Persona) => void; 
};

export default function EditProfileModal({ open, persona, onClose, onUpdated }: Props) {
    // Se construye un "estado inicial" a partir de persona.
    // useMemo evita recalcularlo en cada render, y mantiene consistencia si persona cambia.
    const initial = useMemo(
        () => ({
            primerNombre: persona.primerNombre ?? '',
            segundoNombre: persona.segundoNombre ?? '',
            primerApellido: persona.primerApellido ?? '',
            segundoApellido: persona.segundoApellido ?? '',
            fechaNacimiento: persona.fechaNacimiento?.slice(0, 10) ?? '',
            direccion: persona.direccion ?? '',
            telefono1: persona.telefono1 ?? '',
            telefono2: persona.telefono2 ?? '',
        }),
        [persona]
    );

    const [form, setForm] = useState(initial);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Cuando el modal se abre, se resetea el formulario con los datos actuales
        // para evitar que queden valores viejos de una edición anterior.
        if (open) {
            setForm(initial);
            setError(null);
        }
    }, [open, initial]);

    const onChange = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [key]: e.target.value }));
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            await sendData(
                'Persona/actualizarMiPerfil',
                'PUT',
                {
                    primerNombre: form.primerNombre,
                    segundoNombre: form.segundoNombre || null,
                    primerApellido: form.primerApellido,
                    segundoApellido: form.segundoApellido || null,
                    // Se envía con timezone UTC (Z) para evitar error del backend con timestamp with time zone.
                    fechaNacimiento: new Date(form.fechaNacimiento + 'T00:00:00Z').toISOString(),
                    direccion: form.direccion,
                    telefono1: Number(form.telefono1) || 0,
                    telefono2: Number(form.telefono2) || 0,
                }
            );

            onUpdated?.({
                ...persona,
                ...form,
                segundoNombre: form.segundoNombre || undefined,
                segundoApellido: form.segundoApellido || undefined,
                telefono2: form.telefono2 || undefined,
            });

            onClose();
        } catch (err: any) {
            setError(err?.message ?? 'No se pudo guardar el perfil.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal open={open} title="Editar perfil" onClose={onClose}>
            <form onSubmit={onSubmit} className={styles.form}>
                <div className={styles.grid}>
                    <Field label="Primer nombre" value={form.primerNombre} onChange={onChange('primerNombre')} required />
                    <Field label="Segundo nombre" value={form.segundoNombre} onChange={onChange('segundoNombre')} />
                    <Field label="Primer apellido" value={form.primerApellido} onChange={onChange('primerApellido')} required />
                    <Field label="Segundo apellido" value={form.segundoApellido} onChange={onChange('segundoApellido')} />
                    <Field label="Fecha de nacimiento" type="date" value={form.fechaNacimiento} onChange={onChange('fechaNacimiento')} />
                    <Field label="Dirección" value={form.direccion} onChange={onChange('direccion')} />
                    <Field label="Teléfono 1" type="tel" value={form.telefono1} onChange={onChange('telefono1')} />
                    <Field label="Teléfono 2" type="tel" value={form.telefono2} onChange={onChange('telefono2')} />
                </div>

                {error && <p className={styles.error}>{error}</p>}

                <div className={styles.actions}>
                    <button type="button" className={styles.secondary} onClick={onClose} disabled={saving}>
                        Cancelar
                    </button>
                    <button type="submit" className={styles.primary} disabled={saving}>
                        {saving ? 'Guardando...' : 'Guardar cambios'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}

function Field({
                   label,
                   value,
                   onChange,
                   type = 'text',
                   required = false,
               }: {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    required?: boolean;
}) {
    return (
        <label className={styles.field}>
            <span className={styles.label}>{label}</span>
            <input className={styles.input} type={type} value={value} onChange={onChange} required={required} />
        </label>
    );
}
