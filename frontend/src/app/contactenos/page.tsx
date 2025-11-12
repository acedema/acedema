'use client';

import Navbar from '@/components/Navbar';
import Header from '@/components/Header';
import styles from './contactenos.module.css';
import { FaClock, FaWhatsapp, FaMapMarkerAlt, FaEnvelope } from 'react-icons/fa';



export default function Contactenos() {
  return (
    <div>
      <Navbar />
      <div className={styles.container}>
        <Header
          title="Contáctenos"
          subtitle="Estamos aquí para ayudarte. No dudes en comunicarte con nosotros para cualquier consulta."
          imageUrl="/bandabg.jpg"
          imageAlt="Contáctenos"
          textBlock="Ya sea que tengas preguntas sobre nuestros cursos, horarios o proceso de matrícula, nuestro equipo está listo para darte toda la información que necesites. ¡Esperamos saber de ti!"
        />

          {/* === Sección 1: Horario / Contacto rápido === */}
          <section className={styles.contactCardsSection}>
              <div className={styles.contactCardsWrap}>
                  {/* Card: Horario de atencion */}
                  <article className={styles.contactCard}>
                      <div className={styles.contactIcon}><FaClock /></div>
                      <h3 className={styles.contactTitle}>Horario de atención</h3>
                      <p className={styles.contactSub}>Lun – Vie</p>
                      <p className={styles.contactEmphasis}>8:00 a.m. – 5:00 p.m.</p>
                      <span className={styles.accentBar} />
                  </article>

                  {/* Card: WhatsApp */}
                  <article className={styles.contactCard}>
                      <div className={styles.contactIcon}><FaWhatsapp /></div>
                      <h3 className={styles.contactTitle}>WhatsApp</h3>
                      <p className={styles.contactSub}>Envíanos un mensaje al:</p>
                      <a
                          href="https://wa.me/50686696541"
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.contactLinkBig}
                      >
                          8669-6541
                      </a>
                      <span className={styles.accentBar} />
                  </article>

                  {/* Card: Correo */}
                  <article className={styles.contactCard}>
                      <div className={styles.contactIcon}><FaEnvelope /></div>
                      <h3 className={styles.contactTitle}>Correo electrónico</h3>
                      <p className={styles.contactSub}>Escríbenos directamente a:</p>
                      <a href="mailto:acedema.sr@gmail.com" className={styles.contactLink}>
                          acedema.sr@gmail.com
                      </a>
                      <span className={styles.accentBar} />
                  </article>
              </div>
          </section>

          {/* === Sección 2: Mapa === */}
          <section className={styles.missionSection}>
              <div className={styles.cardWrapper}>
                  <div className={`${styles.card} ${styles.mapCard}`}>
                      <h2 className={styles.titleCard}>Ubicación</h2>
                      <p className={styles.paragraph}>San Rafael de Heredia, Costa Rica.</p>

                      <div className={styles.mapFrameWrapper}>
                          <iframe
                              className={styles.mapFrame}
                              src="https://www.google.com/maps?q=ACEDEMA%20San%20Rafael%20de%20Heredia&output=embed"
                              loading="lazy"
                              referrerPolicy="no-referrer-when-downgrade"
                              aria-label="Mapa de ubicación ACEDEMA"
                          />
                      </div>

                      <div className={styles.mapActions}>
                          <a
                              className={styles.primaryLink}
                              href="https://maps.app.goo.gl/H5BkGZbPfssNDsGY8?g_st=ipc"
                              target="_blank"
                              rel="noopener noreferrer"
                          >
                              Abrir en Google Maps
                          </a>
                      </div>
                  </div>
              </div>
          </section>


      </div>
    </div>
  );
}
