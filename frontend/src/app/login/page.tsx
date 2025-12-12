'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { saveSession } from '@/lib/auth';
import styles from './login.module.css';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import { FaEye, FaEyeSlash } from "react-icons/fa";


const API_LOGIN_URL = 'http://localhost:5069/api/Persona/login';

type RolApp = 'estudiante' | 'admin' | 'profesor';

interface BackendUsuario {
    personaId: number;
    primerNombre: string;
    segundoNombre: string | null;
    primerApellido: string;
    segundoApellido: string;
    correo: string;
    idRol: number;
    puesto: string;
}

interface LoginResponse {
    token: string;
    usuario: BackendUsuario;
}

function mapRol(idRol: number): RolApp {
    switch (idRol) {
        case 1:
            return 'admin';       // Administrador
        case 2:
            return 'estudiante';  // Estudiante
        case 3:
            return 'profesor';    // Profesor
        default:
            return 'estudiante';  // fallback
    }
}

export default function LoginPage() {
  const router = useRouter();
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const [mostrarClave, setMostrarClave] = useState(false);
  const [transicionSuave, setTransicionSuave] = useState(true);
  const [toast, setToast] = useState<{ mensaje: string; tipo: 'error' | 'success' } | null>(null);

    // entra suave con transicion
    useEffect(() => {
        const t = setTimeout(() => {
            setTransicionSuave(false); 
        }, 20);

        return () => clearTimeout(t);
    }, []);

    const mostrarToast = (mensaje: string, tipo: 'error' | 'success' = 'error') => {
        setToast({ mensaje, tipo });
        setTimeout(() => setToast(null), 3000); // se oculta en 3s
    };
    
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setCargando(true);
        
        if (!correo.trim() || !contrasena.trim()) {
            mostrarToast("Debes completar todos los campos.");
            setCargando(false);
            return;
        }

        try {
            const res = await fetch(API_LOGIN_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    correo,
                    contrasena,
                }),
            });

            // Si la API devuelve 400/401/500, mostramos el mensaje
            if (!res.ok) {
                let mensaje = 'Error al iniciar sesión.';
                try {
                    const data = await res.json();
                    if (data?.message) {
                        mensaje = data.message;
                    }
                } catch {
                    // ignoramos error al parsear JSON
                }
                mostrarToast(mensaje); 
                return;
            }

            const data: LoginResponse = await res.json();

            // Guarda token y usuario para el resto de la app
            if (typeof window !== 'undefined') {
                localStorage.setItem('token', data.token);
                localStorage.setItem('usuario', JSON.stringify(data.usuario));
            }

            const rol = mapRol(data.usuario.idRol);
            const nombre = `${data.usuario.primerNombre} ${data.usuario.primerApellido}`;
            
            saveSession({ nombre, rol });

            // Mostrar "Ingresando..." por 1.2 segundos
            await new Promise((resolve) => setTimeout(resolve, 1200));

            // activa animacion
            setTransicionSuave(true); 
            
            // redirija según el rol
            setTimeout(() => {
                if (rol === 'admin') {
                    router.push('/acedemaApp/Administrador');
                } else if (rol === 'profesor') {
                    router.push('/acedemaApp/Profesor');
                } else {
                    router.push('/acedemaApp/Estudiante');
                }
            }, 500);
          
        } catch (err) {
            console.error(err);
            mostrarToast("No se pudo conectar con el servidor.");
        } finally {
            setCargando(false);
        }
    };
    
  return (
    <div className={styles.login}>
      <Navbar />
        
        {toast && (
            <div className={`${styles.toast} ${toast.tipo === 'error' ? styles.toastError : styles.toastSuccess}`}>
                {toast.mensaje}
            </div>
        )}
        
      <div className={styles.loginWrapper}>
          <div className={`${styles.loginBox} ${transicionSuave ? styles.fadeOut : ''}`}>
          <div className={styles.loginForm}>
            <h2 className={styles.title}>Iniciar Sesión</h2>
              <form autoComplete="off" noValidate onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Correo electrónico"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                className={styles.input}
              />
                <div className={styles.inputPasswordWrapper}>
                    <input
                        type={mostrarClave ? "text" : "password"}
                        placeholder="Contraseña"
                        value={contrasena}
                        onChange={(e) => setContrasena(e.target.value)}
                        className={styles.input}
                    />

                    <span
                        className={styles.eyeIcon}
                        onClick={() => setMostrarClave(!mostrarClave)}
                    >
    {mostrarClave ?  <FaEye /> : <FaEyeSlash />}
  </span>
                </div>
                <button type="submit" className={styles.button} disabled={cargando}>
                    {cargando ? 'Ingresando...' : 'Ingresar'}
              </button>
              {error && <p className={styles.error}>{error}</p>}
            </form>
              <p className={styles.password}>
                  <a
                      href="/cambiarClave"
                      onClick={(e) => {
                          e.preventDefault();           // evita navegación inmediata
                          if (transicionSuave) return;  // evita doble click
                          setTransicionSuave(true);     // activa fadeOut
                          setTimeout(() => {
                              router.push('/cambiarClave'); // navega despues de la animacion
                          }, 400); 
                      }}
                  >
                      Cambiar contraseña
                  </a>
              </p>


          </div>
          <div className={styles.loginImage}>
            <Image
              src="/Acedema.jpg"
              alt="Login image"
              fill
              className={styles.image}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
