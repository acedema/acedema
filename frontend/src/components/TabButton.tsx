'use client';

import styles from '@/app/acedemaApp/Estudiante/perfil/perfil.module.css';

interface TabButtonProps {
    label: string;
    isActive: boolean;
    onClick: () => void;
}

export default function TabButton({ label, isActive, onClick }: TabButtonProps) {
    return (
        <button
            type="button"
            className={`${styles.tabButton} ${isActive ? styles.tabButtonActive : ''}`}
            onClick={onClick}
        >
            {label}
        </button>
    );
}
