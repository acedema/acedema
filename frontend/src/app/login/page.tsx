'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveSession } from '@/lib/auth';
import { usuarios } from '@/datos/usuarios';
import styles from './login.module.css';
import Image from 'next/image';
import Navbar from '@/components/Navbar';


export default function LoginPage() {
  const router = useRouter();
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const user = {
        email: correo,
        password: contrasena
    }
    
    try{
        const baseURI = "https://localhost:44353";
        
        const path = "/api/Persona/login" 
        
        const response = await fetch(baseURI + path, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Login successful:', data);
            
            //exchange the token and get the data from it
            
            const tokenInfo = data.jwtToken;

            saveSession({ nombre: tokenInfo.nombre, rol: tokenInfo.rol as 'estudiante' | 'admin' | 'profesor' });
            router.push('/acedemaApp');
            //Handle login proccess
            
        } else {
            const errorData = await response.json();
            console.error('Login failed:', response.status, errorData);
            setError('Credenciales incorrectas');
            return;
        }
    }catch(e){
        console.error('Internal Server Error:', e);
        setError('Internal Server Error');
        return;
    }
    /*
    const usuario = usuarios.find(
      (u) => u.correo === correo && u.contrasena === contrasena
    );

    if (!usuario) {
      setError('Credenciales incorrectas');
      return;
    }

    saveSession({ nombre: usuario.nombre, rol: usuario.rol as 'estudiante' | 'admin' | 'profesor' });
    router.push('/acedemaApp');
    
    
    // Redirecciona según el rol
    if (usuario.rol === 'administrador') {
      router.push('/acedemaApp/Administrador');
    } else if (usuario.rol === 'profesor') {
      router.push('/acedemaApp/Profesor');
    } else {
      router.push('/acedemaApp/Estudiante');
    }
    */
  };

  return (
    <div className={styles.login}>
      <Navbar />
      <div className={styles.loginWrapper}>
        <div className={styles.loginBox}>
          <div className={styles.loginForm}>
            <h2 className={styles.title}>Iniciar Sesión</h2>
            <form autoComplete="off" onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Correo electrónico"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
                className={styles.input}
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                required
                className={styles.input}
              />
              <button type="submit" className={styles.button}>
                Ingresar
              </button>
              {error && <p className={styles.error}>{error}</p>}
            </form>
          </div>
          <div className={styles.loginImage}>
            <Image
              src="/bandabg.jpg"
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
