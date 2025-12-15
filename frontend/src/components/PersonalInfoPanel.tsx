import styles from '@/app/acedemaApp/Estudiante/perfil/perfil.module.css';
import InfoItem from './InfoItem';

interface Persona {
    numCedula: string;
    fechaNacimiento: string;
    direccion: string;
    telefono1: string;
    telefono2?: string;
    correo: string;
    cedulaResponsable?: string;
    fechaRegistro: string;
}

export default function PersonalInfoPanel({ persona }: { persona: Persona }) {
    return (
        <div className={styles.infoPanel}>
            <h2 className={styles.subTitle}>Información personal</h2>
            <p className={styles.helperText}>Estos son los datos registrados para tu cuenta.</p>

            <div className={styles.infoGrid}>
                <InfoItem label="Cédula" value={persona.numCedula} />
                <InfoItem label="Fecha de nacimiento" value={persona.fechaNacimiento} />
                <InfoItem label="Dirección" value={persona.direccion} />
                <InfoItem label="Teléfono 1" value={persona.telefono1} />
                <InfoItem label="Teléfono 2" value={persona.telefono2 || 'No registrado'} />
                <InfoItem label="Correo" value={persona.correo} />
                <InfoItem label="Cédula responsable" value={persona.cedulaResponsable || 'No aplica'} />
                <InfoItem label="Miembro desde" value={persona.fechaRegistro} />
            </div>
        </div>
    );
}
