"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import styles from "./formulario.module.css";
import { MatriculaData } from "@/lib/types";

export default function FormularioMatricula() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data: MatriculaData = {
      nombre: formData.get("nombre") as string,
      edad: Number(formData.get("edad")),
      email: formData.get("email") as string,
      telefono: formData.get("telefono") as string,
      instrumento: formData.get("instrumento") as string,
      experiencia: formData.get("experiencia") as string,
    };

    // Guardar en localStorage
    const existingMatriculas = JSON.parse(
      localStorage.getItem("matriculas") || "[]",
    );
    localStorage.setItem(
      "matriculas",
      JSON.stringify([...existingMatriculas, data]),
    );

    setSubmitted(true);
    event.currentTarget.reset();
  };

  return (
    <div>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.formWrapper}>
          <h1 className={styles.title}>Formulario de Matrícula</h1>
          <p className={styles.subtitle}>
            Estás a un paso de comenzar tu aventura musical. Por favor, completa
            tus datos y nos pondremos en contacto a la brevedad.
          </p>

          {submitted ? (
            <div className={styles.successMessage}>
              <p>¡Gracias por tu interés!</p>
              <p>Hemos recibido tu solicitud y te contactaremos pronto.</p>
            </div>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="nombre">Nombre completo del alumno</label>
                  <input type="text" id="nombre" name="nombre" required />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="edad">Edad del alumno</label>
                  <input type="number" id="edad" name="edad" required />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="email">Correo electrónico de contacto</label>
                  <input type="email" id="email" name="email" required />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="telefono">Teléfono de contacto</label>
                  <input type="tel" id="telefono" name="telefono" required />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="instrumento">Instrumento de interés</label>
                  <select id="instrumento" name="instrumento" required>
                    <option value="">Selecciona un instrumento</option>
                    <option value="Piano">Piano</option>
                    <option value="Guitarra">Guitarra</option>
                    <option value="Violin">Violín</option>
                    <option value="Canto">Canto</option>
                    {/* Agrega más opciones según los instrumentos que ofreces */}
                  </select>
                </div>
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label htmlFor="experiencia">
                    ¿Tiene conocimiento musical previo? (Opcional)
                  </label>
                  <textarea
                    id="experiencia"
                    name="experiencia"
                    rows={4}
                    placeholder="Ej: Llevé 2 años de guitarra clásica, sé leer partituras, etc."
                  ></textarea>
                </div>
              </div>
              <button type="submit" className={styles.submitButton}>
                Enviar solicitud
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
