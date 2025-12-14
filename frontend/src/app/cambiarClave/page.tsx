'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import styles from './cambiar.module.css';
import { useEffect } from 'react';
import { cambiarClaveRules, validateCambiarClave } from "@/lib/cambiarClaveValidaciones";


const API_CAMBIAR_CLAVE = "http://localhost:5069/api/Persona/cambiar-clave-inicial";

type ToastType = 'success' | 'error' | 'warning';

type ToastState = {
    message: string;
    type: ToastType;
} | null;

type FormState = {
    correo: string;
    contrasenaActual: string;
    nuevaContrasena: string;
    confirmarContrasena: string;
};

const initialForm: FormState = {
    correo: '',
    contrasenaActual: '',
    nuevaContrasena: '',
    confirmarContrasena: '',
};

export default function CambiarClavePage() {
    const router = useRouter();
    const [form, setForm] = useState<FormState>(initialForm);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<ToastState>(null);
    const [showActual, setShowActual] = useState(false);
    const [showNueva, setShowNueva] = useState(false);
    const [showConfirmar, setShowConfirmar] = useState(false);
    const [transicionSuave, setTransicionSuave] = useState(true);

    // para que entre suave al tocarse 'cambiar contraseña'
    useEffect(() => {
        const t = setTimeout(() => setTransicionSuave(false), 20);
        return () => clearTimeout(t);
    }, []);
    
    // para que salga suave al tocarse 'cvolver'
    const handleVolver = () => {
        if (transicionSuave) return;
        setTransicionSuave(true); // fadeOut
        setTimeout(() => router.back(), 400);
    };
    const showToast = (message: string, type: ToastType = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        // VALIDACIONES 
        const errors = validateCambiarClave(form, cambiarClaveRules);
        if (errors.length > 0) {
            showToast(errors[0], "warning");
            return;
        }
        
        const payload = {
            correo: form.correo.trim(),
            contrasenaActual: form.contrasenaActual,
            nuevaContrasena: form.nuevaContrasena,
        };

        try {
            setLoading(true);

            const res = await fetch(API_CAMBIAR_CLAVE, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json().catch(() => null);
            console.log('Respuesta cambiar clave:', data);
            
            if (!res.ok || !data?.resultado) {
                const msg =
                    data?.mensaje ||
                    data?.message ||
                    'No se pudo actualizar la contraseña. Verifica los datos.';
                showToast(msg, 'error');
                return;
            }

            showToast('Contraseña actualizada correctamente.', 'success');
            setForm(initialForm);

            // activa animacion
            setTransicionSuave(true);
            setTimeout(() => router.push('/login'), 1400);

        } catch (err) {
            console.error(err);
            showToast('Ocurrió un error inesperado al conectar con el servidor.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.change}>
            {/* TOAST */}
            {toast && (
                <div
                    className={`${styles.toast} ${
                        toast.type === 'success'
                            ? styles.toastSuccess
                            : toast.type === 'error'
                                ? styles.toastError
                                : styles.toastWarning
                    }`}
                >
                    {toast.message}
                </div>
            )}

            <main className={styles.changeWrapper}>
                <section className={`${styles.changeBox} ${transicionSuave ? styles.fadeOut : ''}`}>
                    <form className={styles.changeForm} onSubmit={handleSubmit} noValidate>

                        <div className={styles.header}>
                            <h1 className={styles.title}>Cambiar contraseña</h1>
                            <p className={styles.smallText}>
                                Recuerda no compartir tu contraseña con nadie.
                            </p>
                        </div>

                        {/* GRID DE CAMPOS */}
                        <div className={styles.formGrid}>
                            {/* Correo */}
                            <div className={styles.field}>
                                <label className={styles.label}>Correo electrónico</label>
                                <input
                                    type="email"
                                    name="correo"
                                    value={form.correo}
                                    onChange={handleChange}
                                    className={styles.input}
                                    placeholder="ejemplo@correo.com"
                                />
                            </div>

                            {/* Contraseña actual */}
                            <div className={styles.field}>
                                <label className={styles.label}>Contraseña actual</label>
                                <div className={styles.inputPasswordWrapper}>
                                    <input
                                        type={showActual ? 'text' : 'password'}
                                        name="contrasenaActual"
                                        value={form.contrasenaActual}
                                        onChange={handleChange}
                                        className={styles.input}
                                    />
                                    <span className={styles.eyeIcon} onClick={() => setShowActual(p => !p)}>
                    {showActual ? <FaEye  /> : <FaEyeSlash />}
                </span>
                                </div>
                            </div>

                            {/* Nueva contraseña */}
                            <div className={styles.field}>
                                <label className={styles.label}>Nueva contraseña</label>
                                <div className={styles.inputPasswordWrapper}>
                                    <input
                                        type={showNueva ? 'text' : 'password'}
                                        name="nuevaContrasena"
                                        value={form.nuevaContrasena}
                                        onChange={handleChange}
                                        className={styles.input}
                                    />
                                    <span className={styles.eyeIcon} onClick={() => setShowNueva(p => !p)}>
                    {showNueva ? <FaEye /> : <FaEyeSlash />}
                </span>
                                </div>
                            </div>

                            {/* Confirmar contraseña */}
                            <div className={styles.field}>
                                <label className={styles.label}>Confirmar nueva contraseña</label>
                                <div className={styles.inputPasswordWrapper}>
                                    <input
                                        type={showConfirmar ? 'text' : 'password'}
                                        name="confirmarContrasena"
                                        value={form.confirmarContrasena}
                                        onChange={handleChange}
                                        className={styles.input}
                                    />
                                    <span className={styles.eyeIcon} onClick={() => setShowConfirmar(p => !p)}>
                    {showConfirmar ? <FaEye /> : <FaEyeSlash />}
                </span>
                                </div>
                            </div>
                        </div>

                        <button type="submit" className={styles.button} disabled={loading}>
                            {loading ? 'Actualizando...' : 'Guardar'}
                        </button>

                        <p className={styles.backText}>
                            <button
                                type="button"
                                className={styles.backLink}
                                onClick={() => {
                                    if (transicionSuave) return;   // evita doble click
                                    setTransicionSuave(true);      // activa fadeOut
                                    setTimeout(() => {
                                        router.back();               // navega luego de la animacion
                                    }, 400);                       
                                }}
                            >
                                ← Volver
                            </button>
                        </p>
                    </form>

                </section>
            </main>
        </div>
    );
}
