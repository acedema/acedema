/**
 * ¿Qué hace?
 * - Define la página de Perfil del usuario autenticado.
 * - Obtiene los datos del perfil desde el backend usando la API protegida.
 * - Muestra la información principal del usuario y permite abrir un modal para editar el perfil.
 *
 * Forma parte del módulo del Estudiante dentro de la aplicación principal (acedemaApp). Es la vista donde el usuario puede consultar y actualizar su información personal.
 *
 * Faltante:
 * El editar perfil no funciona correctamente por un error del Backend.
 */

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import styles from './perfil.module.css';
import { fetchData } from '@/lib/api';

import TabButton from '@/components/TabButton';
import PersonalInfoPanel from '@/components/PersonalInfoPanel';
import EditProfileModal from '@/components/EditProfileModal';

type TabKey = 'info' | 'settings';

// Define la estructura de los datos de la persona que vienen del backend.
// Se usa para tipar correctamente la información del perfil y evitar errores.
interface Persona {
    personaId: number;
    numCedula: string;
    primerNombre: string;
    segundoNombre?: string;
    primerApellido: string;
    segundoApellido?: string;
    correo: string;
    direccion: string;
    telefono1: string;
    telefono2?: string;
    fechaNacimiento: string;
    fechaRegistro: string;
    nombreRol: string;
    puesto?: string;
    cedulaResponsable?: string;
}

// Obtiene las iniciales del usuario a partir de su nombre y apellido.
// Se utiliza para mostrar un avatar con letras cuando no hay imagen de perfil.
function getInitials(persona: Persona) {
    const parts = [persona.primerNombre, persona.segundoNombre, persona.primerApellido]
        .filter((p): p is string => Boolean(p));

    const initials = parts
        .map((p) => p.trim().charAt(0).toUpperCase())
        .join('')
        .slice(0, 2);

    return initials || 'US';
}

export default function PerfilPage() {
    // activeTab: controla qué sección del perfil se muestra.
    // persona: almacena los datos del perfil obtenidos del backend.
    // loading: controla el estado de carga inicial.
    // openEdit: controla la apertura del modal de edición de perfil.
    const [activeTab, setActiveTab] = useState<TabKey>('info');
    const [persona, setPersona] = useState<Persona | null>(null);
    const [loading, setLoading] = useState(true);
    const [openEdit, setOpenEdit] = useState(false);

    useEffect(() => {
        // Al montar la página, se consulta el endpoint obtenerMiPerfil.
        // Esto garantiza que los datos mostrados correspondan al usuario autenticado y no dependan de información almacenada localmente.
        const fetchPersona = async () => {
            try {
                const data = await fetchData<{ persona: Persona }>('Persona/obtenerMiPerfil');
                setPersona(data.persona);
            } catch (error) {
                console.error(error);
                setPersona(null);
            } finally {
                setLoading(false);
            }
        };
        fetchPersona();
    }, []);

    if (loading) return <div>Cargando...</div>;
    if (!persona) return <div>No se pudo obtener los datos del perfil.</div>;

    const fullName = [
        persona.primerNombre,
        persona.segundoNombre,
        persona.primerApellido,
        persona.segundoApellido,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={styles.page}>
            <Navbar />
            {/* Modal reutilizable que permite editar los datos del perfil. Al cerrarse exitosamente, actualiza el estado local sin recargar la página. */}
            <EditProfileModal
                open={openEdit}
                persona={persona}
                onClose={() => setOpenEdit(false)}
                onUpdated={(updated) => setPersona({ ...persona, ...updated })}
            />
            <main className={styles.container}>
                <section className={styles.profileWrapper}>
                    <section className={styles.profileLayout}>
                        <div className={styles.leftColumn}>
                            <header className={styles.header}>
                                <div className={styles.avatar}>
                                    <span>{getInitials(persona)}</span>
                                </div>
                                <div>
                                    <p className={styles.sectionLabel}>Mi perfil</p>
                                    <h1 className={styles.name}>{fullName}</h1>
                                    <p className={styles.role}>{persona.nombreRol}</p>
                                    <p className={styles.email}>{persona.correo}</p>
                                </div>
                            </header>

                            <div className={styles.actions}>
                                {/* Abre el modal de edición del perfil. Se separa la edición en un modal para mantener la página limpia y clara.*/}
                                <button
                                    className={styles.primaryButton}
                                    onClick={() => setOpenEdit(true)}
                                    type="button"
                                >
                                    Editar perfil
                                </button>
                            </div>

                            <div className={styles.tabs}>
                                {/* Sistema de tabs simple para separar la información del perfil
                                    y futuras secciones*/}
                                <TabButton
                                    label="Información personal"
                                    isActive={activeTab === 'info'}
                                    onClick={() => setActiveTab('info')}
                                />
                            </div>

                            <div className={styles.tabContent}>
                                {activeTab === 'info' && <PersonalInfoPanel persona={persona} />}
                            </div>
                        </div>

                        <div className={styles.rightColumn}>
                            <Image
                                src="/bandabg.jpg"
                                alt="ACEDEMA"
                                fill
                                className={styles.image}
                                priority
                            />
                        </div>
                    </section>
                </section>
            </main>
        </div>
    );
}
