"use client";

import styles from "./nosotros.module.css";
import Navbar from "@/components/Navbar";
import Header from "@/components/Header";
// import Image from 'next/image';
import { FaHeart, FaEye, FaChalkboardTeacher } from "react-icons/fa";

const achievements = [
  { title: "+10 años", description: "de experiencia musical" },
  { title: "+500 alumnos", description: "formados con excelencia" },
  { title: "+12 instrumentos", description: "enseñados en todos los niveles" },
];

export default function Nosotros() {
  return (
    <div>
      <Navbar />
      <div className={styles.container}>
        <Header
          title="¿Quiénes somos?"
          subtitle="En ACEDEMA nos apasiona formar músicos con alma, técnica y corazón. Esta es nuestra historia."
          imageUrl="/banda.png"
          imageAlt="Logo Acedema"
          textBlock="Somos una academia de música comprometida con el crecimiento artístico de cada estudiante. Creemos en el
        aprendizaje personalizado, adaptado al ritmo, experiencia y metas de cada persona, desde niños hasta adultos. Nuestro
        equipo está conformado por músicos profesionales apasionados por enseñar y compartir su conocimiento."
          achievements={achievements}
        />
        <section className={styles.missionSection}>
          <div className={styles.cardWrapper}>
            <div className={styles.card}>
              <div className={styles.iconCircle}>
                <FaHeart />
              </div>
              <h2 className={styles.titleCard}>Misión</h2>
              <p className={styles.paragraph}>
                Fomentar el amor por la música y brindar una formación artística
                integral mediante clases personalizadas, creando un espacio
                accesible y profesional para el desarrollo musical.
              </p>
            </div>

            <div className={styles.card}>
              <div className={styles.iconCircle}>
                <FaEye />
              </div>
              <h2 className={styles.titleCard}>Visión</h2>
              <p className={styles.paragraph}>
                Ser reconocidos como una institución de referencia en educación
                musical a nivel nacional, destacando por nuestra calidad
                docente, calidez humana y compromiso con cada estudiante.
              </p>
            </div>

            <div className={styles.card}>
              <div className={styles.iconCircle}>
                <FaChalkboardTeacher />
              </div>
              <h2 className={styles.titleCard}>Nuestra metodología</h2>
              <p className={styles.paragraph}>
                Cada estudiante recibe atención personalizada de acuerdo con su
                experiencia y nivel. El proceso inicia con una entrevista y, si
                es necesario, una prueba corta de solfeo para ubicarlo
                adecuadamente.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.listValues}>
          <h2 className={styles.titleList}>Nuestros Valores</h2>
          <p className={styles.description}>
            En ACEDEMA, nuestros valores guían cada clase, cada nota y cada
            interacción. Son la base sobre la que construimos una comunidad
            comprometida y apasionada por la música.
          </p>
          <ul className={styles.list}>
            <li>Respeto</li>
            <li>Disciplina</li>
            <li>Pasión</li>
            <li>Responsabilidad</li>
            <li>Compromiso</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
