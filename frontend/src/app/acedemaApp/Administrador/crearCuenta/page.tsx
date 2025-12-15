'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/AdminNavbar';
import styles from '../crearCuenta/cuenta.module.css';
import DatePicker from "react-datepicker";
import { cuentaRules, validateCuenta } from "@/lib/cuentavalidaciones";
import { useRef } from 'react';


const API_REGISTER_URL = 'http://localhost:5069/api/Persona/registrarPersona';

type PersonaForm = {
    numCedula: string;
    fechaNacimiento: string;
    primerNombre: string;
    segundoNombre: string;
    primerApellido: string;
    segundoApellido: string;
    correo: string;
    direccion: string;
    telefono1: string;
    telefono2: string;
    idRol: string;
    puesto: string;
};

const initialForm: PersonaForm = {
    numCedula: '',
    fechaNacimiento: '',
    primerNombre: '',
    segundoNombre: '',
    primerApellido: '',
    segundoApellido: '',
    correo: '',
    direccion: '',
    telefono1: '',
    telefono2: '',
    idRol: '',
    puesto: '',
};

type ToastType = 'success' | 'error' | 'warning';

type ToastState = {
    message: string;
    type: ToastType;
    copyText?: string;
} | null;

export default function CrearCuentaPage() {
    const router = useRouter();
    const [form, setForm] = useState<PersonaForm>(initialForm);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [openRol, setOpenRol] = useState(false);
    const [toast, setToast] = useState<ToastState>(null);
    const toastTimerRef = useRef<number | null>(null);

    const showToast = (
        message: string,
        type: ToastType = 'success',
        duration: number = 3500,
        copyText?: string
    ) => {
        setToast({ message, type, copyText });

        if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);

        toastTimerRef.current = window.setTimeout(() => {
            setToast(null);
            toastTimerRef.current = null;
        }, duration);
    };


    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        // Validacion con reglas
        const errors = validateCuenta(form, cuentaRules);
        if (errors.length > 0) {
            showToast(errors[0], 'warning'); 
            return;
        }

        // Este endpoint exige rol "Administrador".
        const token = localStorage.getItem('token');
        if (!token) {
            showToast(
                'No se encontró un token de sesión. Inicia sesión nuevamente como administrador.',
                'error'
            );
            return;
        }
        //  Crear objeto persona  
        const persona = {
            numCedula: Number(form.numCedula),
            fechaNacimiento: form.fechaNacimiento, // YYYY-MM-DD
            primerNombre: form.primerNombre.trim(),
            segundoNombre: form.segundoNombre.trim() || '', //se envia pero puede ir vacio
            primerApellido: form.primerApellido.trim(),
            segundoApellido: form.segundoApellido.trim() || '', //se envia pero puede ir vacio
            correo: form.correo.trim(),
            direccion: form.direccion.trim(),
            telefono1: Number(form.telefono1),
            telefono2: form.telefono2.trim() ? Number(form.telefono2) : 0, //se envia pero puede ir vacio
            idRol: Number(form.idRol),
            puesto: form.puesto.trim(),
        };

        const payload = { persona };
        
        try {
            setLoading(true);

            const res = await fetch(API_REGISTER_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json().catch(() => null);
            console.log('Respuesta registrarPersona:', data); 

            if (!res.ok) {
                const msg =
                    data?.mensaje ||
                    data?.message ||
                    'No se pudo registrar la persona. Revisa los datos o los permisos.';
                showToast(msg, 'error');
                return;
            }

            // Aca se lee el campo que se manda desde el backend
            const tempPassword: string | undefined = data.passwordTemporal;

            if (tempPassword) {
                showToast(
                    `Cuenta creada.\nContraseña temporal: ${tempPassword}`,
                    'success',
                    6000,       
                    tempPassword 
                );
            } else {
                showToast('Cuenta creada correctamente (sin contraseña temporal en respuesta).', 'warning');
            }
            
            // limpiar formulario
            setForm(initialForm);
            setOpenRol(false);
            
        } catch (err) {
            console.error(err);
            showToast('Ocurrió un error inesperado al conectar con el servidor.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const rolOptions = [
        { value: '1', label: 'Administrador' },
        { value: '2', label: 'Estudiante' },
        { value: '3', label: 'Profesor' },
    ];

    const getRolLabel = (value: string) => {
        const found = rolOptions.find(r => r.value === value);
        return found ? found.label : 'Selecciona un rol';
    };

    const handleSelectRol = (value: string) => {
        setForm(prev => ({ ...prev, idRol: value }));
        setOpenRol(false);
    };

    return (
        <div className={styles.cuenta}>
            <Navbar />
            {toast && (
                <div
                    className={`${styles.toast} ${styles[toast.type]}`}
                    style={{
                        ['--toast-duration' as any]:
                            toast.type === 'success' ? '6s' : '3s'
                    }}
                >
                    <div className={styles.toastContent}>
                        <span className={styles.toastText}>{toast.message}</span>

                        {toast.copyText && (
                            <button
                                type="button"
                                className={styles.toastCopyBtn}
                                onClick={async () => {
                                    try {
                                        await navigator.clipboard.writeText(toast.copyText!);
                                        showToast('Copiado', 'success', 2000);
                                    } catch {
                                        showToast('No se pudo copiar.', 'warning', 2500);
                                    }
                                }}
                            >
                                Copiar
                            </button>
                        )}
                    </div>
                </div>
            )}

            <main className={styles.cuentaWrapper}>
                <section className={styles.cuentaBox}>
                    {/* formulario */}
                    <form className={styles.cuentaForm} onSubmit={handleSubmit} noValidate>
                        <h1 className={styles.title}>Crear cuenta</h1>

                        <div className={styles.fieldsGrid}>
                            {/* Cédula */}
                            <div className={styles.field}>
                                <label htmlFor="numCedula" className={styles.label}>
                                    Número de cédula
                                </label>
                                <input
                                    id="numCedula"
                                    type="text"
                                    name="numCedula"
                                    value={form.numCedula}
                                    onChange={handleChange}
                                    className={styles.input}
                                />
                            </div>

                            {/* Fecha de nacimiento */}
                            <div className={styles.field}>
                                <label htmlFor="fechaNacimiento" className={styles.label}>
                                    Fecha de nacimiento
                                </label>

                                <div className={styles.customDate}>
                                    <DatePicker
                                        selected={form.fechaNacimiento ? new Date(form.fechaNacimiento) : null}
                                        onChange={(date: Date | null) => {
                                            const formatted = date
                                                ? date.toISOString().split("T")[0]   // YYYY-MM-DD
                                                : "";

                                            handleChange({
                                                target: {
                                                    name: "fechaNacimiento",
                                                    value: formatted,
                                                },
                                            } as React.ChangeEvent<HTMLInputElement>);
                                        }}
                                        dateFormat="dd/MM/yyyy"
                                        placeholderText="Selecciona una fecha"
                                        className={`${styles.input} ${styles.dateInputCustom}`}  
                                        calendarClassName={styles.calendar}
                                        peekNextMonth
                                        showMonthDropdown
                                        showYearDropdown
                                        dropdownMode="select"
                                    />
                                </div>
                            </div>

                            {/* Nombres */}
                            <div className={styles.field}>
                                <label htmlFor="primerNombre" className={styles.label}>
                                    Primer nombre
                                </label>
                                <input
                                    id="primerNombre"
                                    type="text"
                                    name="primerNombre"
                                    value={form.primerNombre}
                                    onChange={handleChange}
                                    className={styles.input}
                                />
                            </div>

                            <div className={styles.field}>
                                <label htmlFor="segundoNombre" className={styles.label}>
                                    Segundo nombre (Opcional)
                                </label>
                                <input
                                    id="segundoNombre"
                                    type="text"
                                    name="segundoNombre"
                                    value={form.segundoNombre}
                                    onChange={handleChange}
                                    className={styles.input}
                                />
                            </div>

                            {/* Apellidos */}
                            <div className={styles.field}>
                                <label htmlFor="primerApellido" className={styles.label}>
                                    Primer apellido
                                </label>
                                <input
                                    id="primerApellido"
                                    type="text"
                                    name="primerApellido"
                                    value={form.primerApellido}
                                    onChange={handleChange}
                                    className={styles.input}
                                />
                            </div>

                            <div className={styles.field}>
                                <label htmlFor="segundoApellido" className={styles.label}>
                                    Segundo apellido (Opcional)
                                </label>
                                <input
                                    id="segundoApellido"
                                    type="text"
                                    name="segundoApellido"
                                    value={form.segundoApellido}
                                    onChange={handleChange}
                                    className={styles.input}
                                />
                            </div>

                            {/* Teléfono principal */}
                            <div className={styles.field}>
                                <label htmlFor="telefono1" className={styles.label}>
                                    Teléfono principal
                                </label>
                                <input
                                    id="telefono1"
                                    type="tel"
                                    name="telefono1"
                                    value={form.telefono1}
                                    onChange={handleChange}
                                    className={styles.input}
                                />
                            </div>

                            {/* Teléfono secundario */}
                            <div className={styles.field}>
                                <label htmlFor="telefono2" className={styles.label}>
                                    Teléfono secundario (Opcional)
                                </label>
                                <input
                                    id="telefono2"
                                    type="tel"
                                    name="telefono2"
                                    value={form.telefono2}
                                    onChange={handleChange}
                                    className={styles.input}
                                />
                            </div>

                            {/* Correo */}
                            <div className={styles.field}>
                                <label htmlFor="correo" className={styles.label}>
                                    Correo electrónico
                                </label>
                                <input
                                    id="correo"
                                    type="email"
                                    name="correo"
                                    value={form.correo}
                                    onChange={handleChange}
                                    className={styles.input}
                                />
                            </div>
                            
                            {/* Rol */}
                            <div className={styles.field}>
                                <label htmlFor="idRol" className={styles.label}>
                                    Rol en el sistema
                                </label>

                                <div className={styles.customSelect}>
                                    <button
                                        type="button"
                                        className={styles.customSelectButton}
                                        onClick={() => setOpenRol(prev => !prev)}
                                    >
                                        <span>{getRolLabel(form.idRol)}</span>
                                        <span className={styles.arrow}>▾</span>
                                    </button>

                                    {openRol && (
                                        <div className={styles.customSelectMenu}>
                                            {rolOptions.map(op => (
                                                <button
                                                    key={op.value}
                                                    type="button"
                                                    className={`${styles.customSelectItem} ${
                                                        form.idRol === op.value ? styles.selectedItem : ''
                                                    }`}
                                                    onClick={() => handleSelectRol(op.value)}
                                                >
                                                    <span>{op.label}</span>
                                                    {form.idRol === op.value && (
                                                        <span className={styles.checkIcon}>✔</span>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Dirección */}
                            <div className={styles.field}>
                                <label htmlFor="direccion" className={styles.label}>
                                    Dirección
                                </label>
                                <textarea
                                    id="direccion"
                                    name="direccion"
                                    value={form.direccion}
                                    onChange={handleChange}
                                    placeholder="Provincia, cantón, distrito…"
                                    className={styles.textarea}
                                    rows={2}
                                />
                            </div>
                            
                            {/* Puesto */}
                            <div className={styles.field}>
                                <label htmlFor="puesto" className={styles.label}>
                                    Puesto
                                </label>
                                <input
                                    id="puesto"
                                    type="text"
                                    name="puesto"
                                    value={form.puesto}
                                    onChange={handleChange}
                                    className={styles.input}
                                />
                            </div>
                        </div>

                        <button type="submit" className={styles.button} disabled={loading}>
                            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
                        </button>
                        
                    </form>

                </section>
            </main>
        </div>
    );
}