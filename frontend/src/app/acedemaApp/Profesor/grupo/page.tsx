'use client';

import { useState } from 'react';
import { FaSearch, FaArrowLeft } from 'react-icons/fa';
import styles from './grupo.module.css';
import CardGrupo, { Curso, Grupo } from '@/components/CardGrupo';
import ModalCrearGrupo, { GrupoInput } from '@/components/ModalCrearGrupo';
import ModalEditarGrupo from '@/components/ModalEditarGrupo';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/ProfNavbar'



type ToastType = 'success' | 'error' | 'info';

interface ToastState {
    message: string;
    type: ToastType;
}

type GroupsByCourse = Record<string, Grupo[]>;

const MOCK_CURSOS: Curso[] = [
    { id: '1', nombre: 'Curso de guitarra', modalidad: 'Individual', imageUrl: '/instrumentos/guitarra.png' },
    { id: '4', nombre: 'Curso de canto', modalidad: 'Grupal', imageUrl: '/instrumentos/guitarra.png' },
    { id: '6', nombre: 'Curso de flauta', modalidad: 'Grupal', imageUrl: '/instrumentos/guitarra.png' },
    { id: '7', nombre: 'Curso de flauta', modalidad: 'Grupal', imageUrl: '/instrumentos/guitarra.png' },
    { id: '8', nombre: 'Curso de flauta', modalidad: 'Grupal', imageUrl: '/instrumentos/guitarra.png' },
    { id: '9', nombre: 'Curso de flauta', modalidad: 'Grupal', imageUrl: '/instrumentos/guitarra.png' },
];

const INITIAL_GROUPS: GroupsByCourse = {
    '1': [
        {
            id: 'g1',
            nombre: 'Grupo 1 - Lunes 4:00 p.m.',
            edades: '8 - 12 años',
            nivel: 'Principiante',
            duracion: '60 minutos',
            horario: 'Lunes 4:00 p.m.',
            cupoMaximo: '10',
        },
        {
            id: 'g2',
            nombre: 'Grupo 2 - Miércoles 6:00 p.m.',
            edades: '13 - 16 años',
            nivel: 'Intermedio',
            duracion: '60 minutos',
            horario: 'Miércoles 6:00 p.m.',
            cupoMaximo: '8',
        },
    ],
    '4': [
        {
            id: 'g3',
            nombre: 'Grupo A - Canto principiantes',
            edades: '10 - 15 años',
            nivel: 'Principiante',
            duracion: '45 minutos',
            horario: 'Sábados 10:00 a.m.',
            cupoMaximo: '12',
        },
    ],
    // el resto sin grupos iniciales
};

