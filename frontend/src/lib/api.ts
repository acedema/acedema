/**
 * Archivo centralizado para la comunicación con la API del backend.
 *
 * ¿Qué hace ?
 * Proporciona funciones genéricas para realizar solicitudes HTTP
 * (GET, POST, PUT y DELETE) hacia la API del sistema, incluyendo automáticamente el token de autenticación cuando existe.
 *
 * Se utiliza en todas las páginas y componentes del frontend que
 * necesitan consumir servicios del backend, como:
 * -Obtener datos del perfil
 * -Enviar formularios
 * -Actualizar información del usuario
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5069/api";

function getToken() {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
}

/**
 * Realiza una solicitud GET a la API.
 * Incluye el token JWT en el encabezado Authorization si el usuario está autenticado.
 */
export async function fetchData<T>(endpoint: string): Promise<T> {
    const token = getToken();

    const res = await fetch(`${API_BASE_URL}/${endpoint}`, {
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        cache: "no-store",
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Error fetching ${endpoint}: ${res.status} ${text}`);
    }

    return res.json();
}

/**
 * Realiza solicitudes POST, PUT o DELETE a la API.
 * Permite enviar datos en formato JSON y maneja errores de respuesta.
 */
export async function sendData<T>(
    endpoint: string,
    method: "POST" | "PUT" | "DELETE",
    body?: unknown
): Promise<T> {
    const token = getToken();

    const res = await fetch(`${API_BASE_URL}/${endpoint}`, {
        method,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Error ${method} ${endpoint}: ${res.status} ${text}`);
    }

    return res.json();
}
