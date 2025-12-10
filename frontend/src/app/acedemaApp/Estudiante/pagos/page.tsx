'use client';

import React, { useState, useEffect } from 'react';
import styles from './pagos.module.css';
import Navbar from '@/components/EstuNavbar';
import { FiSmartphone, FiDollarSign, FiChevronDown, FiCheck,FiUpload} from 'react-icons/fi';

const SubirComprobantePage: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [tipoPagoOpen, setTipoPagoOpen] = useState(false);
    const [tipoPago, setTipoPago] = useState<string | null>(null);
    const [descripcion, setDescripcion] = useState('');
    const [toast, setToast] = useState<{ mensaje: string; tipo: 'error' | 'success' } | null>(null);
    
    const paymentOptions = [
        { value: 'matricula', label: 'Matrícula anual' },
        { value: 'mensualidad', label: 'Mensualidad' },
        { value: 'libro', label: 'Libro de solfeo' },
    ];

    const mostrarToast = (mensaje: string, tipo: 'error' | 'success' = 'error') => {
        setToast({ mensaje, tipo });
        setTimeout(() => setToast(null), 3000); // se oculta en 3s
    };


    useEffect(() => {
        if (!file) {
            setPreviewUrl(null);
            return;
        }

        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [file]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];

        if (!selected) {
            setFile(null);
            return;
        }

        const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];

        if (!allowedTypes.includes(selected.type)) {
            mostrarToast("Selecciona un archivo JPG, PNG o PDF válido.");
            e.target.value = "";
            return;
        }

        setFile(selected);
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!tipoPago) {
            mostrarToast('Selecciona el tipo de pago.');
            return;
        }

        if (!descripcion) {
            mostrarToast('Escribe una descripción para el pago.');
            return;
        }
        
        if (!file) {
            mostrarToast('Agrega el comprobante.');
            return;
        }
        
        try {
            setIsSubmitting(true);

            const formData = new FormData();
            formData.append('comprobante', file);
            formData.append('tipoPago', tipoPago);
            formData.append('descripcion', descripcion);

            // TODO: cuando el backend esté listo, descomenta y ajusta la URL:
            // await fetch('http://localhost:5069/api/Comprobantes', {
            //     method: 'POST',
            //     body: formData,
            // });

            mostrarToast('Comprobante enviado correctamente.', 'success');
            setFile(null);
            setDescripcion('');
            setTipoPago(null);
            
        } catch (error) {
            console.error(error);
            mostrarToast('Ocurrió un error al subir el comprobante.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.page}>
             <Navbar />
            
            {toast && (
                <div className={`${styles.toast} ${toast.tipo === 'error' ? styles.toastError : styles.toastSuccess}`}>
                    {toast.mensaje}
                </div>
            )}
            
            <main className={styles.container}>
                {/* Secciones informativas */}
                <section className={styles.infoGrid}>
                    {/* SINPE Móvil */}
                    <article className={styles.infoCard}>
                        <div className={styles.floatingIconBlue}>
                            <FiSmartphone className={styles.floatingIcon} />
                        </div>

                        <h2 className={styles.cardTitle}>SINPE Móvil</h2>
                        <p className={styles.cardText}>
                            Realiza el pago antes de subir tu comprobante.
                        </p>

                        <div className={styles.cardHighlight}>
                            <p className={styles.label}>Asoc Ctro Des De Musica Y Arte Sn Rafae</p>
                            <p className={styles.value}>8669-6541</p>
                        </div>

                        <p className={styles.simpleNote}>
                            Incluye el nombre del estudiante en el detalle.
                        </p>
                    </article>


                    {/* Montos y tipos de pago */}
                    <article className={styles.infoCard}>
                        <div className={styles.floatingIconBlue}>
                            <FiDollarSign className={styles.floatingIcon} />
                        </div>

                        <h2 className={styles.cardTitle}>Montos de pago</h2>
                        <p className={styles.cardText}>Revisa los montos antes de transferir.</p>

                        <div className={styles.feeRow}>
                            <span className={styles.feeLabel}>Matrícula anual</span>
                            <span className={styles.feeAmount}>₡20 000</span>
                        </div>
                        <div className={styles.feeRow}>
                            <span className={styles.feeLabel}>Mensualidad</span>
                            <span className={styles.feeAmount}>₡32 000</span>
                        </div>
                        <div className={styles.feeRow}>
                            <span className={styles.feeLabel}>Libro de solfeo</span>
                            <span className={styles.feeAmount}>₡5 500</span>
                        </div>

                        <p className={styles.cardNote}>
                            Conserva el comprobante por cualquier consulta.
                        </p>
                    </article>

                </section>

                {/* Sección de carga de comprobante */}
                <section className={styles.uploadSection}>
                    <div className={styles.floatingIconBlue}>
                        <FiUpload className={styles.floatingIcon} />
                    </div>
                    <h2 className={styles.uploadTitle}>Subir comprobante</h2>
                    <p className={styles.uploadSubtitle}>
                        Completa toda la información y selecciona una foto legible del comprobante.
                    </p>

                    <form onSubmit={handleSubmit} className={styles.form}>
                        {/* Fila superior*/}
                        <div className={styles.formTopRow}>
                            {/* Tipo de pago */}
                            <div className={styles.fieldGroup}>
                                <label className={styles.fieldLabel}>Tipo</label>

                                <div className={styles.customSelect}>
                                    <button
                                        type="button"
                                        className={styles.customSelectButton}
                                        onClick={() => setTipoPagoOpen((prev) => !prev)}
                                    >
                                    <span>
                                        {tipoPago
                                         ? paymentOptions.find((opt) => opt.value === tipoPago)?.label
                                          : 'Selecciona una opción'}
                                    </span>
                                        <span className={styles.arrow}>
                                         <FiChevronDown />
                                        </span>
                                    </button>

                                    {tipoPagoOpen && (
                                        <div className={styles.customSelectMenu}>
                                            {paymentOptions.map((opt) => (
                                                <button
                                                    type="button"
                                                    key={opt.value}
                                                    className={`${styles.customSelectItem} ${
                                                        tipoPago === opt.value ? styles.selectedItem : ''
                                                    }`}
                                                    onClick={() => {
                                                        setTipoPago(opt.value);
                                                        setTipoPagoOpen(false);
                                                    }}
                                                >
                                                    <span>{opt.label}</span>
                                                    {tipoPago === opt.value && (
                                                        <span className={styles.checkIcon}>
                                                              <FiCheck />
                                                         </span>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Descripcion */}
                            <div className={styles.fieldGroup}>
                                <label className={styles.fieldLabel}>Descripción</label>
                                <textarea
                                    className={styles.textarea}
                                    placeholder="Ejemplo: Mensualidad de marzo 202X curso..."
                                    rows={3}
                                    value={descripcion}
                                    onChange={(e) => setDescripcion(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Fila inferior*/}
                        <div className={styles.formContent}>
                            {/* Selector de imagen */}
                            <div className={styles.fileColumn}>
                                <p className={styles.fileLabel}>Seleccionar archivo</p>
                                <label htmlFor="comprobante" className={styles.fileDropArea}>
                                    <span className={styles.fileIcon}>📎</span>
                                    <span className={styles.fileTitle}> Haz clic para elegir</span>
                                    <span className={styles.fileText}>
                                        Formatos aceptados: JPG, PNG y PDF
                                      <br />
                                         </span>
                                    <input
                                        id="comprobante"
                                        type="file"
                                        accept="image/*"
                                        className={styles.fileInput}
                                        onChange={handleFileChange}
                                    />
                                </label>
                            </div>

                            {/* Vista previa */}
                            <div className={styles.previewColumn}>
                                <p className={styles.previewLabel}>Vista previa</p>
                                <div className={`${styles.previewBox} ${previewUrl ? styles.previewBoxFilled : ''}`}>
                                    {previewUrl ? (
                                        <img
                                            src={previewUrl}
                                            alt="Vista previa del comprobante"
                                            className={styles.previewImage}
                                        />
                                    ) : (
                                        <p className={styles.previewPlaceholder}>
                                            Aún no has seleccionado ninguna imagen.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className={styles.actionsRow}>
                            <button
                                type="submit"
                                className={styles.submitButton}
                            >
                                {isSubmitting ? 'Subiendo...' : 'Subir comprobante'}
                            </button>
                        </div>
                    </form>

                </section>
            </main>
        </div>
    );
};

export default SubirComprobantePage;