export default function GrupoPage() {
    const [cursos] = useState<Curso[]>(MOCK_CURSOS);
    const [groupsByCourse, setGroupsByCourse] = useState<GroupsByCourse>(INITIAL_GROUPS);

    const [searchTerm, setSearchTerm] = useState('');
    const [toast, setToast] = useState<ToastState | null>(null);

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [activeCursoId, setActiveCursoId] = useState<string | null>(null);
    const [grupoEditing, setGrupoEditing] = useState<GrupoInput | undefined>(undefined);

    const [confirmDelete, setConfirmDelete] = useState<null | { cursoId: string; grupoId: string }>(null);

    const router = useRouter();

    // Notificaciones
    const showToast = (message: string, type: ToastType = 'success') => {
        setToast({ message, type });
        setTimeout(() => {
            setToast(null);
        }, 3500);
    };

    // Abrir modal para AGREGAR grupo
    const handleAddGrupo = (curso: Curso) => {
        setActiveCursoId(curso.id);
        setGrupoEditing(undefined);
        setIsCreateOpen(true);
    };

// Abrir modal para EDITAR grupo
    const handleEditGrupo = (cursoId: string, grupo: Grupo) => {
        setActiveCursoId(cursoId);
        setGrupoEditing({
            id: grupo.id,
            nombre: grupo.nombre,
            edades: grupo.edades,
            nivel: grupo.nivel,
            duracion: grupo.duracion,
            horario: grupo.horario,
            cupoMaximo: grupo.cupoMaximo,
        });
        setIsEditOpen(true);
    };


    // Crear grupo 
    const handleCreateGrupo = (payload: GrupoInput) => {
        if (!activeCursoId) return;

        setGroupsByCourse(prev => {
            const current = prev[activeCursoId] ?? [];
            const newGrupo: Grupo = {
                id: String(Date.now()),
                nombre: payload.nombre,
                edades: payload.edades,
                nivel: payload.nivel,
                duracion: payload.duracion,
                horario: payload.horario,
                cupoMaximo: payload.cupoMaximo,
            };
            return { ...prev, [activeCursoId]: [newGrupo, ...current] };
        });

        showToast('Grupo creado correctamente.', 'success');
        setIsCreateOpen(false);
        setActiveCursoId(null);
    };

// Actualizar grupo 
    const handleUpdateGrupo = (payload: GrupoInput) => {
        if (!activeCursoId || !payload.id) return;

        setGroupsByCourse(prev => {
            const current = prev[activeCursoId] ?? [];
            const updated = current.map(g =>
                g.id === payload.id
                    ? {
                        ...g,
                        nombre: payload.nombre,
                        edades: payload.edades,
                        nivel: payload.nivel,
                        duracion: payload.duracion,
                        horario: payload.horario,
                        cupoMaximo: payload.cupoMaximo,
                    }
                    : g
            );
            return { ...prev, [activeCursoId]: updated };
        });

        showToast('Grupo actualizado correctamente.', 'success');
        setIsEditOpen(false);
        setActiveCursoId(null);
    };


    const handleDeleteGrupo = (cursoId: string, grupoId: string) => {
        setConfirmDelete({ cursoId, grupoId });
    };

    // Confirmar / cancelar eliminacion
    const confirmDeleteYes = () => {
        if (!confirmDelete) return;

        const { cursoId, grupoId } = confirmDelete;
        setGroupsByCourse(prev => {
            const current = prev[cursoId] ?? [];
            const updated = current.filter(g => g.id !== grupoId);
            return { ...prev, [cursoId]: updated };
        });

        showToast('Grupo eliminado correctamente.', 'info');
        setConfirmDelete(null);
    };

    const confirmDeleteNo = () => {
        showToast('Eliminación cancelada.', 'info');
        setConfirmDelete(null);
    };

    // Filtro de busqueda por nombre de curso
    const filteredCursos = cursos.filter(c =>
        c.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <Navbar />
            {/* Toast general */}
            {toast && (
                <div className={styles.toastContainer}>
                    <div
                        className={`${styles.toast} ${
                            toast.type === 'success'
                                ? styles.toastSuccess
                                : toast.type === 'error'
                                    ? styles.toastError
                                    : styles.toastInfo
                        }`}
                    >
                        {toast.message}
                    </div>
                </div>
            )}

            {/* Toast de confirmacion de eliminacion de grupo */}
            {confirmDelete && (
                <div className={`${styles.toastContainer} ${styles.toastConfirmWrapper}`}>
                    <div className={`${styles.toast} ${styles.toastConfirm}`}>
                        <span>¿Desea eliminar este grupo?</span>

                        <div className={styles.confirmButtons}>
                            <button onClick={confirmDeleteYes} className={styles.btnYes}>Sí</button>
                            <button onClick={confirmDeleteNo} className={styles.btnNo}>No</button>
                        </div>
                    </div>
                </div>
            )}

            <div className={styles.container}>

                {/* Barra superior */}
                <div className={styles.topBar}>
                    <div className={styles.searchWrapper}>
                        <input
                            type="text"
                            className={styles.searchInput}
                            placeholder="Buscar cursos..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                        <span className={styles.searchIcon}>
                            <FaSearch size={16} />
                        </span>
                    </div>
                </div>

                {/* Grid de cursos con CardGrupo */}
                <section className={styles.grid}>
                    {filteredCursos.map(curso => (
                        <CardGrupo
                            key={curso.id}
                            curso={curso}
                            grupos={groupsByCourse[curso.id] ?? []}
                            onAddGrupo={handleAddGrupo}
                            onEditGrupo={grupo => handleEditGrupo(curso.id, grupo)}
                            onDeleteGrupo={grupoId => handleDeleteGrupo(curso.id, grupoId)}
                        />
                    ))}
                </section>
            </div>

            <ModalCrearGrupo
                open={isCreateOpen}
                onClose={() => {
                    setIsCreateOpen(false);
                    setActiveCursoId(null);
                }}
                onSubmit={handleCreateGrupo}
            />

            <ModalEditarGrupo
                open={isEditOpen}
                initialData={grupoEditing}
                onClose={() => {
                    setIsEditOpen(false);
                    setActiveCursoId(null);
                }}
                onSubmit={handleUpdateGrupo}
            />

        </div>
    );
}
