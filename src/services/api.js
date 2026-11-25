const TOKEN_KEY = "pelis_pascual_token";
const USER_KEY = "pelis_pascual_user";

const envBase = import.meta.env.VITE_API_URL;
export const API_BASE =
    typeof envBase === "string" && envBase.trim().length > 0
        ? envBase.trim().replace(/\/$/, "")
        : "";

export function getToken() {
    return sessionStorage.getItem(TOKEN_KEY);
}

export function getStoredUser() {
    try {
        const raw = sessionStorage.getItem(USER_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export function setSession(token, usuario) {
    // Migración: limpiar restos en localStorage
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    if (token) sessionStorage.setItem(TOKEN_KEY, token);
    if (usuario) sessionStorage.setItem(USER_KEY, JSON.stringify(usuario));
}

export function clearSession() {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
}

async function parseError(response) {
    try {
        const text = (await response.text()).trim();
        if (!text) return "Error general";
        const data = JSON.parse(text);
        return data.message || "Error general";
    } catch {
        return "Error general";
    }
}

function parseJsonSafe(text) {
    const trimmed = (text || "").trim();
    if (!trimmed) return null;
    try {
        return JSON.parse(trimmed);
    } catch {
        return null;
    }
}

/**
 * Fetch tipado para el API.
 * @param {string} path - ruta relativa, ej. /api/v1/generos
 * @param {RequestInit} options
 * @param {{ auth?: boolean }} config - auth=true envía Bearer (default true)
 */
export async function apiRequest(path, options = {}, config = {}) {
    const { auth = true } = config;
    const { headers: customHeaders, body, ...rest } = options;
    const headers = { ...(customHeaders || {}) };

    if (body !== undefined && body !== null) {
        headers["Content-Type"] = "application/json";
    }

    if (auth) {
        const token = getToken();
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }
    }

    const response = await fetch(`${API_BASE}${path}`, {
        ...rest,
        headers,
        body
    });

    if (response.status === 401) {
        clearSession();
        window.dispatchEvent(new CustomEvent("auth:unauthorized"));
        throw new Error(await parseError(response));
    }

    if (!response.ok) {
        throw new Error(await parseError(response));
    }

    if (response.status === 204 || response.status === 205) {
        return null;
    }

    const text = await response.text();
    return parseJsonSafe(text);
}
