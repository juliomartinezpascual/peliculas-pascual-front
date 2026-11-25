import { apiRequest } from "./api";

const AUTH_URL = "/api/v1/auth";

/** POST /api/v1/auth/login — público */
export async function login(email, password) {
    return apiRequest(
        `${AUTH_URL}/login`,
        {
            method: "POST",
            body: JSON.stringify({ email, password })
        },
        { auth: false }
    );
}

/**
 * POST /api/v1/auth/register
 * - Operario: público (sin rol o rol omitido)
 * - Admin: requiere Bearer de un admin + rol: "admin"
 */
export async function register(payload, { asAdmin = false } = {}) {
    return apiRequest(
        `${AUTH_URL}/register`,
        {
            method: "POST",
            body: JSON.stringify(payload)
        },
        { auth: asAdmin }
    );
}

/** POST /api/v1/auth/bootstrap-admin — solo si no hay usuarios */
export async function bootstrapAdmin(payload) {
    return apiRequest(
        `${AUTH_URL}/bootstrap-admin`,
        {
            method: "POST",
            body: JSON.stringify(payload)
        },
        { auth: false }
    );
}

/** GET /api/v1/auth/me */
export async function getMe() {
    return apiRequest(`${AUTH_URL}/me`);
}
