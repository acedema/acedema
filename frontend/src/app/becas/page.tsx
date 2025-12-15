/**
 * NOTA:
 * El contenido de esta página es referencial y fue construido como propuesta
 * estructural y de diseño, ya que no se contó con la información definitiva
 * por parte de la clienta al momento del desarrollo.
 *
 * Textos, porcentajes, requisitos, procesos y nombres de becas deben ser
 * validados, ajustados o reemplazados según las políticas oficiales que
 * defina ACEDEMA.
 *
 * Esta página queda preparada para ser tomada y finalizada en una etapa
 * posterior del proyecto.
 */
'use client';

import Navbar from '@/components/Navbar';
import styles from './becas.module.css';
import Image from 'next/image';
import Link from 'next/link';

export default function BecasPage() {
    return (
        <div>
            <Navbar />

            <main className={styles.page}>
                <div className={styles.container}>
                    {/* HERO DIFERENTE */}
                    <section className={styles.hero}>
                        <div className={styles.heroText}>
                            <p className={styles.heroEyebrow}>Apoyo económico</p>
                            <h1 className={styles.heroTitle}>Programas de becas ACEDEMA</h1>
                            <p className={styles.heroSubtitle}>
                                Queremos que el talento y el compromiso tengan más peso que la
                                parte económica. Nuestras becas están pensadas para que nadie
                                se quede fuera por motivos financieros.
                            </p>

                            <div className={styles.chipsRow}>
                                <span className={styles.chip}>Descuentos parciales y totales</span>
                                <span className={styles.chip}>Enfoque académico y socioeconómico</span>
                                <span className={styles.chip}>Convocatorias durante el año</span>
                            </div>
                        </div>

                        <div className={styles.heroImageWrapper}>
                            <Image
                                src="/ctaimg.jpg"
                                alt="Estudiantes de ACEDEMA"
                                fill
                                className={styles.heroImage}
                                priority
                            />
                            <div className={styles.heroTag}>
                                <span>Becas activas</span>
                            </div>
                        </div>
                    </section>

                    {/* TIPOS DE BECAS y el RESUMEN */}
                    <section className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>Tipos de becas</h2>
                            <p className={styles.sectionSubtitle}>
                                Estos tipos son referenciales. Más adelante se pueden ajustar
                                nombres, porcentajes y requisitos según lo que pida la clienta.
                            </p>
                        </div>

                        <div className={styles.typesLayout}>
                            <div className={styles.scholarshipGrid}>
                                <article className={styles.scholarshipCard}>
                                    <h3>Beca académica</h3>
                                    <p>
                                        Pensada para estudiantes con alto rendimiento académico y un
                                        fuerte compromiso con sus estudios musicales.
                                    </p>
                                    <ul>
                                        <li>Promedio mínimo establecido por la academia</li>
                                        <li>Revisión periódica del desempeño</li>
                                    </ul>
                                </article>

                                <article className={styles.scholarshipCard}>
                                    <h3>Beca socioeconómica</h3>
                                    <p>
                                        Dirigida a familias que requieren apoyo económico para que
                                        sus hijos continúen su formación musical.
                                    </p>
                                    <ul>
                                        <li>Basada en estudio socioeconómico</li>
                                        <li>Puede combinarse con otras ayudas internas</li>
                                    </ul>
                                </article>

                                <article className={styles.scholarshipCard}>
                                    <h3>Beca por talento musical</h3>
                                    <p>
                                        Para estudiantes que destacan por su interpretación,
                                        disciplina y aporte artístico dentro de la banda.
                                    </p>
                                    <ul>
                                        <li>Audición o presentación de desempeño</li>
                                        <li>Participación activa en ensayos y presentaciones</li>
                                    </ul>
                                </article>
                            </div>

                            <aside className={styles.summaryCard}>
                                <h3>¿Qué suelen cubrir las becas?</h3>
                                <p>
                                    La cobertura exacta depende de cada programa, pero
                                    normalmente se aplica a:
                                </p>
                                <ul>
                                    <li>Mensualidad total o porcentajes de descuento</li>
                                    <li>Cuotas de participación en la banda o ensambles</li>
                                    <li>Apoyos específicos según cada caso</li>
                                </ul>
                                <p className={styles.summaryNote}>
                                    Toda esta información se ajustará cuando definan oficialmente
                                    las políticas de becas de ACEDEMA.
                                </p>
                            </aside>
                        </div>
                    </section>

                    {/* REQUISITOS GENERALES */}
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Requisitos generales</h2>
                        <p className={styles.sectionSubtitle}>
                            Estos requisitos son orientativos por ahora.
                        </p>

                        <ul className={styles.requirementsList}>
                            <li>Ser estudiante activo o estar en proceso de matrícula.</li>
                            <li>
                                Comprometerse a la asistencia a clases, ensayos y presentaciones.
                            </li>
                            <li>
                                Participar en evaluaciones periódicas según el tipo de beca.
                            </li>
                            <li>
                                Para becas socioeconómicas, brindar información básica de la
                                situación familiar.
                            </li>
                            <li>
                                Aceptar el reglamento de becas y sus condiciones de continuidad.
                            </li>
                        </ul>
                    </section>

                    {/* PROCESO DE APLICACIÓN COMO LÍNEA DE TIEMPO */}
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>¿Cómo aplicar a una beca?</h2>

                        <div className={styles.timeline}>
                            <div className={styles.timelineItem}>
                                <div className={styles.timelineBadge}>1</div>
                                <div className={styles.timelineContent}>
                                    <h3>Solicitud</h3>
                                    <p>
                                        El estudiante o encargado completa un formulario indicando
                                        el tipo de beca y compartiendo su situación. SI así lo desea la clienta.
                                    </p>
                                </div>
                            </div>

                            <div className={styles.timelineItem}>
                                <div className={styles.timelineBadge}>2</div>
                                <div className={styles.timelineContent}>
                                    <h3>Revisión</h3>
                                    <p>
                                        El equipo de ACEDEMA analiza la información y, si es
                                        necesario, coordina entrevista o audición.
                                    </p>
                                </div>
                            </div>

                            <div className={styles.timelineItem}>
                                <div className={styles.timelineBadge}>3</div>
                                <div className={styles.timelineContent}>
                                    <h3>Resultado</h3>
                                    <p>
                                        Se comunica la decisión, el porcentaje de apoyo y las
                                        condiciones de la beca otorgada.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* CTA FINAL */}
                    <section className={styles.ctaSection}>
                        <div className={styles.ctaContent}>
                            <h2 className={styles.ctaTitle}>
                                ¿Te gustaría optar por una beca?
                            </h2>
                            <p className={styles.ctaText}>
                                En cuanto se definan los detalles oficiales, esta sección se
                                actualizará con los requisitos y formularios reales.
                            </p>
                            <Link href="/contactenos" className={styles.ctaButton}>
                                Consultar sobre becas
                            </Link>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
