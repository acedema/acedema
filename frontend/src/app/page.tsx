'use client';

import styles from './page.module.css'
import Navbar from '@/components/Navbar';
import Image from 'next/image';
import { FaInstagram, FaFacebook, FaWhatsapp } from "react-icons/fa";

export default function Home() {
  return (
    <div>
      {/* Navbar */}
      <Navbar />
      {/* Main content */}
      <div>
        <div className={styles.main}>
          <section id="hero" className={styles.hero}>
            {/* Imagen de fondo oscurecida con overlay */}
            <div className={styles.background}></div>

            {/* Contenido del hero */}
            <div className={styles.content}>
              <p className={styles.subtitle}>
                Formamos músicos con pasión y disciplina
              </p>
              <h1 className={styles.text}>MARCHING BAND <br /> ACEDEMA</h1>
              <a href="/matricula" className={styles.ctaButton}>Inscribite ahora →</a>
            </div>
          </section>

          {/* Sección About */}
          <section id="about" className={styles.sectionAbout}>
            <div className={styles.aboutStats}>
              <div className={styles.statsHeader}>
                <h2>San rafael de Heredia</h2>
                <Image
                  src="/logo.jpg"
                  alt="Logo ACEDEMA"
                  width={80}
                  height={80}
                  className={styles.logo}
                />
              </div>
              <div className={styles.stats}>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>10+</span>
                  <span className={styles.statLabel}>Años de experiencia</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>5</span>
                  <span className={styles.statLabel}>Profesores altamente calificados</span>
                </div>
              </div>
            </div>
            <div className={styles.aboutInfo}>
              <div className={styles.aboutText}>
                <h2 >¿Quiénes somos?</h2>
                <p className="text-gray-700 leading-relaxed mb-6">
                  La Asociación Centro de Desarrollo de la Música y el Arte (ACEDEMA) es una institución educativa sin fines de lucro dedicada a la promoción y enseñanza de la música y las artes. Fundada hace más de una década en el pintoresco San Rafael de Heredia, ACEDEMA ha crecido hasta convertirse en un pilar fundamental para la comunidad local, ofreciendo un espacio donde la pasión por la música puede florecer.
                </p>
              </div>
              <div className={styles.aboutImage}>
                <Image
                  src="/banda.jpg"
                  alt="Sobre nosotros"
                  width={400}
                  height={400}
                  className="rounded-xl object-cover"
                />
              </div>
            </div>
          </section>

          <section id="benefits" className={styles.sectionBenefits}>
            <div className={styles.benefitsContent}>
              <h2 className={styles.benefitsTitle}>¿Por qué elegirnos?</h2>
              <div className={styles.cardsContainer}>
                <div className={styles.card}>
                  <span className={styles.icon}>📚</span>
                  <h3>Clases personalizadas</h3>
                  <p>Grupos pequeños e instrucción individualizada.</p>
                </div>
                <div className={styles.card}>
                  <span className={styles.icon}>🎓</span>
                  <h3>Profesores capacitados</h3>
                  <p>Equipo docente altamente calificado y comprometido.</p>
                </div>
                <div className={styles.card}>
                  <span className={styles.icon}>🎶</span>
                  <h3>Comunidad activa</h3>
                  <p>Eventos, conciertos y oportunidades para todos.</p>
                </div>
              </div>
            </div>
          </section>
          <section id="cta" className={styles.ctaSection}>
            <div className={styles.ctaOverlay}></div>
            <div className={styles.ctaContent}>
              <p className={styles.ctaSubtitle}>
                En ACEDEMA creemos que la música transforma vidas. Ya sea que estés dando tus primeros pasos o quieras perfeccionar tu talento, nuestro equipo te acompañará en cada nota.
              </p>
              <h2 className={styles.ctaTitle}>¿Listo para empezar tu camino musical?</h2>
              <a href="/matricula" className={styles.ctaButtonPrimary}>Matricúlate hoy</a>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className={styles.footer}>
          <div className={styles.footerContainer}>
            {/* Columna izquierda */}
            <div className={styles.footerColumn}>
              <ul className={styles.footerLinks}>
                <li><a href="#hero">Inicio</a></li>
                <li><a href="#about">Quienes Somos</a></li>
                <li><a href="#benefits">Eligenos</a></li>
                <li><a href="#cta">Empieza tu camino</a></li>
              </ul>
            </div>

            {/* Centro - Newsletter */}
            <div className={styles.footerCenter}>
              <p className={styles.newsletterText}>
                Suscribite a nuestro boletín para recibir tips, eventos y más.
              </p>
              <form className={styles.newsletterForm}>
                <input type="email" placeholder="Tu correo electrónico" />
                <button type="submit"><span>→</span></button>
              </form>
            </div>

            {/* Columna derecha */}
              {/* Columna derecha */}
              <div className={styles.footerColumn}>
                  <p className={styles.followText}>Síguenos</p>
                  <div className={styles.socialIcons}>
                      <a href="https://www.instagram.com/acedemasanrafael?igsh=MWFxcW9idThzdWw5cA==" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                          <div className={styles.circleIcon}><FaInstagram /></div>
                      </a>
                      <a href="https://www.facebook.com/share/16HUHgngcw/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                          <div className={styles.circleIcon}><FaFacebook /></div>
                      </a>
                      <a href="https://wa.me/50686696541" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                          <div className={styles.circleIcon}><FaWhatsapp /></div>
                      </a>
                  </div>
              </div>
          </div>

          <div className={styles.footerBottom}>
            <p className={styles.madeBy}>Hecho por <span>ACEDEMA</span></p>
          </div>
        </footer>
      </div>
    </div>
  );
}

