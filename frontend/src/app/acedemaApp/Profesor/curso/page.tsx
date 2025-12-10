'use client';

import styles from './cursos.module.css';
import CardCurso, { Curso } from '@/components/CardCurso';
import EditarCursoModal, { CourseInput} from '@/components/ModalEditarCurso'
import ModalCrearCurso from '@/components/ModalCrearCurso';
import { FaPlus, FaUsers, FaSearch } from "react-icons/fa"
import { useState } from 'react';
import Navbar from '@/components/ProfNavbar'


type ToastType = 'success' | 'error' | 'info';

interface ToastState {
    message: string;
    type: ToastType;
}

const MOCK: Curso[] = [
    { id: '1', nombre: 'Curso de guitarra', modalidad: 'Individual', imageUrl: '/instrumentos/guitarra.png' },
    { id: '4', nombre: 'Curso de canto', modalidad: 'Grupal', imageUrl: '/instrumentos/guitarra.png' },
    { id: '6', nombre: 'Curso de flauta', modalidad: 'Grupal', imageUrl: '/instrumentos/guitarra.png'},
    { id: '7', nombre: 'Curso de flauta', modalidad: 'Grupal', imageUrl: '/instrumentos/guitarra.png'},
    { id: '8', nombre: 'Curso de flauta', modalidad: 'Grupal', imageUrl: '/instrumentos/guitarra.png'},
    { id: '9', nombre: 'Curso de flauta', modalidad: 'Grupal', imageUrl: '/instrumentos/guitarra.png'},


];

export default function CursoPage() {
    const [cursos, setCursos] = useState<Curso[]>(MOCK);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editing, setEditing] = useState<CourseInput | undefined>(undefined);
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState<null | { id: string }>(null);
    const [toast, setToast] = useState<ToastState | null>(null);

    
    //Notificaciones
    const showToast = (message: string, type: ToastType = 'success') => {
        setToast({ message, type });
        // se oculta despues de 3.5s
        setTimeout(() => {
            setToast(null);
        }, 3500);
    };
    

    //Crear curso
    const handleCreateSubmit = (payload: CourseInput) => {

        const newCurso: Curso = {
            id: String(Date.now()),
            nombre: payload.nombre.trim(),
            modalidad: payload.modalidad,
            imageUrl: payload.imagenUrl.trim(),
        };

        setCursos(prev => [newCurso, ...prev]);
        setIsCreateOpen(false);
        showToast('Curso creado correctamente.', 'success');
    };


    //Editar Curso
    const handleEdit = (curso: Curso) => {
        setEditing({
            id: curso.id,
            nombre: curso.nombre,
            profesor: '', // completa si lo tienes
            instrumento: curso.nombre.replace(/^Curso de\s+/i, ''), // ej. "guitarra"
            modalidad: curso.modalidad,
            imagenUrl: curso.imageUrl ?? '',
        });
        setIsModalOpen(true);
    };
    
    const handleSubmit = (payload: CourseInput) => {
       
            setCursos(prev =>
                prev.map(c =>
                    c.id === payload.id
                        ? {
                            ...c,
                            nombre: payload.nombre.trim(),
                            modalidad: payload.modalidad,
                            imageUrl: payload.imagenUrl.trim(),
                        }
                        : c
                )
            );

            setIsModalOpen(false);
            showToast('Curso actualizado correctamente.', 'success');
    };

    
    //Eliminar Curso
    const handleDelete = (id: string) => {
        setConfirmDelete({ id }); // activa el toast de confirmacion
    };

    const confirmDeleteYes = () => {
        if (!confirmDelete) return;

        setCursos(prev => prev.filter(c => c.id !== confirmDelete.id));

        showToast("Curso eliminado correctamente.", "info");
        setConfirmDelete(null);
    };

    const confirmDeleteNo = () => {
        showToast("Eliminación cancelada.", "info");
        setConfirmDelete(null);
    };
    
    
//Filtro de busqueda para la barra
    const filteredCursos = cursos.filter(c =>
        c.nombre.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    
    
    return (
        <div>
            <Navbar />
            {/* toast en general */}
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

            {/* toas de confirmar eliminacion */}
            {confirmDelete && (
                <div className={`${styles.toastContainer} ${styles.toastConfirmWrapper}`}>
                    <div className={`${styles.toast} ${styles.toastConfirm}`}>
                        <span>¿Desea eliminar este curso?</span>

                        <div className={styles.confirmButtons}>
                            <button onClick={confirmDeleteYes} className={styles.btnYes}>Sí</button>
                            <button onClick={confirmDeleteNo} className={styles.btnNo}>No</button>
                        </div>
                    </div>
                </div>
            )}
            
            <div className={styles.container}>
                {/* Barra de busqueda y botones */}
                <div className={styles.topBar}>
                    <div className={styles.leftButtons}>
                        {/* agregar */}
                        <button
                            type="button"
                            className={`${styles.iconButton} ${styles.tooltip}`}
                            onClick={() => setIsCreateOpen(true)}
                            data-tooltip="Agregar"
                        >
                            <FaPlus size={18} />
                        </button>
                    </div>

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
                
                
                <section className={styles.grid}>
                    {filteredCursos.map(c => (
                        <CardCurso
                            key={c.id}
                            curso={c}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}

                    <EditarCursoModal
                        open={isModalOpen}
                        initialData={editing}
                        onClose={() => setIsModalOpen(false)}
                        onSubmit={handleSubmit}
                        title="Editar curso"
                    />

                    <ModalCrearCurso
                        open={isCreateOpen}
                        onClose={() => setIsCreateOpen(false)}
                        onSubmit={handleCreateSubmit}
                    />

                </section>
            </div>
        </div>
    );
}