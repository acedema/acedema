import styles from '@/app/acedemaApp/Estudiante/perfil/perfil.module.css';

interface InfoItemProps {
    label: string;
    value: string;
}

export default function InfoItem({ label, value }: InfoItemProps) {
    return (
        <div className={styles.infoItem}>
            <span className={styles.infoLabel}>{label}</span>
            <span className={styles.infoValue}>{value}</span>
        </div>
    );
}
