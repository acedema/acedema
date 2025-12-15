/**
 * Archivo de utilidades de autenticación y autorización del frontend.
 *
 * ¿Qué hace?
 * Centraliza toda la lógica relacionada con el manejo de sesión del usuario:
 * -Guardado y lectura del token JWT
 * -Guardado y lectura de los datos del usuario autenticado
 * -Validación de expiración del token
 * -Conversión de roles del backend a roles usados por la aplicación
 *
 * Se utiliza en todo el frontend para:
 * -Determinar si un usuario está autenticado
 * -Obtener el rol del usuario.
 * -Proteger rutas o vistas según permisos
 * -Cerrar sesión de forma segura
 *
 * Existe para evitar duplicar lógica de autenticación en múltiples componentes,
 * mejorar la mantenibilidad del sistema y garantizar un manejo consistente
 * de la sesión y los permisos del usuario.
 */

export type RolApp = 'estudiante' | 'admin' | 'profesor';

export interface BackendUsuario {
    personaId: number;
    primerNombre: string;
    segundoNombre: string | null;
    primerApellido: string;
    segundoApellido: string | null;
    correo: string;
    idRol: number;
    puesto: string;
}

const TOKEN_KEY = 'token';
const USER_KEY = 'usuario';

/**
 * Convierte el id de rol proveniente del backend en un rol legible y manejable por el frontend.
 */
export function mapRol(idRol: number): RolApp {
    switch (idRol) {
        case 1: return 'admin';
        case 2: return 'estudiante';
        case 3: return 'profesor';
        default: return 'estudiante';
    }
}

/**
 * Obtiene la información completa de autenticación del usuario.
 * Verifica que exista token, usuario y que el token no esté expirado.
 */

export function getAuth() {
    const token = getToken();
    const usuario = getUsuario();
    if (!token || !usuario) return null;
    if (isTokenExpired(token)) return null;
    return { token, usuario, rol: mapRol(usuario.idRol) as RolApp };
}

export function saveAuth(token: string, usuario: BackendUsuario) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(usuario));
}

export function getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
}

export function getUsuario(): BackendUsuario | null {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
}

export function getRol(): RolApp | null {
    const u = getUsuario();
    return u ? mapRol(u.idRol) : null;
}

export function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
}

/** Decodifica payload del JWT (solo para leer exp) */
function decodeJwtPayload(token: string): any | null {
    try {
        const payload = token.split('.')[1];
        const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
        const json = decodeURIComponent(
            atob(normalized)
                .split('')
                .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
                .join('')
        );
        return JSON.parse(json);
    } catch {
        return null;
    }
}

/**
 * Verifica si un token JWT ha expirado comparando la fecha actual
 * con el campo exp del payload del token.
 */
export function isTokenExpired(token: string): boolean {
    const payload = decodeJwtPayload(token);
    const exp = payload?.exp;
    if (!exp) return true;
    const nowSec = Math.floor(Date.now() / 1000);
    return nowSec >= exp;
}

export function isAuthenticated(): boolean {
    const token = getToken();
    const usuario = getUsuario();
    if (!token || !usuario) return false;
    if (isTokenExpired(token)) return false;
    return true;
}

export function requireAuth(rolesPermitidos?: RolApp[]) {
    const auth = getAuth();
    if (!auth) return { ok: false as const, reason: 'NO_AUTH' as const };

    if (rolesPermitidos && !rolesPermitidos.includes(auth.rol)) {
        return { ok: false as const, reason: 'FORBIDDEN' as const, rol: auth.rol };
    }

    return { ok: true as const, auth };
}
